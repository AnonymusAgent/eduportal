import { db } from '@/db';
import { users, sessions, students, staff } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export type UserRole =
  | 'super_admin'
  | 'it_admin'
  | 'registrar'
  | 'admissions_officer'
  | 'finance_officer'
  | 'examination_officer'
  | 'department_admin'
  | 'teacher'
  | 'student'
  | 'readonly_staff';

export interface SessionUser {
  id: string;
  email: string;
  role: UserRole;
  studentId?: string;
  staffId?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string, ipAddress?: string, userAgent?: string): Promise<string> {
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await db.insert(sessions).values({
    userId,
    token,
    expiresAt,
    ipAddress,
    userAgent,
  });

  return token;
}

export async function validateSession(token: string): Promise<SessionUser | null> {
  if (!token) return null;

  const [session] = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
    .limit(1);

  if (!session) return null;

  const [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.id, session.userId), eq(users.isActive, true)))
    .limit(1);

  if (!user) return null;

  let studentData = null;
  let staffData = null;

  if (user.role === 'student') {
    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.userId, user.id))
      .limit(1);
    studentData = student;
  } else {
    const [staffMember] = await db
      .select()
      .from(staff)
      .where(eq(staff.userId, user.id))
      .limit(1);
    staffData = staffMember;
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role as UserRole,
    studentId: studentData?.studentId,
    staffId: staffData?.employeeId,
    firstName: studentData?.firstName || staffData?.firstName,
    lastName: studentData?.lastName || staffData?.lastName,
    photoUrl: studentData?.photoUrl || staffData?.photoUrl || undefined,
  };
}

export async function login(
  email: string,
  password: string,
  ipAddress?: string,
  userAgent?: string
): Promise<{ success: boolean; token?: string; error?: string; user?: SessionUser }> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }

  // Check if account is locked
  if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
    const remainingMinutes = Math.ceil((new Date(user.lockedUntil).getTime() - Date.now()) / 60000);
    return {
      success: false,
      error: `Account is locked. Please try again in ${remainingMinutes} minutes.`,
    };
  }

  if (!user.isActive) {
    return { success: false, error: 'Account is deactivated. Please contact support.' };
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash);

  if (!isValidPassword) {
    const newAttempts = user.failedLoginAttempts + 1;
    const updates: Record<string, unknown> = { failedLoginAttempts: newAttempts };

    if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
      updates.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
    }

    await db.update(users).set(updates).where(eq(users.id, user.id));

    return { success: false, error: 'Invalid email or password' };
  }

  // Reset failed attempts and update last login
  await db
    .update(users)
    .set({
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLogin: new Date(),
    })
    .where(eq(users.id, user.id));

  const token = await createSession(user.id, ipAddress, userAgent);

  let studentData = null;
  let staffData = null;

  if (user.role === 'student') {
    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.userId, user.id))
      .limit(1);
    studentData = student;
  } else {
    const [staffMember] = await db
      .select()
      .from(staff)
      .where(eq(staff.userId, user.id))
      .limit(1);
    staffData = staffMember;
  }

  return {
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role as UserRole,
      studentId: studentData?.studentId,
      staffId: staffData?.employeeId,
      firstName: studentData?.firstName || staffData?.firstName,
      lastName: studentData?.lastName || staffData?.lastName,
      photoUrl: studentData?.photoUrl || staffData?.photoUrl || undefined,
    },
  };
}

export async function logout(token: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.token, token));
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    if (!token) return null;
    return validateSession(token);
  } catch (error) {
    console.error('getSession error:', error);
    return null;
  }
}

export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function requireRole(allowedRoles: UserRole[]): Promise<SessionUser> {
  const session = await requireAuth();
  if (!allowedRoles.includes(session.role)) {
    throw new Error('Forbidden');
  }
  return session;
}

export function isAdmin(role: UserRole): boolean {
  return ['super_admin', 'it_admin', 'registrar', 'admissions_officer', 'finance_officer', 'examination_officer', 'department_admin', 'teacher', 'readonly_staff'].includes(role);
}

export function canManageStudents(role: UserRole): boolean {
  return ['super_admin', 'it_admin', 'registrar', 'admissions_officer', 'department_admin'].includes(role);
}

export function canManageFees(role: UserRole): boolean {
  return ['super_admin', 'finance_officer'].includes(role);
}

export function canManageExams(role: UserRole): boolean {
  return ['super_admin', 'examination_officer', 'teacher'].includes(role);
}

export function canManageAttendance(role: UserRole): boolean {
  return ['super_admin', 'teacher', 'department_admin'].includes(role);
}
