import { readDb, writeDb, generateId } from './db.js';
import {
  CONSTITUTION_LAWS_GROUPS,
  WELFARE_SCHEME_GROUPS
} from './data/home-section-content.js';

const TARGET_SLUGS = ['constitution_laws', 'government_manifesto'];

function buildConstitutionItems(categoryId) {
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
        active: true,
        createdAt: new Date().toISOString()
      });
    }
  }
  return items;
}

function buildWelfareSchemeItems(categoryId) {
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
        active: true,
        createdAt: new Date().toISOString()
      });
    }
  }
  return items;
}

const db = readDb();
let added = 0;

// Rename welfare schemes category
const welfareCat = db.categories.find((c) => c.slug === 'government_manifesto');
if (welfareCat) {
  welfareCat.name = 'Citizen Welfare Schemes & Benefits in AP';
  welfareCat.description = 'State and central government welfare schemes available in Andhra Pradesh';
}

// Remove student manifesto category and its content
const studentCat = db.categories.find((c) => c.slug === 'student_manifesto');
if (studentCat) {
  db.contentItems = db.contentItems.filter((i) => i.categoryId !== studentCat.id);
  db.categories = db.categories.filter((c) => c.slug !== 'student_manifesto');
  console.log('  Removed student_manifesto category');
}

for (const slug of TARGET_SLUGS) {
  const category = db.categories.find((c) => c.slug === slug);
  if (!category) {
    console.warn(`Category not found: ${slug}`);
    continue;
  }

  db.contentItems = db.contentItems.filter((i) => i.categoryId !== category.id);

  let newItems = [];
  if (slug === 'constitution_laws') {
    newItems = buildConstitutionItems(category.id);
  } else if (slug === 'government_manifesto') {
    newItems = buildWelfareSchemeItems(category.id);
  }

  db.contentItems.push(...newItems);
  added += newItems.length;
  console.log(`  ${slug}: ${newItems.length} items`);
}

writeDb(db);
console.log(`Home section content updated (${added} items).`);
