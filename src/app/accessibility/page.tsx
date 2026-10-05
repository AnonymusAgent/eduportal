import PublicHeader from '@/components/layouts/PublicHeader';
import PublicFooter from '@/components/layouts/PublicFooter';
import Card from '@/components/ui/Card';

export default function AccessibilityPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main id="main-content" className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-extrabold text-slate-800 mb-6">Accessibility Statement</h1>
          <Card>
            <div className="prose prose-slate max-w-none space-y-4 text-slate-600 text-sm leading-relaxed">
              <p>EduPortal Academy is committed to ensuring digital accessibility for all users, including those with disabilities.</p>
              <h2 className="text-lg font-bold text-slate-800 mt-6">Our Commitment</h2>
              <p>We strive to conform to WCAG 2.2 Level AA guidelines. Our platform includes:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Keyboard-navigable interface</li>
                <li>Screen reader compatible content</li>
                <li>Adjustable text size and spacing</li>
                <li>High contrast mode</li>
                <li>Reduced motion option</li>
                <li>Dyslexia-friendly font option</li>
                <li>Proper heading hierarchy and semantic HTML</li>
                <li>Accessible forms with error messages</li>
                <li>ARIA labels where appropriate</li>
              </ul>
              <h2 className="text-lg font-bold text-slate-800 mt-6">Accessibility Controls</h2>
              <p>Use the accessibility button (gear icon) in the bottom-right corner of any page to adjust display settings.</p>
              <h2 className="text-lg font-bold text-slate-800 mt-6">Feedback</h2>
              <p>If you encounter accessibility barriers, please contact us at <a href="mailto:accessibility@eduportal.edu" className="text-indigo-600 hover:text-indigo-700">accessibility@eduportal.edu</a>.</p>
            </div>
          </Card>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
