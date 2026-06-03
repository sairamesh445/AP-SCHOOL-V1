/**
 * Parse MyNeta AP 2024 winners into mlas-parsed.json (175 constituencies).
 * Source: https://myneta.info/AndhraPradesh2024/index.php?action=show_winners
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, '../data/mlas-parsed.json');

const html = await fetch(
  'https://myneta.info/AndhraPradesh2024/index.php?action=show_winners&sort=default'
).then((r) => r.text());

const rows = [];
const rowRe = /<td>(\d+)<\/td>\s*<td>.*?>([^<]+)<\/a>.*?<\/td>\s*<td>([^<]+)<\/td>\s*<td>([^<]+)<\/td>/gi;
let m;
while ((m = rowRe.exec(html)) !== null) {
  const party = m[4].trim()
    .replace('Janasena Party', 'JSP')
    .replace('Bharatiya Janata Party', 'BJP')
    .replace('Yuvajana Sramika Rythu Congress Party', 'YSRCP')
    .replace('Telugu Desam', 'TDP');
  rows.push({
    name: m[2].trim(),
    constituency: m[3].trim(),
    party
  });
}

const byConstituency = new Map();
for (const row of rows) {
  if (!byConstituency.has(row.constituency)) byConstituency.set(row.constituency, row);
}
const unique = [...byConstituency.values()].sort((a, b) =>
  a.constituency.localeCompare(b.constituency)
);

if (unique.length < 150) {
  console.error(`Only parsed ${unique.length} unique MLAs — check HTML format`);
  process.exit(1);
}
if (unique.length < 175) {
  console.warn(`Note: parsed ${unique.length}/175 MLAs from MyNeta (remaining may need manual entry).`);
}

fs.writeFileSync(outPath, JSON.stringify(unique, null, 2));
console.log(`Wrote ${unique.length} MLAs to ${outPath}`);
