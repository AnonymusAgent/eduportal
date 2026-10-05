import PublicHeader from '@/components/layouts/PublicHeader';
import PublicFooter from '@/components/layouts/PublicFooter';
import Card from '@/components/ui/Card';
import {
  GraduationCap, Target, Eye, Award, Users, BookOpen, Globe, Heart,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />

      <main id="main-content" className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden py-16">
          <div className="absolute inset-0 animated-gradient" aria-hidden="true" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <h1 className="text-4xl font-extrabold text-white mb-4">About EduPortal Academy</h1>
            <p className="text-xl text-white/80 max-w-3xl">
              A leading educational institution dedicated to excellence in education, research, and community service since 1990.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-l-4 border-l-indigo-500">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 shadow-lg">
                    <Target className="w-7 h-7 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-800 mb-3">Our Mission</h2>
                    <p className="text-slate-500 leading-relaxed">
                      To provide transformative education that empowers students to become innovative thinkers,
                      ethical leaders, and engaged global citizens. We are committed to fostering an inclusive
                      learning environment that promotes academic excellence, critical thinking, and lifelong learning.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="border-l-4 border-l-emerald-500">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
                    <Eye className="w-7 h-7 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-800 mb-3">Our Vision</h2>
                    <p className="text-slate-500 leading-relaxed">
                      To be recognized as a world-class institution of higher learning that leads in
                      innovation, research, and community impact. We aspire to shape the future by
                      nurturing the next generation of leaders who will make meaningful contributions
                      to society.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-extrabold text-slate-800 text-center mb-12">Our Core Values</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Award, title: 'Excellence', description: 'Striving for the highest standards in everything we do', gradient: 'from-indigo-500 to-blue-500' },
                { icon: Heart, title: 'Integrity', description: 'Acting with honesty, ethics, and transparency', gradient: 'from-rose-500 to-pink-500' },
                { icon: Users, title: 'Inclusivity', description: 'Embracing diversity and creating belonging', gradient: 'from-violet-500 to-purple-500' },
                { icon: Globe, title: 'Innovation', description: 'Fostering creativity and forward thinking', gradient: 'from-emerald-500 to-teal-500' },
              ].map((value) => {
                const Icon = value.icon;
                return (
                  <Card key={value.title} className="text-center">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 bg-gradient-to-br ${value.gradient} shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{value.title}</h3>
                    <p className="text-slate-500 text-sm">{value.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* History */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-extrabold text-slate-800 text-center mb-8">Our History</h2>
            <div className="space-y-4 text-slate-500 leading-relaxed text-lg">
              <p>
                EduPortal Academy was founded in 1990 with a vision to provide quality education
                accessible to all. Starting with just 200 students and a handful of programs,
                we have grown into a comprehensive institution serving over 5,000 students across
                multiple disciplines.
              </p>
              <p>
                Over the decades, we have continuously evolved our curriculum, facilities, and
                teaching methodologies to meet the changing needs of students and the industry.
                Our commitment to excellence has earned us recognition as one of the leading
                educational institutions in the region.
              </p>
              <p>
                Today, we offer more than 50 undergraduate and graduate programs across 8 departments,
                supported by world-class faculty, modern facilities, and strong industry partnerships.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 animated-gradient" aria-hidden="true" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-white">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div><p className="text-4xl font-extrabold mb-2">5,000+</p><p className="text-white/70">Students</p></div>
              <div><p className="text-4xl font-extrabold mb-2">50+</p><p className="text-white/70">Programs</p></div>
              <div><p className="text-4xl font-extrabold mb-2">200+</p><p className="text-white/70">Faculty Members</p></div>
              <div><p className="text-4xl font-extrabold mb-2">30+</p><p className="text-white/70">Years of Excellence</p></div>
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-extrabold text-slate-800 text-center mb-12">Leadership Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Dr. John Anderson', role: 'Chancellor', dept: 'Office of the Chancellor' },
                { name: 'Dr. Sarah Mitchell', role: 'Vice Chancellor', dept: 'Academic Affairs' },
                { name: 'Prof. Michael Chen', role: 'Registrar', dept: 'Student Services' },
                { name: 'Dr. Emily Watson', role: 'Dean', dept: 'Faculty of Sciences' },
                { name: 'Prof. Robert Kumar', role: 'Dean', dept: 'Faculty of Engineering' },
                { name: 'Dr. Lisa Thompson', role: 'Dean', dept: 'Faculty of Business' },
              ].map((person) => (
                <Card key={person.name} className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-10 h-10 text-indigo-400" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{person.name}</h3>
                  <p className="text-indigo-600 font-semibold">{person.role}</p>
                  <p className="text-sm text-slate-400">{person.dept}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Accreditation */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-8">Accreditation & Recognition</h2>
            <p className="text-slate-500 mb-8">
              EduPortal Academy is accredited by leading educational bodies and recognized for
              its commitment to quality education.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {['National Education Board', 'Higher Education Council', 'International Accreditation Agency'].map((accr) => (
                <Card key={accr} padding="sm" className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-amber-500" aria-hidden="true" />
                  <span className="font-semibold text-slate-700">{accr}</span>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
