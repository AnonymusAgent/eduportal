import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notifications } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse(null, {
        status: 307,
        headers: { Location: '/login' },
      });
    }

    await db
      .update(notifications)
      .set({ isRead: true, readAt: new Date() })
      .where(and(eq(notifications.userId, session.id), eq(notifications.isRead, false)));

    return new NextResponse(null, {
      status: 307,
      headers: { Location: '/portal/notifications' },
    });
  } catch (error) {
    console.error('Failed to mark notifications as read:', error);
    return new NextResponse(null, {
      status: 307,
      headers: { Location: '/portal/notifications' },
    });
  }
}
