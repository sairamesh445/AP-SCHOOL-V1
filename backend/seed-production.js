/**
 * Full production data pipeline (idempotent).
 * Run on Render startup so live site matches local feature set.
 */
import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRODUCTION_DATA_SOURCE = path.join(__dirname, 'data', 'production-data.json');
const DATABASE_PATH = path.join(__dirname, 'data', 'database.json');

const STEPS = [
  'seed.js',
  'seed-home-content.js',
  'seed-civic.js',
  'seed-governance.js',
  'seed-court.js',
  'seed-court-layout.js',
  'seed-assembly-layout.js',
  'seed-quiz-extended.js'
];

console.log('=== AP School production seed pipeline ===');

if (fs.existsSync(PRODUCTION_DATA_SOURCE)) {
  console.log(`Using production data template: ${PRODUCTION_DATA_SOURCE}`);
  fs.copyFileSync(PRODUCTION_DATA_SOURCE, DATABASE_PATH);
} else {
  console.log('No production data template found; using default seed pipeline.');
}

for (const script of STEPS) {
  console.log(`\n>> node ${script}`);
  try {
    execSync(`node ${script}`, { cwd: __dirname, stdio: 'inherit' });
  } catch (err) {
    console.error(`Warning: ${script} exited with error (continuing):`, err.message);
  }
}

console.log('\n=== Production seed pipeline complete ===');
