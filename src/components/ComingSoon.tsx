import PublicHeader from '@/components/layouts/PublicHeader';
import PublicFooter from '@/components/layouts/PublicFooter';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { Construction, ArrowLeft } from 'lucide-react';

export default function ComingSoon({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main id="main-content" className="flex-1 flex items-center justify-center py-16 px-4">
        <Card className="max-w-lg w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 flex items-center justify-center mx-auto mb-5">
            <Construction className="w-8 h-8 text-indigo-500" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 mb-2">{title}</h1>
          <p className="text-slate-500 mb-6">
            {description || 'This page is under development and will be available soon. Thank you for your patience.'}
          </p>
          <Link href="/">
            <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
        </Card>
      </main>
      <PublicFooter />
    </div>
  );
}
