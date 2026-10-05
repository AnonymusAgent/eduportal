import Link from 'next/link';
import { GraduationCap, Mail, Phone, MapPin, Globe, MessageCircle, Share2, Video } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.15),transparent)]" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <div>
                <span className="text-lg font-bold">EduPortal</span>
                <span className="block text-[10px] font-semibold text-indigo-300 tracking-widest uppercase -mt-0.5">
                  Academy
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-5 leading-relaxed">
              Empowering minds, shaping futures. Our institution is dedicated to
              providing quality education and fostering innovation.
            </p>
            <div className="flex gap-3">
              {[Globe, MessageCircle, Share2, Video].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
                  aria-label="Social link"
                >
                  <Icon className="w-4 h-4 text-slate-300" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-300 mb-4">
              Quick Links
            </h3>
            <nav aria-label="Footer quick links">
              <ul className="space-y-2.5">
                {[
                  { label: 'About Us', href: '/about' },
                  { label: 'Programs', href: '/academics/programs' },
                  { label: 'Admissions', href: '/admissions' },
                  { label: 'Academic Calendar', href: '/academics/calendar' },
                  { label: 'Notices', href: '/notices' },
                  { label: 'FAQs', href: '/faqs' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* For Students */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-300 mb-4">
              For Students
            </h3>
            <nav aria-label="Footer student links">
              <ul className="space-y-2.5">
                {[
                  { label: 'Student Portal', href: '/login' },
                  { label: 'Apply Now', href: '/apply' },
                  { label: 'Fee Structure', href: '/admissions/fees' },
                  { label: 'Scholarships', href: '/admissions/scholarships' },
                  { label: 'Student Support', href: '/support' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-300 mb-4">
              Contact Us
            </h3>
            <address className="not-italic space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-1" aria-hidden="true" />
                <span className="text-slate-400 text-sm">
                  123 Education Street,
                  <br />
                  Academic City, AC 12345
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-indigo-400 flex-shrink-0" aria-hidden="true" />
                <a
                  href="tel:+1234567890"
                  className="text-slate-400 hover:text-white text-sm transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-indigo-400 flex-shrink-0" aria-hidden="true" />
                <a
                  href="mailto:info@eduportal.edu"
                  className="text-slate-400 hover:text-white text-sm transition-colors"
                >
                  info@eduportal.edu
                </a>
              </div>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
              <p className="text-slate-500 text-sm">
                © {new Date().getFullYear()} Webloom LLC. All rights reserved.
              </p>
              <nav aria-label="Footer legal links">
                <ul className="flex flex-wrap items-center gap-6">
                  {[
                    { label: 'Privacy', href: '/privacy' },
                    { label: 'Terms', href: '/terms' },
                    { label: 'Accessibility', href: '/accessibility' },
                  ].map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-slate-500 hover:text-white text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <p className="text-slate-600 text-xs">
              Made with <span className="text-red-400" aria-label="love">❤️</span> by Webloom
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
