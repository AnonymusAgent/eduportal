import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { admissionApplications } from '@/db/schema';
import { generateApplicationNumber } from '@/lib/utils';
import { rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const applicationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Gender is required'),
  nationality: z.string().optional(),
  nationalIdNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  programId: z.string().optional(),
  campusId: z.string().optional(),
  academicSessionId: z.string().optional(),
  previousInstitution: z.string().optional(),
  previousQualification: z.string().optional(),
  previousMarks: z.string().optional(),
  previousGrade: z.string().optional(),
  previousYear: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const { success: allowed } = rateLimit(`application:${ip}`, 5, 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait a moment and try again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    
    const result = applicationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = result.data;
    const applicationNumber = generateApplicationNumber();

    // Insert application
    const [application] = await db.insert(admissionApplications).values({
      applicationNumber,
      email: data.email,
      status: 'submitted',
      firstName: data.firstName,
      lastName: data.lastName,
      fatherName: data.fatherName || null,
      motherName: data.motherName || null,
      guardianName: data.guardianName || null,
      guardianPhone: data.guardianPhone || null,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender as 'male' | 'female' | 'other' | 'prefer_not_to_say',
      nationality: data.nationality || null,
      nationalIdNumber: data.nationalIdNumber || null,
      phone: data.phone,
      address: data.address || null,
      city: data.city || null,
      country: data.country || null,
      postalCode: data.postalCode || null,
      permanentAddress: data.address || null,
      emergencyContactName: data.emergencyContactName || null,
      emergencyContactPhone: data.emergencyContactPhone || null,
      emergencyContactRelation: data.emergencyContactRelation || null,
      programId: data.programId || null,
      campusId: data.campusId || null,
      academicSessionId: data.academicSessionId || null,
      previousInstitution: data.previousInstitution || null,
      previousQualification: data.previousQualification || null,
      previousMarks: data.previousMarks || null,
      previousGrade: data.previousGrade || null,
      previousYear: data.previousYear ? parseInt(data.previousYear) : null,
      submittedAt: new Date(),
      currentStep: 5,
    }).returning();

    return NextResponse.json({
      success: true,
      applicationNumber: application.applicationNumber,
      applicationId: application.id,
    });
  } catch (error) {
    console.error('Application submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}
