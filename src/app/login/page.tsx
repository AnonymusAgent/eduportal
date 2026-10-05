'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GraduationCap, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // If user already has a session, redirect them away from the login page.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/auth/session')
      .then(async (r) => {
        if (cancelled) return;
        if (r.ok) {
          const d = await r.json();
          if (d?.user) {
            window.location.replace(
              d.user.role === 'student' ? '/portal' : '/admin',
            );
          }
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Safety timeout – if something goes wrong with the redirect the
    // button must eventually become clickable again.
    const safetyTimer = setTimeout(() => {
      if (!isRedirecting) {
        setIsLoading(false);
        setError('Login is taking too long. Please try again.');
      }
    }, 15000);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        clearTimeout(safetyTimer);
        setError(data.error || 'Login failed. Please check your credentials.');
        setIsLoading(false);
        return;
      }

      // Redirect through the callback endpoint which sets the cookie
      // via a server-level redirect (not a fetch Set-Cookie).
      setIsRedirecting(true);
      const callbackUrl =
        `/api/auth/callback?token=${encodeURIComponent(data.token)}&to=${encodeURIComponent(data.redirect || '/portal')}`;
      window.location.href = callbackUrl;
      // Loading state intentionally stays true during redirect.
    } catch (err) {
      clearTimeout(safetyTimer);
      setError('Unable to connect to the server. Please check your internet connection and try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden">
      <div className="absolute inset-0 animated-gradient" aria-hidden="true" />
      <div className="blob w-96 h-96 bg-white/10 top-[-12%] left-[-8%]" aria-hidden="true" />
      <div className="blob w-80 h-80 bg-cyan-300/15 bottom-[-8%] right-[-6%]" style={{ animationDelay: '3s' }} aria-hidden="true" />

      <header className="relative p-4 sm:p-6">
        <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to Home
        </Link>
      </header>

      <main className="relative flex-1 flex items-center justify-center p-4 pb-12">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5 justify-center">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg">
                <GraduationCap className="w-7 h-7 text-white" aria-hidden="true" />
              </div>
              <div className="text-left">
                <span className="text-2xl font-bold text-white block">EduPortal</span>
                <span className="text-xs font-semibold text-white/60 tracking-widest uppercase">Academy</span>
              </div>
            </Link>
          </div>

          <Card className="glass-strong !border-white/40 shadow-2xl">
            <h1 className="text-2xl font-extrabold text-slate-800 text-center mb-1">Welcome Back</h1>
            <p className="text-slate-500 text-center mb-6 text-sm">Sign in to access your portal</p>

            {error && <Alert variant="error" className="mb-4">{error}</Alert>}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <Input
                type="email" label="Email Address" name="email"
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" required autoComplete="email"
              />
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'} label="Password" name="password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" required autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="text-sm text-slate-500">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" size="lg" isLoading={isLoading} disabled={isLoading}>
                {isRedirecting ? 'Redirecting…' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/30 text-center space-y-2">
              <p className="text-sm text-slate-500">
                New applicant?{' '}
                <Link href="/apply" className="text-indigo-600 hover:text-indigo-700 font-semibold">Apply for Admission</Link>
              </p>
              <p className="text-sm text-slate-500">
                Track your application?{' '}
                <Link href="/application-status" className="text-indigo-600 hover:text-indigo-700 font-semibold">Check Status</Link>
              </p>
            </div>
          </Card>

          <div className="mt-4 glass rounded-2xl p-5 border border-white/30">
            <h2 className="text-sm font-bold text-white/90 mb-2">Demo Credentials</h2>
            <div className="text-sm text-white/70 space-y-1 font-mono">
              <p><span className="text-cyan-300 font-semibold">Student:</span> student@demo.edu / demo123</p>
              <p><span className="text-cyan-300 font-semibold">Admin:</span> admin@demo.edu / admin123</p>
              <p><span className="text-cyan-300 font-semibold">Teacher:</span> teacher@demo.edu / teacher123</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
