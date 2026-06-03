/**
 * Fill 2019 term majority margins from Wikipedia (keeps 2024 Oneindia margins).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inPath = path.join(__dirname, '../data/ap-mla-history.json');
const outPath = inPath;

const BAD_MARGIN = /^(Not available|Margin: run npm|See ECI records)/i;

function wikiTitle(constituency) {
  let name = constituency
    .replace(/VIJAYWADA/gi, 'VIJAYAWADA')
    .replace(/RAJAHMUNDRY/gi, 'RAJAMAHENDRAVARAM')
    .trim();
  const base = name
    .replace(/\s*\(SC\)\s*/gi, ' (SC)')
    .replace(/\s*\(ST\)\s*/gi, ' (ST)')
    .split(/\s+/)
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join('_')
    .replace(/\(sc\)/gi, '(SC)')
    .replace(/\(st\)/gi, '(ST)');
  return `${base}_Assembly_constituency`;
}

function parseElectionBox(wikitext, year) {
  const sectionRe = new RegExp(
    `={2,4}\\s*${year}\\s*={2,4}[\\s\\S]*?\\{\\{Election box end\\}\\}`,
    'i'
  );
  const titleRe = new RegExp(
    `\\{\\{Election box begin[^\\n]*${year}[\\s\\S]*?\\{\\{Election box end\\}\\}`,
    'i'
  );
  const block = wikitext.match(sectionRe)?.[0] || wikitext.match(titleRe)?.[0];
  if (!block) return null;

  const majority = block.match(
    /\{\{Election box majority\|\|votes\s*=\s*([\d,]+)\|percentage\s*=\s*([\d.]+)/i
  );
  if (!majority) return null;

  const marginVotes = majority[1].replace(/,/g, '');
  const marginPct = majority[2];
  return `${Number(marginVotes).toLocaleString('en-IN')} votes (${marginPct}%)`;
}

async function fetchWikiPage(title) {
  const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(title)}&prop=wikitext&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'APSchoolCivic/1.0 (education)' } });
  if (!res.ok) return null;
  const data = await res.json();
  if (data.error) return null;
  return data.parse?.wikitext?.['*'] || null;
}

async function searchWikiTitle(constituency) {
  const label = constituency
    .replace(/VIJAYWADA/gi, 'VIJAYAWADA')
    .split(/\s+/)
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ');
  const q = `${label} assembly constituency Andhra Pradesh`;
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&srlimit=5&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'APSchoolCivic/1.0 (education)' } });
  if (!res.ok) return null;
  const data = await res.json();
  const hit = (data.query?.search || []).find(
    (s) => /assembly constituency/i.test(s.title) && !/lok sabha/i.test(s.title)
  );
  return hit?.title || null;
}

async function fetchWiki(constituency) {
  const primary = wikiTitle(constituency).replace(/_/g, ' ');
  let wikitext = await fetchWikiPage(primary);
  if (wikitext) return wikitext;
  await new Promise((r) => setTimeout(r, 1200));
  const alt = await searchWikiTitle(constituency);
  if (!alt) return null;
  await new Promise((r) => setTimeout(r, 1200));
  return fetchWikiPage(alt);
}

async function main() {
  const existing = JSON.parse(fs.readFileSync(inPath, 'utf-8'));
  const need2019 = [
    ...new Set(
      existing
        .filter((r) => r.termRank === 2 && BAD_MARGIN.test(r.majorityMargin || ''))
        .map((r) => r.constituency)
    )
  ];

  console.log(`Enriching 2019 margins for ${need2019.length} constituencies…`);

  const wiki2019 = new Map();
  let ok = 0;

  for (let i = 0; i < need2019.length; i++) {
    const constituency = need2019[i];
    process.stdout.write(`\r${i + 1}/${need2019.length} ${constituency.slice(0, 32).padEnd(32)}`);

    const wikitext = await fetchWiki(constituency);
    if (wikitext) {
      const margin = parseElectionBox(wikitext, 2019);
      if (margin) {
        wiki2019.set(constituency, margin);
        ok++;
      }
    }
    await new Promise((r) => setTimeout(r, 2200));
  }

  const updated = existing.map((record) => {
    if (record.termRank === 2 && BAD_MARGIN.test(record.majorityMargin || '')) {
      const margin = wiki2019.get(record.constituency);
      if (margin) return { ...record, majorityMargin: margin };
    }
    return record;
  });

  fs.writeFileSync(outPath, JSON.stringify(updated, null, 2));
  console.log(`\n2019 margins from Wikipedia: ${ok}/${need2019.length}. Saved ${updated.length} records.`);
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isMain) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
