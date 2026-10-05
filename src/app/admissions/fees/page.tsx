import { db } from '@/db';
import { programs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import PublicHeader from '@/components/layouts/PublicHeader';
import PublicFooter from '@/components/layouts/PublicFooter';
import Card, { CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { CreditCard } from 'lucide-react';

export default async function FeesPage() {
  const programList = await db.select().from(programs).where(eq(programs.isActive, true));

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main id="main-content" className="flex-1 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Fee Structure</h1>
            <p className="text-slate-500">Tuition and fee information for our programs.</p>
          </div>
          {programList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {programList.map((p) => (
                <Card key={p.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h2 className="font-bold text-slate-800">{p.name}</h2>
                      <p className="text-xs text-indigo-500 font-semibold">{p.code} · {p.degreeType}</p>
                    </div>
                    <Badge variant="info">{p.durationYears} yr</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/30 mb-3">
                    <CreditCard className="w-5 h-5 text-indigo-500" aria-hidden="true" />
                    <div>
                      <p className="text-xs text-slate-400">Annual Tuition</p>
                      <p className="text-lg font-extrabold text-slate-800">{p.tuitionFee ? formatCurrency(p.tuitionFee) : 'Contact us'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-center text-sm">
                    <div className="p-2 rounded-lg bg-white/20">
                      <p className="font-bold text-slate-700">{p.totalSemesters}</p>
                      <p className="text-xs text-slate-400">Semesters</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white/20">
                      <p className="font-bold text-slate-700">{p.totalCredits}</p>
                      <p className="text-xs text-slate-400">Credits</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card><p className="text-center text-slate-500 py-8">Fee structure information will be available soon.</p></Card>
          )}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
