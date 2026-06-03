import { readDb, writeDb, generateId } from './db.js';
import { courtAuthoritiesOfficial } from './data/ap-official-data.js';

const courtPositions = [
  {
    slot: 'chief_justice',
    title: 'Chief Justice',
    designation: 'Hon\'ble The Chief Justice',
    personName: 'Smt. Justice Lisa Gill',
    responsibilities: 'Head of the Andhra Pradesh High Court. Administers justice, constitutes benches, and leads judicial administration of the state.',
    order: 1
  },
  {
    slot: 'registrar',
    title: 'Registrar General',
    designation: 'Court Administration',
    personName: 'Registrar General, AP High Court',
    responsibilities: 'Chief administrative officer of the High Court. Manages registry, listing of cases, and court establishment.',
    order: 2
  },
  {
    slot: 'division_left',
    title: 'Division Bench (Left)',
    designation: 'Two-Judge Bench',
    personName: 'Hon\'ble Division Bench',
    responsibilities: 'Hears appeals and writ petitions assigned by the Chief Justice. Typically consists of two puisne judges.',
    order: 3
  },
  {
    slot: 'division_right',
    title: 'Division Bench (Right)',
    designation: 'Two-Judge Bench',
    personName: 'Hon\'ble Division Bench',
    responsibilities: 'Parallel division bench hearing matters as per roster fixed by the Chief Justice.',
    order: 4
  },
  {
    slot: 'single_left',
    title: 'Single Judge Bench (Left Wing)',
    designation: 'Sitting Judge',
    personName: 'Hon\'ble Sitting Judge',
    responsibilities: 'Hears original and appellate matters assigned individually as per the cause list.',
    order: 5
  },
  {
    slot: 'single_right',
    title: 'Single Judge Bench (Right Wing)',
    designation: 'Sitting Judge',
    personName: 'Hon\'ble Sitting Judge',
    responsibilities: 'Hears cases posted before the judge as per weekly roster of the High Court.',
    order: 6
  },
  {
    slot: 'bar',
    title: 'Advocates / Bar',
    designation: 'Court Hall — Facing Bench',
    personName: 'Advocates of High Court',
    responsibilities: 'Advocates present arguments before the bench from the bar. Senior advocates lead important constitutional matters.',
    order: 7
  }
];

const courtAuthorities = courtAuthoritiesOfficial;

const db = readDb();

if (!db.courtPositions?.length) {
  db.courtPositions = courtPositions.map((p) => ({
    id: generateId(),
    ...p,
    personPhoto: '',
    active: true,
    createdAt: new Date().toISOString()
  }));
  console.log(`Seeded ${db.courtPositions.length} court positions`);
}

if (!db.courtAuthorities?.length) {
  db.courtAuthorities = courtAuthorities.map((a) => ({
    id: generateId(),
    ...a,
    photoUrl: '',
    active: true,
    createdAt: new Date().toISOString()
  }));
  console.log(`Seeded ${db.courtAuthorities.length} court authorities`);
}

writeDb(db);
console.log('Court data ready.');
