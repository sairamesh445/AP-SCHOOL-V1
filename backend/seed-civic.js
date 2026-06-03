import { readDb, writeDb, generateId } from './db.js';
import {
  AP_DISTRICTS,
  districtsOfficial,
  policeAuthoritiesOfficial,
  assemblyTopicsOfficial,
  mlaHistoryOfficial
} from './data/ap-official-data.js';
import {
  grievanceTopicsOfficial,
  whatsappServicesOfficial
} from './data/ap-civic-services-data.js';

const parliamentTopicsSeed = [
  {
    title: 'What is Lok Sabha?',
    icon: '🏛️',
    summary: 'The House of the People — lower house of Parliament.',
    content: `Lok Sabha (House of the People) is the lower house of India's Parliament. Members are called MPs (Members of Parliament).

• Maximum strength: 552 members (530 from states, 20 from UTs, up to 2 Anglo-Indian nominees).
• Andhra Pradesh sends 25 MPs to Lok Sabha.
• Lok Sabha makes laws on national subjects like defence, railways, currency, and foreign policy.
• The party or alliance with a majority in Lok Sabha usually forms the Union Government at the Centre.`
  },
  {
    title: 'How are Lok Sabha members elected?',
    icon: '🗳️',
    summary: 'Direct election by voters in each parliamentary constituency.',
    content: `Lok Sabha MPs are elected through direct elections:

1. India is divided into parliamentary constituencies (Andhra Pradesh has 25 Lok Sabha seats).
2. Voters cast ONE vote for a candidate in their constituency.
3. The candidate with the highest votes (First Past the Post system) wins that seat.
4. Elections are held every 5 years, or earlier if the house is dissolved.
5. Universal adult franchise: citizens aged 18+ can vote.

Example: If Constituency X has 8 lakh voters, the candidate with the most votes becomes MP — even if they did not get 50% of all votes.`
  },
  {
    title: 'What is Rajya Sabha?',
    icon: '📜',
    summary: 'The Council of States — upper house of Parliament.',
    content: `Rajya Sabha (Council of States) is the upper house of Parliament. Members are called RS MPs.

• Maximum strength: 250 (238 elected + 12 nominated by President for arts, science, literature).
• Andhra Pradesh has 11 Rajya Sabha seats.
• Rajya Sabha represents states; it cannot be dissolved.
• It reviews laws passed by Lok Sabha and protects state interests.
• One-third of Rajya Sabha members retire every 2 years (6-year term each).`
  },
  {
    title: 'How are Rajya Sabha members elected?',
    icon: '⚖️',
    summary: 'Elected by MLAs of state legislatures — not by direct public vote.',
    content: `Rajya Sabha MPs are NOT elected directly by citizens:

1. Members are elected by the elected MLAs of State Legislative Assemblies (and UTs with legislatures).
2. Voting uses the Single Transferable Vote (STV) system with proportional representation.
3. Each state gets seats based on population — larger states send more members.
4. The President nominates 12 members with special knowledge in literature, science, art, and social service.

For students: When you vote in Assembly elections, your MLA later participates in choosing Rajya Sabha MPs from your state.`
  },
  {
    title: 'What is a ruling party? How many seats are needed?',
    icon: '👑',
    summary: 'Majority in Lok Sabha (272+ out of 543 elected seats) to form government.',
    content: `Ruling Party / Government at Centre:

• After Lok Sabha elections, the President invites the leader who can prove a majority to become Prime Minister.
• Majority means more than half of the effective strength of Lok Sabha.
• Out of 543 elected seats, the majority mark is 272 seats (half of 543 is 271.5, so 272 is needed).
• The ruling party (or alliance) with 272+ seats runs the Union Government.

State level (Andhra Pradesh Assembly): 175 seats → majority mark is 88 seats to form the state government.`
  },
  {
    title: 'What if no party gets a majority?',
    icon: '🤝',
    summary: 'Hung Parliament — parties form alliances or coalitions.',
    content: `If no single party wins 272 Lok Sabha seats, it is called a Hung Parliament:

1. Parties negotiate to form a coalition government.
2. Smaller parties may support a larger party in return for ministries and policies.
3. A Confidence Vote in Lok Sabha proves the government has majority support.
4. If the government loses a no-confidence vote, it must resign and new elections may be held.

Alliance (Mahagathbandhan / NDA style):
• Pre-poll alliance: Parties agree before elections to share seats and campaign together.
• Post-poll alliance: Parties join after results to cross the 272-seat mark together.
• Example: NDA, UPA, or state-level alliances like TDP+JSP+BJP in AP.`
  }
];

const districtMap = new Map(districtsOfficial.map((d) => [d.name, d]));

function seed() {
  const db = readDb();
  const ts = new Date().toISOString();

  if (!db.districts?.length) {
    db.districts = AP_DISTRICTS.map((name, i) => {
      const official = districtMap.get(name) || {};
      return {
        id: generateId(),
        state: 'Andhra Pradesh',
        name,
        imageUrl: '',
        famousFor: '',
        mandalsCount: null,
        collectorName: official.collectorName || 'See district portal (ap.gov.in)',
        spName: official.spName || 'See district police portal',
        order: i + 1,
        active: true,
        createdAt: ts
      };
    });
    console.log(`Seeded ${db.districts.length} districts`);
  }

  if (!db.policeAuthorities?.length) {
    db.policeAuthorities = policeAuthoritiesOfficial.map((p, i) => ({
      id: generateId(),
      ...p,
      active: true,
      createdAt: ts
    }));
    console.log('Seeded police authorities');
  }

  if (!db.parliamentTopics?.length) {
    db.parliamentTopics = parliamentTopicsSeed.map((t, i) => ({
      id: generateId(),
      ...t,
      order: i + 1,
      active: true,
      createdAt: ts
    }));
    console.log('Seeded parliament topics');
  }

  if (!db.assemblyTopics?.length) {
    db.assemblyTopics = assemblyTopicsOfficial.map((t, i) => ({
      id: generateId(),
      ...t,
      order: i + 1,
      active: true,
      createdAt: ts
    }));
    console.log('Seeded assembly topics');
  }

  if (!db.grievanceTopics?.length) {
    db.grievanceTopics = grievanceTopicsOfficial.map((t, i) => ({
      id: generateId(),
      ...t,
      order: i + 1,
      active: true,
      createdAt: ts
    }));
    console.log('Seeded grievance topics');
  }

  if (!db.whatsappServices?.length) {
    db.whatsappServices = whatsappServicesOfficial.map((t, i) => ({
      id: generateId(),
      ...t,
      order: i + 1,
      active: true,
      createdAt: ts
    }));
    console.log('Seeded WhatsApp governance guides');
  }

  if (!db.districtMlaHistory?.length) {
    db.districtMlaHistory = mlaHistoryOfficial.map((r, i) => ({
      id: generateId(),
      ...r,
      order: i + 1,
      active: true,
      createdAt: ts
    }));
    console.log('Seeded MLA history');
  }

  writeDb(db);
  console.log('Civic seed complete.');
}

seed();
