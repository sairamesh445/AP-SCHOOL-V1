import { readDb, writeDb, generateId } from './db.js';

const EMBLEM =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Emblem_of_Andhra_Pradesh.svg/200px-Emblem_of_Andhra_Pradesh.svg.png';
const COURT_IMG =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/200px-Emblem_of_India.svg.png';
const GALLERY = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=220&h=220&fit=crop';

const courtPositions = [
  {
    slot: 'chief_justice',
    title: 'Chief Justice / Judge',
    designation: 'Judge\'s Bench — High Court of AP',
    personName: 'Smt. Justice Lisa Gill',
    personPhoto: COURT_IMG,
    responsibilities:
      'The Chief Justice (or presiding judge) sits on the elevated bench at the top. They hear cases, interpret law, deliver judgments, and maintain discipline in court. Students should know: the judge is impartial and does not take sides.',
    x: 50,
    y: 11,
    width: 11,
    order: 1
  },
  {
    slot: 'judges_entry',
    title: 'Judges\' Entry',
    designation: 'Door — Left of Bench',
    personName: 'Judicial Officers',
    personPhoto: EMBLEM,
    responsibilities:
      'Judges enter the courtroom through this door before hearings begin. It keeps the court process formal and separates judicial officers from the public gallery.',
    x: 22,
    y: 14,
    width: 9,
    order: 2
  },
  {
    slot: 'court_officers_entry',
    title: 'Court Officers\' Entry',
    designation: 'Door — Right of Bench',
    personName: 'Court Staff',
    personPhoto: EMBLEM,
    responsibilities:
      'Court masters, stenographers, and administrative staff use this entry. They support the judge by managing case files, calling matters, and recording proceedings.',
    x: 78,
    y: 14,
    width: 9,
    order: 3
  },
  {
    slot: 'senior_counsel',
    title: 'Senior Advocates',
    designation: 'Counsel Table — Centre',
    personName: 'Senior Counsel / Advocates',
    personPhoto: COURT_IMG,
    responsibilities:
      'Senior advocates sit at the central table facing the judge. They present legal arguments, cite precedents, and examine witnesses on behalf of their clients in important cases.',
    x: 50,
    y: 26,
    width: 11,
    order: 4
  },
  {
    slot: 'accused',
    title: 'Accused',
    designation: 'Accused Box — Left',
    personName: 'Accused / Respondent',
    personPhoto: EMBLEM,
    responsibilities:
      'A person accused in a criminal case or respondent in certain matters stands or sits here. They have the right to a fair trial and a lawyer to defend them. The court protects their legal rights.',
    x: 33,
    y: 36,
    width: 10,
    order: 5
  },
  {
    slot: 'victim',
    title: 'Victim',
    designation: 'Victim Box — Right',
    personName: 'Victim / Complainant',
    personPhoto: EMBLEM,
    responsibilities:
      'Victims or complainants may be seated here in criminal cases. The court ensures their safety and dignity while the State prosecutes the accused. Victim rights are an important part of justice.',
    x: 67,
    y: 36,
    width: 10,
    order: 6
  },
  {
    slot: 'court_officers_left',
    title: 'Court Officers (Left)',
    designation: 'Left Wing — Stenographers & Staff',
    personName: 'Court Master / Stenographer',
    personPhoto: EMBLEM,
    responsibilities:
      'Court officers on the left record proceedings, manage exhibits, and assist the judge. Accurate records help appeals and ensure transparency in how justice is delivered.',
    x: 14,
    y: 48,
    width: 10,
    order: 7
  },
  {
    slot: 'court_officers_right',
    title: 'Court Officers (Right)',
    designation: 'Right Wing — Registry Staff',
    personName: 'Registry & Court Staff',
    personPhoto: EMBLEM,
    responsibilities:
      'Staff on the right wing support filing of petitions, scheduling of cases, and communication between the bench and advocates. The registry keeps the High Court functioning smoothly.',
    x: 86,
    y: 48,
    width: 10,
    order: 8
  },
  {
    slot: 'govt_advocates',
    title: 'Government Advocates',
    designation: 'Advocates\' Desks — Left',
    personName: 'Advocate General / Govt Pleader',
    personPhoto: COURT_IMG,
    responsibilities:
      'Government advocates represent the State of Andhra Pradesh. They defend government actions, prosecute in criminal appeals, and advise departments on legal matters before the High Court.',
    x: 36,
    y: 58,
    width: 10,
    order: 9
  },
  {
    slot: 'defense_advocates',
    title: 'Defense Advocates',
    designation: 'Advocates\' Desks — Right',
    personName: 'Defense Counsel / Private Advocates',
    personPhoto: COURT_IMG,
    responsibilities:
      'Private advocates defend citizens, companies, or the accused. Everyone has the right to legal representation. These desks are where lawyers prepare arguments and question witnesses.',
    x: 64,
    y: 58,
    width: 10,
    order: 10
  },
  {
    slot: 'registrar',
    title: 'Registrar',
    designation: 'Central Court Administration',
    personName: 'Registrar, High Court of AP',
    personPhoto: EMBLEM,
    responsibilities:
      'The Registrar administers the High Court under the Chief Justice — managing case flow, judicial roster, and administrative rules. Students can think of this role as the chief administrator of the court system.',
    x: 50,
    y: 42,
    width: 10,
    order: 11
  },
  {
    slot: 'public_gallery',
    title: 'Public Gallery',
    designation: 'Observers — Front of Courtroom',
    personName: 'Citizens & Students',
    personPhoto: GALLERY,
    responsibilities:
      'The public gallery is where citizens, journalists, and students may watch court proceedings. Open courts teach us that justice should be transparent and accountable to the people of Andhra Pradesh.',
    x: 50,
    y: 88,
    width: 14,
    order: 12
  }
];

const db = readDb();
db.courtPositions = courtPositions.map((p) => ({
  id: generateId(),
  ...p,
  active: true,
  createdAt: new Date().toISOString()
}));
db.courtLayoutVersion = 3;
writeDb(db);
console.log(`Court layout updated (${db.courtPositions.length} AP High Court hotspots).`);
