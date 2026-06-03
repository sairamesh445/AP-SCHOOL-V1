import { readDb, writeDb, generateId } from './db.js';

/** Wikimedia Commons portraits (educational use) */
const PHOTOS = {
  speaker: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Emblem_of_Andhra_Pradesh.svg/200px-Emblem_of_Andhra_Pradesh.svg.png',
  cm: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Chandrababu_Naidu_%28cropped%29.jpg/220px-Chandrababu_Naidu_%28cropped%29.jpg',
  deputy: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Pawan_Kalyan_at_Intinta_Annadambaram_Event.jpg/220px-Pawan_Kalyan_at_Intinta_Annadambaram_Event.jpg',
  minister: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Nara_Lokesh.jpg/220px-Nara_Lokesh.jpg',
  opposition: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/YS_Jagan_Mohan_Reddy.jpg/220px-YS_Jagan_Mohan_Reddy.jpg',
  mla: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Emblem_of_Andhra_Pradesh.svg/200px-Emblem_of_Andhra_Pradesh.svg.png',
  gallery: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=220&h=220&fit=crop'
};

const assemblyLayout = [
  {
    slot: 'speaker',
    title: 'The Speaker',
    designation: 'Presiding Officer — Speaker\'s Dais',
    personName: 'Ayyannagari Ganesh',
    personPhoto: PHOTOS.speaker,
    responsibilities: 'The Speaker is like the referee of the Assembly. They sit on the high chair at the top, keep order during debates, decide who may speak, and make sure laws are passed fairly. Students should know: the Speaker does not vote on party lines — they serve all MLAs equally.',
    x: 50, y: 11, width: 11, order: 1
  },
  {
    slot: 'secretariat_left',
    title: 'Assembly Secretary (Left)',
    designation: 'Legislative Secretariat',
    personName: 'Secretariat Officials',
    personPhoto: PHOTOS.gallery,
    responsibilities: 'Officials beside the Speaker help record every word spoken, prepare bills and reports, and guide MLAs on Assembly rules. They support democracy by keeping accurate records of what government decides.',
    x: 41, y: 17, width: 9, order: 2
  },
  {
    slot: 'secretariat_right',
    title: 'Assembly Secretary (Right)',
    designation: 'Legislative Secretariat',
    personName: 'Table Officers',
    personPhoto: PHOTOS.gallery,
    responsibilities: 'These officers assist the Speaker with documents, timing of votes, and communication between the Assembly and the State government departments.',
    x: 59, y: 17, width: 9, order: 3
  },
  {
    slot: 'central_well',
    title: 'The Well (Centre Table)',
    designation: 'Ministers & Officers at the Table',
    personName: 'Council of Ministers (Table)',
    personPhoto: PHOTOS.minister,
    responsibilities: 'The large centre table in front of the Speaker is called "the well." Ministers and senior officials sit here when important bills are introduced. This is where major policy discussions happen before voting on the green and red benches.',
    x: 50, y: 30, width: 12, order: 4
  },
  {
    slot: 'treasury_cm',
    title: 'Chief Minister',
    designation: 'Treasury Benches — Green Side (Front Row)',
    personName: 'N. Chandrababu Naidu',
    personPhoto: PHOTOS.cm,
    responsibilities: 'The Chief Minister leads the State government. They sit on the Treasury side (green chairs, left in this diagram) in the front row nearest the centre aisle. The CM answers questions, presents the budget, and guides ministers to implement schemes for Andhra Pradesh.',
    x: 42, y: 45, width: 10, order: 5
  },
  {
    slot: 'treasury_deputy',
    title: 'Deputy Chief Minister',
    designation: 'Treasury — Front Row',
    personName: 'Konidela Pawan Kalyan',
    personPhoto: PHOTOS.deputy,
    responsibilities: 'The Deputy CM supports the Chief Minister and may head key departments. Sitting beside the CM on green benches shows they are part of the ruling government team responsible for day-to-day governance.',
    x: 34, y: 50, width: 10, order: 6
  },
  {
    slot: 'treasury_ministers',
    title: 'Cabinet Minister',
    designation: 'Treasury — Second Row',
    personName: 'Nara Lokesh',
    personPhoto: PHOTOS.minister,
    responsibilities: 'Cabinet Ministers head departments such as Education, Health, or IT. Example: Nara Lokesh oversees technology and governance reforms. Ministers on green benches propose laws and defend government policies in debates.',
    x: 26, y: 56, width: 10, order: 7
  },
  {
    slot: 'treasury_mlas',
    title: 'Ruling Party MLAs',
    designation: 'Treasury — Green Tiered Rows',
    personName: 'TDP & Alliance MLAs',
    personPhoto: PHOTOS.mla,
    responsibilities: 'Members of Legislative Assembly (MLAs) on the Treasury side vote with the government. They represent constituencies across Andhra Pradesh, raise local issues, and pass the state budget and laws. Green benches = ruling party side.',
    x: 18, y: 64, width: 11, order: 8
  },
  {
    slot: 'opposition_leader',
    title: 'Leader of Opposition',
    designation: 'Opposition Benches — Red Side (Front Row)',
    personName: 'Y.S. Jagan Mohan Reddy',
    personPhoto: PHOTOS.opposition,
    responsibilities: 'The Leader of Opposition leads the largest party not in power. They sit on the red benches (right side) opposite the CM. Their job is to question government decisions, suggest alternatives, and represent voters who did not support the ruling party.',
    x: 58, y: 45, width: 10, order: 9
  },
  {
    slot: 'opposition_deputy',
    title: 'Deputy Leader of Opposition',
    designation: 'Opposition — Front Row',
    personName: 'Buggana Rajendranath Reddy',
    personPhoto: PHOTOS.opposition,
    responsibilities: 'The Deputy LoP assists the Opposition Leader during debates and committee work. They coordinate YSR Congress MLAs and ensure the opposition\'s voice is heard on budgets, welfare schemes, and local issues.',
    x: 66, y: 50, width: 10, order: 10
  },
  {
    slot: 'opposition_senior',
    title: 'Senior Opposition MLA',
    designation: 'Opposition — Second Row',
    personName: 'Vijaya Sai Reddy',
    personPhoto: PHOTOS.opposition,
    responsibilities: 'Senior opposition MLAs have experience in Assembly rules and policy. They speak on important bills and hold the government accountable — a key part of democracy students learn in civics class.',
    x: 74, y: 56, width: 10, order: 11
  },
  {
    slot: 'opposition_mlas',
    title: 'Opposition MLAs',
    designation: 'Opposition — Red Tiered Rows',
    personName: 'YSRCP MLAs',
    personPhoto: PHOTOS.mla,
    responsibilities: 'Opposition MLAs sit on red benches in curved rows. They debate, vote, and raise constituency problems even when their party is not in power. Red benches = opposition side; this two-sided layout helps students see balance in democracy.',
    x: 82, y: 64, width: 11, order: 12
  },
  {
    slot: 'gallery_press',
    title: 'Press Gallery',
    designation: 'Observers — Media',
    personName: 'Journalists & Media',
    personPhoto: PHOTOS.gallery,
    responsibilities: 'Reporters sit in the gallery to watch Assembly sessions and inform the public. A free press helps citizens understand what laws are made and how leaders debate — an important link between the Assembly and everyday people.',
    x: 36, y: 90, width: 11, order: 13
  },
  {
    slot: 'gallery_public',
    title: 'Public Gallery',
    designation: 'Observers — Citizens',
    personName: 'Visitors & Students',
    personPhoto: PHOTOS.gallery,
    responsibilities: 'Citizens, including students on educational visits, can watch Assembly proceedings from the public gallery. Seeing democracy in action helps you understand how leaders are accountable to the people of Andhra Pradesh.',
    x: 64, y: 90, width: 11, order: 14
  }
];

const db = readDb();
db.hierarchyPositions = assemblyLayout.map((p) => ({
  id: generateId(),
  ...p,
  height: 0,
  level: 'assembly',
  active: true,
  createdAt: new Date().toISOString()
}));
db.assemblyLayoutVersion = 4;
writeDb(db);
console.log(`Assembly layout updated (${db.hierarchyPositions.length} profiles on chamber diagram).`);
