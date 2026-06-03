import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { api } from '../api/client';
import ContentCard from '../components/ContentCard';
import SectionTableContent from '../components/SectionTableContent';

const TABLE_SECTION_SLUGS = new Set([
  'constitution_laws',
  'government_manifesto'
]);

export default function SectionDetail() {
  const { slug } = useParams();
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSections()
      .then((sections) => {
        const found = sections.find((s) => s.slug === slug);
        setSection(found);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (slug === 'test_knowledge') {
    return <Navigate to="/quiz" replace />;
  }

  if (loading) return <div className="container" style={{ padding: '3rem' }}>Loading...</div>;
  if (!section) return <div className="container" style={{ padding: '3rem' }}>Section not found</div>;

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div className="section-header">
        <span className="section-icon">{section.category?.icon || '📋'}</span>
        <h2>{section.category?.name}</h2>
      </div>
      {section.category?.description && (
        <p style={{ marginBottom: '1.5rem', color: '#666' }}>{section.category.description}</p>
      )}
      {section.items?.length > 0 ? (
        TABLE_SECTION_SLUGS.has(slug) ? (
          <SectionTableContent slug={slug} items={section.items} />
        ) : (
          section.items.map((item) => <ContentCard key={item.id} item={item} />)
        )
      ) : (
        <p style={{ color: '#888' }}>No content in this section yet.</p>
      )}
    </div>
  );
}
