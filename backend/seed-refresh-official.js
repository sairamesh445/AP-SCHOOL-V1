/**
 * Force-refresh civic & governance data from curated JSON + MyNeta MLAs.
 * Run: npm run seed:refresh
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { readDb, writeDb, generateId } from './db.js';
import {
  AP_DISTRICTS,
  policeAuthoritiesOfficial,
  assemblyTopicsOfficial,
  ministriesOfficial,
  mpsOfficial,
  courtAuthoritiesOfficial
} from './data/ap-official-data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ts = new Date().toISOString();

function loadJson(file) {
  const p = path.join(__dirname, 'data', file);
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf-8')) : [];
}

function withMeta(items, mapFn = (x) => x) {
  return items.map((item, i) => ({
    id: generateId(),
    ...mapFn(item),
    order: item.order ?? i + 1,
    active: true,
    createdAt: ts
  }));
}

const db = readDb();
const districtsData = loadJson('ap-district-officials.json');
const districtMap = new Map(districtsData.map((d) => [d.name, d]));

db.districts = AP_DISTRICTS.map((name, i) => {
  const official = districtMap.get(name) || {};
  const prev = (db.districts || []).find((d) => d.name === name) || {};
  return {
    id: generateId(),
    state: prev.state || 'Andhra Pradesh',
    name,
    collectorName: official.collectorName || 'Verify on district portal',
    spName: official.spName || 'Verify on district police portal',
    collectorEmail: official.collectorEmail || '',
    collectorPhone: official.collectorPhone || '',
    spEmail: official.spEmail || '',
    spPhone: official.spPhone || '',
    imageUrl: prev.imageUrl || '',
    famousFor: prev.famousFor || '',
    mandalsCount: typeof prev.mandalsCount === 'number' ? prev.mandalsCount : null,
    order: i + 1,
    active: true,
    createdAt: ts
  };
});

db.districtIas = db.districts.map((d, i) => ({
  id: generateId(),
  districtName: d.name,
  iasName: d.collectorName.replace(/,?\s*I\.?A\.?S\.?/i, '').replace(/^(Sri|Smt|Dr)\.?\s+/i, '').trim(),
  designation: 'District Collector & District Magistrate',
  details: [d.collectorEmail && `Email: ${d.collectorEmail}`, d.collectorPhone && `Phone: ${d.collectorPhone}`]
    .filter(Boolean)
    .join(' | ') || 'Verify on district ap.gov.in portal.',
  order: i + 1,
  active: true,
  createdAt: ts
}));

db.policeAuthorities = withMeta(policeAuthoritiesOfficial);
db.assemblyTopics = withMeta(assemblyTopicsOfficial);
// Keep existing parliament topics (not overwritten on refresh)

const ministerIas = loadJson('ap-minister-ias.json');
db.ministerOsds = withMeta(ministerIas, (o) => ({
  ministerName: o.ministerName,
  ministry: o.ministry,
  osdName: o.iasOfficerName,
  iasOfficerName: o.iasOfficerName,
  officerType: o.officerType,
  contactEmail: o.contactEmail,
  contactPhone: o.contactPhone,
  osdDetails: o.osdDetails
}));

const mlaHistory = loadJson('ap-mla-history.json');
db.districtMlaHistory = withMeta(mlaHistory);

db.ministries = withMeta(ministriesOfficial, (m) => ({ ...m, photoUrl: '' }));
db.mps = withMeta(mpsOfficial, (m) => ({ ...m, photoUrl: '' }));

const mlasPath = path.join(__dirname, 'data', 'mlas-parsed.json');
if (fs.existsSync(mlasPath)) {
  const mlasRaw = JSON.parse(fs.readFileSync(mlasPath, 'utf-8'));
  db.mlas = mlasRaw.map((m, i) => ({
    id: generateId(),
    name: m.name,
    constituency: m.constituency,
    party: m.party || '',
    order: i + 1,
    active: true,
    createdAt: ts
  }));
}

db.courtAuthorities = withMeta(courtAuthoritiesOfficial, (a) => ({ ...a, photoUrl: '' }));

if (db.courtPositions?.length) {
  db.courtPositions = db.courtPositions.map((p) => {
    if (p.slot === 'chief_justice' || /chief justice/i.test(p.title || '')) {
      return {
        ...p,
        personName: 'Smt. Justice Lisa Gill',
        designation: "Hon'ble The Chief Justice",
        responsibilities:
          'Chief Justice of the Andhra Pradesh High Court at Amaravati (sworn in April 2026). Source: aphc.gov.in.'
      };
    }
    return p;
  });
}

writeDb(db);
console.log('Official data refresh complete:');
console.log(`  Districts: ${db.districts.length} (with contacts)`);
console.log(`  Minister IAS/OSD: ${db.ministerOsds.length}`);
console.log(`  MLA history: ${db.districtMlaHistory.length}`);
console.log(`  MLAs: ${db.mlas?.length || 0}`);
