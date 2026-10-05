import PublicHeader from '@/components/layouts/PublicHeader';
import PublicFooter from '@/components/layouts/PublicFooter';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />

      <main id="main-content" className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Contact Us</h1>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Have questions? We&apos;re here to help. Reach out to us through any of the following channels.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <h2 className="text-lg font-bold text-slate-800 mb-4">Get in Touch</h2>
                <div className="space-y-4">
                  {[
                    { icon: MapPin, gradient: 'from-indigo-500 to-blue-500', label: 'Address', content: <address className="text-sm text-slate-500 not-italic">123 Education Street<br />Academic City, AC 12345<br />United States</address> },
                    { icon: Phone, gradient: 'from-emerald-500 to-teal-500', label: 'Phone', content: <a href="tel:+1234567890" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">+1 (234) 567-890</a> },
                    { icon: Mail, gradient: 'from-violet-500 to-purple-500', label: 'Email', content: <a href="mailto:info@eduportal.edu" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">info@eduportal.edu</a> },
                    { icon: Clock, gradient: 'from-amber-500 to-orange-500', label: 'Office Hours', content: <p className="text-sm text-slate-500">Monday – Friday: 8:00 AM – 5:00 PM<br />Saturday: 9:00 AM – 1:00 PM<br />Sunday: Closed</p> },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl bg-gradient-to-br ${item.gradient} shadow-md flex-shrink-0`}>
                          <Icon className="w-4 h-4 text-white" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-700 text-sm">{item.label}</p>
                          {item.content}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card>
                <h2 className="text-lg font-bold text-slate-800 mb-4">Department Contacts</h2>
                <div className="space-y-2.5">
                  {[
                    { name: 'Admissions Office', email: 'admissions@eduportal.edu' },
                    { name: 'Finance Office', email: 'finance@eduportal.edu' },
                    { name: 'Student Support', email: 'support@eduportal.edu' },
                    { name: 'IT Helpdesk', email: 'it@eduportal.edu' },
                  ].map((dept) => (
                    <div key={dept.name} className="p-3 rounded-xl bg-white/30">
                      <p className="font-semibold text-slate-700 text-sm">{dept.name}</p>
                      <a href={`mailto:${dept.email}`} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                        {dept.email}
                      </a>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <h2 className="text-lg font-bold text-slate-800 mb-4">Send us a Message</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="First Name" name="firstName" placeholder="Your first name" required />
                    <Input label="Last Name" name="lastName" placeholder="Your last name" required />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Email Address" name="email" type="email" placeholder="you@example.com" required />
                    <Input label="Phone Number" name="phone" type="tel" placeholder="+1 234 567 890" />
                  </div>
                  <Input label="Subject" name="subject" placeholder="How can we help you?" required />
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Message <span className="text-rose-400" aria-hidden="true">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={6}
                      placeholder="Please provide details about your inquiry..."
                      className="w-full px-4 py-2.5 rounded-xl transition-all duration-200 bg-white/60 backdrop-blur-sm border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400 placeholder:text-slate-400"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="privacy"
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      required
                    />
                    <label htmlFor="privacy" className="text-sm text-slate-500">
                      I agree to the privacy policy and terms of service
                    </label>
                  </div>
                  <Button type="submit" rightIcon={<Send className="w-4 h-4" />} className="w-full sm:w-auto">
                    Send Message
                  </Button>
                </form>
              </Card>

              <Card className="mt-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Find Us</h2>
                <div className="bg-white/30 rounded-xl h-64 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" aria-hidden="true" />
                    <p className="text-slate-400 font-medium">Map view would appear here</p>
                    <p className="text-sm text-slate-400">123 Education Street, Academic City</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
