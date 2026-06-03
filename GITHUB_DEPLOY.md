# GitHub deployment notes

## After cloning this repo

```bash
npm run install:all
cd backend && npm run seed && cd ..
npm run start
```

## Restore production data

`database.json` is **not** in GitHub (security). Copy your backup file to:

`backend/data/database.json`

## Default platform admin (after seed)

| Username | Password  |
|----------|-----------|
| admin    | admin123  |

Change passwords before production use.
