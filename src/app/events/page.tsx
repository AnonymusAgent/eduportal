import { db } from '@/db';
import { events } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import PublicHeader from '@/components/layouts/PublicHeader';
import PublicFooter from '@/components/layouts/PublicFooter';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';
import { Calendar, MapPin, Clock } from 'lucide-react';

async function getEvents() {
  return db.select().from(events).where(eq(events.isPublic, true)).orderBy(desc(events.startDate));
}

export default async function EventsPage() {
  const eventList = await getEvents();

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main id="main-content" className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Events</h1>
            <p className="text-slate-500">Upcoming and past events at EduPortal Academy</p>
          </div>
          <div className="space-y-4">
            {eventList.length > 0 ? eventList.map((event) => (
              <Card key={event.id} className="hover:shadow-lg hover:shadow-indigo-500/5 transition-shadow">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 flex flex-col items-center justify-center">
                    <span className="text-xl font-extrabold text-indigo-600">{new Date(event.startDate).getDate()}</span>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase">{new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' })}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-lg font-bold text-slate-800">{event.title}</h2>
                      {event.eventType && <Badge variant="info">{event.eventType}</Badge>}
                    </div>
                    {event.description && <p className="text-slate-500 text-sm mt-1 line-clamp-2">{event.description}</p>}
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" aria-hidden="true" />{formatDate(event.startDate)}</span>
                      {event.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" aria-hidden="true" />{event.location}</span>}
                    </div>
                  </div>
                </div>
              </Card>
            )) : (
              <Card>
                <EmptyState icon={<Calendar className="w-8 h-8 text-indigo-400" />} title="No Events" description="There are no upcoming events at this time." />
              </Card>
            )}
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
