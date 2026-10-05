'use client';

import { useState } from 'react';
import Link from 'next/link';
import PublicHeader from '@/components/layouts/PublicHeader';
import PublicFooter from '@/components/layouts/PublicFooter';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a production system this would call an API to send a reset link.
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main id="main-content" className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <Card>
            {submitted ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Mail className="w-7 h-7 text-white" aria-hidden="true" />
                </div>
                <h1 className="text-xl font-extrabold text-slate-800 mb-2">Check Your Email</h1>
                <p className="text-slate-500 text-sm mb-6">
                  If an account exists for <strong>{email}</strong>, we have sent password reset instructions. Please also check your spam folder.
                </p>
                <Link href="/login"><Button variant="outline" className="w-full">Back to Login</Button></Link>
              </div>
            ) : (
              <>
                <h1 className="text-xl font-extrabold text-slate-800 text-center mb-1">Reset Password</h1>
                <p className="text-slate-500 text-center text-sm mb-6">Enter your email and we will send you a reset link.</p>
                <Alert variant="info" className="mb-4">In the demo environment, emails are not sent. Please contact IT support.</Alert>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input type="email" label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                  <Button type="submit" className="w-full">Send Reset Link</Button>
                </form>
                <div className="mt-4 text-center">
                  <Link href="/login" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-1">
                    <ArrowLeft className="w-3 h-3" /> Back to Login
                  </Link>
                </div>
              </>
            )}
          </Card>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
