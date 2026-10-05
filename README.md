# EduPortal Academy - Educational Institution Management System

**Version: 2.0.0**

A comprehensive, production-ready, fully accessible web application for schools, colleges, and universities. Combines a modern public institutional website with a secure Student Portal and Administrative Dashboard.

## 🎯 Overview

EduPortal Academy is a complete educational institution management system built with modern technologies, focusing on:

- **Security**: Role-based access control, secure authentication, and data protection
- **Accessibility**: WCAG 2.2 AA compliant, screen reader friendly
- **Responsiveness**: Mobile-first design, works on all devices
- **Performance**: Optimized for fast loading and efficient database queries

## ✨ Features

### Public Website
- 🏠 Home page with institutional information
- 📚 Academic programs and departments
- 📋 Admission information and requirements
- 💰 Fee structure and scholarships
- 📢 Notices and announcements
- 📅 Events calendar
- 📞 Contact information
- ❓ FAQs

### Student Portal
- 📊 Dashboard with academic overview
- 👤 Profile management
- 📈 Academic progress tracking
- 📚 Course enrollment and timetable
- ✅ Attendance tracking
- 📝 Examination schedules
- 📊 Results and grades
- 💳 Fee management and payment
- 🧾 Receipt generation and download
- 📄 Document access
- 🔔 Notifications
- 🎫 Support ticket system

### Administrative Portal
- 📊 Admin dashboard with analytics
- 👥 Student management
- 📝 Admission processing
- 💰 Fee collection and management
- 📋 Attendance management
- 📊 Result management
- 📢 Announcement creation
- 🎫 Support ticket handling

### Admission System
- Multi-step application form
- Document upload
- Application tracking
- Status notifications
- Draft saving

## 🛠 Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS 4
- **Authentication**: Custom session-based auth with bcrypt
- **Validation**: Zod
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 20.9+
- PostgreSQL 14+ (Neon is supported)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/eduportal-academy.git
cd eduportal-academy
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Set `DATABASE_URL` in `.env` to your Neon PostgreSQL connection string. Keep this value private and do not commit `.env`.
```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
```

4. Push the database schema:
```bash
npm run db:push
```

5. Seed the database with demo data:
```bash
npx tsx src/db/seed.ts
```

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 👥 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Student | student@demo.edu | demo123 |
| Admin | admin@demo.edu | admin123 |
| Teacher | teacher@demo.edu | teacher123 |
| Registrar | registrar@demo.edu | admin123 |
| Finance | finance@demo.edu | admin123 |
| Admissions | admissions@demo.edu | admin123 |

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── admin/             # Admin portal pages
│   ├── portal/            # Student portal pages
│   ├── apply/             # Admission application
│   └── login/             # Authentication
├── components/            # React components
│   ├── layouts/           # Layout components
│   └── ui/                # Reusable UI components
├── db/                    # Database configuration
│   ├── index.ts          # Database connection
│   ├── schema.ts         # Drizzle schema
│   └── seed.ts           # Seed data
└── lib/                   # Utilities
    ├── auth.ts           # Authentication utilities
    └── utils.ts          # Helper functions
```

## 🔐 Security Features

- Secure password hashing with bcrypt
- Session-based authentication
- HTTP-only cookies
- Role-based access control
- Server-side authorization
- Input validation with Zod
- CSRF protection
- Rate limiting on login
- Account lockout after failed attempts
- Audit logging

## ♿ Accessibility Features

- WCAG 2.2 AA compliant
- Screen reader friendly
- Keyboard navigation support
- High contrast mode
- Text size adjustment
- Reduce motion option
- Dyslexia-friendly font option
- Proper ARIA labels
- Focus indicators
- Semantic HTML

## 📱 Responsive Design

- Mobile-first approach
- Responsive navigation
- Touch-friendly interfaces
- Adaptive tables
- Collapsible sidebar

## 🗄 Database Schema

The system includes tables for:

- Users & Authentication
- Students & Staff
- Departments & Programs
- Courses & Enrollments
- Attendance
- Examinations & Results
- Fees & Payments
- Receipts
- Notifications
- Announcements
- Support Tickets
- Audit Logs

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | PostgreSQL connection string | Yes |
| NODE_ENV | Environment (development/production) | No |

## 📝 API Routes

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Get current session

### Application
- `GET /api/application/options` - Get application options
- `POST /api/application/submit` - Submit application
- `POST /api/application/draft` - Save draft

### Health
- `GET /api/health` - Health check endpoint

## 🧪 Testing

```bash
# Run type checking
npm run typecheck

# Run linting
npm run lint

# Run build
npm run build
```

## 📈 Performance Optimization

- Server-side rendering
- Code splitting
- Lazy loading
- Optimized database queries
- Pagination support
- Caching strategies

## 🚢 Deployment

### Production Build

```bash
npm run build
npm start
```

### Docker (Coming Soon)

```bash
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Drizzle team for the excellent ORM
- Tailwind CSS for the utility-first CSS framework
- Lucide for the beautiful icons

## 🔍 Security & Quality Audit

A comprehensive bug audit has been performed. See [`website_student_portal_bug_audit.md`](website_student_portal_bug_audit.md) for full details.

### Audit Summary

| Metric | Count |
|---|---|
| Total Bugs Found | 41 |
| Fixed | 39 |
| Not Fixed (design limitation) | 1 |
| Cannot Verify | 1 |
| Coming Soon pages replaced | 13 |
| Missing portal pages created | 8 |
| Total routes | 48 |

### Login Fix — Root Cause
The login redirect loop had **4 layers**: (1) `Secure` cookie flag mismatch behind proxy, (2) `router.push` RSC race condition, (3) `fetch()` Set-Cookie async timing, (4) `NextResponse.redirect()` generating absolute `http://0.0.0.0:3000` Location headers unreachable by browser. **All four fixed.** Login now uses a callback redirect pattern with relative Location headers. Teacher/readonly_staff role redirect loop also fixed.

### Key Changes (v2.0.0)
- ✅ **All 13 Coming Soon pages replaced** with real data-driven functional pages
- ✅ **8 missing portal pages created** (progress, courses, timetable, exams, results, receipts, documents, settings)
- ✅ **Application status tracker** with API search by reference number
- ✅ Login callback uses relative redirects — works in all proxy environments
- ✅ Teacher/readonly_staff redirect loop fixed
- ✅ Loading screen only shows once per browser session
- ✅ Login safety timeout prevents infinite spinner
- ✅ 15 automated auth tests, all passing through HTTPS proxy

### Known Remaining Issues
- Session table cleanup requires scheduled task (sessions validated server-side)

## 📧 Support

For support, please:
- Open an issue on GitHub
- Contact: support@eduportal.edu

---

© Webloom LLC | Made with ❤️ by Webloom
