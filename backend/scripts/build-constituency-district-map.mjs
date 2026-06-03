/**
 * Build ap-constituency-district.json — all 175 constituencies → revenue district.
 * Source: Wikipedia "Current constituencies" table (2022 AP district boundaries).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { AP_DISTRICTS } from '../data/ap-official-data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, '../data/ap-constituency-district.json');
const resultsPath = path.join(__dirname, '../data/ap-mla-2024-results.json');

const WIKI_DISTRICT_TO_APP = {
  Srikakulam: 'Srikakulam',
  Vizianagaram: 'Vizianagaram',
  'Parvathipuram Manyam': 'Parvathipuram Manyam',
  Visakhapatnam: 'Visakhapatnam',
  Anakapalli: 'Anakapalli',
  'Alluri Sitharama Raju': 'Alluri Sitharama Raju',
  Kakinada: 'Kakinada',
  'East Godavari': 'East Godavari',
  Konaseema: 'Dr. B. R. Ambedkar Konaseema',
  'West Godavari': 'West Godavari',
  Eluru: 'Eluru',
  NTR: 'NTR',
  Krishna: 'Krishna',
  Guntur: 'Guntur',
  Palnadu: 'Palnadu',
  Bapatla: 'Bapatla',
  Prakasam: 'Prakasam',
  Nellore: 'Sri Potti Sriramulu Nellore',
  Tirupati: 'Sri Balaji (Tirupati)',
  Chittoor: 'Chittoor',
  Annamayya: 'Annamayya',
  'YSR Kadapa': 'YSR Kadapa',
  YSR: 'YSR Kadapa',
  Anantapuramu: 'Anantapur',
  Anantapur: 'Anantapur',
  'Sri Sathya Sai': 'Sri Sathya Sai',
  Kurnool: 'Kurnool',
  Nandyal: 'Nandyal'
};

/** Oneindia/ECI key → Wikipedia constituency label (normalized) */
const WIKI_CONSTITUENCY_ALIASES = {
  ANAKAPALLE: 'ANAKAPALLE',
  BHIMILI: 'BHEEMILI',
  CHEEPURUPALLE: 'CHEEPURUPALLI',
  PALACOLE: 'PALAKOLLU',
  UNGUTUR: 'UNGUTURU',
  YELAMANCHILI: 'ELAMANCHILI',
  SATYAVEDU: 'SATHYAVEDU',
  PONNUR: 'PONNURU',
  'GANNAVARAM(SC)': 'GANNAVARAM, KONASEEMA',
  PRATHIPADU: 'PRATHIPADU, KAKINADA',
  'PRATHIPADU (SC)': 'PRATHIPADU, GUNTUR',
  'RAJAMAHENDRAVARAM CITY': 'RAJAHMUNDRY CITY',
  'RAJAMAHENDRAVARAM RURAL': 'RAJAHMUNDRY RURAL',
  TADPATRI: 'TADIPATRI'
};

function normalizeConstituency(c) {
  return c.trim().toUpperCase().replace(/\s+/g, ' ');
}

function wikiDistrictToApp(cell) {
  for (const [wiki, app] of Object.entries(WIKI_DISTRICT_TO_APP)) {
    if (cell.includes(wiki)) return app;
  }
  return null;
}

function linkLabel(cell) {
  const m = cell.match(/\[\[([^|\]]+)(?:\|([^\]]+))?\]\]/);
  if (!m) return cell.trim();
  return (m[2] || m[1])
    .trim()
    .replace(/\s+Assembly constituency$/i, '')
    .replace(/\s+constituency$/i, '');
}

function districtFromRowLines(lines) {
  for (const line of lines) {
    if (/lok sabha/i.test(line)) continue;
    if (/assembly constituency/i.test(line) && !/district/i.test(line)) continue;
    const d = wikiDistrictToApp(line);
    if (d) return d;
  }
  return null;
}

async function fetchWikitext() {
  const page = 'List_of_constituencies_of_the_Andhra_Pradesh_Legislative_Assembly';
  const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(page)}&prop=wikitext&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'APSchoolCivic/1.0 (educational)' } });
  if (!res.ok) throw new Error(`Wikipedia API ${res.status}`);
  const data = await res.json();
  return data.parse.wikitext['*'];
}

function parseConstituencyDistrictTable(wikitext) {
  const start = wikitext.indexOf('== Current constituencies ==');
  if (start < 0) throw new Error('Current constituencies section not found');
  const section = wikitext.slice(start);
  const tableEnd = section.indexOf('\n|}', section.indexOf('{|'));
  const table = section.slice(section.indexOf('{|'), tableEnd > 0 ? tableEnd : undefined);

  const wikiMap = new Map();
  let currentDistrict = null;

  for (const row of table.split(/\n\|-\n/)) {
    const lines = row
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.startsWith('|'))
      .map((l) => l.replace(/^\|/, '').trim());
    if (!lines.length) continue;

    const assemblyLine = lines.find((l) => /assembly constituency/i.test(l));
    if (!assemblyLine) continue;

    const district = districtFromRowLines(lines);
    if (district) currentDistrict = district;
    if (!currentDistrict) continue;

    const name = linkLabel(assemblyLine);
    wikiMap.set(normalizeConstituency(name), currentDistrict);
  }

  return wikiMap;
}

function lookupDistrict(constituencyKey, wikiMap) {
  if (wikiMap.has(constituencyKey)) return wikiMap.get(constituencyKey);

  const alias = WIKI_CONSTITUENCY_ALIASES[constituencyKey];
  if (alias && wikiMap.has(alias)) return wikiMap.get(alias);

  const withoutSc = constituencyKey.replace(/\s*\(SC\)\s*/i, '').trim();
  if (wikiMap.has(withoutSc)) return wikiMap.get(withoutSc);

  if (alias) {
    const aliasBase = alias.replace(/\s*\(SC\)\s*/i, '').trim();
    if (wikiMap.has(aliasBase)) return wikiMap.get(aliasBase);
  }

  return null;
}

const results2024 = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
const wikitext = await fetchWikitext();
const wikiMap = parseConstituencyDistrictTable(wikitext);

const map = {};
const unmapped = [];

for (const r of results2024) {
  const key = normalizeConstituency(r.constituency);
  const district = lookupDistrict(key, wikiMap);
  if (district) {
    map[key] = district;
  } else {
    unmapped.push(key);
  }
}

if (unmapped.length) {
  console.error('Unmapped constituencies:', unmapped);
  process.exit(1);
}

fs.writeFileSync(out, JSON.stringify(map, null, 2));

const counts = {};
for (const d of Object.values(map)) counts[d] = (counts[d] || 0) + 1;
console.log(`Mapped ${Object.keys(map).length} constituencies → ${out}`);
console.log('By district:', counts);

const unknown = [...new Set(Object.values(map))].filter((d) => !AP_DISTRICTS.includes(d));
if (unknown.length) console.warn('Not in AP_DISTRICTS:', unknown);
