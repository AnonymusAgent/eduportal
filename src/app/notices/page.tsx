import { db } from '@/db';
import { announcements } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import PublicHeader from '@/components/layouts/PublicHeader';
import PublicFooter from '@/components/layouts/PublicFooter';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';
import { Bell, Pin, AlertTriangle, Info, Megaphone } from 'lucide-react';

async function getAnnouncements() {
  return db
    .select()
    .from(announcements)
    .where(eq(announcements.isPublished, true))
    .orderBy(desc(announcements.isPinned), desc(announcements.createdAt));
}

export default async function NoticesPage() {
  const noticeList = await getAnnouncements();

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />

      <main id="main-content" className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-2">
              Notices &amp; Announcements
            </h1>
            <p className="text-slate-500">
              Stay updated with the latest news and announcements from the institution
            </p>
          </div>

          <div className="space-y-4">
            {noticeList.length > 0 ? (
              noticeList.map((notice) => (
                <Card key={notice.id} className="hover:shadow-lg hover:shadow-indigo-500/5 transition-shadow">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 p-3 rounded-xl shadow-md ${
                        notice.priority === 'urgent'
                          ? 'bg-gradient-to-br from-rose-500 to-pink-500'
                          : notice.priority === 'high'
                          ? 'bg-gradient-to-br from-amber-500 to-orange-500'
                          : 'bg-gradient-to-br from-indigo-500 to-blue-500'
                      }`}
                    >
                      {notice.priority === 'urgent' ? (
                        <AlertTriangle className="w-5 h-5 text-white" aria-hidden="true" />
                      ) : notice.priority === 'high' ? (
                        <Megaphone className="w-5 h-5 text-white" aria-hidden="true" />
                      ) : (
                        <Info className="w-5 h-5 text-white" aria-hidden="true" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-lg font-bold text-slate-800">
                            {notice.title}
                          </h2>
                          {notice.isPinned && (
                            <Pin className="w-4 h-4 text-indigo-500" aria-label="Pinned" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {notice.category && (
                            <Badge variant="default">{notice.category}</Badge>
                          )}
                          {notice.priority === 'urgent' && (
                            <Badge variant="danger">Urgent</Badge>
                          )}
                          {notice.priority === 'high' && (
                            <Badge variant="warning">Important</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-slate-500 mt-2 whitespace-pre-wrap">
                        {notice.content}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-slate-400">
                        <span>{formatDate(notice.createdAt)}</span>
                        {notice.targetAudience && notice.targetAudience !== 'all' && (
                          <span>For: {notice.targetAudience}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card>
                <EmptyState
                  icon={<Bell className="w-8 h-8 text-indigo-400" />}
                  title="No Announcements"
                  description="There are no announcements at this time. Check back later for updates."
                />
              </Card>
            )}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
