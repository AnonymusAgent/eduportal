import { NextRequest, NextResponse } from 'next/server';
import { logout } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (token) {
      await logout(token);
    }

    // Use a relative Location header so the redirect works correctly
    // behind any proxy/sandbox without leaking internal origins.
    const response = new NextResponse(null, {
      status: 307,
      headers: { Location: '/login' },
    });

    response.cookies.set('session_token', '', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return new NextResponse(null, {
      status: 307,
      headers: { Location: '/login' },
    });
  }
}
