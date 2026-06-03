import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { readDb, writeDb, generateId } from './db.js';
import { ministriesOfficial, mpsOfficial } from './data/ap-official-data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const db = readDb();
let updated = false;

if (!db.ministries?.length) {
  db.ministries = ministriesOfficial.map((m, i) => ({
    id: generateId(),
    ...m,
    photoUrl: '',
    active: true,
    createdAt: new Date().toISOString()
  }));
  updated = true;
  console.log(`Seeded ${db.ministries.length} ministries`);
}

if (!db.mps?.length) {
  db.mps = mpsOfficial.map((m) => ({
    id: generateId(),
    ...m,
    photoUrl: '',
    active: true,
    createdAt: new Date().toISOString()
  }));
  updated = true;
  console.log(`Seeded ${db.mps.length} MPs`);
}

if (!db.mlas?.length) {
  const mlasPath = path.join(__dirname, 'data', 'mlas-parsed.json');
  let mlasRaw = [];
  if (fs.existsSync(mlasPath)) {
    mlasRaw = JSON.parse(fs.readFileSync(mlasPath, 'utf-8'));
  }
  db.mlas = mlasRaw.map((m, i) => ({
    id: generateId(),
    name: m.name,
    constituency: m.constituency,
    party: m.party || '',
    order: i + 1,
    active: true,
    createdAt: new Date().toISOString()
  }));
  updated = true;
  console.log(`Seeded ${db.mlas.length} MLAs`);
}

if (updated) {
  writeDb(db);
  console.log('Governance data seeded successfully!');
} else {
  console.log('Governance data already exists. Use admin dashboard to edit.');
}
