/** Four Constitution Laws categories (must match backend extra.subgroup) */
export const CONSTITUTION_CATEGORIES = [
  {
    id: 1,
    subgroup: 'Important Constitutional Principles',
    title: 'Important Constitutional Principles',
    columns: ['Topic', 'Article', 'Correct Description'],
    threeCol: true
  },
  {
    id: 2,
    subgroup: 'Important BNS Sections (New Criminal Law)',
    title: 'Important BNS Sections (New Criminal Law)',
    columns: ['BNS Section', 'Description'],
    threeCol: false
  },
  {
    id: 3,
    subgroup: 'Updated Citizen Protection Laws (India)',
    title: 'Updated Citizen Protection Laws (India)',
    columns: ['Law', 'One-line Description'],
    threeCol: false
  },
  {
    id: 4,
    subgroup: 'Updated Police & Citizen Rights (India – 2026)',
    title: 'Updated Police & Citizen Rights (India – 2026)',
    columns: ['Right', 'Description'],
    threeCol: false
  }
];
