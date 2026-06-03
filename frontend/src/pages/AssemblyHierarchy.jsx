import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { getImageSrc } from '../utils/image';
import AssemblyDiagram from '../components/AssemblyDiagram';

export default function AssemblyHierarchy() {
  const [positions, setPositions] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [mps, setMps] = useState([]);
  const [mlas, setMlas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mlaSearch, setMlaSearch] = useState('');

  useEffect(() => {
    Promise.all([
      api.getHierarchy(),
      api.getMinistries(),
      api.getMps(),
      api.getMlas()
    ])
      .then(([pos, min, mpList, mlaList]) => {
        setPositions(pos);
        setMinistries(min);
        setMps(mpList);
        setMlas(mlaList);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredMlas = mlas.filter(
    (m) =>
      m.name.toLowerCase().includes(mlaSearch.toLowerCase()) ||
      m.constituency.toLowerCase().includes(mlaSearch.toLowerCase())
  );

  if (loading) {
    return <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div className="hierarchy-page container">
      <Link to="/learn-hierarchies" className="back-link">← Back to Learn Hierarchies</Link>

      <div className="hierarchy-title">
        <h1>🏛️ Assembly Hierarchy — Andhra Pradesh</h1>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>
          Legislative Assembly seating arrangement, ministries, MPs and MLAs
        </p>
      </div>

      <section className="gov-section">
        <h2 className="gov-section-title">📊 Assembly Seating Arrangement</h2>
        <p className="gov-section-desc">
          Explore the chamber like a map. Hover each coloured card to see a photo and a short explanation written for students.
        </p>

        <div className="assembly-legend">
          <span className="legend-item legend-speaker">🪑 Speaker — presides at the top</span>
          <span className="legend-item legend-treasury">🟢 Green benches — Treasury (ruling government)</span>
          <span className="legend-item legend-opposition">🔴 Red benches — Opposition</span>
          <span className="legend-item legend-gallery">👥 Gallery — media & public visitors</span>
        </div>

        <AssemblyDiagram positions={positions} />

        <div className="assembly-key-profiles">
          <h3>Key leaders in this diagram</h3>
          <div className="key-profiles-grid">
            {['speaker', 'treasury_cm', 'treasury_deputy', 'treasury_ministers', 'opposition_leader', 'opposition_deputy']
              .map((slot) => positions.find((p) => p.slot === slot))
              .filter(Boolean)
              .map((p) => (
                <article key={p.id} className={`key-profile-card key-${p.slot}`}>
                  {p.personPhoto ? (
                    <img src={getImageSrc(p.personPhoto)} alt={p.personName} />
                  ) : (
                    <div className="key-profile-placeholder">{p.personName?.charAt(0) || '?'}</div>
                  )}
                  <div>
                    <strong>{p.personName}</strong>
                    <span>{p.title}</span>
                    <p>{p.designation}</p>
                  </div>
                </article>
              ))}
          </div>
        </div>
      </section>

      <section className="gov-section">
        <h2 className="gov-section-title">🏢 State Ministries & Departments</h2>
        <div className="ministry-list">
          {ministries.map((m, idx) => (
            <article key={m.id} className="ministry-card">
              <div className="ministry-order">{idx + 1}</div>
              {m.photoUrl ? (
                <img className="ministry-photo" src={getImageSrc(m.photoUrl)} alt={m.ministerName} />
              ) : (
                <div className="ministry-photo placeholder">🏛️</div>
              )}
              <div className="ministry-body">
                <h3>{m.name}</h3>
                <h4>{m.ministerName}</h4>
                <p className="ministry-dept"><strong>Department:</strong> {m.department}</p>
                <p className="ministry-role">{m.responsibilities}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="gov-section">
        <h2 className="gov-section-title">🇮🇳 Lok Sabha MPs — Andhra Pradesh</h2>
        <div className="mp-grid">
          {mps.map((mp, idx) => (
            <article key={mp.id} className="mp-card">
              <span className="mp-num">{idx + 1}</span>
              {mp.photoUrl && <img className="mp-photo" src={getImageSrc(mp.photoUrl)} alt={mp.name} />}
              <div className="mp-body">
                <h3>{mp.name}</h3>
                <p className="mp-constituency">{mp.constituency}</p>
                {mp.party && <span className="party-badge">{mp.party}</span>}
                <p className="mp-role">{mp.responsibilities}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="gov-section">
        <h2 className="gov-section-title">🗳️ MLAs — Andhra Pradesh ({mlas.length})</h2>
        <div className="mla-search-wrap">
          <input
            type="search"
            placeholder="Search by MLA name or constituency..."
            value={mlaSearch}
            onChange={(e) => setMlaSearch(e.target.value)}
            className="mla-search"
          />
        </div>
        <div className="mla-table-wrap">
          <table className="mla-table">
            <thead>
              <tr><th>#</th><th>MLA Name</th><th>Constituency</th><th>Party</th></tr>
            </thead>
            <tbody>
              {filteredMlas.map((mla, idx) => (
                <tr key={mla.id}>
                  <td>{idx + 1}</td>
                  <td><strong>{mla.name}</strong></td>
                  <td>{mla.constituency}</td>
                  <td><span className="party-badge small">{mla.party || '—'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
