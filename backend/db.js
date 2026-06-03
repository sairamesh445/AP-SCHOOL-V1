import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'data', 'database.json');

const defaultData = {
  schools: [],
  users: [],
  categories: [],
  contentItems: [],
  carouselSlides: [],
  hierarchyPositions: [],
  quizQuestions: [],
  ministries: [],
  mps: [],
  mlas: [],
  courtPositions: [],
  courtAuthorities: [],
  assemblyLayoutVersion: 0,
  districts: [],
  policeAuthorities: [],
  ministerOsds: [],
  districtIas: [],
  parliamentTopics: [],
  assemblyTopics: [],
  districtMlaHistory: []
};

function ensureDb() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2));
  }
}

export function readDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

export function writeDb(data) {
  ensureDb();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}
