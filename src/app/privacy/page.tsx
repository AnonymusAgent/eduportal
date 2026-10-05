import PublicHeader from '@/components/layouts/PublicHeader';
import PublicFooter from '@/components/layouts/PublicFooter';
import Card from '@/components/ui/Card';

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main id="main-content" className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-extrabold text-slate-800 mb-6">Privacy Policy</h1>
          <Card>
            <div className="prose prose-slate max-w-none space-y-4 text-slate-600 text-sm leading-relaxed">
              <p><strong>Last updated:</strong> January 2025</p>
              <h2 className="text-lg font-bold text-slate-800 mt-6">1. Information We Collect</h2>
              <p>We collect personal information you provide during admission, registration, and use of the student portal, including name, contact details, academic records, and identification documents.</p>
              <h2 className="text-lg font-bold text-slate-800 mt-6">2. How We Use Your Information</h2>
              <p>Your information is used to process admissions, manage academic records, communicate important notices, and provide student services. We do not sell personal data to third parties.</p>
              <h2 className="text-lg font-bold text-slate-800 mt-6">3. Data Security</h2>
              <p>We implement industry-standard security measures including encryption, secure authentication, and role-based access control to protect your personal information.</p>
              <h2 className="text-lg font-bold text-slate-800 mt-6">4. Your Rights</h2>
              <p>You have the right to access, correct, or request deletion of your personal data. Contact the registrar's office or submit a request through the student portal.</p>
              <h2 className="text-lg font-bold text-slate-800 mt-6">5. Contact</h2>
              <p>For privacy-related inquiries, contact us at <a href="mailto:privacy@eduportal.edu" className="text-indigo-600 hover:text-indigo-700">privacy@eduportal.edu</a>.</p>
            </div>
          </Card>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
