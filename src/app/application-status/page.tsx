'use client';

import { useState } from 'react';
import PublicHeader from '@/components/layouts/PublicHeader';
import PublicFooter from '@/components/layouts/PublicFooter';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Alert from '@/components/ui/Alert';
import { Search, FileText } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function ApplicationStatusPage() {
  const [refNumber, setRefNumber] = useState('');
  const [result, setResult] = useState<{ status: string; name: string; date: string; program: string } | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refNumber.trim()) { setError('Please enter your application reference number.'); return; }
    setError(''); setResult(null); setIsLoading(true);
    try {
      const r = await fetch(`/api/application/status?ref=${encodeURIComponent(refNumber.trim())}`);
      const data = await r.json();
      if (!r.ok) { setError(data.error || 'Application not found.'); }
      else { setResult(data); }
    } catch { setError('Unable to check status. Please try again.'); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main id="main-content" className="flex-1 py-16">
        <div className="max-w-lg mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Track Your Application</h1>
            <p className="text-slate-500">Enter the reference number you received when you submitted your application.</p>
          </div>
          <Card>
            {error && <Alert variant="error" className="mb-4">{error}</Alert>}
            <form onSubmit={handleSearch} className="space-y-4">
              <Input label="Application Reference Number" name="ref" value={refNumber} onChange={(e) => setRefNumber(e.target.value)} placeholder="e.g. APP-2025-XXXXXX" required />
              <Button type="submit" className="w-full" isLoading={isLoading} leftIcon={<Search className="w-4 h-4" />}>Check Status</Button>
            </form>
            {result && (
              <div className="mt-6 p-4 rounded-xl bg-white/30 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-800">{result.name}</p>
                  <Badge status={result.status}>{result.status.replace('_', ' ')}</Badge>
                </div>
                <p className="text-sm text-slate-500">Program: {result.program || 'N/A'}</p>
                <p className="text-sm text-slate-400">Submitted: {result.date}</p>
              </div>
            )}
          </Card>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
