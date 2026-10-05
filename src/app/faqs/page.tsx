import { db } from '@/db';
import { faqs } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import PublicHeader from '@/components/layouts/PublicHeader';
import PublicFooter from '@/components/layouts/PublicFooter';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { HelpCircle, ChevronDown } from 'lucide-react';

async function getFaqs() {
  return db
    .select()
    .from(faqs)
    .where(eq(faqs.isPublished, true))
    .orderBy(asc(faqs.sortOrder));
}

export default async function FaqsPage() {
  const faqList = await getFaqs();
  const categories = ['all', ...new Set(faqList.map((f) => f.category).filter(Boolean))];

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />

      <main id="main-content" className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-2">
              Frequently Asked Questions
            </h1>
            <p className="text-slate-500">
              Find answers to common questions about admissions, fees, academics, and more.
            </p>
          </div>

          {faqList.length > 0 ? (
            <Tabs defaultValue="all">
              <TabsList ariaLabel="FAQ categories" className="justify-center mb-6">
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category || 'all'}>
                    {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All'}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category} value={category || 'all'}>
                  <div className="space-y-3">
                    {faqList
                      .filter((f) => category === 'all' || f.category === category)
                      .map((faq) => (
                        <details
                          key={faq.id}
                          className="group glass-strong rounded-2xl"
                        >
                          <summary className="flex items-center justify-between cursor-pointer p-4 font-semibold text-slate-800 hover:bg-indigo-50/30 rounded-2xl transition-colors">
                            <span className="flex items-center gap-3">
                              <HelpCircle className="w-5 h-5 text-indigo-500 flex-shrink-0" aria-hidden="true" />
                              {faq.question}
                            </span>
                            <ChevronDown
                              className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform duration-200"
                              aria-hidden="true"
                            />
                          </summary>
                          <div className="px-4 pb-4 pt-2 text-slate-500 border-t border-white/30">
                            <p className="pl-8">{faq.answer}</p>
                          </div>
                        </details>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <Card>
              <EmptyState
                icon={<HelpCircle className="w-8 h-8 text-indigo-400" />}
                title="No FAQs Available"
                description="Check back later for frequently asked questions."
              />
            </Card>
          )}

          {/* Contact Section */}
          <Card className="mt-12 text-center">
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Can&apos;t find what you&apos;re looking for?
            </h2>
            <p className="text-slate-500 mb-4">
              Our support team is here to help you with any questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact">
                <Button>Contact Us</Button>
              </a>
              <a href="mailto:support@eduportal.edu">
                <Button variant="outline">Email Support</Button>
              </a>
            </div>
          </Card>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
