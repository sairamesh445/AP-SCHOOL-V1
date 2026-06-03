import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { getImageSrc } from '../utils/image';
import CourtDiagram from '../components/CourtDiagram';

const KEY_COURT_SLOTS = [
  'chief_justice',
  'senior_counsel',
  'accused',
  'victim',
  'govt_advocates',
  'defense_advocates',
  'public_gallery'
];

export default function CourtHierarchy() {
  const [positions, setPositions] = useState([]);
  const [authorities, setAuthorities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getCourtPositions(), api.getCourtAuthorities()])
      .then(([pos, auth]) => {
        setPositions(pos);
        setAuthorities(auth);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div className="hierarchy-page container">
      <Link to="/learn-hierarchies" className="back-link">← Back to Learn Hierarchies</Link>

      <div className="hierarchy-title">
        <h1>⚖️ Court Hierarchy — Andhra Pradesh High Court</h1>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>
          High Court of Andhra Pradesh courtroom layout and profiles of judicial authorities
        </p>
      </div>

      <section className="gov-section">
        <h2 className="gov-section-title">🏛️ High Court Courtroom Layout</h2>
        <p className="gov-section-desc">
          Explore the courtroom like a map. Hover each coloured card to see a photo and a short explanation written for students.
        </p>

        <div className="assembly-legend court-legend">
          <span className="legend-item legend-speaker">⚖️ Judge&apos;s Bench — presides at the top</span>
          <span className="legend-item legend-treasury">📗 Government advocates &amp; senior counsel</span>
          <span className="legend-item legend-opposition">📕 Accused box</span>
          <span className="legend-item legend-victim">📙 Victim box</span>
          <span className="legend-item legend-gallery">👥 Public gallery</span>
        </div>

        <CourtDiagram positions={positions} />

        <div className="assembly-key-profiles court-key-profiles">
          <h3>Key roles in this courtroom</h3>
          <div className="key-profiles-grid">
            {KEY_COURT_SLOTS.map((slot) => positions.find((p) => p.slot === slot))
              .filter(Boolean)
              .map((p) => (
                <article key={p.id} className={`key-profile-card key-court-${p.slot}`}>
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
        <h2 className="gov-section-title">👨‍⚖️ Current High Court Authorities</h2>
        <p className="gov-section-desc">
          Judges and senior officials of the High Court of Andhra Pradesh at Amaravati.
        </p>
        <div className="ministry-list">
          {authorities.map((a, idx) => (
            <article key={a.id} className="ministry-card" style={{ borderLeftColor: '#7B2CBF' }}>
              <div className="ministry-order">{idx + 1}</div>
              {a.photoUrl ? (
                <img className="ministry-photo" src={getImageSrc(a.photoUrl)} alt={a.name} />
              ) : (
                <div className="ministry-photo placeholder">⚖️</div>
              )}
              <div className="ministry-body">
                <h3>{a.name}</h3>
                <h4>{a.designation}</h4>
                {a.role && <span className="party-badge">{a.role}</span>}
                <p className="ministry-role">{a.responsibilities}</p>
              </div>
            </article>
          ))}
          {authorities.length === 0 && (
            <p className="empty-msg">Court authority data will be added by the administrator.</p>
          )}
        </div>
      </section>
    </div>
  );
}
