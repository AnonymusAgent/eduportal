import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const { success: allowed } = rateLimit(`login:${ip}`, 10, 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please wait a moment and try again.' },
        { status: 429 },
      );
    }

    const body = await request.json();

    const result = loginSchema.safeParse(body);
    if (!result.success) {
      const msg = result.error.issues[0]?.message || 'Please provide a valid email and password.';
      return NextResponse.json(
        { error: msg === 'Invalid input: expected string, received undefined' ? 'Please enter your email and password.' : msg },
        { status: 400 },
      );
    }

    const { email, password } = result.data;
    const userAgent = request.headers.get('user-agent') || undefined;
    const loginResult = await login(email, password, ip || undefined, userAgent);

    if (!loginResult.success) {
      return NextResponse.json(
        { error: loginResult.error },
        { status: 401 },
      );
    }

    // Return the token in the JSON body so the client can navigate to
    // /api/auth/callback?token=...&to=... which sets the cookie via a
    // proper browser navigation (not fetch).  This guarantees the cookie
    // is stored before the destination page's server component reads it.
    const redirectTo = loginResult.user?.role === 'student' ? '/portal' : '/admin';

    return NextResponse.json({
      success: true,
      token: loginResult.token,
      redirect: redirectTo,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 },
    );
  }
}
