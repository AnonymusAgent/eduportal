import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { students, receipts } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import Card, { CardTitle } from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Receipt } from 'lucide-react';

export default async function ReceiptsPage() {
  const session = await getSession();
  if (!session) redirect('/login');
  const [student] = await db.select().from(students).where(eq(students.userId, session.id)).limit(1);
  if (!student) return <Card className="max-w-4xl mx-auto mt-8"><EmptyState title="No Profile" /></Card>;

  const receiptList = await db.select().from(receipts).where(eq(receipts.studentId, student.id)).orderBy(desc(receipts.issuedAt));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-800">Fee Receipts</h1>
      {receiptList.length > 0 ? (
        <div className="space-y-3">
          {receiptList.map((r) => (
            <Card key={r.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{r.receiptNumber}</p>
                    <p className="text-sm text-slate-500">{r.feeDescription || 'Fee payment'}</p>
                    <p className="text-xs text-slate-400">{formatDate(r.issuedAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-extrabold text-emerald-600">{formatCurrency(r.amount)}</p>
                  {r.paymentMethod && <p className="text-xs text-slate-400 capitalize">{r.paymentMethod}</p>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card><EmptyState icon={<Receipt className="w-8 h-8 text-emerald-400" />} title="No Receipts" description="You don't have any fee receipts yet. Receipts are generated after successful payments." /></Card>
      )}
    </div>
  );
}
