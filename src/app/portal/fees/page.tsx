import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { students, studentFees, payments, semesters } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import Card, { CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell, MobileTableCard, MobileTableRow } from '@/components/ui/Table';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate, formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { CreditCard, Receipt, AlertTriangle, CheckCircle } from 'lucide-react';

async function getStudentFees(userId: string) {
  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.userId, userId))
    .limit(1);

  if (!student) return null;

  const fees = await db
    .select({
      fee: studentFees,
      semester: semesters,
    })
    .from(studentFees)
    .leftJoin(semesters, eq(studentFees.semesterId, semesters.id))
    .where(eq(studentFees.studentId, student.id))
    .orderBy(desc(studentFees.createdAt));

  const paymentHistory = await db
    .select()
    .from(payments)
    .where(eq(payments.studentId, student.id))
    .orderBy(desc(payments.createdAt));

  // Calculate totals
  const totalFees = fees.reduce((sum, f) => sum + parseFloat(f.fee.netAmount?.toString() || '0'), 0);
  const totalPaid = fees.reduce((sum, f) => sum + parseFloat(f.fee.paidAmount?.toString() || '0'), 0);
  const totalPending = fees.reduce((sum, f) => sum + parseFloat(f.fee.pendingAmount?.toString() || '0'), 0);
  const totalScholarship = fees.reduce((sum, f) => sum + parseFloat(f.fee.scholarshipAmount?.toString() || '0'), 0);

  return {
    student,
    fees,
    paymentHistory,
    totalFees,
    totalPaid,
    totalPending,
    totalScholarship,
  };
}

export default async function FeesPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const data = await getStudentFees(session.id);

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <EmptyState
            title="No Fee Information"
            description="Your fee information is not available at this time."
          />
        </Card>
      </div>
    );
  }

  const { fees, paymentHistory, totalFees, totalPaid, totalPending, totalScholarship } = data;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Fee Management</h1>
          <p className="text-slate-500">View and manage your fee payments</p>
        </div>
        <Link href="/portal/receipts">
          <Button variant="outline" leftIcon={<Receipt className="w-4 h-4" />}>
            View Receipts
          </Button>
        </Link>
      </div>

      {/* Fee Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-blue-600" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Fees</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(totalFees)}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Amount Paid</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${totalPending > 0 ? 'bg-yellow-100' : 'bg-green-100'}`}>
              <AlertTriangle className={`w-6 h-6 ${totalPending > 0 ? 'text-yellow-600' : 'text-green-600'}`} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Amount</p>
              <p className={`text-xl font-bold ${totalPending > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                {formatCurrency(totalPending)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-purple-600" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Scholarship</p>
              <p className="text-xl font-bold text-purple-600">{formatCurrency(totalScholarship)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Fee Details */}
      <Card>
        <CardTitle className="mb-4">Fee Details</CardTitle>

        {fees.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <Table ariaLabel="Fee details">
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Scholarship</TableHead>
                    <TableHead>Net Amount</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Pending</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fees.map(({ fee, semester }) => (
                    <TableRow key={fee.id}>
                      <TableCell>{fee.description || 'Fee Payment'}</TableCell>
                      <TableCell>{semester?.name || 'N/A'}</TableCell>
                      <TableCell>{formatCurrency(fee.totalAmount)}</TableCell>
                      <TableCell>{formatCurrency(fee.scholarshipAmount)}</TableCell>
                      <TableCell>{formatCurrency(fee.netAmount)}</TableCell>
                      <TableCell className="text-green-600">{formatCurrency(fee.paidAmount)}</TableCell>
                      <TableCell className="text-yellow-600">{formatCurrency(fee.pendingAmount)}</TableCell>
                      <TableCell>{formatDate(fee.dueDate)}</TableCell>
                      <TableCell>
                        <Badge status={fee.status}>{fee.status.replace('_', ' ')}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {fees.map(({ fee, semester }) => (
                <MobileTableCard key={fee.id}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium text-gray-900">{fee.description || 'Fee Payment'}</p>
                      <p className="text-sm text-gray-500">{semester?.name || 'N/A'}</p>
                    </div>
                    <Badge status={fee.status}>{fee.status.replace('_', ' ')}</Badge>
                  </div>
                  <MobileTableRow label="Net Amount" value={formatCurrency(fee.netAmount)} />
                  <MobileTableRow label="Paid" value={<span className="text-green-600">{formatCurrency(fee.paidAmount)}</span>} />
                  <MobileTableRow label="Pending" value={<span className="text-yellow-600">{formatCurrency(fee.pendingAmount)}</span>} />
                  <MobileTableRow label="Due Date" value={formatDate(fee.dueDate)} />
                </MobileTableCard>
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            title="No Fee Records"
            description="You don't have any fee records at this time."
          />
        )}
      </Card>

      {/* Payment History */}
      <Card>
        <CardTitle className="mb-4">Payment History</CardTitle>

        {paymentHistory.length > 0 ? (
          <div className="space-y-3">
            {paymentHistory.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${
                    payment.paymentStatus === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    <CreditCard className={`w-5 h-5 ${
                      payment.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'
                    }`} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {formatCurrency(payment.amount)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {payment.paymentMethod} • {formatDate(payment.paymentDate || payment.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge status={payment.paymentStatus || 'pending'}>
                    {payment.paymentStatus || 'pending'}
                  </Badge>
                  {payment.transactionId && (
                    <p className="text-xs text-gray-500 mt-1">
                      Ref: {payment.transactionId}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Payment History"
            description="Your payment history will appear here once you make a payment."
          />
        )}
      </Card>
    </div>
  );
}
