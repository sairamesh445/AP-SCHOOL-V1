import bcrypt from 'bcryptjs';
import { readDb, writeDb, generateId } from './db.js';
import {
  CONSTITUTION_LAWS_GROUPS,
  WELFARE_SCHEME_GROUPS
} from './data/home-section-content.js';

const db = readDb();

if (db.users.some((u) => u.role === 'platform_admin')) {
  console.log('Database already seeded.');
  process.exit(0);
}

const platformAdmin = {
  id: generateId(),
  username: 'admin',
  passwordHash: await bcrypt.hash('admin123', 10),
  role: 'platform_admin',
  name: 'Platform Administrator',
  schoolId: null,
  createdAt: new Date().toISOString()
};

const categories = [
  { id: generateId(), name: 'Help Line Numbers', slug: 'helpline', description: 'Emergency and government helplines', icon: '📞', order: 1, active: true },
  { id: generateId(), name: 'Fundamental Rights', slug: 'fundamental_rights', description: 'Rights guaranteed by the Constitution', icon: '⚖️', order: 2, active: true },
  { id: generateId(), name: 'Constitution Laws', slug: 'constitution_laws', description: 'Important constitutional provisions', icon: '📜', order: 3, active: true },
  { id: generateId(), name: 'Test Your Knowledge', slug: 'test_knowledge', description: 'Quiz to test civic knowledge', icon: '🎯', order: 4, active: true },
  { id: generateId(), name: 'Citizen Welfare Schemes & Benefits in AP', slug: 'government_manifesto', description: 'State and central government welfare schemes available in Andhra Pradesh', icon: '🏛️', order: 5, active: true }
];

const helplineCat = categories[0].id;
const rightsCat = categories[1].id;
const constitutionCat = categories[2].id;
const welfareSchemesCat = categories[4].id;

function buildConstitutionSeedItems(categoryId) {
  const items = [];
  let order = 1;
  for (const group of CONSTITUTION_LAWS_GROUPS) {
    for (const row of group.items) {
      items.push({
        id: generateId(),
        categoryId,
        title: row.title,
        description: row.description,
        imageUrl: '',
        order: order++,
        extra: {
          subgroup: group.subgroup,
          subgroupOrder: group.subgroupOrder,
          ...(row.article ? { article: row.article } : {})
        },
        active: true
      });
    }
  }
  return items;
}

function buildWelfareSchemeSeedItems(categoryId) {
  const items = [];
  let order = 1;
  for (const group of WELFARE_SCHEME_GROUPS) {
    for (const row of group.items) {
      items.push({
        id: generateId(),
        categoryId,
        title: row.title,
        description: row.beneficiaries,
        imageUrl: '',
        order: order++,
        extra: {
          subgroup: group.subgroup,
          subgroupOrder: group.subgroupOrder,
          category: row.category,
          benefit: row.benefit,
          beneficiaries: row.beneficiaries
        },
        active: true
      });
    }
  }
  return items;
}

const contentItems = [
  { id: generateId(), categoryId: helplineCat, title: '102', description: 'For Medical Emergency - Ambulance Service', imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=200&h=200&fit=crop', order: 1, active: true },
  { id: generateId(), categoryId: helplineCat, title: '100', description: 'Police Emergency Helpline', imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200&h=200&fit=crop', order: 2, active: true },
  { id: generateId(), categoryId: helplineCat, title: '101', description: 'Fire Emergency Services', imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&h=200&fit=crop', order: 3, active: true },
  { id: generateId(), categoryId: helplineCat, title: '1098', description: 'Child Helpline - For children in distress', imageUrl: 'https://images.unsplash.com/photo-1503454537845-2311af8644e1?w=200&h=200&fit=crop', order: 4, active: true },
  { id: generateId(), categoryId: rightsCat, title: 'Right to Equality', description: 'Article 14-18 - Equal treatment before law regardless of religion, race, caste, sex or place of birth', imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200&h=200&fit=crop', order: 1, active: true },
  { id: generateId(), categoryId: rightsCat, title: 'Right to Freedom', description: 'Article 19-22 - Freedom of speech, assembly, association, movement and profession', imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=200&h=200&fit=crop', order: 2, active: true },
  { id: generateId(), categoryId: rightsCat, title: 'Right against Exploitation', description: 'Article 23-24 - Prohibition of human trafficking and forced labour', imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=200&h=200&fit=crop', order: 3, active: true },
  ...buildConstitutionSeedItems(constitutionCat),
  ...buildWelfareSchemeSeedItems(welfareSchemesCat)
];

const carouselSlides = [
  { id: generateId(), imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&h=400&fit=crop', caption: 'Learn About Andhra Pradesh Government', order: 1, active: true },
  { id: generateId(), imageUrl: 'https://images.unsplash.com/photo-1577495508326-19f94c42eaef?w=1200&h=400&fit=crop', caption: 'Know Your Rights & Responsibilities', order: 2, active: true },
  { id: generateId(), imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c1daef1d935?w=1200&h=400&fit=crop', caption: 'Understand Government Hierarchy', order: 3, active: true }
];

const hierarchyPositions = [
  { id: generateId(), title: 'Governor', designation: 'Hon\'ble Governor of AP', personName: 'S. Abdul Nazeer', personPhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop', responsibilities: 'Constitutional head of state. Appoints CM, summons legislature, gives assent to bills.', x: 42, y: 5, width: 140, height: 55, order: 1, level: 'state', active: true },
  { id: generateId(), title: 'Chief Minister', designation: 'Hon\'ble Chief Minister', personName: 'N. Chandrababu Naidu', personPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop', responsibilities: 'Head of state government. Leads Council of Ministers, implements policies, represents state.', x: 38, y: 18, width: 150, height: 55, order: 2, level: 'executive', active: true },
  { id: generateId(), title: 'Deputy Chief Minister', designation: 'Deputy CM', personName: 'Pawan Kalyan', personPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop', responsibilities: 'Assists CM in governance. May hold key portfolios.', x: 22, y: 32, width: 130, height: 50, order: 3, level: 'executive', active: true },
  { id: generateId(), title: 'Speaker', designation: 'Legislative Assembly Speaker', personName: 'Ayyannagari Ganesh', personPhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop', responsibilities: 'Presides over Assembly sessions. Maintains order and conducts legislative business.', x: 55, y: 32, width: 130, height: 50, order: 4, level: 'legislature', active: true },
  { id: generateId(), title: 'MLA', designation: 'Member of Legislative Assembly', personName: 'Elected Representatives', personPhoto: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop', responsibilities: 'Represents constituency. Makes laws, raises local issues, approves budget in Assembly.', x: 15, y: 48, width: 110, height: 45, order: 5, level: 'legislature', active: true },
  { id: generateId(), title: 'MP (Lok Sabha)', designation: 'Member of Parliament', personName: 'AP Lok Sabha MPs', personPhoto: 'https://images.unsplash.com/photo-1551836022-d5d88e7428e3?w=150&h=150&fit=crop', responsibilities: 'Represents AP in Parliament. Makes national laws, discusses Union policies.', x: 42, y: 48, width: 120, height: 45, order: 6, level: 'parliament', active: true },
  { id: generateId(), title: 'MP (Rajya Sabha)', designation: 'Rajya Sabha Member', personName: 'AP Rajya Sabha MPs', personPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop', responsibilities: 'Represents state in Rajya Sabha. Reviews legislation, protects state interests.', x: 68, y: 48, width: 120, height: 45, order: 7, level: 'parliament', active: true },
  { id: generateId(), title: 'Ministers', designation: 'Council of Ministers', personName: 'Cabinet Ministers', personPhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop', responsibilities: 'Head government departments. Formulate and implement policies in assigned portfolios.', x: 30, y: 62, width: 140, height: 45, order: 8, level: 'executive', active: true },
  { id: generateId(), title: 'Assembly Floor', designation: 'Legislative Assembly', personName: '175 MLAs', personPhoto: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=150&h=150&fit=crop', responsibilities: 'Main legislative chamber where laws are debated and passed for Andhra Pradesh.', x: 25, y: 78, width: 200, height: 50, order: 9, level: 'legislature', active: true }
];

const quizQuestions = [
  { id: generateId(), question: 'Who is the constitutional head of Andhra Pradesh?', options: ['Chief Minister', 'Governor', 'Speaker', 'President'], correctAnswer: 'Governor', explanation: 'The Governor is the constitutional head of the state.', active: true },
  { id: generateId(), question: 'How many MLAs are in the AP Legislative Assembly?', options: ['150', '175', '200', '234'], correctAnswer: '175', explanation: 'Andhra Pradesh has 175 Assembly constituencies.', active: true },
  { id: generateId(), question: 'Which helpline is for medical emergencies?', options: ['100', '101', '102', '1098'], correctAnswer: '102', explanation: '102 is the ambulance/medical emergency helpline.', active: true }
];

db.users.push(platformAdmin);
db.categories = categories;
db.contentItems = contentItems;
db.carouselSlides = carouselSlides;
db.hierarchyPositions = hierarchyPositions;
db.quizQuestions = quizQuestions;

writeDb(db);
console.log('Database seeded successfully!');
console.log('Platform Admin: username=admin, password=admin123');
