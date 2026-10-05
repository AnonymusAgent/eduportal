'use client';

import { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Only show loading screen on the very first visit per browser session.
    // This avoids the loading screen re-appearing after login callback redirects,
    // which makes users think the app is stuck.
    if (sessionStorage.getItem('eduportal_loaded')) {
      setVisible(false);
      return;
    }

    sessionStorage.setItem('eduportal_loaded', '1');

    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => setVisible(false), 500);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center animated-gradient ${
        exiting ? 'loader-screen-exit' : ''
      }`}
      aria-live="assertive"
      aria-label="Loading application"
      role="status"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div className="w-56 h-56 rounded-full border border-white/10 animate-ping" style={{ animationDuration: '3s' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-6">
          <div className="loader-ring w-20 h-20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="loader-logo">
              <GraduationCap className="w-9 h-9 text-white drop-shadow-lg" aria-hidden="true" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white tracking-wide mb-1">EduPortal</h1>
        <p className="text-sm text-white/70 font-medium tracking-widest uppercase">Academy</p>

        <div className="mt-8 w-48 h-1 rounded-full overflow-hidden bg-white/15">
          <div className="h-full shimmer rounded-full bg-white/30" />
        </div>
      </div>
    </div>
  );
}
