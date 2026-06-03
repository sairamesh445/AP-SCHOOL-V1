import { Link } from 'react-router-dom';

export default function LearnHierarchies() {
  return (
    <div className="container learn-hierarchies-page">
      <div className="hierarchy-title">
        <h1>📚 Learn Hierarchies</h1>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>
          Choose which branch of government you want to explore
        </p>
      </div>

      <div className="hierarchy-choice-grid">
        <Link to="/learn-hierarchies/assembly" className="hierarchy-choice-card assembly">
          <span className="choice-icon">🏛️</span>
          <h2>Assembly Hierarchy</h2>
          <p>
            Legislative Assembly seating, Speaker, Treasury & Opposition benches, ministries, MPs and MLAs of Andhra Pradesh.
          </p>
          <span className="choice-cta">Explore Assembly →</span>
        </Link>

        <Link to="/learn-hierarchies/court" className="hierarchy-choice-card court">
          <span className="choice-icon">⚖️</span>
          <h2>Court Hierarchy</h2>
          <p>
            High Court sitting arrangement, benches, and profiles of current Andhra Pradesh High Court authorities.
          </p>
          <span className="choice-cta">Explore Court →</span>
        </Link>

        <Link to="/know-ap" className="hierarchy-choice-card civic">
          <span className="choice-icon">📚</span>
          <h2>Know Andhra Pradesh</h2>
          <p>
            Districts, Collectors, SPs, police leaders, OSDs, IAS officers, Parliament basics, and MLA election history.
          </p>
          <span className="choice-cta">Explore Civic Knowledge →</span>
        </Link>
      </div>
    </div>
  );
}
