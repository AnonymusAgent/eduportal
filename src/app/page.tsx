import Link from 'next/link';
import {
  GraduationCap, Users, BookOpen, Award, ArrowRight,
  CheckCircle, MapPin,
} from 'lucide-react';
import PublicHeader from '@/components/layouts/PublicHeader';
import PublicFooter from '@/components/layouts/PublicFooter';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { db } from '@/db';
import { announcements, events, programs, departments } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { formatDate } from '@/lib/utils';

async function getHomeData() {
  const [latestAnnouncements, upcomingEvents, featuredPrograms, departmentList] =
    await Promise.all([
      db.select().from(announcements).where(eq(announcements.isPublished, true)).orderBy(desc(announcements.createdAt)).limit(3),
      db.select().from(events).where(eq(events.isPublic, true)).orderBy(desc(events.startDate)).limit(3),
      db.select().from(programs).where(eq(programs.isActive, true)).limit(6),
      db.select().from(departments).where(eq(departments.isActive, true)).limit(8),
    ]);
  return { latestAnnouncements, upcomingEvents, featuredPrograms, departmentList };
}

export default async function HomePage() {
  const { latestAnnouncements, upcomingEvents, featuredPrograms, departmentList } = await getHomeData();

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main id="main-content" className="flex-1">

        {/* ─── Hero ─── */}
        <section className="relative overflow-hidden py-24 lg:py-36">
          {/* Animated gradient bg */}
          <div className="absolute inset-0 animated-gradient" aria-hidden="true" />
          {/* Decorative blobs */}
          <div className="blob w-96 h-96 bg-cyan-400/30 top-[-10%] left-[-8%]" aria-hidden="true" />
          <div className="blob w-80 h-80 bg-violet-400/20 bottom-[-10%] right-[-5%]" style={{ animationDelay: '2s' }} aria-hidden="true" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl animate-fade-in-up">
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-white/15 text-white/90 backdrop-blur-sm border border-white/20 mb-6">
                🎓 Applications Open for 2025
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                Empowering Minds,
                <span className="block text-cyan-200">Shaping Futures</span>
              </h1>
              <p className="text-lg sm:text-xl text-white/80 mb-10 leading-relaxed max-w-2xl">
                Join EduPortal Academy and embark on a journey of academic excellence.
                World-class education with a focus on innovation, research, and career readiness.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/apply">
                  <Button
                    size="lg"
                    className="bg-white text-indigo-700 hover:bg-white/90 shadow-xl shadow-black/10 w-full sm:w-auto"
                  >
                    Apply for Admission
                    <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="/academics/programs">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/40 text-white hover:bg-white/10 w-full sm:w-auto"
                  >
                    Explore Programs
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Stats ─── */}
        <section className="relative -mt-12 z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Users, value: '5,000+', label: 'Students', color: 'from-indigo-500 to-blue-500' },
                { icon: GraduationCap, value: '50+', label: 'Programs', color: 'from-emerald-500 to-teal-500' },
                { icon: BookOpen, value: '200+', label: 'Faculty', color: 'from-violet-500 to-purple-500' },
                { icon: Award, value: '95%', label: 'Placement Rate', color: 'from-amber-500 to-orange-500' },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label} className="text-center animate-fade-in-up">
                    <div className={`inline-flex items-center justify-center w-12 h-12 mb-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <p className="text-2xl font-extrabold text-slate-800">{stat.value}</p>
                    <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── Departments ─── */}
        <section className="py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100/80 text-indigo-600 mb-4">
                Departments
              </span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">
                Our Academic Departments
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                Explore our diverse range of departments offering cutting-edge programs
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {(departmentList.length > 0
                ? departmentList.map((d) => ({ name: d.name, code: d.code }))
                : ['Computer Science', 'Engineering', 'Business', 'Arts & Humanities', 'Science', 'Medicine', 'Law', 'Education'].map((n) => ({ name: n, code: '' }))
              ).map((dept) => (
                <Card key={dept.name} className="group cursor-pointer hover:scale-[1.02] transition-transform duration-200">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 flex items-center justify-center flex-shrink-0 group-hover:from-indigo-500 group-hover:to-cyan-400 transition-all duration-300">
                      <BookOpen className="w-5 h-5 text-indigo-500 group-hover:text-white transition-colors" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{dept.name}</h3>
                      {dept.code && <p className="text-xs text-slate-400">{dept.code}</p>}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/academics/departments">
                <Button variant="outline">
                  View All Departments <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Featured Programs ─── */}
        <section className="py-20 lg:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none" aria-hidden="true" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-cyan-100/80 text-cyan-700 mb-4">
                Programs
              </span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">
                Featured Programs
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                Discover flagship academic programs designed for your success
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(featuredPrograms.length > 0
                ? featuredPrograms.map((p) => ({
                    name: p.name, type: p.degreeType || 'Degree',
                    duration: p.durationYears, credits: p.totalCredits,
                    desc: p.description || 'A comprehensive program designed for professional excellence.',
                  }))
                : [
                    { name: 'Bachelor of Computer Science', type: 'Bachelor', duration: 4, credits: 120, desc: 'A comprehensive program.' },
                    { name: 'Master of Business Administration', type: 'Master', duration: 2, credits: 60, desc: 'A comprehensive program.' },
                    { name: 'Bachelor of Engineering', type: 'Bachelor', duration: 4, credits: 140, desc: 'A comprehensive program.' },
                    { name: 'Doctor of Medicine', type: 'Doctorate', duration: 5, credits: 200, desc: 'A comprehensive program.' },
                    { name: 'Bachelor of Arts', type: 'Bachelor', duration: 3, credits: 100, desc: 'A comprehensive program.' },
                    { name: 'Master of Science', type: 'Master', duration: 2, credits: 60, desc: 'A comprehensive program.' },
                  ]
              ).map((program) => (
                <Card key={program.name} className="h-full hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 text-indigo-600 rounded-full border border-indigo-200/50">
                      {program.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{program.name}</h3>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">{program.desc}</p>
                  <div className="flex items-center justify-between text-sm text-slate-400 font-medium">
                    <span>{program.duration} Years</span>
                    <span>{program.credits} Credits</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-5">Learn More</Button>
                </Card>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/academics/programs">
                <Button variant="outline">
                  View All Programs <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Why Choose Us ─── */}
        <section className="py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">
                Why Choose EduPortal Academy?
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {[
                { title: 'Academic Excellence', desc: 'World-class faculty and rigorous academic standards' },
                { title: 'Modern Facilities', desc: 'State-of-the-art labs, libraries, and learning spaces' },
                { title: 'Career Support', desc: 'Dedicated career services and industry partnerships' },
                { title: 'Research Opportunities', desc: 'Cutting-edge research programs and funding' },
                { title: 'Global Network', desc: 'International exchange programs and alumni network' },
                { title: 'Financial Aid', desc: 'Generous scholarships and financial assistance' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
                    <CheckCircle className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">{item.title}</h3>
                    <p className="text-slate-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Announcements & Events ─── */}
        <section className="py-20 lg:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-50/40 to-transparent pointer-events-none" aria-hidden="true" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Announcements */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-extrabold text-slate-900">Latest Notices</h2>
                  <Link href="/notices" className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold">View All</Link>
                </div>
                <div className="space-y-4">
                  {(latestAnnouncements.length > 0
                    ? latestAnnouncements.map((n) => ({ title: n.title, desc: n.content, date: formatDate(n.createdAt) }))
                    : [
                        { title: 'Admission Open for Fall 2024', desc: 'Important announcement for all students.', date: 'Dec 15, 2024' },
                        { title: 'Final Examination Schedule', desc: 'Important announcement for all students.', date: 'Dec 10, 2024' },
                        { title: 'Holiday Notice - Winter Break', desc: 'Important announcement for all students.', date: 'Dec 5, 2024' },
                      ]
                  ).map((notice) => (
                    <Card key={notice.title} padding="sm">
                      <h3 className="font-semibold text-slate-800 mb-1">{notice.title}</h3>
                      <p className="text-slate-500 text-sm line-clamp-2 mb-2">{notice.desc}</p>
                      <p className="text-xs text-slate-400">{notice.date}</p>
                    </Card>
                  ))}
                </div>
              </div>
              {/* Events */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-extrabold text-slate-900">Upcoming Events</h2>
                  <Link href="/events" className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold">View All</Link>
                </div>
                <div className="space-y-4">
                  {(upcomingEvents.length > 0
                    ? upcomingEvents.map((e) => ({
                        title: e.title,
                        day: new Date(e.startDate).getDate().toString(),
                        month: new Date(e.startDate).toLocaleDateString('en-US', { month: 'short' }),
                        location: e.location || '',
                      }))
                    : [
                        { title: 'Annual Convocation 2024', day: '20', month: 'Dec', location: 'Main Auditorium' },
                        { title: 'Tech Symposium', day: '25', month: 'Dec', location: 'Conference Hall' },
                        { title: 'Career Fair 2024', day: '02', month: 'Jan', location: 'Sports Complex' },
                      ]
                  ).map((event) => (
                    <Card key={event.title} padding="sm">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 flex flex-col items-center justify-center">
                          <span className="text-lg font-extrabold text-indigo-600">{event.day}</span>
                          <span className="text-[10px] font-semibold text-indigo-400 uppercase">{event.month}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800">{event.title}</h3>
                          {event.location && (
                            <span className="flex items-center gap-1 text-sm text-slate-400 mt-0.5">
                              <MapPin className="w-3 h-3" aria-hidden="true" />
                              {event.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="relative py-20 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 animated-gradient" aria-hidden="true" />
          <div className="blob w-72 h-72 bg-white/10 top-[-15%] right-[-5%]" aria-hidden="true" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-white/75 text-lg mb-10 max-w-2xl mx-auto">
              Applications are now open. Take the first step towards your future today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply">
                <Button size="lg" className="bg-white text-indigo-700 hover:bg-white/90 shadow-xl w-full sm:w-auto">
                  Apply Now <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10 w-full sm:w-auto">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
