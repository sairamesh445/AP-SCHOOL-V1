# AP_SCHOOL_V1 - Technical Documentation

## 1) Project Overview
`AP_SCHOOL_V1` is a role-based civic education web application designed for school students in Andhra Pradesh.  
It provides structured educational content, hierarchy visualizations, civic information, and quiz-based learning.

Primary goals:
- Make civic learning simple and visual.
- Support multi-school onboarding.
- Keep platform management easy for admins.

---

## 2) System Architecture

The application follows a client-server architecture:

- **Frontend (React + Vite)**: UI, routing, role-based page rendering, API integration.
- **Backend (Node.js + Express)**: REST APIs, authentication, authorization, CRUD operations, file uploads.
- **Data layer**: JSON-based storage (`backend/data/database.json`) with seed scripts.
- **Media storage**: Uploaded images stored in `backend/uploads/` and served through static route.

Flow:
1. User logs in from frontend.
2. Backend validates credentials and returns JWT token.
3. Frontend sends token for protected APIs.
4. Backend serves role-appropriate data and actions.

---

## 3) Technologies Used

## Frontend Technologies
- **React 18** - component-based UI
- **React Router DOM** - page routing and protected routes
- **Vite** - frontend build/dev tooling
- **CSS** (`frontend/src/index.css`) - custom styling
- **svgmap-andhrapradesh** - map rendering utility

## Backend Technologies
- **Node.js** - runtime
- **Express 5** - API framework
- **jsonwebtoken (JWT)** - token-based authentication
- **bcryptjs** - password hashing
- **multer** - image/file uploads
- **cors** - cross-origin support
- **dotenv** - environment variable support
- **uuid** - IDs generation

## Database Approach
- JSON file-based persistence (no SQL/NoSQL DB in current version).
- Seed and refresh scripts populate civic/governance data.

---

## 4) User Roles and Access

### 4.1 Platform Admin
- Creates schools and school admins.
- Manages categories, content cards, carousel slides, hierarchies, quiz.
- Updates governance/court/civic data.

### 4.2 School Admin
- Creates and manages student accounts for their school only.
- Cannot manage platform-wide data.

### 4.3 Student
- Logs in and accesses learning modules.
- Views hierarchies and civic data.
- Attempts quiz and gets score.

---

## 5) Frontend Structure and Key Components

Root: `frontend/src/`

### 5.1 Entry and Core
- `main.jsx` - React app bootstrap with router/provider setup.
- `App.jsx` - central route definitions and role-based route protection.
- `context/AuthContext.jsx` - authentication state (user, token, loading).
- `components/ProtectedRoute.jsx` - route-level access control by role.
- `api/client.js` - API request layer and helper methods.

### 5.2 Main Pages
- `pages/Login.jsx` - user login page.
- `pages/Home.jsx` - carousel + category cards.
- `pages/LearnHierarchies.jsx` - hierarchy entry point.
- `pages/AssemblyHierarchy.jsx` - assembly diagram/positions.
- `pages/CourtHierarchy.jsx` - court hierarchy data.
- `pages/CivicKnowledge.jsx` - district, police, officials, assembly, parliament, MLA history.
- `pages/QuizPage.jsx` - quiz attempt and scoring UI.
- `pages/PlatformDashboard.jsx` - complete platform admin console.
- `pages/SchoolDashboard.jsx` - school-level student management.
- `pages/SectionDetail.jsx` - expanded section content view.
- `pages/ExploreDistricts.jsx` - district exploration experience.

### 5.3 Reusable UI Components
- `components/Layout.jsx` - common layout shell.
- `components/Carousel.jsx` - homepage slide carousel.
- `components/ContentCard.jsx` - standard content card UI.
- `components/ImageUpload.jsx` - upload input for admin forms.
- `components/AssemblyDiagram.jsx` / `components/CourtDiagram.jsx` - hierarchy visuals.
- `components/AdminGovernancePanel.jsx` - governance management tabs.
- `components/AdminCourtPanel.jsx` - court/admin hierarchy management.
- `components/AdminCivicPanel.jsx` - civic content management tabs.

---

## 6) Backend Structure and Key Components

Root: `backend/`

### 6.1 Core Backend Files
- `server.js` - Express app entry, middleware, route mounting, health route.
- `db.js` - data access helpers for JSON persistence.
- `middleware/auth.js` - JWT verification and role checks.
- `middleware/upload.js` - multer configuration for file uploads.

### 6.2 API Route Modules
- `routes/auth.js` - login/auth endpoints.
- `routes/schools.js` - school CRUD and school-level operations.
- `routes/users.js` - users/students operations.
- `routes/content.js` - categories, home content, carousel management.
- `routes/hierarchy.js` - assembly hierarchy operations.
- `routes/court.js` - court hierarchy and authority operations.
- `routes/governance.js` - ministries, MPs, MLAs related APIs.
- `routes/civic.js` - district/police/officials/assembly/parliament/MLA history APIs.
- `routes/quiz.js` - quiz CRUD and quiz submission/scoring.
- `routes/upload.js` - image upload endpoints.

### 6.3 Data and Seed Files
- `data/database.json` - primary application data file.
- `seed.js` - initial master seed flow.
- `seed-home-content.js`, `seed-quiz-extended.js`, `seed-governance.js`, `seed-court.js`, `seed-civic.js` - module-wise seeders.
- `seed-refresh-official.js` and `scripts/*.mjs` - data refresh/enrichment pipelines.

---

## 7) Important API Groups (High Level)

- `/api/auth` - authentication.
- `/api/schools` - schools and school administrators.
- `/api/users` - students and user-level operations.
- `/api/content` - homepage categories/content/carousel.
- `/api/hierarchy` - assembly hierarchy.
- `/api/court` - court data.
- `/api/governance` - governance structure.
- `/api/civic` - civic and AP knowledge datasets.
- `/api/quiz` - quiz question management and submission.
- `/api/upload` - image uploads.

---

## 8) Security and Access Control

- JWT token-based authentication for protected APIs.
- Password hashing with bcrypt.
- Role-based frontend route protection (`ProtectedRoute`).
- Role checks in backend middleware and routes.
- Student account creation restricted to school admin panel.

---

## 9) Deployment and Run Details

From root project:

- Install and run both apps using root scripts and backend seeds.
- Frontend default: `http://localhost:3000`
- Backend default: `http://localhost:5000`

Backend provides:
- `GET /api/health` for service health check.
- `/uploads/*` static serving for uploaded assets.

---

## 10) Key Functional Highlights

- Multi-tenant school setup with school-specific student management.
- Centralized admin dashboard for all content domains.
- Visual civic modules (assembly/court/district data).
- Quiz-based student self-assessment.
- Data seeding and refresh scripts for faster content updates.

---

## 11) Limitations in Current Version

- Uses JSON file storage (not ideal for large scale concurrency).
- No advanced analytics dashboard yet for learning progress.
- No multilingual UI currently.
- No dedicated mobile app currently.

---

## 12) Recommended Future Enhancements

- Move storage to PostgreSQL or MongoDB.
- Add student progress analytics and reports.
- Add Telugu/English bilingual mode.
- Add notifications and assignment workflows for schools.
- Add CI/CD and environment-based deployment setup.

