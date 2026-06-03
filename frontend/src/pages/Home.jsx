import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import Carousel from '../components/Carousel';
import ContentCard from '../components/ContentCard';
import { CONSTITUTION_CATEGORIES } from '../data/constitution-categories';

const SECTION_LINKS = {
  helpline: { icon: '📞', color: '#FF6B35' },
  fundamental_rights: { icon: '⚖️', color: '#4361EE' },
  constitution_laws: { icon: '📜', color: '#7B2CBF' },
  test_knowledge: { icon: '🎯', color: '#F72585' },
  government_manifesto: { icon: '🏛️', color: '#1B4965' }
};

export default function Home() {
  const [sections, setSections] = useState([]);
  const [carousel, setCarousel] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getSections(), api.getCarousel()])
      .then(([secs, slides]) => {
        setSections(secs);
        setCarousel(slides);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="container">
      <Carousel slides={carousel} />

      {sections
        .filter(({ slug }) => slug !== 'test_knowledge')
        .map(({ slug, category, items }) => {
        const meta = SECTION_LINKS[slug] || { icon: '📋', color: '#FF6B35' };
        const previewItems = items.slice(0, 2);

        return (
          <section key={slug} className="section-block">
            <div className="section-header">
              <span className="section-icon">{category?.icon || meta.icon}</span>
              <h2>{category?.name || slug.replace(/_/g, ' ')}</h2>
              <Link
                to={`/section/${slug}`}
                style={{
                  marginLeft: 'auto',
                  color: meta.color,
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              >
                View All →
              </Link>
            </div>

            {slug === 'constitution_laws' ? (
              <div className="constitution-category-grid constitution-category-grid--home">
                {CONSTITUTION_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/section/constitution_laws?cat=${cat.id}`}
                    className="constitution-category-card"
                  >
                    <span className="constitution-category-num">Category {cat.id}</span>
                    <span className="constitution-category-name">{cat.title}</span>
                  </Link>
                ))}
              </div>
            ) : slug === 'government_manifesto' ? (
              items.length > 0 ? (
                <p style={{ color: '#555', padding: '0.5rem 1rem 1rem' }}>
                  {items.length} entries — open <strong>View All</strong> for the full table.
                </p>
              ) : (
                <p style={{ color: '#888', padding: '1rem' }}>Content coming soon...</p>
              )
            ) : previewItems.length > 0 ? (
              previewItems.map((item) => <ContentCard key={item.id} item={item} />)
            ) : (
              <p style={{ color: '#888', padding: '1rem' }}>Content coming soon...</p>
            )}
          </section>
        );
      })}
    </div>
  );
}
