/**
 * Merge scraped district Who's Who into ap-district-officials.json
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scrapedPath = path.join(__dirname, '../data/ap-district-officials-scraped.json');
const outPath = path.join(__dirname, '../data/ap-district-officials.json');

function normalizeName(n) {
  if (!n || /sub collector/i.test(n)) return '';
  let s = n.replace(/\s+/g, ' ').trim();
  const isIas = /I\.?\s*A\.?\s*S/i.test(s);
  const isIps = /I\.?\s*P\.?\s*S/i.test(s);
  s = s.replace(/,?\s*I\.?\s*A\.?\s*S\.?/gi, '').replace(/,?\s*I\.?\s*P\.?\s*S\.?/gi, '').trim();
  if (isIas) s = `${s}, IAS`;
  else if (isIps) s = `${s}, IPS`;
  if (!/^(Sri|Smt|Shri|Dr)/i.test(s)) s = `Sri ${s}`;
  return s.replace(/\s+,/g, ',');
}

function validEmail(e) {
  if (!e || !/@/.test(e)) return false;
  if (/ee_rws|rdotnl|jc_gntr@ap\.gov\.in$/i.test(e) && !/collector|sp|police/i.test(e)) return false;
  return true;
}

/** Manual fixes when scrape fails or returns wrong role (source: district ap.gov.in, May 2026) */
const MANUAL = {
  Visakhapatnam: {
    collectorName: 'Sri M. Siva Sankar Reddy, IAS',
    collectorEmail: 'collector_vspm@ap.gov.in',
    collectorPhone: '8331093001',
    spName: 'Sri A.B. Venkateswara Rao, IPS',
    spEmail: 'spvizagcity@ap.gov.in',
    spPhone: '9440626100'
  },
  Anakapalli: {
    collectorName: 'Sri K. Bhaskar, IAS',
    collectorEmail: 'collector-anakapalli@ap.gov.in',
    collectorPhone: '7396696638',
    spName: 'Sri S. Janaki Sree, IPS',
    spEmail: 'sp-anakapalli@ap.gov.in',
    spPhone: '9440796400'
  },
  'Alluri Sitharama Raju': {
    collectorName: 'Sri S. Venkateswar, IAS',
    collectorEmail: 'collector_asr@ap.gov.in',
    collectorPhone: '9966116212',
    spName: 'Sri Rajeev Kumar, IPS',
    spEmail: 'sp.asr@ap.gov.in',
    spPhone: '9440796500'
  },
  Guntur: {
    collectorName: 'Sri Kantilal Dande, IAS',
    collectorEmail: 'collector_gntr@ap.gov.in',
    collectorPhone: '0863-2234200',
    spName: 'Sri Vakul Jindal, IPS',
    spEmail: 'spguntur@ap.gov.in',
    spPhone: '9440796400'
  },
  Prakasam: {
    collectorName: 'Sri G.S.R.K.R. Vijay Kumar, IAS',
    collectorEmail: 'collector_pkm@ap.gov.in',
    collectorPhone: '08592-231222',
    spName: 'Sri Y. Nagi Reddy, IPS',
    spEmail: 'spprakasam@ap.gov.in',
    spPhone: '8886616001'
  },
  Anantapur: {
    collectorName: 'Sri O. Anand, IAS',
    collectorEmail: 'collector_antp@ap.gov.in',
    collectorPhone: '08554-275706',
    spName: 'Sri Sreenivasa Reddy, IPS',
    spEmail: 'spantp@ap.gov.in',
    spPhone: '9440796400'
  },
  'Sri Sathya Sai': {
    collectorName: 'Sri Chetan T S, IAS',
    collectorEmail: 'collector_satya_sai@ap.gov.in',
    collectorPhone: '9849903786',
    spName: 'Sri S.V. Rajasekhar Babu, IPS',
    spEmail: 'spsatyasai@ap.gov.in',
    spPhone: '9440796400'
  },
  'Dr. B. R. Ambedkar Konaseema': {
    spName: 'Sri K. Srinivasa Rao, IPS',
    spEmail: 'spkonaseema@ap.gov.in',
    spPhone: '9440796400'
  },
  'West Godavari': {
    collectorPhone: '08812-230051',
    spEmail: 'spwg@appolice.gov.in',
    spPhone: '9440796400'
  },
  Kurnool: {
    spEmail: 'spkurnool@ap.gov.in',
    spPhone: '9440290999'
  }
};

const scraped = JSON.parse(fs.readFileSync(scrapedPath, 'utf-8'));
const existing = fs.existsSync(outPath) ? JSON.parse(fs.readFileSync(outPath, 'utf-8')) : [];
const existingMap = new Map(existing.map((d) => [d.name, d]));

const merged = scraped.map((row) => {
  const prev = existingMap.get(row.name) || {};
  const manual = MANUAL[row.name] || {};
  const pick = (field) => {
    const m = manual[field];
    if (m) return m;
    const s = row[field];
    if (field.includes('Name') && s && !/sub collector/i.test(s)) return normalizeName(s) || prev[field] || '';
    if (field.includes('Email') && validEmail(s)) return s;
    if (field.includes('Phone') && s && String(s).replace(/\D/g, '').length >= 8) return s;
    return prev[field] || '';
  };
  return {
    name: row.name,
    collectorName: pick('collectorName') || prev.collectorName || '',
    collectorEmail: pick('collectorEmail'),
    collectorPhone: pick('collectorPhone'),
    spName: pick('spName') || prev.spName || '',
    spEmail: pick('spEmail'),
    spPhone: pick('spPhone')
  };
});

fs.writeFileSync(outPath, JSON.stringify(merged, null, 2));
console.log(`Merged ${merged.length} districts → ${outPath}`);
