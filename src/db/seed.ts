import 'dotenv/config';
import { db } from './index';
import {
  users,
  campuses,
  departments,
  programs,
  academicSessions,
  semesters,
  courses,
  programCourses,
  staff,
  students,
  studentFees,
  announcements,
  events,
  faqs,
  notifications,
  institutionSettings,
} from './schema';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Starting database seed...');

  // Hash passwords
  const passwordHash = await bcrypt.hash('demo123', 12);
  const adminPasswordHash = await bcrypt.hash('admin123', 12);
  const teacherPasswordHash = await bcrypt.hash('teacher123', 12);

  // Create users
  const [adminUser] = await db.insert(users).values({
    email: 'admin@demo.edu',
    passwordHash: adminPasswordHash,
    role: 'super_admin',
    isActive: true,
    isVerified: true,
  }).returning();

  const [registrarUser] = await db.insert(users).values({
    email: 'registrar@demo.edu',
    passwordHash: adminPasswordHash,
    role: 'registrar',
    isActive: true,
    isVerified: true,
  }).returning();

  const [financeUser] = await db.insert(users).values({
    email: 'finance@demo.edu',
    passwordHash: adminPasswordHash,
    role: 'finance_officer',
    isActive: true,
    isVerified: true,
  }).returning();

  const [admissionsUser] = await db.insert(users).values({
    email: 'admissions@demo.edu',
    passwordHash: adminPasswordHash,
    role: 'admissions_officer',
    isActive: true,
    isVerified: true,
  }).returning();

  const [teacherUser] = await db.insert(users).values({
    email: 'teacher@demo.edu',
    passwordHash: teacherPasswordHash,
    role: 'teacher',
    isActive: true,
    isVerified: true,
  }).returning();

  const [studentUser] = await db.insert(users).values({
    email: 'student@demo.edu',
    passwordHash: passwordHash,
    role: 'student',
    isActive: true,
    isVerified: true,
  }).returning();

  const [studentUser2] = await db.insert(users).values({
    email: 'student2@demo.edu',
    passwordHash: passwordHash,
    role: 'student',
    isActive: true,
    isVerified: true,
  }).returning();

  console.log('✅ Created users');

  // Create campus
  const [mainCampus] = await db.insert(campuses).values({
    name: 'Main Campus',
    code: 'MAIN',
    address: '123 Education Street',
    city: 'Academic City',
    country: 'United States',
    phone: '+1 (234) 567-890',
    email: 'info@eduportal.edu',
    isActive: true,
  }).returning();

  console.log('✅ Created campus');

  // Create departments
  const departmentData = [
    { name: 'Computer Science', code: 'CS', description: 'Department of Computer Science and Information Technology' },
    { name: 'Engineering', code: 'ENG', description: 'Department of Engineering and Technology' },
    { name: 'Business Administration', code: 'BA', description: 'Department of Business and Management' },
    { name: 'Arts & Humanities', code: 'AH', description: 'Department of Arts, Humanities, and Social Sciences' },
    { name: 'Natural Sciences', code: 'NS', description: 'Department of Natural Sciences' },
    { name: 'Medicine', code: 'MED', description: 'Department of Medical Sciences' },
    { name: 'Law', code: 'LAW', description: 'Department of Law and Legal Studies' },
    { name: 'Education', code: 'EDU', description: 'Department of Education and Pedagogy' },
  ];

  const createdDepartments = await db.insert(departments).values(
    departmentData.map((d) => ({ ...d, campusId: mainCampus.id }))
  ).returning();

  const csDept = createdDepartments.find(d => d.code === 'CS')!;
  const engDept = createdDepartments.find(d => d.code === 'ENG')!;
  const baDept = createdDepartments.find(d => d.code === 'BA')!;

  console.log('✅ Created departments');

  // Create programs
  const programData = [
    { name: 'Bachelor of Computer Science', code: 'BCS', departmentId: csDept.id, degreeType: 'Bachelor', durationYears: 4, totalSemesters: 8, totalCredits: 120 },
    { name: 'Master of Computer Science', code: 'MCS', departmentId: csDept.id, degreeType: 'Master', durationYears: 2, totalSemesters: 4, totalCredits: 60 },
    { name: 'Bachelor of Engineering', code: 'BE', departmentId: engDept.id, degreeType: 'Bachelor', durationYears: 4, totalSemesters: 8, totalCredits: 140 },
    { name: 'Master of Business Administration', code: 'MBA', departmentId: baDept.id, degreeType: 'Master', durationYears: 2, totalSemesters: 4, totalCredits: 60 },
    { name: 'Bachelor of Business Administration', code: 'BBA', departmentId: baDept.id, degreeType: 'Bachelor', durationYears: 4, totalSemesters: 8, totalCredits: 120 },
  ];

  const createdPrograms = await db.insert(programs).values(
    programData.map((p) => ({
      ...p,
      description: `${p.name} - A comprehensive program designed for academic and professional excellence.`,
      admissionRequirements: 'High school diploma or equivalent. Minimum GPA of 2.5.',
      tuitionFee: '15000.00',
      minAttendancePercentage: 75,
    }))
  ).returning();

  const bcsProgram = createdPrograms.find(p => p.code === 'BCS')!;

  console.log('✅ Created programs');

  // Create academic session
  const [currentSession] = await db.insert(academicSessions).values({
    name: '2024-2025',
    startDate: '2024-08-01',
    endDate: '2025-07-31',
    isCurrent: true,
  }).returning();

  console.log('✅ Created academic session');

  // Create semesters
  const semesterData = [
    { name: 'Fall 2024', semesterNumber: 1, startDate: '2024-08-15', endDate: '2024-12-15', registrationDeadline: '2024-08-01', isCurrent: true },
    { name: 'Spring 2025', semesterNumber: 2, startDate: '2025-01-15', endDate: '2025-05-15', registrationDeadline: '2025-01-01', isCurrent: false },
  ];

  const createdSemesters = await db.insert(semesters).values(
    semesterData.map((s) => ({ ...s, academicSessionId: currentSession.id }))
  ).returning();

  const currentSemester = createdSemesters[0];

  console.log('✅ Created semesters');

  // Create courses
  const courseData = [
    { code: 'CS101', name: 'Introduction to Programming', departmentId: csDept.id, creditHours: 3, description: 'Fundamentals of programming using Python' },
    { code: 'CS102', name: 'Data Structures', departmentId: csDept.id, creditHours: 3, description: 'Arrays, linked lists, trees, and graphs' },
    { code: 'CS201', name: 'Algorithms', departmentId: csDept.id, creditHours: 3, description: 'Algorithm design and analysis' },
    { code: 'CS202', name: 'Database Systems', departmentId: csDept.id, creditHours: 3, description: 'Relational databases and SQL' },
    { code: 'CS301', name: 'Operating Systems', departmentId: csDept.id, creditHours: 3, description: 'Process management and memory systems' },
    { code: 'CS302', name: 'Computer Networks', departmentId: csDept.id, creditHours: 3, description: 'Network protocols and architecture' },
    { code: 'MATH101', name: 'Calculus I', departmentId: csDept.id, creditHours: 4, description: 'Limits, derivatives, and integrals' },
    { code: 'MATH102', name: 'Linear Algebra', departmentId: csDept.id, creditHours: 3, description: 'Vectors, matrices, and linear transformations' },
    { code: 'ENG101', name: 'English Composition', departmentId: csDept.id, creditHours: 3, description: 'Academic writing and communication' },
    { code: 'PHY101', name: 'Physics I', departmentId: csDept.id, creditHours: 4, description: 'Mechanics and thermodynamics' },
  ];

  const createdCourses = await db.insert(courses).values(courseData).returning();

  console.log('✅ Created courses');

  // Create staff
  await db.insert(staff).values([
    {
      userId: adminUser.id,
      employeeId: 'EMP001',
      firstName: 'Admin',
      lastName: 'User',
      departmentId: csDept.id,
      designation: 'System Administrator',
      phone: '+1 234 567 0001',
    },
    {
      userId: registrarUser.id,
      employeeId: 'EMP002',
      firstName: 'Sarah',
      lastName: 'Johnson',
      departmentId: csDept.id,
      designation: 'Registrar',
      phone: '+1 234 567 0002',
    },
    {
      userId: financeUser.id,
      employeeId: 'EMP003',
      firstName: 'Michael',
      lastName: 'Chen',
      departmentId: baDept.id,
      designation: 'Finance Officer',
      phone: '+1 234 567 0003',
    },
    {
      userId: admissionsUser.id,
      employeeId: 'EMP004',
      firstName: 'Emily',
      lastName: 'Davis',
      departmentId: csDept.id,
      designation: 'Admissions Officer',
      phone: '+1 234 567 0004',
    },
    {
      userId: teacherUser.id,
      employeeId: 'EMP005',
      firstName: 'Dr. Robert',
      lastName: 'Williams',
      departmentId: csDept.id,
      designation: 'Professor',
      phone: '+1 234 567 0005',
    },
  ]);

  console.log('✅ Created staff');

  // Create students
  const [student1] = await db.insert(students).values({
    userId: studentUser.id,
    studentId: 'STU2024001',
    firstName: 'John',
    lastName: 'Smith',
    fatherName: 'Robert Smith',
    motherName: 'Mary Smith',
    guardianName: 'Robert Smith',
    guardianPhone: '+1 234 567 1111',
    guardianEmail: 'robert.smith@email.com',
    dateOfBirth: '2000-05-15',
    gender: 'male',
    nationality: 'United States',
    phone: '+1 234 567 2222',
    address: '456 Student Avenue, Apt 12',
    permanentAddress: '456 Student Avenue, Apt 12',
    city: 'Academic City',
    country: 'United States',
    postalCode: '12345',
    programId: bcsProgram.id,
    departmentId: csDept.id,
    campusId: mainCampus.id,
    academicSessionId: currentSession.id,
    currentSemester: 3,
    enrollmentDate: '2023-08-15',
    expectedGraduationDate: '2027-05-15',
    enrollmentStatus: 'active',
    cgpa: '3.45',
    totalCreditsCompleted: 45,
    emergencyContactName: 'Robert Smith',
    emergencyContactPhone: '+1 234 567 1111',
    emergencyContactRelation: 'Father',
    bloodGroup: 'O+',
  }).returning();

  const [student2] = await db.insert(students).values({
    userId: studentUser2.id,
    studentId: 'STU2024002',
    firstName: 'Emma',
    lastName: 'Johnson',
    fatherName: 'David Johnson',
    motherName: 'Lisa Johnson',
    guardianName: 'David Johnson',
    guardianPhone: '+1 234 567 3333',
    dateOfBirth: '2001-03-22',
    gender: 'female',
    nationality: 'United States',
    phone: '+1 234 567 4444',
    address: '789 College Road, Suite 5',
    city: 'Academic City',
    country: 'United States',
    programId: bcsProgram.id,
    departmentId: csDept.id,
    campusId: mainCampus.id,
    academicSessionId: currentSession.id,
    currentSemester: 2,
    enrollmentDate: '2024-01-15',
    enrollmentStatus: 'active',
    cgpa: '3.72',
    totalCreditsCompleted: 30,
  }).returning();

  console.log('✅ Created students');

  // Create student fees
  await db.insert(studentFees).values([
    {
      studentId: student1.id,
      semesterId: currentSemester.id,
      totalAmount: '5000.00',
      discountAmount: '0.00',
      scholarshipAmount: '500.00',
      netAmount: '4500.00',
      paidAmount: '2000.00',
      pendingAmount: '2500.00',
      status: 'partially_paid',
      dueDate: '2024-09-30',
      description: 'Fall 2024 Tuition Fee',
    },
    {
      studentId: student1.id,
      semesterId: currentSemester.id,
      totalAmount: '200.00',
      discountAmount: '0.00',
      scholarshipAmount: '0.00',
      netAmount: '200.00',
      paidAmount: '0.00',
      pendingAmount: '200.00',
      status: 'pending',
      dueDate: '2024-10-15',
      description: 'Lab Fee',
    },
    {
      studentId: student2.id,
      semesterId: currentSemester.id,
      totalAmount: '5000.00',
      discountAmount: '0.00',
      scholarshipAmount: '1000.00',
      netAmount: '4000.00',
      paidAmount: '4000.00',
      pendingAmount: '0.00',
      status: 'paid',
      dueDate: '2024-09-30',
      description: 'Fall 2024 Tuition Fee',
    },
  ]);

  console.log('✅ Created student fees');

  // Create announcements
  await db.insert(announcements).values([
    {
      title: 'Admission Open for Spring 2025',
      content: 'We are now accepting applications for the Spring 2025 semester. Apply before December 31, 2024 to secure your seat.',
      category: 'administrative',
      priority: 'high',
      targetAudience: 'all',
      isPublished: true,
      isPinned: true,
      createdBy: adminUser.id,
    },
    {
      title: 'Final Examination Schedule Released',
      content: 'The final examination schedule for Fall 2024 has been released. Please check your exam timetable on the student portal.',
      category: 'academic',
      priority: 'high',
      targetAudience: 'students',
      isPublished: true,
      createdBy: registrarUser.id,
    },
    {
      title: 'Library Extended Hours During Exams',
      content: 'The library will remain open until 10 PM during the examination period to support student study needs.',
      category: 'academic',
      priority: 'normal',
      targetAudience: 'students',
      isPublished: true,
      createdBy: adminUser.id,
    },
  ]);

  console.log('✅ Created announcements');

  // Create events
  await db.insert(events).values([
    {
      title: 'Annual Convocation 2024',
      description: 'Join us for the annual convocation ceremony celebrating our graduating class.',
      eventType: 'academic',
      location: 'Main Auditorium',
      startDate: new Date('2024-12-20T10:00:00'),
      endDate: new Date('2024-12-20T14:00:00'),
      isPublic: true,
      createdBy: adminUser.id,
    },
    {
      title: 'Tech Symposium 2024',
      description: 'A symposium featuring the latest in technology and innovation.',
      eventType: 'seminar',
      location: 'Conference Hall A',
      startDate: new Date('2024-12-25T09:00:00'),
      endDate: new Date('2024-12-25T17:00:00'),
      isPublic: true,
      createdBy: teacherUser.id,
    },
    {
      title: 'Career Fair 2025',
      description: 'Connect with top employers and explore career opportunities.',
      eventType: 'workshop',
      location: 'Sports Complex',
      startDate: new Date('2025-01-15T10:00:00'),
      endDate: new Date('2025-01-15T16:00:00'),
      isPublic: true,
      registrationRequired: true,
      createdBy: adminUser.id,
    },
  ]);

  console.log('✅ Created events');

  // Create FAQs
  await db.insert(faqs).values([
    {
      question: 'How do I apply for admission?',
      answer: 'You can apply online through our website. Click on "Apply Now" and follow the step-by-step application process. You will need to provide personal information, academic records, and upload required documents.',
      category: 'admission',
      sortOrder: 1,
    },
    {
      question: 'What are the admission requirements?',
      answer: 'Requirements vary by program. Generally, you need a high school diploma or equivalent, minimum GPA of 2.5, and standardized test scores. International students must also submit English proficiency scores.',
      category: 'admission',
      sortOrder: 2,
    },
    {
      question: 'How can I pay my tuition fees?',
      answer: 'Tuition fees can be paid online through the student portal using credit/debit cards, bank transfers, or payment plans. You can also pay in person at the finance office.',
      category: 'fees',
      sortOrder: 3,
    },
    {
      question: 'Are scholarships available?',
      answer: 'Yes, we offer merit-based and need-based scholarships. You can apply for scholarships during the admission process or through the scholarship portal for current students.',
      category: 'fees',
      sortOrder: 4,
    },
    {
      question: 'How do I access my student portal?',
      answer: 'After your enrollment is confirmed, you will receive login credentials via email. Use these credentials to access the student portal at login page.',
      category: 'general',
      sortOrder: 5,
    },
    {
      question: 'What is the minimum attendance requirement?',
      answer: 'Students must maintain a minimum of 75% attendance in each course to be eligible for final examinations. Attendance below 75% may result in exam restriction.',
      category: 'academics',
      sortOrder: 6,
    },
  ]);

  console.log('✅ Created FAQs');

  // Create notifications for students
  await db.insert(notifications).values([
    {
      userId: studentUser.id,
      title: 'Welcome to EduPortal!',
      message: 'Your student account has been activated. Explore your dashboard to view your courses, attendance, and more.',
      type: 'general',
      isRead: true,
    },
    {
      userId: studentUser.id,
      title: 'Fee Payment Reminder',
      message: 'Your tuition fee payment for Fall 2024 is due on September 30, 2024. Please ensure timely payment.',
      type: 'fee',
      link: '/portal/fees',
      isRead: false,
    },
    {
      userId: studentUser.id,
      title: 'New Course Material Available',
      message: 'New study materials have been uploaded for CS201 - Algorithms.',
      type: 'academic',
      isRead: false,
    },
  ]);

  console.log('✅ Created notifications');

  // Create institution settings
  await db.insert(institutionSettings).values([
    { key: 'institution_name', value: 'EduPortal Academy', category: 'general' },
    { key: 'institution_address', value: '123 Education Street, Academic City, AC 12345', category: 'general' },
    { key: 'institution_phone', value: '+1 (234) 567-890', category: 'general' },
    { key: 'institution_email', value: 'info@eduportal.edu', category: 'general' },
    { key: 'min_attendance_percentage', value: '75', category: 'academic' },
    { key: 'grading_scale', value: 'standard', category: 'academic' },
    { key: 'currency', value: 'USD', category: 'finance' },
    { key: 'late_fee_percentage', value: '5', category: 'finance' },
  ]);

  console.log('✅ Created institution settings');

  console.log('🎉 Database seeded successfully!');
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
