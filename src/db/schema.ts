import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  date,
  time,
  jsonb,
  pgEnum,
} from 'drizzle-orm/pg-core';

// Enums
export const userRoleEnum = pgEnum('user_role', [
  'super_admin',
  'it_admin',
  'registrar',
  'admissions_officer',
  'finance_officer',
  'examination_officer',
  'department_admin',
  'teacher',
  'student',
  'readonly_staff',
]);

export const genderEnum = pgEnum('gender', ['male', 'female', 'other', 'prefer_not_to_say']);

export const applicationStatusEnum = pgEnum('application_status', [
  'draft',
  'submitted',
  'under_review',
  'documents_verified',
  'accepted',
  'rejected',
  'waitlisted',
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'paid',
  'partially_paid',
  'overdue',
]);

export const ticketStatusEnum = pgEnum('ticket_status', [
  'open',
  'in_progress',
  'resolved',
  'closed',
]);

export const semesterStatusEnum = pgEnum('semester_status', [
  'completed',
  'current',
  'upcoming',
]);

export const attendanceStatusEnum = pgEnum('attendance_status', [
  'present',
  'absent',
  'late',
  'excused',
]);

export const resultStatusEnum = pgEnum('result_status', [
  'pass',
  'fail',
  'incomplete',
  'withheld',
]);

// Core Tables
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: userRoleEnum('role').notNull().default('student'),
  isActive: boolean('is_active').notNull().default(true),
  isVerified: boolean('is_verified').notNull().default(false),
  twoFactorEnabled: boolean('two_factor_enabled').notNull().default(false),
  twoFactorSecret: varchar('two_factor_secret', { length: 255 }),
  lastLogin: timestamp('last_login'),
  failedLoginAttempts: integer('failed_login_attempts').notNull().default(0),
  lockedUntil: timestamp('locked_until'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const campuses = pgTable('campuses', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 20 }).notNull().unique(),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  country: varchar('country', { length: 100 }),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const departments = pgTable('departments', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 20 }).notNull().unique(),
  description: text('description'),
  headOfDepartment: uuid('head_of_department'),
  campusId: uuid('campus_id').references(() => campuses.id),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const programs = pgTable('programs', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 20 }).notNull().unique(),
  description: text('description'),
  departmentId: uuid('department_id').references(() => departments.id),
  degreeType: varchar('degree_type', { length: 50 }), // Bachelor, Master, PhD, Diploma, Certificate
  durationYears: integer('duration_years').notNull().default(4),
  totalSemesters: integer('total_semesters').notNull().default(8),
  totalCredits: integer('total_credits').notNull().default(120),
  minAttendancePercentage: integer('min_attendance_percentage').notNull().default(75),
  admissionRequirements: text('admission_requirements'),
  tuitionFee: decimal('tuition_fee', { precision: 12, scale: 2 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const academicSessions = pgTable('academic_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(), // e.g., "2024-2025"
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  isCurrent: boolean('is_current').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const semesters = pgTable('semesters', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(), // e.g., "Fall 2024"
  academicSessionId: uuid('academic_session_id').references(() => academicSessions.id),
  semesterNumber: integer('semester_number').notNull(), // 1, 2, 3...
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  registrationDeadline: date('registration_deadline'),
  isCurrent: boolean('is_current').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const courses = pgTable('courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 20 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  departmentId: uuid('department_id').references(() => departments.id),
  creditHours: integer('credit_hours').notNull().default(3),
  isElective: boolean('is_elective').notNull().default(false),
  prerequisites: text('prerequisites'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const programCourses = pgTable('program_courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  programId: uuid('program_id').references(() => programs.id),
  courseId: uuid('course_id').references(() => courses.id),
  semesterNumber: integer('semester_number').notNull(),
  isRequired: boolean('is_required').notNull().default(true),
});

// Staff & Students
export const staff = pgTable('staff', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  employeeId: varchar('employee_id', { length: 50 }).notNull().unique(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  departmentId: uuid('department_id').references(() => departments.id),
  designation: varchar('designation', { length: 100 }),
  phone: varchar('phone', { length: 50 }),
  address: text('address'),
  dateOfBirth: date('date_of_birth'),
  gender: genderEnum('gender'),
  joiningDate: date('joining_date'),
  photoUrl: text('photo_url'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const students = pgTable('students', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  studentId: varchar('student_id', { length: 50 }).notNull().unique(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  fatherName: varchar('father_name', { length: 200 }),
  motherName: varchar('mother_name', { length: 200 }),
  guardianName: varchar('guardian_name', { length: 200 }),
  guardianPhone: varchar('guardian_phone', { length: 50 }),
  guardianEmail: varchar('guardian_email', { length: 255 }),
  dateOfBirth: date('date_of_birth'),
  gender: genderEnum('gender'),
  nationality: varchar('nationality', { length: 100 }),
  phone: varchar('phone', { length: 50 }),
  address: text('address'),
  permanentAddress: text('permanent_address'),
  city: varchar('city', { length: 100 }),
  country: varchar('country', { length: 100 }),
  postalCode: varchar('postal_code', { length: 20 }),
  programId: uuid('program_id').references(() => programs.id),
  departmentId: uuid('department_id').references(() => departments.id),
  campusId: uuid('campus_id').references(() => campuses.id),
  academicSessionId: uuid('academic_session_id').references(() => academicSessions.id),
  currentSemester: integer('current_semester').notNull().default(1),
  enrollmentDate: date('enrollment_date'),
  expectedGraduationDate: date('expected_graduation_date'),
  enrollmentStatus: varchar('enrollment_status', { length: 50 }).default('active'), // active, suspended, graduated, withdrawn
  cgpa: decimal('cgpa', { precision: 4, scale: 2 }),
  totalCreditsCompleted: integer('total_credits_completed').notNull().default(0),
  photoUrl: text('photo_url'),
  emergencyContactName: varchar('emergency_contact_name', { length: 200 }),
  emergencyContactPhone: varchar('emergency_contact_phone', { length: 50 }),
  emergencyContactRelation: varchar('emergency_contact_relation', { length: 50 }),
  bloodGroup: varchar('blood_group', { length: 10 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Admissions
export const admissionApplications = pgTable('admission_applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  applicationNumber: varchar('application_number', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }), // For applicant portal access
  status: applicationStatusEnum('status').notNull().default('draft'),
  programId: uuid('program_id').references(() => programs.id),
  departmentId: uuid('department_id').references(() => departments.id),
  campusId: uuid('campus_id').references(() => campuses.id),
  academicSessionId: uuid('academic_session_id').references(() => academicSessions.id),
  semesterApplied: integer('semester_applied').notNull().default(1),
  
  // Personal Information
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  fatherName: varchar('father_name', { length: 200 }),
  motherName: varchar('mother_name', { length: 200 }),
  guardianName: varchar('guardian_name', { length: 200 }),
  guardianPhone: varchar('guardian_phone', { length: 50 }),
  dateOfBirth: date('date_of_birth'),
  gender: genderEnum('gender'),
  nationality: varchar('nationality', { length: 100 }),
  nationalIdNumber: varchar('national_id_number', { length: 100 }),
  phone: varchar('phone', { length: 50 }),
  address: text('address'),
  permanentAddress: text('permanent_address'),
  city: varchar('city', { length: 100 }),
  country: varchar('country', { length: 100 }),
  postalCode: varchar('postal_code', { length: 20 }),
  
  // Previous Education
  previousInstitution: varchar('previous_institution', { length: 255 }),
  previousQualification: varchar('previous_qualification', { length: 100 }),
  previousMarks: varchar('previous_marks', { length: 50 }),
  previousGrade: varchar('previous_grade', { length: 20 }),
  previousYear: integer('previous_year'),
  
  // Emergency Contact
  emergencyContactName: varchar('emergency_contact_name', { length: 200 }),
  emergencyContactPhone: varchar('emergency_contact_phone', { length: 50 }),
  emergencyContactRelation: varchar('emergency_contact_relation', { length: 50 }),
  
  // Additional Information
  additionalInfo: jsonb('additional_info'),
  
  // Documents
  photoUrl: text('photo_url'),
  documentsSubmitted: boolean('documents_submitted').notNull().default(false),
  
  // Review
  reviewedBy: uuid('reviewed_by').references(() => users.id),
  reviewedAt: timestamp('reviewed_at'),
  reviewNotes: text('review_notes'),
  rejectionReason: text('rejection_reason'),
  
  // Converted student
  convertedStudentId: uuid('converted_student_id').references(() => students.id),
  
  submittedAt: timestamp('submitted_at'),
  currentStep: integer('current_step').notNull().default(1),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const applicationDocuments = pgTable('application_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  applicationId: uuid('application_id').notNull().references(() => admissionApplications.id, { onDelete: 'cascade' }),
  documentType: varchar('document_type', { length: 100 }).notNull(), // transcript, id_card, certificate, photo
  documentName: varchar('document_name', { length: 255 }).notNull(),
  fileUrl: text('file_url').notNull(),
  fileSize: integer('file_size'),
  mimeType: varchar('mime_type', { length: 100 }),
  isVerified: boolean('is_verified').notNull().default(false),
  verifiedBy: uuid('verified_by').references(() => users.id),
  verifiedAt: timestamp('verified_at'),
  uploadedAt: timestamp('uploaded_at').notNull().defaultNow(),
});

// Enrollments & Courses
export const studentEnrollments = pgTable('student_enrollments', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  courseId: uuid('course_id').notNull().references(() => courses.id),
  semesterId: uuid('semester_id').notNull().references(() => semesters.id),
  instructorId: uuid('instructor_id').references(() => staff.id),
  status: varchar('status', { length: 50 }).default('enrolled'), // enrolled, dropped, completed, failed
  grade: varchar('grade', { length: 10 }),
  marks: decimal('marks', { precision: 5, scale: 2 }),
  creditHours: integer('credit_hours'),
  gradePoints: decimal('grade_points', { precision: 4, scale: 2 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const courseSections = pgTable('course_sections', {
  id: uuid('id').primaryKey().defaultRandom(),
  courseId: uuid('course_id').notNull().references(() => courses.id),
  semesterId: uuid('semester_id').notNull().references(() => semesters.id),
  instructorId: uuid('instructor_id').references(() => staff.id),
  sectionName: varchar('section_name', { length: 20 }), // A, B, C
  roomNumber: varchar('room_number', { length: 50 }),
  maxCapacity: integer('max_capacity').default(50),
  currentEnrollment: integer('current_enrollment').default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const timetable = pgTable('timetable', {
  id: uuid('id').primaryKey().defaultRandom(),
  courseSectionId: uuid('course_section_id').references(() => courseSections.id),
  courseId: uuid('course_id').references(() => courses.id),
  semesterId: uuid('semester_id').references(() => semesters.id),
  instructorId: uuid('instructor_id').references(() => staff.id),
  dayOfWeek: integer('day_of_week').notNull(), // 0-6 (Sunday-Saturday)
  startTime: time('start_time').notNull(),
  endTime: time('end_time').notNull(),
  roomNumber: varchar('room_number', { length: 50 }),
  building: varchar('building', { length: 100 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Attendance
export const attendance = pgTable('attendance', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  courseId: uuid('course_id').notNull().references(() => courses.id),
  semesterId: uuid('semester_id').notNull().references(() => semesters.id),
  date: date('date').notNull(),
  status: attendanceStatusEnum('status').notNull(),
  markedBy: uuid('marked_by').references(() => users.id),
  remarks: text('remarks'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Examinations
export const examinations = pgTable('examinations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  examType: varchar('exam_type', { length: 50 }).notNull(), // midterm, final, quiz, assignment
  courseId: uuid('course_id').references(() => courses.id),
  semesterId: uuid('semester_id').notNull().references(() => semesters.id),
  examDate: date('exam_date').notNull(),
  startTime: time('start_time'),
  endTime: time('end_time'),
  duration: integer('duration'), // in minutes
  totalMarks: decimal('total_marks', { precision: 5, scale: 2 }).notNull().default('100'),
  passingMarks: decimal('passing_marks', { precision: 5, scale: 2 }),
  roomNumber: varchar('room_number', { length: 50 }),
  building: varchar('building', { length: 100 }),
  instructions: text('instructions'),
  isPublished: boolean('is_published').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const examResults = pgTable('exam_results', {
  id: uuid('id').primaryKey().defaultRandom(),
  examinationId: uuid('examination_id').notNull().references(() => examinations.id, { onDelete: 'cascade' }),
  studentId: uuid('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  marksObtained: decimal('marks_obtained', { precision: 5, scale: 2 }),
  grade: varchar('grade', { length: 10 }),
  gradePoints: decimal('grade_points', { precision: 4, scale: 2 }),
  status: resultStatusEnum('status'),
  remarks: text('remarks'),
  isPublished: boolean('is_published').notNull().default(false),
  publishedAt: timestamp('published_at'),
  enteredBy: uuid('entered_by').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const semesterResults = pgTable('semester_results', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  semesterId: uuid('semester_id').notNull().references(() => semesters.id),
  semesterGpa: decimal('semester_gpa', { precision: 4, scale: 2 }),
  cgpa: decimal('cgpa', { precision: 4, scale: 2 }),
  creditsAttempted: integer('credits_attempted'),
  creditsEarned: integer('credits_earned'),
  status: resultStatusEnum('status'),
  academicStanding: varchar('academic_standing', { length: 50 }), // good, probation, warning
  isPublished: boolean('is_published').notNull().default(false),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Fees & Payments
export const feeStructures = pgTable('fee_structures', {
  id: uuid('id').primaryKey().defaultRandom(),
  programId: uuid('program_id').references(() => programs.id),
  academicSessionId: uuid('academic_session_id').references(() => academicSessions.id),
  semesterNumber: integer('semester_number'),
  feeType: varchar('fee_type', { length: 100 }).notNull(), // tuition, lab, library, exam, etc.
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  description: text('description'),
  dueDate: date('due_date'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const studentFees = pgTable('student_fees', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  semesterId: uuid('semester_id').references(() => semesters.id),
  feeStructureId: uuid('fee_structure_id').references(() => feeStructures.id),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
  discountAmount: decimal('discount_amount', { precision: 12, scale: 2 }).default('0'),
  scholarshipAmount: decimal('scholarship_amount', { precision: 12, scale: 2 }).default('0'),
  netAmount: decimal('net_amount', { precision: 12, scale: 2 }).notNull(),
  paidAmount: decimal('paid_amount', { precision: 12, scale: 2 }).default('0'),
  pendingAmount: decimal('pending_amount', { precision: 12, scale: 2 }),
  status: paymentStatusEnum('status').notNull().default('pending'),
  dueDate: date('due_date'),
  description: varchar('description', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  studentFeeId: uuid('student_fee_id').references(() => studentFees.id),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }), // cash, card, bank_transfer, online
  transactionId: varchar('transaction_id', { length: 255 }),
  paymentGateway: varchar('payment_gateway', { length: 100 }),
  paymentStatus: varchar('payment_status', { length: 50 }).default('pending'), // pending, completed, failed, refunded
  paymentDate: timestamp('payment_date'),
  verifiedBy: uuid('verified_by').references(() => users.id),
  verifiedAt: timestamp('verified_at'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const receipts = pgTable('receipts', {
  id: uuid('id').primaryKey().defaultRandom(),
  receiptNumber: varchar('receipt_number', { length: 50 }).notNull().unique(),
  paymentId: uuid('payment_id').notNull().references(() => payments.id),
  studentId: uuid('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  feeDescription: text('fee_description'),
  semester: varchar('semester', { length: 100 }),
  paymentMethod: varchar('payment_method', { length: 50 }),
  transactionId: varchar('transaction_id', { length: 255 }),
  qrCode: text('qr_code'),
  verificationCode: varchar('verification_code', { length: 50 }),
  issuedAt: timestamp('issued_at').notNull().defaultNow(),
  issuedBy: uuid('issued_by').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Scholarships
export const scholarships = pgTable('scholarships', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  amount: decimal('amount', { precision: 12, scale: 2 }),
  percentage: decimal('percentage', { precision: 5, scale: 2 }),
  eligibilityCriteria: text('eligibility_criteria'),
  programId: uuid('program_id').references(() => programs.id),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const studentScholarships = pgTable('student_scholarships', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  scholarshipId: uuid('scholarship_id').notNull().references(() => scholarships.id),
  academicSessionId: uuid('academic_session_id').references(() => academicSessions.id),
  awardedAmount: decimal('awarded_amount', { precision: 12, scale: 2 }),
  status: varchar('status', { length: 50 }).default('active'), // active, renewed, expired, revoked
  awardedDate: date('awarded_date'),
  expiryDate: date('expiry_date'),
  renewalRequirements: text('renewal_requirements'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Documents
export const studentDocuments = pgTable('student_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  documentType: varchar('document_type', { length: 100 }).notNull(),
  documentName: varchar('document_name', { length: 255 }).notNull(),
  fileUrl: text('file_url').notNull(),
  fileSize: integer('file_size'),
  mimeType: varchar('mime_type', { length: 100 }),
  isOfficial: boolean('is_official').notNull().default(false),
  issuedDate: date('issued_date'),
  expiryDate: date('expiry_date'),
  uploadedBy: uuid('uploaded_by').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Notifications
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  type: varchar('type', { length: 50 }), // admission, fee, exam, result, attendance, general
  link: text('link'),
  isRead: boolean('is_read').notNull().default(false),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Announcements
export const announcements = pgTable('announcements', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  category: varchar('category', { length: 50 }), // academic, administrative, event, emergency
  priority: varchar('priority', { length: 20 }).default('normal'), // low, normal, high, urgent
  targetAudience: varchar('target_audience', { length: 50 }).default('all'), // all, students, staff, specific_program
  targetProgramId: uuid('target_program_id').references(() => programs.id),
  targetDepartmentId: uuid('target_department_id').references(() => departments.id),
  publishDate: timestamp('publish_date'),
  expiryDate: timestamp('expiry_date'),
  isPublished: boolean('is_published').notNull().default(false),
  isPinned: boolean('is_pinned').notNull().default(false),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Events
export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  eventType: varchar('event_type', { length: 50 }), // academic, cultural, sports, workshop, seminar
  location: varchar('location', { length: 255 }),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  isPublic: boolean('is_public').notNull().default(true),
  imageUrl: text('image_url'),
  registrationRequired: boolean('registration_required').notNull().default(false),
  maxParticipants: integer('max_participants'),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Support Tickets
export const supportTickets = pgTable('support_tickets', {
  id: uuid('id').primaryKey().defaultRandom(),
  ticketNumber: varchar('ticket_number', { length: 50 }).notNull().unique(),
  userId: uuid('user_id').notNull().references(() => users.id),
  category: varchar('category', { length: 50 }).notNull(), // technical, admission, fee, academic, general
  subject: varchar('subject', { length: 255 }).notNull(),
  description: text('description').notNull(),
  priority: varchar('priority', { length: 20 }).default('normal'),
  status: ticketStatusEnum('status').notNull().default('open'),
  assignedTo: uuid('assigned_to').references(() => users.id),
  resolvedAt: timestamp('resolved_at'),
  closedAt: timestamp('closed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const ticketMessages = pgTable('ticket_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  ticketId: uuid('ticket_id').notNull().references(() => supportTickets.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id),
  message: text('message').notNull(),
  isStaffReply: boolean('is_staff_reply').notNull().default(false),
  attachmentUrl: text('attachment_url'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Leave Requests
export const leaveRequests = pgTable('leave_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  leaveType: varchar('leave_type', { length: 50 }).notNull(), // sick, personal, emergency, academic
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  reason: text('reason').notNull(),
  attachmentUrl: text('attachment_url'),
  status: varchar('status', { length: 50 }).default('pending'), // pending, approved, rejected
  reviewedBy: uuid('reviewed_by').references(() => users.id),
  reviewedAt: timestamp('reviewed_at'),
  reviewNotes: text('review_notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Document Requests (Transcripts, etc.)
export const documentRequests = pgTable('document_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  requestNumber: varchar('request_number', { length: 50 }).notNull().unique(),
  studentId: uuid('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  documentType: varchar('document_type', { length: 100 }).notNull(), // transcript, enrollment_letter, recommendation
  copies: integer('copies').notNull().default(1),
  purpose: text('purpose'),
  status: varchar('status', { length: 50 }).default('pending'), // pending, processing, ready, collected, rejected
  fee: decimal('fee', { precision: 10, scale: 2 }),
  isPaid: boolean('is_paid').notNull().default(false),
  processedBy: uuid('processed_by').references(() => users.id),
  processedAt: timestamp('processed_at'),
  readyDate: date('ready_date'),
  collectedAt: timestamp('collected_at'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Change Requests
export const changeRequests = pgTable('change_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  changeType: varchar('change_type', { length: 100 }).notNull(), // name, address, contact, program
  currentValue: text('current_value'),
  requestedValue: text('requested_value'),
  reason: text('reason'),
  supportingDocument: text('supporting_document'),
  status: varchar('status', { length: 50 }).default('pending'), // pending, approved, rejected
  reviewedBy: uuid('reviewed_by').references(() => users.id),
  reviewedAt: timestamp('reviewed_at'),
  reviewNotes: text('review_notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Academic Calendar
export const academicCalendar = pgTable('academic_calendar', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  eventType: varchar('event_type', { length: 50 }).notNull(), // holiday, exam, registration, deadline, event
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  academicSessionId: uuid('academic_session_id').references(() => academicSessions.id),
  isHoliday: boolean('is_holiday').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// FAQs
export const faqs = pgTable('faqs', {
  id: uuid('id').primaryKey().defaultRandom(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  category: varchar('category', { length: 50 }), // admission, fees, academics, general
  sortOrder: integer('sort_order').default(0),
  isPublished: boolean('is_published').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Audit Logs
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(),
  tableName: varchar('table_name', { length: 100 }),
  recordId: uuid('record_id'),
  oldValues: jsonb('old_values'),
  newValues: jsonb('new_values'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Settings
export const institutionSettings = pgTable('institution_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: text('value'),
  description: text('description'),
  category: varchar('category', { length: 50 }),
  updatedBy: uuid('updated_by').references(() => users.id),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Export type definitions
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;
export type Staff = typeof staff.$inferSelect;
export type Program = typeof programs.$inferSelect;
export type Department = typeof departments.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type AdmissionApplication = typeof admissionApplications.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Announcement = typeof announcements.$inferSelect;
export type SupportTicket = typeof supportTickets.$inferSelect;
