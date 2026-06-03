# Live URLs for AP Civic Education Portal

Repository: [github.com/sairamesh445/AP-SCHOOL-V1](https://github.com/sairamesh445/AP-SCHOOL-V1)

---

## Option A — GitHub Pages (free, GitHub URL)

**Public URL:** https://sairamesh445.github.io/AP-SCHOOL-V1/

### One-time setup (you do this once on GitHub)

1. Open https://github.com/sairamesh445/AP-SCHOOL-V1/settings/pages
2. Under **Build and deployment** → **Source**, choose **GitHub Actions**
3. Save. The workflow `.github/workflows/deploy-github-pages.yml` runs on every push to `main`.

After the first successful workflow run (Actions tab), the site is live at the URL above.

> **Note:** GitHub Pages hosts only the **frontend**. Login and data need the API. For a **fully working** app with login, use **Option B (Render)** below.

---

## Option B — Render (full app with login, one URL) — **use this URL**

**Best for:** Schools logging in, quizzes, admin dashboard, Know AP, districts map.

1. Go to https://render.com and sign in with GitHub.
2. **New** → **Blueprint** → select repo **AP-SCHOOL-V1**.
3. Render reads `render.yaml` and deploys automatically.
4. Open your **Render service URL** (e.g. `https://ap-school-v1.onrender.com`).

On each deploy, the server runs the **full seed pipeline** (districts, civic data, quiz, welfare schemes, etc.).

> **Do not use the GitHub Pages URL for testing login** — Pages has no backend API.

Default admin after first deploy (from seed):

| Username | Password  |
|----------|-----------|
| admin    | admin123  |

Change passwords before real use.

**Free tier note:** Render may sleep after inactivity; first visit can take ~30–60 seconds to wake up.

---

## After cloning locally

```bash
npm run install:all
cd backend && npm run seed && cd ..
npm run start
```

Restore production data: copy your backup to `backend/data/database.json`.

---

## Update the live site

```bash
git add .
git commit -m "Your change description"
git push origin main
```

GitHub Pages redeploys automatically. Render redeploys on push if connected.
