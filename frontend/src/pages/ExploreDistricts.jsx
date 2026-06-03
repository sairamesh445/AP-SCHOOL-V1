import { useEffect, useMemo, useRef, useState } from 'react';
import AndhrapradeshMap from 'svgmap-andhrapradesh';
import { api } from '../api/client';
import { getImageSrc } from '../utils/image';
import {
  AP_DISTRICT_DB_NAME_TO_MAP_ID,
  AP_DISTRICT_MAP_IDS
} from '../constants/apDistrictMapIds';

function normalizeName(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/district/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function guessMapIdFromName(name) {
  const exact = AP_DISTRICT_DB_NAME_TO_MAP_ID[name];
  if (exact) return exact;

  const raw = String(name || '').toLowerCase();
  if (raw.includes('tirupati') || raw.includes('balaji')) return 'TIR';
  if (raw.includes('nellore') || raw.includes('sri potti')) return 'SPS';
  if (raw.includes('konaseema')) return 'KON';
  if (raw.includes('kadapa') || raw.includes('ysr')) return 'YSR';
  if (raw.includes('anantapur')) return 'ANA';
  if (raw.includes('sathya sai') || raw.includes('puttaparthi')) return 'SSS';

  const n = normalizeName(name);
  const entries = Object.entries(AP_DISTRICT_MAP_IDS);
  for (const [code, label] of entries) {
    const ln = normalizeName(label);
    if (ln === n) return code;
  }
  for (const [code, label] of entries) {
    const ln = normalizeName(label);
    if (ln.includes(n) || n.includes(ln)) return code;
  }
  return '';
}

function mapIdToColor(mapId) {
  const palette = [
    '#E63946', '#457B9D', '#2A9D8F', '#F4A261', '#E9C46A', '#6D597A', '#00AFB9',
    '#F72585', '#4361EE', '#06D6A0', '#FF6B35', '#7B2CBF', '#4D908E', '#F94144'
  ];
  const s = String(mapId || '');
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

export default function ExploreDistricts() {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [hoveredMapId, setHoveredMapId] = useState('');
  const [selectedMapId, setSelectedMapId] = useState('');
  const [pointer, setPointer] = useState({ x: 24, y: 24 });
  const mapWrapRef = useRef(null);
  const baseFillByIdRef = useRef(new Map());

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    api.getCivicDistricts()
      .then((rows) => {
        if (!mounted) return;
        setDistricts(rows || []);
      })
      .catch((e) => mounted && setError(e.message || 'Failed to load districts'))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  // Apply distinct fill colors per district and keep them after hover.
  useEffect(() => {
    const wrap = mapWrapRef.current;
    if (!wrap) return;

    const ids = Object.keys(AP_DISTRICT_MAP_IDS);
    const baseFillById = new Map();

    for (const id of ids) {
      const el = wrap.querySelector(`#${CSS.escape(id)}`);
      if (!el) continue;
      const baseFill = mapIdToColor(id);
      baseFillById.set(id, baseFill);
      el.style.fill = baseFill;
      el.dataset.baseFill = baseFill;
      el.style.transition = 'fill 120ms ease';

      // svgmap-core sets fill to mapColor on mouseleave. Restore our base color after.
      const restore = () => {
        requestAnimationFrame(() => {
          const fill = el.dataset.baseFill || baseFill;
          el.style.fill = fill;
        });
      };
      el.addEventListener('mouseleave', restore);
      el.addEventListener('blur', restore);
    }

    baseFillByIdRef.current = baseFillById;

    return () => {
      for (const id of ids) {
        const el = wrap.querySelector(`#${CSS.escape(id)}`);
        if (!el) continue;
        // listeners are anonymous per element; simplest safe cleanup is resetting fill.
        // (Component unmount removes the DOM anyway.)
        el.style.fill = el.dataset.baseFill || el.style.fill;
      }
    };
  }, [districts]);

  const districtsByMapId = useMemo(() => {
    const map = new Map();
    for (const d of districts) {
      const mapId = (d.mapId || '').toUpperCase().trim() || guessMapIdFromName(d.name);
      if (!mapId) continue;
      map.set(mapId, { ...d, mapId });
    }
    return map;
  }, [districts]);

  const activeMapId = hoveredMapId || selectedMapId;
  const activeDistrict = activeMapId ? districtsByMapId.get(activeMapId) : null;

  const handlePointerMove = (e) => {
    if (!mapWrapRef.current) return;
    const rect = mapWrapRef.current.getBoundingClientRect();
    setPointer({
      x: Math.min(rect.right - 16, Math.max(rect.left + 16, e.clientX)) - rect.left,
      y: Math.min(rect.bottom - 16, Math.max(rect.top + 16, e.clientY)) - rect.top
    });
  };

  const handleMapMouseOver = (e) => {
    const t = e.target;
    if (t?.tagName?.toLowerCase?.() !== 'path') return;
    const id = (t.getAttribute('id') || '').toUpperCase().trim();
    if (id) setHoveredMapId(id);
  };

  const handleMapMouseLeave = () => {
    setHoveredMapId('');
  };

  const handleMapClick = (id) => {
    setSelectedMapId(String(id || '').toUpperCase().trim());
  };

  return (
    <div className="container explore-districts-page">
      <div className="explore-header">
        <div>
          <h1>🗺️ Explore Andhra Pradesh Districts</h1>
          <p className="explore-subtitle">
            Hover any district on the map to see what it’s famous for and how many mandals it has.
          </p>
        </div>
        <div className="explore-legend">
          <span className="legend-pill">Hover: preview</span>
          <span className="legend-pill">Click/Tap: lock selection</span>
        </div>
      </div>

      {loading && (
        <div className="explore-loading">Loading districts…</div>
      )}
      {!loading && error && (
        <div className="explore-error">{error}</div>
      )}

      <div className="explore-grid">
        <section className="explore-map-card">
          <div
            className="explore-map-wrap"
            ref={mapWrapRef}
            onMouseMove={handlePointerMove}
            onMouseOver={handleMapMouseOver}
            onMouseLeave={handleMapMouseLeave}
          >
            <AndhrapradeshMap
              onClick={handleMapClick}
              className="ap-svg-map"
              size="100%"
              mapColor="#ffffff"
              strokeColor="rgba(27,73,101,0.55)"
              strokeWidth="1"
              hoverColor="rgba(255,107,53,0.85)"
            />

            {activeDistrict && (
              <div
                className="district-tooltip"
                style={{
                  left: pointer.x,
                  top: pointer.y
                }}
              >
                <div className="district-tooltip-inner">
                  <img
                    src={getImageSrc(activeDistrict.imageUrl)}
                    alt={activeDistrict.name}
                    className="district-tooltip-img"
                    loading="lazy"
                  />
                  <div className="district-tooltip-body">
                    <div className="district-tooltip-title">
                      <strong>{activeDistrict.name}</strong>
                      <span className="district-tooltip-code">{activeDistrict.mapId}</span>
                    </div>
                    <div className="district-tooltip-meta">
                      <div><strong>Famous:</strong> {activeDistrict.famousFor || '—'}</div>
                      <div><strong>Mandals:</strong> {activeDistrict.mandalsCount ?? '—'}</div>
                      {activeDistrict.headquarters && (
                        <div><strong>HQ:</strong> {activeDistrict.headquarters}</div>
                      )}
                      {activeDistrict.areaSqKm && (
                        <div><strong>Area:</strong> {activeDistrict.areaSqKm} km²</div>
                      )}
                      {activeDistrict.population && (
                        <div><strong>Population:</strong> {Number(activeDistrict.population).toLocaleString('en-IN')}</div>
                      )}
                    </div>
                    {activeDistrict.collectorName && (
                      <div className="district-tooltip-small">
                        <strong>Collector:</strong> {activeDistrict.collectorName}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <p className="explore-hint">
            Platform Admin can update district image, “famous for”, mandals, and map ID in <strong>Admin Dashboard → Know AP → AP Districts</strong>.
          </p>
        </section>

        <aside className="explore-side-card">
          <h2>District details</h2>
          {activeDistrict ? (
            <div className="explore-side-content">
              <img
                src={getImageSrc(activeDistrict.imageUrl)}
                alt={activeDistrict.name}
                className="explore-side-img"
                loading="lazy"
              />
              <h3>{activeDistrict.name}</h3>
              <p><strong>What is famous there?</strong><br />{activeDistrict.famousFor || '—'}</p>
              <p><strong>How many mandals?</strong><br />{activeDistrict.mandalsCount ?? '—'}</p>
              {activeDistrict.headquarters && <p><strong>Headquarters</strong><br />{activeDistrict.headquarters}</p>}
              {activeDistrict.region && <p><strong>Region</strong><br />{activeDistrict.region}</p>}
              {(activeDistrict.areaSqKm || activeDistrict.population) && (
                <p>
                  <strong>Stats</strong><br />
                  {activeDistrict.areaSqKm ? `${activeDistrict.areaSqKm} km²` : '—'}
                  {' · '}
                  {activeDistrict.population ? Number(activeDistrict.population).toLocaleString('en-IN') : '—'}
                </p>
              )}
              {activeDistrict.website && (
                <p>
                  <strong>Website</strong><br />
                  <a href={activeDistrict.website} target="_blank" rel="noreferrer">{activeDistrict.website}</a>
                </p>
              )}
              <div className="explore-side-divider" />
              <p><strong>Collector</strong><br />{activeDistrict.collectorName || '—'}</p>
              <p><strong>SP</strong><br />{activeDistrict.spName || '—'}</p>
            </div>
          ) : (
            <div className="explore-side-empty">
              Hover a district on the map (or click to select) to see details here.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

