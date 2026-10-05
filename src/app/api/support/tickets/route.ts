import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { supportTickets, students } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { generateTicketNumber } from '@/lib/utils';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

const ticketSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  subject: z.string().min(1, 'Subject is required'),
  description: z.string().min(1, 'Description is required'),
});

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tickets = await db
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.userId, session.id))
      .orderBy(desc(supportTickets.createdAt));

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error('Failed to fetch tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const result = ticketSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { category, subject, description } = result.data;
    const ticketNumber = generateTicketNumber();

    const [ticket] = await db.insert(supportTickets).values({
      ticketNumber,
      userId: session.id,
      category,
      subject,
      description,
      status: 'open',
      priority: 'normal',
    }).returning();

    return NextResponse.json({
      success: true,
      ticketNumber: ticket.ticketNumber,
      ticketId: ticket.id,
    });
  } catch (error) {
    console.error('Failed to create ticket:', error);
    return NextResponse.json(
      { error: 'Failed to create ticket' },
      { status: 500 }
    );
  }
}
