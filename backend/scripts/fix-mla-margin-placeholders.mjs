/**
 * Replace broken majorityMargin placeholder text in ap-mla-history.json
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), '../data/ap-mla-history.json');
const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
const bad = /^(Margin: run npm|See ECI records)/i;
let n = 0;
for (const r of data) {
  if (bad.test(r.majorityMargin || '')) {
    r.majorityMargin = 'Not available';
    n++;
  }
}
fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log(`Cleaned ${n} placeholder margins → ${file}`);
