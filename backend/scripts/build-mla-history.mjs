/**
 * Build MLA election history: all 175 constituencies (2024 + 2019).
 * 2024: Oneindia/ECI-aligned results with vote margins.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, '../data/ap-mla-history.json');
const results2024Path = path.join(__dirname, '../data/ap-mla-2024-results.json');
const districtMapPath = path.join(__dirname, '../data/ap-constituency-district.json');

function normalizeConstituency(c) {
  return c.trim().toUpperCase().replace(/\s+/g, ' ');
}

async function parseMyneta2019() {
  const url = 'https://myneta.info/AndhraPradesh2019/index.php?action=show_winners&sort=default';
  const html = await fetch(url).then((r) => r.text());
  const rowRe = /<td>(\d+)<\/td>\s*<td>.*?>([^<]+)<\/a>.*?<\/td>\s*<td>([^<]+)<\/td>\s*<td>([^<]+)<\/td>/gi;
  const rows = [];
  let m;
  while ((m = rowRe.exec(html)) !== null) {
    const party = m[4].trim()
      .replace('Janasena Party', 'JSP')
      .replace('Bharatiya Janata Party', 'BJP')
      .replace('Yuvajana Sramika Rythu Congress Party', 'YSRCP')
      .replace('Telugu Desam', 'TDP')
      .replace('Indian National Congress', 'INC');
    rows.push({ name: m[2].trim(), constituency: normalizeConstituency(m[3]), party });
  }
  const map = new Map();
  for (const r of rows) {
    if (!map.has(r.constituency)) map.set(r.constituency, r);
  }
  return map;
}

const results2024 = JSON.parse(fs.readFileSync(results2024Path, 'utf-8'));
const districtMap = JSON.parse(fs.readFileSync(districtMapPath, 'utf-8'));
const map2019 = await parseMyneta2019();

const history = [];

for (const r of results2024) {
  const key = normalizeConstituency(r.constituency);
  const districtName = districtMap[key] || districtMap[r.constituency];
  if (!districtName) {
    console.warn(`No district for ${key}`);
    continue;
  }

  history.push({
    districtName,
    constituency: key,
    constituencyLabel: r.constituencyDisplay || key,
    mlaName: r.mlaName,
    party: r.party,
    termPeriod: '2024–2029',
    majorityMargin: r.majorityMargin || 'Not available',
    termRank: 1
  });

  const prev = map2019.get(key);
  if (prev) {
    history.push({
      districtName,
      constituency: key,
      constituencyLabel: r.constituencyDisplay || key,
      mlaName: prev.name,
      party: prev.party,
      termPeriod: '2019–2024',
      majorityMargin: 'Not available',
      termRank: 2
    });
  }
}

history.sort((a, b) => {
  const d = a.districtName.localeCompare(b.districtName);
  if (d !== 0) return d;
  const c = a.constituency.localeCompare(b.constituency);
  if (c !== 0) return c;
  return a.termRank - b.termRank;
});

fs.writeFileSync(outPath, JSON.stringify(history, null, 2));
const unique = new Set(history.map((h) => h.constituency));
console.log(`Wrote ${history.length} records for ${unique.size} constituencies → ${outPath}`);
