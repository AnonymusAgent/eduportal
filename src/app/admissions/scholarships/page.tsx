import { db } from '@/db';
import { scholarships, programs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import PublicHeader from '@/components/layouts/PublicHeader';
import PublicFooter from '@/components/layouts/PublicFooter';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { formatCurrency } from '@/lib/utils';
import { Award } from 'lucide-react';

export default async function ScholarshipsPage() {
  const scholarshipList = await db
    .select({ scholarship: scholarships, program: programs })
    .from(scholarships)
    .leftJoin(programs, eq(scholarships.programId, programs.id))
    .where(eq(scholarships.isActive, true));

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main id="main-content" className="flex-1 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Scholarships &amp; Financial Aid</h1>
            <p className="text-slate-500 max-w-2xl mx-auto">We offer a range of merit-based and need-based scholarships to help make education accessible.</p>
          </div>
          {scholarshipList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scholarshipList.map(({ scholarship, program }) => (
                <Card key={scholarship.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-md">
                      <Award className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-bold text-slate-800">{scholarship.name}</h2>
                      {program && <Badge variant="info" className="mt-1">{program.name}</Badge>}
                      {scholarship.description && <p className="text-sm text-slate-500 mt-2">{scholarship.description}</p>}
                      <div className="flex gap-4 mt-3 text-sm">
                        {scholarship.amount && <span className="font-bold text-emerald-600">{formatCurrency(scholarship.amount)}</span>}
                        {scholarship.percentage && <span className="font-bold text-emerald-600">{scholarship.percentage}% off</span>}
                      </div>
                      {scholarship.eligibilityCriteria && <p className="text-xs text-slate-400 mt-2">{scholarship.eligibilityCriteria}</p>}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card><EmptyState icon={<Award className="w-8 h-8 text-amber-400" />} title="No Scholarships Listed" description="Scholarship information will be published soon. Contact the admissions office for details." /></Card>
          )}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
