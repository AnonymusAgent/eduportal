import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { students, programs, departments, campuses, academicSessions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Card, { CardTitle, CardDescription } from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Building,
  Users,
  AlertCircle,
  Edit,
} from 'lucide-react';

async function getStudentProfile(userId: string) {
  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.userId, userId))
    .limit(1);

  if (!student) return null;

  const [program] = student.programId
    ? await db.select().from(programs).where(eq(programs.id, student.programId)).limit(1)
    : [null];

  const [department] = student.departmentId
    ? await db.select().from(departments).where(eq(departments.id, student.departmentId)).limit(1)
    : [null];

  const [campus] = student.campusId
    ? await db.select().from(campuses).where(eq(campuses.id, student.campusId)).limit(1)
    : [null];

  const [academicSession] = student.academicSessionId
    ? await db.select().from(academicSessions).where(eq(academicSessions.id, student.academicSessionId)).limit(1)
    : [null];

  return { student, program, department, campus, academicSession };
}

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const data = await getStudentProfile(session.id);

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">Profile Not Found</h2>
            <p className="text-gray-600">Your student profile is being set up.</p>
          </div>
        </Card>
      </div>
    );
  }

  const { student, program, department, campus, academicSession } = data;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">View and manage your profile information</p>
        </div>
        <Link href="/portal/support?type=change_request">
          <Button variant="outline" leftIcon={<Edit className="w-4 h-4" />}>
            Request Change
          </Button>
        </Link>
      </div>

      {/* Profile Header */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Avatar
            firstName={student.firstName}
            lastName={student.lastName}
            src={student.photoUrl}
            size="xl"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-gray-900">
              {student.firstName} {student.lastName}
            </h2>
            <p className="text-lg text-gray-600">{student.studentId}</p>
            <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
              <Badge status={student.enrollmentStatus || 'active'}>
                {(student.enrollmentStatus || 'active').toUpperCase()}
              </Badge>
              {student.cgpa && (
                <Badge variant="info">CGPA: {student.cgpa}</Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardTitle className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-blue-600" aria-hidden="true" />
          Personal Information
        </CardTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoRow label="Full Name" value={`${student.firstName} ${student.lastName}`} />
          <InfoRow label="Date of Birth" value={formatDate(student.dateOfBirth)} />
          <InfoRow label="Gender" value={student.gender ? student.gender.charAt(0).toUpperCase() + student.gender.slice(1) : 'N/A'} />
          <InfoRow label="Nationality" value={student.nationality} />
          <InfoRow label="Blood Group" value={student.bloodGroup} />
        </div>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardTitle className="flex items-center gap-2 mb-4">
          <Mail className="w-5 h-5 text-blue-600" aria-hidden="true" />
          Contact Information
        </CardTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoRow label="Phone Number" value={student.phone} icon={<Phone className="w-4 h-4" />} />
          <InfoRow label="City" value={student.city} />
          <div className="md:col-span-2">
            <InfoRow label="Address" value={student.address} icon={<MapPin className="w-4 h-4" />} />
          </div>
          <div className="md:col-span-2">
            <InfoRow label="Permanent Address" value={student.permanentAddress} />
          </div>
        </div>
      </Card>

      {/* Guardian Information */}
      <Card>
        <CardTitle className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-blue-600" aria-hidden="true" />
          Guardian Information
        </CardTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoRow label="Father's Name" value={student.fatherName} />
          <InfoRow label="Mother's Name" value={student.motherName} />
          <InfoRow label="Guardian Name" value={student.guardianName} />
          <InfoRow label="Guardian Phone" value={student.guardianPhone} />
          <InfoRow label="Guardian Email" value={student.guardianEmail} />
        </div>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardTitle className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-red-600" aria-hidden="true" />
          Emergency Contact
        </CardTitle>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoRow label="Contact Name" value={student.emergencyContactName} />
          <InfoRow label="Contact Phone" value={student.emergencyContactPhone} />
          <InfoRow label="Relationship" value={student.emergencyContactRelation} />
        </div>
      </Card>

      {/* Academic Information */}
      <Card>
        <CardTitle className="flex items-center gap-2 mb-4">
          <GraduationCap className="w-5 h-5 text-blue-600" aria-hidden="true" />
          Academic Information
        </CardTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoRow label="Student ID" value={student.studentId} />
          <InfoRow label="Program" value={program?.name} />
          <InfoRow label="Department" value={department?.name} />
          <InfoRow label="Campus" value={campus?.name} />
          <InfoRow label="Academic Session" value={academicSession?.name} />
          <InfoRow label="Current Semester" value={student.currentSemester?.toString()} />
          <InfoRow label="Enrollment Date" value={formatDate(student.enrollmentDate)} />
          <InfoRow label="Expected Graduation" value={formatDate(student.expectedGraduationDate)} />
          <InfoRow label="CGPA" value={student.cgpa?.toString()} />
          <InfoRow label="Credits Completed" value={student.totalCreditsCompleted?.toString()} />
        </div>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardDescription>
          <strong>Note:</strong> To request changes to your personal or academic information, 
          please submit a change request through the support portal. Changes will be reviewed 
          by the registrar's office.
        </CardDescription>
      </Card>
    </div>
  );
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | null;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-gray-900 flex items-center gap-2">
        {icon && <span className="text-gray-400">{icon}</span>}
        {value || 'N/A'}
      </p>
    </div>
  );
}
