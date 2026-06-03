import { Router } from 'express';
import { readDb, writeDb, generateId } from '../db.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import {
  GRIEVANCE_CONTENT_VERSION,
  grievanceTopicsOfficial,
  whatsappServicesOfficial
} from '../data/ap-civic-services-data.js';

/** Database district names → SVG map path IDs */
const DISTRICT_NAME_TO_MAP_ID = {
  'Alluri Sitharama Raju': 'ASR',
  'Anakapalli': 'ANK',
  'Anantapur': 'ANA',
  'Annamayya': 'ANN',
  'Bapatla': 'BAP',
  'Chittoor': 'CHI',
  'Dr. B. R. Ambedkar Konaseema': 'KON',
  'East Godavari': 'EGA',
  'Eluru': 'ELU',
  'Guntur': 'GUN',
  'Kakinada': 'KAK',
  'Krishna': 'KRI',
  'Kurnool': 'KUR',
  'Nandyal': 'NAN',
  'NTR': 'NTR',
  'Palnadu': 'PAL',
  'Parvathipuram Manyam': 'PMA',
  'Prakasam': 'PRA',
  'Sri Balaji (Tirupati)': 'TIR',
  'Sri Potti Sriramulu Nellore': 'SPS',
  'Sri Sathya Sai': 'SSS',
  'Srikakulam': 'SRI',
  'Visakhapatnam': 'VIS',
  'Vizianagaram': 'VIZ',
  'West Godavari': 'WGE',
  'YSR Kadapa': 'YSR'
};

const router = Router();

/** URL segment -> JSON database property */
const COLLECTIONS = {
  districts: {
    route: 'districts',
    fields: (b) => ({
      state: b.state || 'Andhra Pradesh',
      name: b.name,
      mapId: b.mapId || '',
      imageUrl: b.imageUrl || '',
      famousFor: b.famousFor || '',
      headquarters: b.headquarters || '',
      region: b.region || '',
      areaSqKm: Number.isFinite(Number(b.areaSqKm)) ? Number(b.areaSqKm) : null,
      population: Number.isFinite(Number(b.population)) ? Number(b.population) : null,
      established: b.established || '',
      website: b.website || '',
      mandalsCount: Number.isFinite(Number(b.mandalsCount)) ? Number(b.mandalsCount) : null,
      collectorName: b.collectorName || '',
      spName: b.spName || '',
      collectorEmail: b.collectorEmail || '',
      collectorPhone: b.collectorPhone || '',
      spEmail: b.spEmail || '',
      spPhone: b.spPhone || ''
    })
  },
  policeAuthorities: {
    route: 'police-authorities',
    fields: (b) => ({
      designation: b.designation,
      name: b.name || '',
      details: b.details || ''
    })
  },
  ministerOsds: {
    route: 'minister-osds',
    fields: (b) => ({
      ministerName: b.ministerName,
      ministry: b.ministry || '',
      osdName: b.osdName || b.iasOfficerName || '',
      iasOfficerName: b.iasOfficerName || b.osdName || '',
      officerType: b.officerType || 'OSD / Principal Secretary',
      contactEmail: b.contactEmail || '',
      contactPhone: b.contactPhone || '',
      osdDetails: b.osdDetails || ''
    })
  },
  districtIas: {
    route: 'district-ias',
    fields: (b) => ({
      districtName: b.districtName,
      iasName: b.iasName || '',
      designation: b.designation || 'District Collector & District Magistrate',
      details: b.details || ''
    })
  },
  parliamentTopics: {
    route: 'parliament-topics',
    fields: (b) => ({
      title: b.title,
      icon: b.icon || '📖',
      content: b.content || '',
      summary: b.summary || ''
    })
  },
  assemblyTopics: {
    route: 'assembly-topics',
    fields: (b) => ({
      title: b.title,
      icon: b.icon || '🏛️',
      content: b.content || '',
      summary: b.summary || ''
    })
  },
  grievanceTopics: {
    route: 'grievance-topics',
    fields: (b) => ({
      title: b.title,
      icon: b.icon || '📞',
      content: b.content || '',
      summary: b.summary || ''
    })
  },
  whatsappServices: {
    route: 'whatsapp-services',
    fields: (b) => ({
      title: b.title,
      icon: b.icon || '💬',
      content: b.content || '',
      summary: b.summary || '',
      contactPhone: b.contactPhone || '9552300009'
    })
  },
  districtMlaHistory: {
    route: 'district-mla-history',
    fields: (b) => ({
      districtName: b.districtName,
      constituency: b.constituency || '',
      mlaName: b.mlaName,
      party: b.party || '',
      termPeriod: b.termPeriod || '',
      majorityMargin: b.majorityMargin || '',
      termRank: Math.min(5, Math.max(1, Number(b.termRank) || 1))
    })
  }
};

/** Legacy bug: admin wrote to hyphenated keys instead of camelCase */
const LEGACY_KEY_MAP = [
  ['police-authorities', 'policeAuthorities'],
  ['minister-osds', 'ministerOsds'],
  ['district-ias', 'districtIas'],
  ['parliament-topics', 'parliamentTopics'],
  ['assembly-topics', 'assemblyTopics'],
  ['district-mla-history', 'districtMlaHistory']
];

export function migrateCivicData() {
  const db = readDb();
  let changed = false;

  for (const [legacyKey, dbKey] of LEGACY_KEY_MAP) {
    const legacy = db[legacyKey];
    if (!legacy?.length) continue;

    const existing = db[dbKey] || [];
    const existingIds = new Set(existing.map((x) => x.id));
    const merged = [...existing, ...legacy.filter((x) => !existingIds.has(x.id))];
    db[dbKey] = merged;
    delete db[legacyKey];
    changed = true;
    console.log(`Migrated ${legacy.length} civic record(s) from "${legacyKey}" to "${dbKey}"`);
  }

  const ts = new Date().toISOString();

  const grievanceVersion = db.grievanceContentVersion ?? 0;
  if (!db.grievanceTopics?.length || grievanceVersion !== GRIEVANCE_CONTENT_VERSION) {
    db.grievanceTopics = grievanceTopicsOfficial.map((t, i) => ({
      id: generateId(),
      ...t,
      order: i + 1,
      active: true,
      createdAt: ts
    }));
    db.grievanceContentVersion = GRIEVANCE_CONTENT_VERSION;
    changed = true;
    console.log(
      grievanceVersion === GRIEVANCE_CONTENT_VERSION
        ? `Seeded ${db.grievanceTopics.length} grievance topics`
        : `Refreshed ${db.grievanceTopics.length} grievance topics (content v${GRIEVANCE_CONTENT_VERSION})`
    );
  }

  if (!db.whatsappServices?.length) {
    db.whatsappServices = whatsappServicesOfficial.map((t, i) => ({
      id: generateId(),
      ...t,
      order: i + 1,
      active: true,
      createdAt: ts
    }));
    changed = true;
    console.log(`Seeded ${db.whatsappServices.length} WhatsApp governance services`);
  }

  for (const district of db.districts || []) {
    const expected = DISTRICT_NAME_TO_MAP_ID[district.name];
    if (!expected) continue;
    const current = (district.mapId || '').toUpperCase().trim();
    if (current !== expected) {
      district.mapId = expected;
      changed = true;
    }
  }

  if (changed) writeDb(db);
  return changed;
}

function sortByOrder(items) {
  return (items || [])
    .filter((i) => i.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

const now = () => new Date().toISOString();

function mountAdmin(adminRouter, dbKey, { route, fields }) {
  adminRouter.get(`/admin/${route}`, (req, res) => {
    res.json(readDb()[dbKey] || []);
  });

  adminRouter.post(`/admin/${route}`, (req, res) => {
    const db = readDb();
    const item = {
      id: generateId(),
      ...fields(req.body),
      order: req.body.order ?? (db[dbKey]?.length || 0),
      active: true,
      createdAt: now()
    };
    db[dbKey] = db[dbKey] || [];
    db[dbKey].push(item);
    writeDb(db);
    res.status(201).json(item);
  });

  adminRouter.put(`/admin/${route}/:id`, (req, res) => {
    const db = readDb();
    const idx = (db[dbKey] || []).findIndex((x) => x.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    db[dbKey][idx] = { ...db[dbKey][idx], ...req.body };
    writeDb(db);
    res.json(db[dbKey][idx]);
  });

  adminRouter.delete(`/admin/${route}/:id`, (req, res) => {
    const db = readDb();
    db[dbKey] = (db[dbKey] || []).filter((x) => x.id !== req.params.id);
    writeDb(db);
    res.json({ success: true });
  });
}

router.get('/districts', authMiddleware, (req, res) => {
  res.json(sortByOrder(readDb().districts));
});

router.get('/police-authorities', authMiddleware, (req, res) => {
  res.json(sortByOrder(readDb().policeAuthorities));
});

router.get('/minister-osds', authMiddleware, (req, res) => {
  res.json(sortByOrder(readDb().ministerOsds));
});

router.get('/district-ias', authMiddleware, (req, res) => {
  res.json(sortByOrder(readDb().districtIas));
});

router.get('/parliament-topics', authMiddleware, (req, res) => {
  res.json(sortByOrder(readDb().parliamentTopics));
});

router.get('/assembly-topics', authMiddleware, (req, res) => {
  res.json(sortByOrder(readDb().assemblyTopics));
});

router.get('/grievance-topics', authMiddleware, (req, res) => {
  res.json(sortByOrder(readDb().grievanceTopics));
});

router.get('/whatsapp-services', authMiddleware, (req, res) => {
  res.json(sortByOrder(readDb().whatsappServices));
});

router.get('/mla-history', authMiddleware, (req, res) => {
  res.json(sortByOrder(readDb().districtMlaHistory));
});

router.get('/overview', authMiddleware, (req, res) => {
  const db = readDb();
  const districts = sortByOrder(db.districts);
  res.json({
    districtCount: districts.length,
    districts,
    policeAuthorities: sortByOrder(db.policeAuthorities),
    ministerOsds: sortByOrder(db.ministerOsds),
    districtIas: sortByOrder(db.districtIas),
    parliamentTopics: sortByOrder(db.parliamentTopics),
    assemblyTopics: sortByOrder(db.assemblyTopics),
    grievanceTopics: sortByOrder(db.grievanceTopics),
    whatsappServices: sortByOrder(db.whatsappServices),
    mlaHistory: sortByOrder(db.districtMlaHistory)
  });
});

const adminRouter = Router();
adminRouter.use(authMiddleware);
adminRouter.use(requireRole('platform_admin'));

for (const [dbKey, config] of Object.entries(COLLECTIONS)) {
  mountAdmin(adminRouter, dbKey, config);
}

router.use(adminRouter);

export default router;
