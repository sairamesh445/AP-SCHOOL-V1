/**
 * Full production data pipeline (idempotent).
 * Run on Render startup so live site matches local feature set.
 */
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

for (const script of STEPS) {
  console.log(`\n>> node ${script}`);
  try {
    execSync(`node ${script}`, { cwd: __dirname, stdio: 'inherit' });
  } catch (err) {
    console.error(`Warning: ${script} exited with error (continuing):`, err.message);
  }
}

console.log('\n=== Production seed pipeline complete ===');
