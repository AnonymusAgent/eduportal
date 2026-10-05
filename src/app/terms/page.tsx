import PublicHeader from '@/components/layouts/PublicHeader';
import PublicFooter from '@/components/layouts/PublicFooter';
import Card from '@/components/ui/Card';

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main id="main-content" className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-extrabold text-slate-800 mb-6">Terms of Service</h1>
          <Card>
            <div className="prose prose-slate max-w-none space-y-4 text-slate-600 text-sm leading-relaxed">
              <p><strong>Last updated:</strong> January 2025</p>
              <h2 className="text-lg font-bold text-slate-800 mt-6">1. Acceptance of Terms</h2>
              <p>By accessing and using the EduPortal Academy website and student portal, you agree to be bound by these terms of service.</p>
              <h2 className="text-lg font-bold text-slate-800 mt-6">2. User Accounts</h2>
              <p>Student accounts are created by authorized institutional staff. You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account.</p>
              <h2 className="text-lg font-bold text-slate-800 mt-6">3. Acceptable Use</h2>
              <p>You agree not to misuse the platform, access other users' data, or circumvent security measures. Violations may result in account suspension.</p>
              <h2 className="text-lg font-bold text-slate-800 mt-6">4. Academic Records</h2>
              <p>Academic records, grades, and attendance displayed on the portal are official institutional records. Any discrepancies should be reported to the registrar's office.</p>
              <h2 className="text-lg font-bold text-slate-800 mt-6">5. Limitation of Liability</h2>
              <p>EduPortal Academy provides the portal on an "as-is" basis and makes no warranties regarding availability or accuracy of displayed data.</p>
              <h2 className="text-lg font-bold text-slate-800 mt-6">6. Contact</h2>
              <p>For questions about these terms, contact <a href="mailto:legal@eduportal.edu" className="text-indigo-600 hover:text-indigo-700">legal@eduportal.edu</a>.</p>
            </div>
          </Card>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
