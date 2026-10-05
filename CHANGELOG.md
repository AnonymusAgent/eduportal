# Changelog

All notable changes to EduPortal Academy will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-01-22

### Authentication — Final Fix (4-layer root cause)
- **Layer 4 discovered:** `NextResponse.redirect(new URL(path, request.url))` produces absolute `location: http://0.0.0.0:3000/...` headers — unreachable by browser through external proxy. **All redirects now use relative `Location` headers** via `new NextResponse(null, { status: 307, headers: { Location: '/path' } })`.
- **Teacher/readonly_staff redirect loop fixed:** These roles weren't in `isAdmin()`, causing infinite bounce between `/portal` (rejects non-students) and `/admin` (rejects non-admins).
- Loading screen now only shows on first visit per browser session (uses `sessionStorage`).
- Login form has 15-second safety timeout — spinner always terminates.
- Empty form returns "Please enter your email and password" instead of raw Zod error.

### Coming Soon Pages → Real Pages (13 pages)
- `/academics/departments` — DB-driven department listing with program counts
- `/academics/programs` — Program catalog with degree type, credits, duration
- `/academics/courses` — Course table with department and credit hours
- `/academics/calendar` — Academic sessions, semesters, and calendar events
- `/admissions` — Step-by-step admission guide
- `/admissions/requirements` — General + program-specific requirements from DB
- `/admissions/fees` — Fee structure cards per program from DB
- `/admissions/scholarships` — Scholarship listings from DB
- `/application-status` — Interactive tracker with API search
- `/forgot-password` — Reset form with email confirmation
- `/privacy` — Full privacy policy
- `/terms` — Full terms of service
- `/accessibility` — Accessibility statement

### Missing Portal Pages Created (8 pages)
- `/portal/progress` — Semester timeline, credit progress, GPA
- `/portal/courses` — Enrolled courses with grades
- `/portal/timetable` — Weekly schedule grouped by day
- `/portal/exams` — Upcoming and past examinations
- `/portal/results` — Semester GPA, CGPA, academic standing
- `/portal/receipts` — Fee receipt history
- `/portal/documents` — Official documents
- `/portal/settings` — Security and notification preferences

### New API
- `GET /api/application/status?ref=...` — Application status lookup

### Quality
- 48 routes compiled (was 39)
- 15 automated auth tests passing through HTTPS proxy
- 0 TypeScript errors
- Neon database schema synchronized

---

## [1.1.1] - 2025-01-21

### Definitive Login Loop Fix (BUG-039)
- **Root cause:** The browser `fetch()` API processes `Set-Cookie` headers asynchronously. Even with `window.location.href` (replacing the earlier `router.push`), the navigation fires before the cookie jar is updated. The portal layout's server component reads `cookies()`, finds nothing, and redirects back to `/login` → infinite loop.
- **Solution:** Redesigned the login flow with a server-side callback redirect pattern:
  1. `POST /api/auth/login` → returns `{ token, redirect }` in JSON body (no Set-Cookie)
  2. Client navigates to `GET /api/auth/callback?token=...&to=/portal`
  3. Callback validates token, sets `Set-Cookie` on a **307 redirect** to `/portal`
  4. Browser processes cookie as part of the redirect chain → cookie guaranteed stored before `/portal` loads
- **Verified:** End-to-end curl tests pass for student, admin, and teacher logins through both HTTP and HTTPS proxy
- Created `src/app/api/auth/callback/route.ts`

### Branding
- Updated footer copyright to "© Webloom LLC"
- Added "Made with ❤️ by Webloom" to footer

---

## [1.1.0] - 2025-01-21

### Main Website Audit — 14 bugs found, 14 fixed

#### Broken Links Fixed (9 navigation links → 404)
- Created `/events` page with full DB-driven event listing
- Created placeholder pages for: `/academics/departments`, `/academics/programs`, `/academics/courses`, `/academics/calendar`, `/admissions`, `/admissions/requirements`, `/admissions/fees`, `/admissions/scholarships`
- Created placeholder pages for: `/application-status`, `/forgot-password`, `/privacy`, `/terms`, `/accessibility`
- Created reusable `ComingSoon` component for consistent placeholder design

#### UI/UX Consistency (5 pages completely rewritten)
- **About page:** Mission/Vision gradient icons, explicit gradient classes replacing dynamic `bg-${color}` (purge-safe), glass cards throughout
- **Contact page:** Gradient icon badges, glass department cards, backdrop-blur textarea, indigo links
- **Notices page:** Gradient priority icons, glass cards, slate text palette
- **FAQs page:** Glass-strong accordion, indigo icons, Button components replacing raw anchors
- **Apply page:** Glass header with gradient logo, 40+ old color references replaced via batch update

### Quality
- Total audit: 38 bugs found across 2 passes, 35 fixed
- All 38 routes compile and build successfully
- Zero old-palette (`text-gray-*`, `bg-blue-*`) references remain in any public page

---

## [1.0.2] - 2025-01-21

### Critical Fix — Login Redirect Loop
- **Fixed:** Users were stuck in an infinite redirect loop between `/login` and `/portal` and could never reach the dashboard
- **Root cause:** Three interacting bugs:
  1. Cookie `Secure` flag set unconditionally in production — prevented cookie storage behind TLS-terminating proxies
  2. `router.push()` caused RSC fetch race condition — cookie wasn't stored before portal layout read it
  3. Login page had no session guard — no way to break the redirect cycle
- **Resolution:**
  - Cookie `secure` flag now derived from `x-forwarded-proto` header
  - Replaced `router.push()` with `window.location.href` for full page navigation
  - Added `useEffect` session check on login page to redirect authenticated users
- Fixed logout cookie deletion to explicitly match original cookie attributes
- Added `try/catch` to `getSession()` and both portal/admin layouts
- **All fixes verified with live curl tests against running production server**

## [1.0.1] - 2025-01-20

### Security Fixes
- Added IP-based rate limiting to `/api/auth/login` (10 req/min) — prevents brute-force attacks
- Added rate limiting to `/api/application/submit` (5 req/min) — prevents submission spam
- Added Zod input validation to `/api/application/draft` endpoint
- Verified CSRF protection via `SameSite=lax` cookies on all session-authenticated endpoints

### Bug Fixes
- Created missing `/api/notifications/mark-all-read` API endpoint (was returning 404)
- Replaced browser `alert()` in draft save with accessible in-page Alert component
- Fixed portal and admin layouts overriding glass-morphism background with solid `bg-gray-50`
- Fixed 10+ pages using pre-redesign color palette (gray→slate, blue→indigo)
- Updated About page hero and stats sections to use animated gradient
- Fixed Apply page stepper colors to match indigo theme
- Updated notifications, fees, attendance page headings and text colors
- Added error handling for failed draft save response
- Added dismissible alerts for draft success/error states

### Quality
- Comprehensive audit performed: 24 bugs found, 21 fixed
- Full audit report: `website_student_portal_bug_audit.md`
- All TypeScript checks pass (0 errors)
- Production build succeeds (24 routes)

### Added
- `src/lib/rate-limit.ts` — in-memory token-bucket rate limiter
- `src/app/api/notifications/mark-all-read/route.ts` — mark-all-read endpoint

---

## [1.0.0] - 2024-12-19

### Added

#### Core Features
- Complete public institutional website
- Secure student portal with dashboard
- Administrative portal with role-based access
- Multi-step admission application system
- Fee management and payment tracking
- Attendance tracking and reporting
- Examination scheduling and results management
- Document management system
- Notification center
- Support ticket system

#### Authentication & Security
- Session-based authentication with secure cookies
- Password hashing with bcrypt (12 rounds)
- Role-based access control (RBAC) with 10 roles
- Account lockout after failed login attempts
- Secure password reset workflow
- Server-side authorization on all protected routes
- Input validation using Zod schema

#### User Roles
- Super Administrator
- IT Administrator
- Registrar
- Admissions Officer
- Finance Officer
- Examination Officer
- Department Administrator
- Teacher/Instructor
- Student
- Read-only Staff

#### Student Portal Features
- Dashboard with academic overview
- Profile management
- Academic progress tracking with visual indicators
- Course enrollment viewing
- Timetable display
- Attendance statistics by course
- Examination schedules with countdowns
- Results and GPA tracking
- Fee statements and payment history
- Receipt viewing and download
- Document access
- Notification center with read/unread status
- Support ticket submission

#### Admin Portal Features
- Administrative dashboard with statistics
- Student management (view, create, edit)
- Admission application processing
- Fee structure management
- Payment recording and verification
- Attendance management
- Examination scheduling
- Result entry and publication
- Announcement creation and management
- Support ticket handling

#### Admission System
- Multi-step application form
- Personal information collection
- Program selection
- Previous education details
- Document upload interface
- Draft saving functionality
- Application submission
- Reference number generation
- Application status tracking

#### Database Schema
- 30+ database tables
- Proper relationships and foreign keys
- Enum types for status fields
- Timestamp tracking
- Soft delete support where needed

#### Accessibility (WCAG 2.2 AA)
- Screen reader compatible
- Keyboard navigation support
- High contrast mode
- Adjustable text size
- Reduce motion option
- Dyslexia-friendly font option
- Proper ARIA labels throughout
- Focus indicators
- Semantic HTML structure
- Accessible forms with error messages
- Skip to main content link
- Accessible data tables

#### Responsive Design
- Mobile-first CSS approach
- Responsive navigation with mobile menu
- Collapsible sidebar
- Adaptive tables for mobile
- Touch-friendly interfaces
- Responsive cards and layouts

#### UI Components
- Button with variants (primary, secondary, outline, ghost, danger)
- Input with validation states
- Select dropdown
- Card components
- Badge/Status indicators
- Progress bars
- Data tables with mobile view
- Modal dialogs
- Alert messages
- Empty state displays
- Avatar component
- Tabs component

#### Performance
- Server-side rendering
- Optimized database queries
- Component-based architecture
- Code splitting

### Technical Details

#### Technology Stack
- Next.js 16 (App Router)
- TypeScript 5.9
- PostgreSQL with Drizzle ORM
- Tailwind CSS 4
- bcryptjs for password hashing
- Zod for validation
- Lucide React for icons
- date-fns for date formatting

#### Database Tables
- users
- sessions
- campuses
- departments
- programs
- academic_sessions
- semesters
- courses
- program_courses
- staff
- students
- admission_applications
- application_documents
- student_enrollments
- course_sections
- timetable
- attendance
- examinations
- exam_results
- semester_results
- fee_structures
- student_fees
- payments
- receipts
- scholarships
- student_scholarships
- student_documents
- notifications
- announcements
- events
- support_tickets
- ticket_messages
- leave_requests
- document_requests
- change_requests
- academic_calendar
- faqs
- audit_logs
- institution_settings

### Demo Data
- Pre-configured demo accounts for all roles
- Sample campus, departments, and programs
- Academic session and semesters
- Course catalog
- Sample students with fee records
- Announcements and events
- FAQs

---

## Future Releases

### [1.1.0] - Planned
- Online payment gateway integration
- Email notifications
- SMS notifications
- Course registration system
- Grade submission by instructors
- Bulk import/export features

### [1.2.0] - Planned
- Mobile app (React Native)
- Push notifications
- Library management integration
- Hostel management integration
- Transport management integration

### [1.3.0] - Planned
- Learning Management System (LMS) features
- Assignment submission
- Online quizzes
- Discussion forums
- Video lectures integration

### [2.0.0] - Planned
- Multi-tenant support
- API for third-party integrations
- Advanced analytics and reporting
- AI-powered insights
- Performance optimization
