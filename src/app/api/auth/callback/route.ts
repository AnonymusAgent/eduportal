import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth';

/**
 * GET /api/auth/callback?token=...&to=/portal
 *
 * Sets the session cookie and redirects to the destination.
 * Uses a relative-path Location header so the redirect works correctly
 * regardless of proxy/origin configuration.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const to = searchParams.get('to') || '/portal';

  // Only allow relative paths
  const safeTo = to.startsWith('/') ? to : '/portal';

  if (!token) {
    return new NextResponse(null, {
      status: 307,
      headers: { Location: '/login' },
    });
  }

  // Validate the token
  const user = await validateSession(token);
  if (!user) {
    return new NextResponse(null, {
      status: 307,
      headers: { Location: '/login' },
    });
  }

  // Build the response with a RELATIVE Location header.
  // NextResponse.redirect() always produces an absolute URL derived from
  // request.url, which inside proxied/sandboxed environments resolves to
  // the internal origin (e.g. http://0.0.0.0:3000) — unreachable by the
  // browser.  A relative Location header works in all environments.
  const response = new NextResponse(null, {
    status: 307,
    headers: { Location: safeTo },
  });

  response.cookies.set('session_token', token, {
    httpOnly: true,
    secure: false,       // cookie works over both HTTP and HTTPS
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });

  return response;
}
