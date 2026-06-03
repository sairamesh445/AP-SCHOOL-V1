/**
 * Fetch all 175 AP 2024 MLA winners + margins from Oneindia results table.
 * Source: https://www.oneindia.com/india/andhra-pradesh-assembly-elections-2024-full-winners-list-for-175-constituencies-3841623.html
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outMlas = path.join(__dirname, '../data/mlas-parsed.json');
const out2024 = path.join(__dirname, '../data/ap-mla-2024-results.json');

const URL =
  'https://www.oneindia.com/india/andhra-pradesh-assembly-elections-2024-full-winners-list-for-175-constituencies-3841623.html';

function titleCaseName(s) {
  return s
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\b(Ias|Ips|Sc|St|Bjp|Tdp|Ysrcp|Jsp|Inc)\b/gi, (m) => m.toUpperCase());
}

function normalizeConstituency(raw) {
  return raw
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .replace(/\(SC\)/i, '(SC)')
    .replace(/\(ST\)/i, '(ST)')
    .replace(/VIJAYWADA/g, 'VIJAYAWADA')
    .replace(/RAJAHMUNDRY/g, 'RAJAMAHENDRAVARAM');
}

function normalizeParty(p) {
  const u = p.trim().toUpperCase();
  if (u.includes('TELUGU DESAM') || u === 'TDP') return 'TDP';
  if (u.includes('YSR') || u === 'YSRCP') return 'YSRCP';
  if (u.includes('JANASENA') || u === 'JSP') return 'JSP';
  if (u.includes('BHARATIYA') || u === 'BJP') return 'BJP';
  if (u.includes('CONGRESS') || u === 'INC') return 'INC';
  return p.trim();
}

function parseTable(html) {
  const rows = [];
  const re =
    /\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([\d,]+)\s*\|/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const constituency = m[1].trim();
    if (!/^[A-Za-z]/.test(constituency) || constituency === 'Constituency') continue;
    rows.push({
      constituency: normalizeConstituency(constituency),
      constituencyDisplay: constituency.trim(),
      mlaName: titleCaseName(m[2].trim()),
      party: normalizeParty(m[3]),
      majorityMargin: `${Number(m[6].replace(/,/g, '')).toLocaleString('en-IN')} votes`
    });
  }
  return rows;
}

const html = await fetch(URL, {
  headers: { 'User-Agent': 'APSchoolCivic/1.0 (education)' }
}).then((r) => r.text());

let results = parseTable(html);

for (const cacheFile of ['ap-oneindia-2024-cache.txt', 'ap-oneindia-2024-cache.html']) {
  if (results.length >= 170) break;
  const local = path.join(__dirname, '../data', cacheFile);
  if (fs.existsSync(local)) {
    results = parseTable(fs.readFileSync(local, 'utf-8'));
  }
}

if (results.length < 170) {
  console.error(`Only parsed ${results.length} constituencies from Oneindia`);
  process.exit(1);
}

const byConst = new Map();
for (const r of results) {
  if (!byConst.has(r.constituency)) byConst.set(r.constituency, r);
}
results = [...byConst.values()].sort((a, b) => a.constituency.localeCompare(b.constituency));

const mlas = results.map((r) => ({
  name: r.mlaName,
  constituency: r.constituency,
  party: r.party
}));

fs.writeFileSync(outMlas, JSON.stringify(mlas, null, 2));
fs.writeFileSync(out2024, JSON.stringify(results, null, 2));
console.log(`Wrote ${mlas.length} MLAs → ${outMlas}`);
console.log(`Wrote ${results.length} results with margins → ${out2024}`);
