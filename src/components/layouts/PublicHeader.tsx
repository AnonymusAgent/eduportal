'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, GraduationCap, ChevronDown } from 'lucide-react';
import Button from '../ui/Button';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Academics',
    href: '/academics',
    children: [
      { label: 'Departments', href: '/academics/departments' },
      { label: 'Programs', href: '/academics/programs' },
      { label: 'Courses', href: '/academics/courses' },
      { label: 'Academic Calendar', href: '/academics/calendar' },
    ],
  },
  {
    label: 'Admissions',
    href: '/admissions',
    children: [
      { label: 'How to Apply', href: '/admissions' },
      { label: 'Requirements', href: '/admissions/requirements' },
      { label: 'Fee Structure', href: '/admissions/fees' },
      { label: 'Scholarships', href: '/admissions/scholarships' },
      { label: 'Apply Now', href: '/apply' },
    ],
  },
  { label: 'Notices', href: '/notices' },
  { label: 'Events', href: '/events' },
  { label: 'Contact', href: '/contact' },
];

export default function PublicHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-white/30">
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-xl"
      >
        Skip to main content
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 rounded-xl"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-500/25">
              <GraduationCap className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                EduPortal
              </span>
              <span className="block text-[10px] font-semibold text-slate-400 tracking-widest uppercase -mt-0.5">
                Academy
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                {item.children ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-indigo-50/50 transition-all duration-200"
                      aria-expanded={openDropdown === item.label}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          'w-3.5 h-3.5 transition-transform duration-200',
                          openDropdown === item.label && 'rotate-180',
                        )}
                        aria-hidden="true"
                      />
                    </button>
                    {openDropdown === item.label && (
                      <div className="absolute left-0 top-full mt-1.5 w-52 glass-strong rounded-xl py-2 animate-fade-in-up shadow-xl shadow-indigo-500/5">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="block px-4 py-2.5 text-sm text-slate-600 hover:bg-indigo-50/60 hover:text-indigo-600 transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-indigo-50/50 transition-all duration-200"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center gap-2.5">
            <Link href="/login" className="hidden sm:block">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/apply" className="hidden sm:block">
              <Button size="sm">Apply Now</Button>
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-2.5 rounded-xl text-slate-600 hover:bg-indigo-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <nav
            id="mobile-menu"
            className="lg:hidden py-4 border-t border-white/30 animate-fade-in-up"
            aria-label="Mobile navigation"
          >
            <div className="space-y-1">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.children ? (
                    <div>
                      <button
                        className="flex items-center justify-between w-full px-4 py-2.5 text-base font-medium text-slate-700 rounded-xl hover:bg-indigo-50/50 transition-colors"
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === item.label ? null : item.label,
                          )
                        }
                        aria-expanded={openDropdown === item.label}
                      >
                        {item.label}
                        <ChevronDown
                          className={cn(
                            'w-5 h-5 transition-transform duration-200',
                            openDropdown === item.label && 'rotate-180',
                          )}
                          aria-hidden="true"
                        />
                      </button>
                      {openDropdown === item.label && (
                        <div className="pl-6 space-y-0.5">
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              className="block px-4 py-2 text-sm text-slate-500 hover:text-indigo-600 rounded-lg"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="block px-4 py-2.5 text-base font-medium text-slate-700 hover:text-indigo-600 rounded-xl hover:bg-indigo-50/50 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 px-4 space-y-2">
              <Link href="/login" className="block">
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link href="/apply" className="block">
                <Button className="w-full">Apply Now</Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
