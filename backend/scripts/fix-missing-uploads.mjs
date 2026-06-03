import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { readDb, writeDb } from '../db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

const FALLBACKS = {
  'N. Chandrababu Naidu': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/N._Chandrababu_Naidu_%28cropped%29.jpg/440px-N._Chandrababu_Naidu_%28cropped%29.jpg',
  'Konidela Pawan Kalyan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Pawan_Kalyan_at_Intinta_Annadambaram_Event.jpg/440px-Pawan_Kalyan_at_Intinta_Annadambaram_Event.jpg'
};

function fixPhoto(photo, personName) {
  if (!photo?.startsWith('/uploads/')) return photo;
  const file = path.join(UPLOAD_DIR, path.basename(photo));
  if (fs.existsSync(file)) return photo;
  console.log(`Missing file ${photo} for ${personName || 'unknown'} — using fallback`);
  return FALLBACKS[personName] || photo;
}

const db = readDb();
let changed = 0;

for (const key of ['hierarchyPositions', 'courtPositions', 'courtAuthorities']) {
  if (!db[key]) continue;
  db[key] = db[key].map((row) => {
    const next = fixPhoto(row.personPhoto, row.personName);
    if (next !== row.personPhoto) {
      changed++;
      return { ...row, personPhoto: next };
    }
    return row;
  });
}

if (changed) {
  writeDb(db);
  console.log(`Fixed ${changed} missing upload reference(s).`);
} else {
  console.log('No missing upload files to fix.');
}
