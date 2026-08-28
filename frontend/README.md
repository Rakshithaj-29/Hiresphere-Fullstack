# HireSphere

HireSphere is a full-stack job portal. Candidates can search jobs (via the
Adzuna API), save jobs, apply, and track their applications. Admins have a
separate dashboard to manage applications.

- **Frontend:** React 19 + Vite + Tailwind CSS v4
- **Backend:** Node.js + Express 5
- **Database:** PostgreSQL
- **Auth:** JWT (JSON Web Tokens) + bcrypt password hashing
- **External API:** [Adzuna](https://developer.adzuna.com/) for live job
  listings

---

## Live Demo
https://hiresphere-34972633g-hiresphere.vercel.app/
## Project structure

```
Hiresphere/
├── backend/
│   ├── config/
│   │   └── db.js                 # PostgreSQL connection pool
│   ├── middleware/
│   │   ├── authMiddleware.js      # Verifies JWT, attaches req.user
│   │   └── adminMiddleware.js     # Restricts routes to admin users
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth  (register, login)
│   │   ├── jobRoutes.js           # /api/jobs  (Adzuna job search)
│   │   ├── applicationRoutes.js   # /api/applications
│   │   ├── savedJobRoutes.js      # /api/saved-jobs
│   │   └── adminRoutes.js         # /api/admin
│   ├── server.js                  # Express app entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── ProtectedRoute.jsx  # Redirects to /login if not authenticated
    │   │   └── AdminRoute.jsx      # Redirects if user isn't an admin
    │   ├── context/
    │   │   └── AuthContext.jsx     # Auth state (user, login, logout)
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Jobs.jsx
    │   │   ├── JobDetails.jsx
    │   │   ├── Apply.jsx
    │   │   ├── Applications.jsx
    │   │   ├── SavedJobs.jsx
    │   │   └── AdminDashboard.jsx
    │   ├── App.jsx                 # Routes
    │   └── main.jsx
    └── package.json
```

---

## Features

- Email/password registration and login (JWT-based sessions)
- Live job search via the Adzuna API, with location and keyword filters
- Save/unsave jobs, with paginated + searchable "Saved jobs" page
- Apply to jobs and track application status
- Admin dashboard (role-based) for managing applications
- Responsive UI built with Tailwind CSS v4, deep teal + warm gray theme

---

