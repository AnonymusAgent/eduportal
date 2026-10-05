import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { notifications } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import Card, { CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import {
  Bell,
  BellOff,
  CreditCard,
  FileText,
  Award,
  ClipboardCheck,
  Calendar,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

const notificationIcons: Record<string, typeof Bell> = {
  fee: CreditCard,
  admission: FileText,
  result: Award,
  exam: Calendar,
  attendance: ClipboardCheck,
  general: Bell,
};

async function getNotifications(userId: string) {
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));
}

export default async function NotificationsPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const notificationList = await getNotifications(session.id);
  const unreadCount = notificationList.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Notifications</h1>
          <p className="text-slate-500">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>
        {notificationList.length > 0 && (
          <form action="/api/notifications/mark-all-read" method="POST">
            <button
              type="submit"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Mark all as read
            </button>
          </form>
        )}
      </div>

      <Card padding="none">
        {notificationList.length > 0 ? (
          <div className="divide-y divide-white/20">
            {notificationList.map((notification) => {
              const Icon = notificationIcons[notification.type || 'general'] || Bell;

              return (
                <div
                  key={notification.id}
                  className={`p-4 flex gap-4 ${
                    notification.isRead ? 'bg-white/20' : 'bg-indigo-50/60'
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                      notification.isRead ? 'bg-slate-100/80' : 'bg-indigo-100/80'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        notification.isRead ? 'text-slate-400' : 'text-indigo-500'
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p
                          className={`font-medium ${
                            notification.isRead ? 'text-slate-500' : 'text-slate-800'
                          }`}
                        >
                          {notification.title}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <span className="flex-shrink-0 w-2 h-2 bg-indigo-500 rounded-full" aria-label="Unread" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-slate-400">
                        {formatDate(notification.createdAt)}
                      </span>
                      {notification.type && (
                        <Badge variant="default" className="text-xs">
                          {notification.type}
                        </Badge>
                      )}
                      {notification.link && (
                        <Link
                          href={notification.link}
                          className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
                        >
                          View Details
                          <ExternalLink className="w-3 h-3" aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<BellOff className="w-8 h-8 text-gray-400" />}
            title="No Notifications"
            description="You don't have any notifications yet. When there are updates about your academics, fees, or announcements, they'll appear here."
          />
        )}
      </Card>
    </div>
  );
}
