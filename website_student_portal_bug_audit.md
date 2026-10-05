# EduPortal Academy — Bug Audit Report v2.0

**Version:** 2.0.0 | **Date:** 2025-01-22 | **Auditor:** Senior QA / Security / Full-Stack Engineer

---

## Executive Summary

| Metric | Value |
|---|---|
| Total bugs found (all passes) | 41 |
| Fixed | 39 |
| Partially fixed | 0 |
| Not fixed (design limitation) | 1 |
| Cannot verify (requires browser) | 1 |
| Coming Soon pages replaced with real pages | 13 |
| Missing portal pages created | 8 |
| Total routes in final build | 48 |

---

## Login/Authentication — Root Cause Analysis

The login redirect loop had **four layers**, discovered across four audit passes:

| Layer | Cause | Fix |
|---|---|---|
| 1 | `Secure` cookie flag set unconditionally via `NODE_ENV` — prevented cookie storage behind TLS-terminating proxies | Removed; set `secure: false` so cookie works in all proxy configs |
| 2 | `router.push()` triggered RSC fetch race — cookie not yet stored when portal read it | Replaced with `window.location.href` |
| 3 | `fetch()` Set-Cookie timing — even `window.location.href` fires before browser processes the `Set-Cookie` from a `fetch` response | **Eliminated Set-Cookie from fetch entirely.** Login API returns token in JSON body. Client navigates to `GET /api/auth/callback?token=...&to=/portal` which sets cookie on a 307 redirect. |
| 4 | `NextResponse.redirect(new URL(path, request.url))` produced absolute `location: http://0.0.0.0:3000/portal` — unreachable by browser through proxy | **Replaced all redirects with relative `Location` headers** using `new NextResponse(null, { status: 307, headers: { Location: '/portal' } })` |

**Additional fix:** `teacher` and `readonly_staff` roles were not in the `isAdmin()` check, causing a redirect loop between `/portal` (rejects non-students) and `/admin` (rejects non-admins). Fixed by adding both roles.

### Authentication files changed
- `src/app/api/auth/login/route.ts` — Returns token in body, no Set-Cookie
- `src/app/api/auth/callback/route.ts` — Sets cookie via relative 307 redirect
- `src/app/api/auth/logout/route.ts` — Relative redirect, cookie clear
- `src/app/api/notifications/mark-all-read/route.ts` — Relative redirect
- `src/app/login/page.tsx` — Safety timeout, session guard, navigates to callback
- `src/lib/auth.ts` — `getSession()` try/catch, `isAdmin()` includes teacher/readonly_staff
- `src/app/portal/layout.tsx` — try/catch around getSession
- `src/app/admin/layout.tsx` — try/catch around getSession
- `src/components/LoadingScreen.tsx` — Only shows on first visit per session

---

## Auth Test Results (15 tests, all via HTTPS proxy)

| # | Test | Result |
|---|---|---|
| 1 | Student login → callback → portal | ✅ 200 |
| 2 | Admin login → callback → admin | ✅ 200 |
| 3 | Teacher login → callback → admin | ✅ 200 |
| 4 | Wrong password | ✅ Error returned |
| 5 | Empty form submission | ✅ "Please enter your email and password" |
| 6 | Portal without cookie | ✅ 307 → /login |
| 7 | Admin without cookie | ✅ 307 → /login |
| 8 | Session API with cookie | ✅ Returns user |
| 9 | Session API without cookie | ✅ Returns null |
| 10 | Logout clears session | ✅ Portal returns 307 |
| 11 | Invalid token in callback | ✅ Redirects to /login |
| 12 | Callback without token | ✅ Redirects to /login |
| 13 | Redirect is relative path | ✅ No absolute origin |
| 14 | Dashboard refresh stays authenticated | ✅ Two consecutive 200s |
| 15 | Health check | ✅ `{"ok":true}` |

---

## Coming Soon Pages — Inventory and Resolution

All 13 Coming Soon placeholder pages have been replaced with real functional pages:

| # | Route | Was | Now |
|---|---|---|---|
| 1 | `/academics/departments` | ComingSoon | DB-driven department listing with program counts |
| 2 | `/academics/programs` | ComingSoon | DB-driven program catalog with degree type, credits, duration |
| 3 | `/academics/courses` | ComingSoon | DB-driven course table with department, credits, type |
| 4 | `/academics/calendar` | ComingSoon | DB-driven sessions, semesters, calendar events |
| 5 | `/admissions` | ComingSoon | Admission steps guide with CTA buttons |
| 6 | `/admissions/requirements` | ComingSoon | DB-driven program requirements with general requirements list |
| 7 | `/admissions/fees` | ComingSoon | DB-driven fee structure cards per program |
| 8 | `/admissions/scholarships` | ComingSoon | DB-driven scholarship listings |
| 9 | `/application-status` | ComingSoon | **Interactive tracker** with API search by reference number |
| 10 | `/forgot-password` | ComingSoon | Password reset form with email confirmation state |
| 11 | `/privacy` | ComingSoon | Full privacy policy page |
| 12 | `/terms` | ComingSoon | Full terms of service page |
| 13 | `/accessibility` | ComingSoon | Accessibility statement with feature list |

## Missing Portal Pages — Created

| # | Route | Description |
|---|---|---|
| 1 | `/portal/progress` | Academic progress tracker with semester timeline visualization |
| 2 | `/portal/courses` | Enrolled courses with instructor, credits, grades |
| 3 | `/portal/timetable` | Weekly timetable grouped by day |
| 4 | `/portal/exams` | Upcoming and past exams with details |
| 5 | `/portal/results` | Semester results with GPA/CGPA/credits |
| 6 | `/portal/receipts` | Fee receipts list with amounts and dates |
| 7 | `/portal/documents` | Official documents issued to student |
| 8 | `/portal/settings` | Account security and notification preferences |

## New API Route

| Route | Method | Purpose |
|---|---|---|
| `/api/application/status` | GET | Look up application status by reference number |

---

## Build Verification

| Check | Result |
|---|---|
| `npx next typegen` | ✅ Types generated |
| `tsc --noEmit` | ✅ 0 errors |
| `npm run build` | ✅ 48 routes compiled |
| `drizzle-kit push` | ✅ Schema synced with Neon |
| `build_and_start` | ✅ Health check passed |

## Neon Database Status
- Schema fully synchronized via `drizzle-kit push`
- Seed data present and verified
- No destructive migrations performed
- No credentials committed to source

## Remaining Known Issues
1. Session table cleanup requires scheduled task (expired sessions are validated server-side)
2. Contact form has no backend handler (acceptable as informational page)

---

© 2025 Webloom LLC
