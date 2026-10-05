import { db } from '@/db';
import { programs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import PublicHeader from '@/components/layouts/PublicHeader';
import PublicFooter from '@/components/layouts/PublicFooter';
import Card, { CardTitle } from '@/components/ui/Card';
import { CheckCircle } from 'lucide-react';

export default async function RequirementsPage() {
  const programList = await db.select().from(programs).where(eq(programs.isActive, true));

  const generalReqs = [
    'Completed application form',
    'Official transcripts from previous institution',
    'Valid identification document (national ID or passport)',
    'Passport-size photograph (recent)',
    'English proficiency certificate (for international students)',
    'Application fee payment',
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main id="main-content" className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Admission Requirements</h1>
            <p className="text-slate-500">Documents and qualifications needed for admission.</p>
          </div>
          <Card className="mb-8">
            <CardTitle className="mb-4">General Requirements</CardTitle>
            <ul className="space-y-3">
              {generalReqs.map((r) => (
                <li key={r} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-slate-600">{r}</span>
                </li>
              ))}
            </ul>
          </Card>
          {programList.length > 0 && (
            <Card>
              <CardTitle className="mb-4">Program-Specific Requirements</CardTitle>
              <div className="space-y-4">
                {programList.map((p) => (
                  <div key={p.id} className="p-4 rounded-xl bg-white/30">
                    <h3 className="font-bold text-slate-800">{p.name} <span className="text-indigo-500 text-sm font-semibold">({p.code})</span></h3>
                    <p className="text-sm text-slate-500 mt-1">{p.admissionRequirements || 'Standard general requirements apply.'}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
