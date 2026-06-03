/** Default hotspot positions (% of diagram container) keyed by slot */
export const ASSEMBLY_HOTSPOTS = {
  speaker: { x: 50, y: 11, w: 11 },
  secretariat_left: { x: 41, y: 17, w: 9 },
  secretariat_right: { x: 59, y: 17, w: 9 },
  central_well: { x: 50, y: 30, w: 12 },
  treasury_cm: { x: 42, y: 45, w: 10 },
  treasury_deputy: { x: 34, y: 50, w: 10 },
  treasury_ministers: { x: 26, y: 56, w: 10 },
  treasury_mlas: { x: 18, y: 64, w: 11 },
  opposition_leader: { x: 58, y: 45, w: 10 },
  opposition_deputy: { x: 66, y: 50, w: 10 },
  opposition_senior: { x: 74, y: 56, w: 10 },
  opposition_mlas: { x: 82, y: 64, w: 11 },
  gallery_press: { x: 36, y: 90, w: 11 },
  gallery_public: { x: 64, y: 90, w: 11 }
};

/** AP High Court isometric courtroom — positions tuned to courtroom-layout.png */
export const COURT_HOTSPOTS = {
  chief_justice: { x: 50, y: 11, w: 11 },
  judges_entry: { x: 22, y: 14, w: 9 },
  court_officers_entry: { x: 78, y: 14, w: 9 },
  senior_counsel: { x: 50, y: 26, w: 11 },
  accused: { x: 33, y: 36, w: 10 },
  victim: { x: 67, y: 36, w: 10 },
  court_officers_left: { x: 14, y: 48, w: 10 },
  court_officers_right: { x: 86, y: 48, w: 10 },
  govt_advocates: { x: 36, y: 58, w: 10 },
  defense_advocates: { x: 64, y: 58, w: 10 },
  registrar: { x: 50, y: 42, w: 10 },
  public_gallery: { x: 50, y: 88, w: 14 }
};

export function getHotspotStyle(item, defaults) {
  const slot = item?.slot || 'other';
  const def = defaults[slot] || { x: 50, y: 50, w: 12 };
  const x = item?.x != null && item.x !== '' ? Number(item.x) : def.x;
  const y = item?.y != null && item.y !== '' ? Number(item.y) : def.y;
  const w = item?.width > 0 ? item.width : def.w;
  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${w}%`,
    transform: 'translate(-50%, -50%)'
  };
}

export function getAssemblyHotspotClass(slot) {
  if (!slot) return '';
  if (slot.startsWith('treasury')) return 'hotspot-treasury';
  if (slot.startsWith('opposition')) return 'hotspot-opposition';
  if (slot.startsWith('gallery')) return 'hotspot-gallery';
  if (slot === 'speaker') return 'hotspot-speaker';
  return 'hotspot-neutral';
}

export function getCourtHotspotClass(slot) {
  if (!slot) return '';
  if (slot === 'chief_justice' || slot === 'judges_entry') return 'hotspot-speaker';
  if (slot === 'accused') return 'hotspot-opposition';
  if (slot === 'victim') return 'hotspot-victim';
  if (slot === 'govt_advocates' || slot === 'senior_counsel') return 'hotspot-treasury';
  if (slot === 'defense_advocates') return 'hotspot-defense';
  if (slot === 'public_gallery') return 'hotspot-gallery';
  return 'hotspot-neutral';
}
