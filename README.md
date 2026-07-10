# EduSphere — School ERP Pro (MVP)

A modern, glassmorphic School Management System built on the MERN stack (MongoDB, Express, React, Node).

This is a **working MVP**, not the full 15-module spec — see [Scope](#scope--whats-included) below for exactly what's built end-to-end vs. what's designed for you to extend.

## Tech Stack

**Frontend:** React (Vite), Tailwind CSS, Redux Toolkit, React Router, React Hook Form, Framer Motion, Chart.js, React Hot Toast
**Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, bcrypt, Helmet, express-rate-limit, Swagger

## Scope — what's included

✅ Fully working:
- School registration + Super Admin approval workflow
- JWT auth (access + refresh tokens, protected routes, auto-login, logout) for 5 roles
- Super Admin: manage & approve/suspend schools, platform analytics
- School Admin dashboard: live stats, 7-day attendance chart, upcoming homework, recent notices
- Students: admission (creates linked user + profile), list, search, delete
- Parents: add parent accounts, link/unlink to one or more students, edit, delete
- Teachers: add, list, assign to class/subject
- Classes & Subjects: create classes with sections, create subjects
- Attendance: mark present/absent/late/leave per class+section+date, stored per-student-per-day
- Homework: assign with due dates, students can submit, teachers can grade
- Fees: assign fee categories to a single student or a whole class+section, record partial/full payments, auto status (pending/partial/paid), student & parent see their own pending fees
- Announcements: publish notices/events/holidays targeted by audience
- Credential sharing: when a Student/Teacher/Parent account is created, the admin can set a password or auto-generate one, then copy the login email+password to share with them (shown once, not stored in plaintext)
- Student portal & Parent portal (read-only views of the above)
- Dark mode, responsive **classic ERP-style UI**: muted navy/grey palette, solid fixed sidebar grouped into People / Academics / Finance / Communication, dense bordered data tables, flat cards (no gradients/blur), toast notifications, loading/empty states
- Client-side routing that survives refresh on any route (see [Routing](#routing--no-404-on-refresh))

## Fixed since first version
- **Parent portal was blank on login** — `/portal` had two colliding route definitions (one for students, one for parents) at the same path; React Router always matched the first one, so parents got redirected in a loop. Now a single `/portal` route resolves the correct view by role.
- **Homework creation always failed** — the `Homework` model required a `teacher` reference that the controller never set. Fixed by resolving it from the logged-in teacher's profile automatically (or omitting it when a school admin creates it).
- **Teacher dashboard returned 403** — the shared `/dashboard` page (used by both School Admin and Teacher) called an endpoint that only allowed the `schooladmin` role. Now both roles are authorized.

🚧 Designed but not built (data models exist, no UI/routes yet) — extend using the same patterns:
- Exams & marks, Library, Transport, Report card generation/export, Student ID cards, Subscription billing

## Project structure

```
school-erp-pro/
├── backend/
│   ├── config/        # DB connection
│   ├── controllers/    # Route handlers
│   ├── middlewares/    # auth, validation, error handling
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routers
│   ├── seed/            # Demo data seeder
│   ├── utils/
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/  # Reusable UI (Sidebar, Navbar, Modal, StatCard...)
│       ├── layouts/      # DashboardLayout
│       ├── pages/         # Route-level pages, organized by feature
│       ├── redux/          # Store + slices (auth, theme, ui)
│       ├── routes/          # ProtectedRoute
│       └── services/         # Axios instance
└── deployment/          # Vercel + Render configs
```

## Getting started

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI to your MongoDB Atlas connection string,
# and set JWT_SECRET / JWT_REFRESH_SECRET to random strings
npm run seed     # populates demo school, admin, teacher, student, parent
npm run dev      # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev       # starts on http://localhost:5173, proxies /api to :5000
```

### 3. Demo credentials (after `npm run seed`)

| Role | Email | Password |
|---|---|---|
| Super Admin | superadmin@schoolerp.com | Super@123 |
| School Admin | schooladmin@greenfield.edu | Admin@123 |
| Teacher | teacher@greenfield.edu | Teacher@123 |
| Student | student@greenfield.edu | Student@123 |
| Parent | parent@greenfield.edu | Parent@123 |

The login screen has one-click buttons to autofill each of these.

## Routing — no 404 on refresh

- **Dev:** Vite's dev server handles SPA fallback automatically.
- **Production (Express serving the build):** `server.js` serves `frontend/dist` as static files and falls back to `index.html` for any unmatched route, so refreshing `/dashboard`, `/students`, etc. works correctly.
- **Vercel:** `deployment/vercel.json` includes a rewrite rule (`"source": "/(.*)"` → `/index.html`) for the same reason.

## API documentation

Once the backend is running, Swagger UI is available at `http://localhost:5000/api-docs` (JSDoc comments can be added to route files to populate it further).

## Deployment

- **Frontend → Vercel:** use `deployment/vercel.json` as your Vercel project config (or copy its contents into a `vercel.json` at the repo root).
- **Backend → Render:** use `deployment/render.yaml` as a Render Blueprint. Set `MONGO_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, and `CLIENT_URL` as environment variables in the Render dashboard.
- **Database → MongoDB Atlas:** create a free cluster, add a database user, whitelist `0.0.0.0/0` (or Render's IPs), and use the connection string as `MONGO_URI`.

## Extending the MVP

Each existing module (e.g. `studentController.js` + `StudentList.jsx`) is a template. To add a new module like **Fees**:

1. Add a `Fee` Mongoose model in `backend/models/`
2. Add `feeController.js` + `feeRoutes.js`, register the route in `server.js`
3. Add a `pages/fees/Fees.jsx` page following the pattern in `pages/homework/Homework.jsx`
4. Add the route to `App.jsx` and a sidebar link in `components/Sidebar.jsx`

## Security notes for production

- Change every secret in `.env` before deploying
- Set `NODE_ENV=production` so error stack traces aren't leaked
- Restrict MongoDB Atlas network access instead of `0.0.0.0/0` where possible
- Add Cloudinary credentials if you wire up file uploads (Multer config is scaffolded but not yet wired to any route)
