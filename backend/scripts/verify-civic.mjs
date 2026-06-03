import { migrateCivicData } from '../routes/civic.js';

const base = 'http://localhost:5000/api';

const loginRes = await fetch(`${base}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin123' })
});
const login = await loginRes.json();
if (!login.token) {
  console.error('Login failed:', login);
  process.exit(1);
}

const headers = { Authorization: `Bearer ${login.token}` };
const overviewRes = await fetch(`${base}/civic/overview`, { headers });
const overview = await overviewRes.json();

console.log('Migration ran:', migrateCivicData());
console.log('Civic overview OK:', overviewRes.ok);
console.log('  Districts:', overview.districtCount);
console.log('  MLA history:', overview.mlaHistory?.length ?? 0);
console.log('  Parliament:', overview.parliamentTopics?.length ?? 0);
console.log('  Police:', overview.policeAuthorities?.length ?? 0);
console.log('  OSDs:', overview.ministerOsds?.length ?? 0);
console.log('  IAS:', overview.districtIas?.length ?? 0);
