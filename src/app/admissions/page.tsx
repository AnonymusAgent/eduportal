import PublicHeader from '@/components/layouts/PublicHeader';
import PublicFooter from '@/components/layouts/PublicFooter';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowRight, FileText, CheckCircle, Clock, CreditCard, Award } from 'lucide-react';

export default function AdmissionsPage() {
  const steps = [
    { icon: FileText, title: 'Submit Application', desc: 'Complete the online application form with your personal and academic details.' },
    { icon: CheckCircle, title: 'Upload Documents', desc: 'Provide transcripts, certificates, ID, and a passport-size photograph.' },
    { icon: Clock, title: 'Application Review', desc: 'Our admissions team will review your application and verify documents.' },
    { icon: Award, title: 'Receive Decision', desc: 'You will be notified of the admissions decision via email and portal.' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main id="main-content" className="flex-1 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Admissions</h1>
            <p className="text-slate-500 max-w-2xl mx-auto">Start your journey at EduPortal Academy. Follow the steps below to apply.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {steps.map((s, i) => { const Icon = s.icon; return (
              <Card key={s.title} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Icon className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <span className="text-xs text-indigo-500 font-bold">Step {i + 1}</span>
                <h3 className="font-bold text-slate-800 mt-1 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500">{s.desc}</p>
              </Card>
            ); })}
          </div>
          <Card className="text-center">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Ready to Apply?</h2>
            <p className="text-slate-500 mb-6">Applications for the upcoming academic session are now open.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/apply"><Button size="lg">Apply Now <ArrowRight className="w-4 h-4 ml-1" /></Button></Link>
              <Link href="/admissions/requirements"><Button variant="outline" size="lg">View Requirements</Button></Link>
              <Link href="/admissions/fees"><Button variant="outline" size="lg">Fee Structure</Button></Link>
            </div>
          </Card>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
