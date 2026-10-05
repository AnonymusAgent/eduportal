import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { admissionApplications } from '@/db/schema';
import { generateApplicationNumber } from '@/lib/utils';
import { z } from 'zod';

const draftSchema = z.object({
  currentStep: z.number().optional(),
  email: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  nationalIdNumber: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
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
}).passthrough();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = draftSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const { currentStep, ...data } = result.data;
    const applicationNumber = generateApplicationNumber();

    const [application] = await db.insert(admissionApplications).values({
      applicationNumber,
      email: data.email || `draft-${applicationNumber}@temp.edu`,
      status: 'draft',
      firstName: data.firstName || null,
      lastName: data.lastName || null,
      fatherName: data.fatherName || null,
      motherName: data.motherName || null,
      guardianName: data.guardianName || null,
      guardianPhone: data.guardianPhone || null,
      dateOfBirth: data.dateOfBirth || null,
      gender: (data.gender as 'male' | 'female' | 'other' | 'prefer_not_to_say') || null,
      nationality: data.nationality || null,
      nationalIdNumber: data.nationalIdNumber || null,
      phone: data.phone || null,
      address: data.address || null,
      city: data.city || null,
      country: data.country || null,
      postalCode: data.postalCode || null,
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
      currentStep: currentStep || 1,
    }).returning();

    return NextResponse.json({
      success: true,
      applicationNumber: application.applicationNumber,
      applicationId: application.id,
    });
  } catch (error) {
    console.error('Draft save error:', error);
    return NextResponse.json(
      { error: 'Failed to save draft' },
      { status: 500 }
    );
  }
}
