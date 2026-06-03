import { readDb } from '../db.js';

const base = 'http://localhost:5000/api';
const login = await (await fetch(`${base}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin123' })
})).json();

const headers = {
  Authorization: `Bearer ${login.token}`,
  'Content-Type': 'application/json'
};

const testName = `Test District ${Date.now()}`;
const created = await (await fetch(`${base}/civic/admin/districts`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    name: testName,
    collectorName: 'Test Collector',
    spName: 'Test SP'
  })
})).json();

const db = readDb();
const inDistricts = db.districts?.some((d) => d.id === created.id);
const inWrongKey = db['districts'] === undefined; // districts key is correct

await fetch(`${base}/civic/admin/districts/${created.id}`, { method: 'DELETE', headers });

console.log('Admin write goes to db.districts:', inDistricts ? 'YES' : 'NO');
console.log('Cleanup deleted test record');
