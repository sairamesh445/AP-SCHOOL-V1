# AP Civic Education Portal

A colourful, responsive web application to educate school students about Andhra Pradesh government structure, civic rights, helplines, manifestos, and more.

## Features

- **Multi-tenant schools** — Each school’s data is isolated; school admins only see their own students
- **Role-based access**
  - **Platform Admin** — Creates schools, school admins, carousel, content categories, government hierarchy, quiz
  - **School System Admin** — Creates student login profiles (sign up is admin-only)
  - **Students** — Browse home sections, take quizzes, explore assembly hierarchy diagram
- **Home page** — AP logo, carousel, 6 content sections with card layout (image + h1 + h3)
- **Learn Hierarchies** — Choose **Assembly Hierarchy** (seating chart, ministries, MPs, MLAs) or **Court Hierarchy** (High Court layout and authorities)
- **Know Andhra Pradesh** — Districts (Collector & SP), police leaders, OSDs & IAS, Parliament guide, MLA history by district (platform admin editable)
- **Test Your Knowledge** — Quiz section with scoring

## Tech Stack

- **Frontend:** React 18, React Router, Vite
- **Backend:** Node.js, Express, JSON file database
- **Auth:** JWT + bcrypt

## Quick Start

**Easiest — run both servers from project root (recommended):**

```bash
cd AP_SCHOOL_V1
npm install
cd backend && npm install && npm run seed && cd ..
npm run start
```

Opens frontend at `http://localhost:3000` and API at `http://localhost:5000`.

### Or run in two terminals

**Terminal 1 — Backend**

```bash
cd backend
npm install
npm run seed
npm run dev
```

API runs at `http://localhost:5000`

**Terminal 2 — Frontend**

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:3000`

> **Login shows "Request failed"?** The backend must be running first. Use **`npm run start`** from the project root (not `npm run preview` alone in `frontend/` — preview serves an old build). After code changes run `cd frontend && npm run build` if you use preview.

> **Know AP data not updating?** Use **http://localhost:3000** with `npm run start`. In Know AP click **↻ Refresh data**. Admin tabs are under **Know AP (Civic Knowledge)** in the dashboard. Seed sample civic data: `npm run seed:civic`. To refresh ministers, MPs, MLAs, court, and civic data from official sources: `npm run seed:refresh`

## Default Login (Platform Admin)

| Username | Password  |
|----------|-----------|
| admin    | admin123  |

## Workflow

1. **Platform Admin** logs in → Admin Dashboard
2. Create a **School** with School System Admin credentials
3. **School Admin** logs in → Manage Students → Create student accounts
4. **Students** log in with credentials from school admin → Home & Hierarchy pages

## Project Structure

```
AP_SCHOOL_V1/
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── seed.js
│   ├── routes/
│   └── data/database.json
├── frontend/
│   └── src/
│       ├── pages/
│       ├── components/
│       └── context/
└── README.md
```

## Adding Content

Use the **Platform Admin Dashboard** to:

- **Upload images** from your computer (carousel, content cards, hierarchy photos)
- **Edit** or **Delete** any school, category, content item, slide, hierarchy position, or quiz question
- Add government hierarchy positions (x/y % for diagram placement)
- Add quiz questions (comma-separated options)
- **Know AP (Civic Knowledge)** — AP Districts, Police, OSDs, IAS Officers, Assembly topics, Parliament topics, MLA History (3 per district)

Uploaded images are stored in `backend/uploads/` and served at `/uploads/...`.

## Notes

- Student sign-up is **not** public — only School System Admins create accounts
- The AP Government official logo is used in the header and login page
- Update `JWT_SECRET` in production via environment variable
