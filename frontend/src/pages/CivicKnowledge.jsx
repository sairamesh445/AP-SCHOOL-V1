import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../api/client';
import { getImageSrc } from '../utils/image';

const SECTIONS = [
  { id: 'districts', label: 'Districts', icon: '🗺️', desc: 'Collectors & SPs' },
  { id: 'police', label: 'Police Leaders', icon: '👮', desc: 'Higher authorities' },
  { id: 'grievance', label: 'Grievance & Spandana', icon: '📞', desc: 'How to complain & get help' },
  { id: 'whatsapp', label: 'WhatsApp Governance', icon: '💬', desc: 'Mana Mitra services' },
  { id: 'assembly', label: 'Assembly', icon: '🏛️', desc: 'State Legislature guide' },
  { id: 'parliament', label: 'Parliament', icon: '🇮🇳', desc: 'Lok Sabha & Rajya Sabha' },
  { id: 'mla-history', label: 'MLA History', icon: '🗳️', desc: 'Constituency election history' }
];

function formatConstituencyLabel(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/\b\(sc\)/g, '(SC)')
    .replace(/\b\(st\)/g, '(ST)')
    .split(' ')
    .map((w) => (w.startsWith('(') ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');
}

function formatContent(text) {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return <br key={i} />;
    if (trimmed.startsWith('•')) {
      return <li key={i}>{trimmed.slice(1).trim()}</li>;
    }
    if (/^Step \d+/i.test(trimmed) || /^Level \d+/i.test(trimmed)) {
      return <p key={i} className="civic-step-heading"><strong>{trimmed}</strong></p>;
    }
    return <p key={i}>{trimmed}</p>;
  });
}

export default function CivicKnowledge() {
  const location = useLocation();
  const [active, setActive] = useState('districts');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [districtSearch, setDistrictSearch] = useState('');
  const [districtState, setDistrictState] = useState('Andhra Pradesh');
  const [hoveredDistrict, setHoveredDistrict] = useState(null);
  const [historyDistrict, setHistoryDistrict] = useState('');
  const [historyConstituency, setHistoryConstituency] = useState('');
  const [historyConstituencySearch, setHistoryConstituencySearch] = useState('');

  const loadData = useCallback(() => {
    setLoading(true);
    setError('');
    api.getCivicOverview()
      .then(setData)
      .catch((e) => {
        console.error(e);
        setError(e.message || 'Failed to load');
        setData(null);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData, location.pathname]);

  const states = useMemo(() => {
    const set = new Set((data?.districts || []).map((d) => d.state || 'Andhra Pradesh'));
    return [...set].sort();
  }, [data?.districts]);

  if (loading) {
    return <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;
  }

  if (!data) {
    return (
      <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>
        <p>{error || 'Could not load civic knowledge.'}</p>
        <button type="button" className="btn-secondary" style={{ marginTop: '1rem' }} onClick={loadData}>
          Try again
        </button>
      </div>
    );
  }

  const districts = data.districts || [];
  const policeAuthorities = data.policeAuthorities || [];
  const grievanceTopics = data.grievanceTopics || [];
  const whatsappServices = data.whatsappServices || [];
  const parliamentTopics = data.parliamentTopics || [];
  const assemblyTopics = data.assemblyTopics || [];
  const mlaHistory = data.mlaHistory || [];

  const filteredDistricts = districts
    .filter((d) => (districtState ? (d.state || 'Andhra Pradesh') === districtState : true))
    .filter((d) => {
      const q = districtSearch.toLowerCase();
      return (
        d.name.toLowerCase().includes(q) ||
        (d.famousFor || '').toLowerCase().includes(q) ||
        String(d.mandalsCount ?? '').toLowerCase().includes(q) ||
        (d.collectorName || '').toLowerCase().includes(q) ||
        (d.spName || '').toLowerCase().includes(q) ||
        (d.collectorEmail || '').toLowerCase().includes(q) ||
        (d.spEmail || '').toLowerCase().includes(q)
      );
    });

  const historyDistricts = [
    ...new Set([
      ...districts.map((d) => d.name),
      ...mlaHistory.map((h) => h.districtName)
    ])
  ].sort();

  const constituencyOptions = [...new Set(mlaHistory.map((h) => h.constituency).filter(Boolean))]
    .map((key) => {
      const row = mlaHistory.find((h) => h.constituency === key && h.termRank === 1);
      return {
        key,
        label: row?.constituencyLabel || formatConstituencyLabel(key),
        districtName: row?.districtName || ''
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  const allConstituencies = constituencyOptions.map((o) => o.key);

  const constituenciesForSelect = (
    historyDistrict
      ? constituencyOptions.filter((o) => o.districtName === historyDistrict)
      : constituencyOptions
  )
    .filter((o) => {
      const q = historyConstituencySearch.trim().toLowerCase();
      if (!q) return true;
      return o.label.toLowerCase().includes(q) || o.key.toLowerCase().includes(q);
    })
    .map((o) => o.key);

  const selectedConstituency =
    historyConstituency && constituenciesForSelect.includes(historyConstituency)
      ? historyConstituency
      : constituenciesForSelect[0] || '';

  const historyForView = mlaHistory
    .filter((h) => h.constituency === selectedConstituency)
    .sort((a, b) => (a.termRank || 0) - (b.termRank || 0))
    .slice(0, 5);

  return (
    <div className="civic-page container">
      <div className="hierarchy-title civic-page-header">
        <div>
          <h1>📚 Know Andhra Pradesh</h1>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            District administration, police, grievance redressal, WhatsApp governance, Parliament, and election history — explained for students.
          </p>
        </div>
        <button type="button" className="btn-secondary civic-refresh-btn" onClick={loadData} disabled={loading}>
          {loading ? 'Refreshing…' : '↻ Refresh data'}
        </button>
      </div>

      <div className="civic-layout">
        <nav className="civic-nav" aria-label="Civic knowledge sections">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`civic-nav-btn${active === s.id ? ' active' : ''}`}
              onClick={() => setActive(s.id)}
            >
              <span className="civic-nav-icon">{s.icon}</span>
              <span className="civic-nav-text">
                <strong>{s.label}</strong>
                <small>{s.desc}</small>
              </span>
            </button>
          ))}
        </nav>

        <div className="civic-content">
          {active === 'districts' && (
            <section className="gov-section civic-panel">
              <h2 className="gov-section-title">🗺️ Districts of Andhra Pradesh</h2>
              <p className="gov-section-desc">
                Andhra Pradesh has <strong>{data.districtCount}</strong> districts. Each district is headed by a
                <strong> District Collector</strong> (civil administration) and a <strong> Superintendent of Police (SP)</strong> (law & order).
              </p>
              <div className="civic-search-wrap">
                <select
                  value={districtState}
                  onChange={(e) => setDistrictState(e.target.value)}
                  className="civic-search"
                  aria-label="Filter by state"
                >
                  {states.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <input
                  type="search"
                  placeholder="Search district, collector, or SP..."
                  value={districtSearch}
                  onChange={(e) => setDistrictSearch(e.target.value)}
                  className="civic-search"
                />
              </div>
              <div className="districts-layout">
                <table className="civic-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>State</th>
                      <th>District</th>
                      <th>Famous for</th>
                      <th>Mandals</th>
                      <th>Collector</th>
                      <th>Collector Contact</th>
                      <th>SP (Police)</th>
                      <th>SP Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDistricts.map((d, i) => (
                      <tr
                        key={d.id}
                        className={`district-row${hoveredDistrict?.id === d.id ? ' active' : ''}`}
                        onMouseEnter={() => setHoveredDistrict(d)}
                        onMouseLeave={() => setHoveredDistrict((cur) => (cur?.id === d.id ? null : cur))}
                        onClick={() => setHoveredDistrict(d)}
                      >
                        <td>{i + 1}</td>
                        <td>{d.state || 'Andhra Pradesh'}</td>
                        <td><strong>{d.name}</strong></td>
                        <td>{d.famousFor || '—'}</td>
                        <td>{d.mandalsCount ?? '—'}</td>
                        <td>{d.collectorName}</td>
                        <td className="civic-contact-cell">
                          {d.collectorEmail && <div><a href={`mailto:${d.collectorEmail}`}>{d.collectorEmail}</a></div>}
                          {d.collectorPhone && <div>{d.collectorPhone}</div>}
                        </td>
                        <td>{d.spName}</td>
                        <td className="civic-contact-cell">
                          {d.spEmail && <div><a href={`mailto:${d.spEmail}`}>{d.spEmail}</a></div>}
                          {d.spPhone && <div>{d.spPhone}</div>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredDistricts.length === 0 && (
                  <p className="civic-empty">No districts match your search.</p>
                )}
                <aside className="district-hover-card" aria-label="District details">
                  {hoveredDistrict ? (
                    <div className="district-card-inner">
                      <img
                        className="district-card-img"
                        src={getImageSrc(hoveredDistrict.imageUrl)}
                        alt={hoveredDistrict.name}
                      />
                      <div className="district-card-body">
                        <h3>{hoveredDistrict.name}</h3>
                        <p className="district-card-meta">
                          <strong>State:</strong> {hoveredDistrict.state || 'Andhra Pradesh'}
                        </p>
                        <p className="district-card-meta">
                          <strong>Famous for:</strong> {hoveredDistrict.famousFor || '—'}
                        </p>
                        <p className="district-card-meta">
                          <strong>Mandals:</strong> {hoveredDistrict.mandalsCount ?? '—'}
                        </p>
                        <div className="district-card-divider" />
                        <p className="district-card-meta">
                          <strong>Collector:</strong> {hoveredDistrict.collectorName || '—'}
                        </p>
                        <p className="district-card-meta">
                          <strong>SP:</strong> {hoveredDistrict.spName || '—'}
                        </p>
                        <p className="district-card-hint">Tip: Platform Admin can update image, famous places, and mandals in the dashboard.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="district-card-empty">
                      Hover (or tap) a district row to see details here.
                    </div>
                  )}
                </aside>
              </div>
            </section>
          )}

          {active === 'police' && (
            <section className="gov-section civic-panel">
              <h2 className="gov-section-title">👮 Andhra Pradesh Police — Higher Authorities</h2>
              <p className="gov-section-desc">
                From DGP at the top to SP in each district — learn who leads the police department at different levels.
              </p>
              <div className="ministry-list">
                {policeAuthorities.map((p, i) => (
                  <article key={p.id} className="ministry-card">
                    <span className="ministry-order">{i + 1}</span>
                    <div className="ministry-body">
                      <h3>{p.designation}</h3>
                      {p.name && <h4>{p.name}</h4>}
                      <p className="ministry-role">{p.details}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {active === 'grievance' && (
            <section className="gov-section civic-panel">
              <h2 className="gov-section-title">📞 Public Grievance Redressal & Spandana</h2>
              <p className="gov-section-desc">
                Learn how citizens of Andhra Pradesh can raise complaints about government services, track resolution,
                and use the <strong>Spandana</strong> / <strong>PGRS (1902)</strong> system — from village Secretariat to Chief Minister&apos;s Office.
              </p>
              <div className="civic-helpline-banner">
                <strong>Toll-free:</strong> <a href="tel:1902">1902</a>
                {' · '}
                <strong>Alternate:</strong> <a href="tel:18004254440">1800-425-4440</a>
                {' · '}
                <strong>Portal:</strong>{' '}
                <a href="https://pgrs.ap.gov.in" target="_blank" rel="noreferrer">pgrs.ap.gov.in</a>
                {' · '}
                <strong>Track status:</strong>{' '}
                <a href="https://meekosam.ap.gov.in" target="_blank" rel="noreferrer">meekosam.ap.gov.in</a>
                {' · '}
                <strong>Email:</strong>{' '}
                <a href="mailto:helpspandana-ap@ap.gov.in">helpspandana-ap@ap.gov.in</a>
              </div>
              <div className="parliament-topics">
                {grievanceTopics.map((topic) => (
                  <details key={topic.id} className="parliament-topic-card" open={topic.order === 1}>
                    <summary>
                      <span className="parliament-topic-icon">{topic.icon}</span>
                      <span>
                        <strong>{topic.title}</strong>
                        {topic.summary && <small>{topic.summary}</small>}
                      </span>
                    </summary>
                    <div className="parliament-topic-body">
                      {formatContent(topic.content)}
                    </div>
                  </details>
                ))}
                {grievanceTopics.length === 0 && (
                  <p className="civic-empty">Grievance guides will appear here once added by the platform admin.</p>
                )}
              </div>
            </section>
          )}

          {active === 'whatsapp' && (
            <section className="gov-section civic-panel">
              <h2 className="gov-section-title">💬 WhatsApp Governance — Mana Mitra</h2>
              <p className="gov-section-desc">
                Andhra Pradesh&apos;s <strong>Mana Mitra</strong> brings government certificates, bills, temple bookings,
                grievances, and more to your phone through WhatsApp — in English and Telugu.
              </p>
              <div className="civic-helpline-banner civic-whatsapp-banner">
                <strong>Official WhatsApp number:</strong>{' '}
                <a href="https://wa.me/919552300009" target="_blank" rel="noreferrer">+91 9552300009</a>
                <span className="civic-whatsapp-hint"> — Save the contact, open WhatsApp, and send &quot;Hi&quot; to start.</span>
              </div>
              <div className="parliament-topics">
                {whatsappServices.map((topic) => (
                  <details key={topic.id} className="parliament-topic-card">
                    <summary>
                      <span className="parliament-topic-icon">{topic.icon}</span>
                      <span>
                        <strong>{topic.title}</strong>
                        {topic.summary && <small>{topic.summary}</small>}
                      </span>
                    </summary>
                    <div className="parliament-topic-body">
                      {topic.contactPhone && (
                        <p>
                          <strong>Contact:</strong>{' '}
                          <a href={`https://wa.me/91${String(topic.contactPhone).replace(/\D/g, '')}`} target="_blank" rel="noreferrer">
                            {topic.contactPhone}
                          </a>
                        </p>
                      )}
                      {formatContent(topic.content)}
                    </div>
                  </details>
                ))}
                {whatsappServices.length === 0 && (
                  <p className="civic-empty">WhatsApp governance guides will appear here once added by the platform admin.</p>
                )}
              </div>
            </section>
          )}

          {active === 'assembly' && (
            <section className="gov-section civic-panel">
              <h2 className="gov-section-title">🏛️ Andhra Pradesh Legislative Assembly</h2>
              <p className="gov-section-desc">
                Learn how the State Assembly works — 175 MLAs, how sessions are conducted, how the Chief Minister is chosen,
                majority seats (88+), and what happens when no party wins outright.
              </p>
              <div className="parliament-topics">
                {assemblyTopics.map((topic) => (
                  <details key={topic.id} className="parliament-topic-card">
                    <summary>
                      <span className="parliament-topic-icon">{topic.icon}</span>
                      <span>
                        <strong>{topic.title}</strong>
                        {topic.summary && <small>{topic.summary}</small>}
                      </span>
                    </summary>
                    <div className="parliament-topic-body">
                      {formatContent(topic.content)}
                    </div>
                  </details>
                ))}
                {assemblyTopics.length === 0 && (
                  <p className="civic-empty">Assembly topics will appear here once added by the platform admin.</p>
                )}
              </div>
            </section>
          )}

          {active === 'parliament' && (
            <section className="gov-section civic-panel">
              <h2 className="gov-section-title">🇮🇳 Parliament & Elections — Student Guide</h2>
              <p className="gov-section-desc">
                Understand Lok Sabha, Rajya Sabha, how members are elected, majority seats, and what happens when no party wins outright.
              </p>
              <div className="parliament-topics">
                {parliamentTopics.map((topic) => (
                  <details key={topic.id} className="parliament-topic-card">
                    <summary>
                      <span className="parliament-topic-icon">{topic.icon}</span>
                      <span>
                        <strong>{topic.title}</strong>
                        {topic.summary && <small>{topic.summary}</small>}
                      </span>
                    </summary>
                    <div className="parliament-topic-body">
                      {formatContent(topic.content)}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {active === 'mla-history' && (
            <section className="gov-section civic-panel">
              <h2 className="gov-section-title">🗳️ MLA Election History</h2>
              <p className="gov-section-desc">
                All <strong>175</strong> assembly constituencies — current MLA (2024) and previous term (2019) with vote
                majority where available (ECI / Oneindia 2024, Wikipedia for 2019).
              </p>
              {allConstituencies.length > 0 ? (
                <>
                  <div className="civic-history-filters">
                    <div className="form-group">
                      <label htmlFor="history-district">Filter by district (optional)</label>
                      <select
                        id="history-district"
                        value={historyDistrict}
                        onChange={(e) => { setHistoryDistrict(e.target.value); setHistoryConstituency(''); }}
                        className="civic-search"
                      >
                        <option value="">All districts — {allConstituencies.length} constituencies</option>
                        {historyDistricts.map((name) => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="history-constituency-search">Search constituency</label>
                      <input
                        id="history-constituency-search"
                        type="search"
                        placeholder="e.g. Mangalagiri, Vijayawada…"
                        value={historyConstituencySearch}
                        onChange={(e) => setHistoryConstituencySearch(e.target.value)}
                        className="civic-search"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="history-constituency">
                        Assembly constituency ({constituenciesForSelect.length}
                        {historyDistrict ? ` in ${historyDistrict}` : ''})
                      </label>
                      <select
                        id="history-constituency"
                        value={selectedConstituency}
                        onChange={(e) => setHistoryConstituency(e.target.value)}
                        className="civic-search"
                      >
                        {constituenciesForSelect.map((name) => {
                          const opt = constituencyOptions.find((o) => o.key === name);
                          return (
                            <option key={name} value={name}>
                              {opt?.label || formatConstituencyLabel(name)}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="mla-history-grid">
                    {historyForView.map((h) => (
                      <article key={h.id} className={`mla-history-card rank-${h.termRank}`}>
                        <span className="mla-history-rank">
                          {h.termRank === 1 ? 'Current (Most Recent)' : `Term #${h.termRank}`}
                        </span>
                        {h.constituency && (
                          <p className="mla-history-constituency">
                            <strong>Constituency:</strong>{' '}
                            {h.constituencyLabel || formatConstituencyLabel(h.constituency)}
                            {h.districtName ? ` (${h.districtName})` : ''}
                          </p>
                        )}
                        <h3>{h.mlaName}</h3>
                        <p className="mla-history-party">{h.party}</p>
                        <p><strong>Term:</strong> {h.termPeriod}</p>
                        <p className="mla-history-margin">
                          <strong>Majority margin:</strong>{' '}
                          {h.majorityMargin && h.majorityMargin !== 'Not available'
                            ? h.majorityMargin
                            : 'Not published for this term'}
                        </p>
                      </article>
                    ))}
                  </div>
                  {historyForView.length === 0 && (
                    <p className="civic-empty">No MLA history recorded for this selection yet.</p>
                  )}
                </>
              ) : (
                <p className="civic-empty">MLA history will appear here once added by the platform admin.</p>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
