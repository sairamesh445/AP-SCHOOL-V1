/**
 * Scrape Collector & SP from district ap.gov.in "Who's Who" pages.
 * Output: data/ap-district-officials-scraped.json
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, '../data/ap-district-officials-scraped.json');

const DISTRICTS = [
  { name: 'Srikakulam', urls: ['https://srikakulam.ap.gov.in/about-district/whos-who/', 'https://srikakulam.ap.gov.in/en/about-district/whos-who/'] },
  { name: 'Vizianagaram', urls: ['https://vizianagaram.ap.gov.in/about-district/whos-who/'] },
  { name: 'Parvathipuram Manyam', urls: ['https://parvathipurammanyam.ap.gov.in/about-district/whos-who/'] },
  { name: 'Visakhapatnam', urls: ['https://visakhapatnam.ap.gov.in/about-district/whos-who/'] },
  { name: 'Anakapalli', urls: ['https://anakapalli.ap.gov.in/about-district/whos-who/'] },
  { name: 'Alluri Sitharama Raju', urls: ['https://allurisitharamaraju.ap.gov.in/about-district/whos-who/'] },
  { name: 'Kakinada', urls: ['https://kakinada.ap.gov.in/about-district/whos-who/'] },
  { name: 'Dr. B. R. Ambedkar Konaseema', urls: ['https://konaseema.ap.gov.in/about-district/whos-who/'] },
  { name: 'East Godavari', urls: ['https://eastgodavari.ap.gov.in/about-district/whos-who/'] },
  { name: 'West Godavari', urls: ['https://westgodavari.ap.gov.in/about-district/whos-who/'] },
  { name: 'Eluru', urls: ['https://eluru.ap.gov.in/about-district/whos-who/'] },
  { name: 'NTR', urls: ['https://ntr.ap.gov.in/about-district/whos-who/'] },
  { name: 'Guntur', urls: ['https://guntur.ap.gov.in/about-district/whos-who/'] },
  { name: 'Palnadu', urls: ['https://palnadu.ap.gov.in/about-district/whos-who/'] },
  { name: 'Bapatla', urls: ['https://bapatla.ap.gov.in/about-district/whos-who/'] },
  { name: 'Prakasam', urls: ['https://prakasam.ap.gov.in/about-district/whos-who/'] },
  { name: 'Sri Potti Sriramulu Nellore', urls: ['https://nellore.ap.gov.in/about-district/whos-who/', 'https://spsnellore.ap.gov.in/about-district/whos-who/'] },
  { name: 'Sri Balaji (Tirupati)', urls: ['https://tirupati.ap.gov.in/about-district/whos-who/'] },
  { name: 'Chittoor', urls: ['https://chittoor.ap.gov.in/about-district/whos-who/'] },
  { name: 'Annamayya', urls: ['https://annamayya.ap.gov.in/about-district/whos-who/'] },
  { name: 'YSR Kadapa', urls: ['https://kadapa.ap.gov.in/about-district/whos-who/', 'https://ysr.ap.gov.in/about-district/whos-who/'] },
  { name: 'Anantapur', urls: ['https://anantapur.ap.gov.in/about-district/whos-who/'] },
  { name: 'Sri Sathya Sai', urls: ['https://srisathyasai.ap.gov.in/about-district/whos-who/', 'https://satyasai.ap.gov.in/about-district/whos-who/'] },
  { name: 'Kurnool', urls: ['https://kurnool.ap.gov.in/about-district/whos-who/'] },
  { name: 'Nandyal', urls: ['https://nandyal.ap.gov.in/about-district/whos-who/'] }
];

function decodeHtml(s) {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&#\d+;/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractFromHtml(html, districtName) {
  const text = html.replace(/\s+/g, ' ');
  const result = { name: districtName, collectorName: '', spName: '', collectorEmail: '', collectorPhone: '', spEmail: '', spPhone: '' };

  // Table rows: Name | Designation | Email | Phone
  const collectorRe = /Collector[^<]*(?:and\s+District\s+Magistrate)?[^<]*<\/td>\s*<td[^>]*>([^<]+(?:<[^>]+>[^<]*)*?)<\/td>/i;
  const rows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];

  for (const row of rows) {
    const cells = [...row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((c) => decodeHtml(c[1]));
    if (cells.length < 3) continue;
    const joined = cells.join(' ').toLowerCase();
    const name = cells.find((c) => /,?\s*I\.?A\.?S\.?/i.test(c)) || cells[1] || cells[0];
    const email = cells.find((c) => /@|ap\.gov\.in|\[at\]/i.test(c)) || '';
    const phone = cells.find((c) => /^[\d\s+\-(),]{8,}$/.test(c.replace(/\s/g, ''))) || '';

    if (/collector.*magistrate|district collector/i.test(joined) && /i\.?a\.?s/i.test(name)) {
      result.collectorName = name.replace(/\s+/g, ' ').trim();
      if (email) result.collectorEmail = email.replace(/\[at\]/gi, '@').replace(/\[dot\]/gi, '.');
      if (phone) result.collectorPhone = phone;
    }
    if (/superintendent of police|^\s*sp\s/i.test(joined) && /i\.?p\.?s/i.test(cells.join(' '))) {
      const spName = cells.find((c) => /,?\s*I\.?P\.?S\.?/i.test(c)) || cells[1];
      result.spName = (spName || '').replace(/\s+/g, ' ').trim();
      if (email) result.spEmail = email.replace(/\[at\]/gi, '@').replace(/\[dot\]/gi, '.');
      if (phone) result.spPhone = phone;
    }
  }

  // Fallback: regex on plain text blocks
  if (!result.collectorName) {
    const m = text.match(/([A-Z][a-z.]+(?:\s+[A-Z][a-z.]+){1,4}),?\s*I\.?\s*A\.?\s*S\.?[^<]{0,80}Collector/i);
    if (m) result.collectorName = m[1].trim() + ', IAS';
  }
  if (!result.spName) {
    const m = text.match(/([A-Z][a-z.]+(?:\s+[A-Z][a-z.]+){1,4}),?\s*I\.?\s*P\.?\s*S\.?[^<]{0,80}Superintendent/i);
    if (m) result.spName = m[1].trim() + ', IPS';
  }

  const emailRe = /([a-z0-9._-]+)\[at\]ap\[dot\]gov\[dot\]in|([a-z0-9._-]+@ap\.gov\.in)/gi;
  const emails = [...text.matchAll(emailRe)].map((e) => (e[1] ? `${e[1]}@ap.gov.in` : e[2]));
  if (!result.collectorEmail && emails[0]) result.collectorEmail = emails[0];
  if (!result.spEmail && emails[1]) result.spEmail = emails[1];

  return result;
}

const results = [];
for (const d of DISTRICTS) {
  let html = '';
  for (const url of d.urls) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'APSchoolCivicBot/1.0' }, signal: AbortSignal.timeout(15000) });
      if (res.ok) {
        html = await res.text();
        if (html.length > 5000) break;
      }
    } catch {
      /* try next url */
    }
  }
  const row = html ? extractFromHtml(html, d.name) : { name: d.name, error: 'fetch failed' };
  results.push(row);
  console.log(d.name, row.collectorName || '-', row.spName || '-');
  await new Promise((r) => setTimeout(r, 400));
}

fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
console.log(`Wrote ${outPath}`);
