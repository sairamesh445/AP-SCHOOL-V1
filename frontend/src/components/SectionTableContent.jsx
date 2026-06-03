import ConstitutionLawsContent from './ConstitutionLawsContent';
import WelfareSchemesContent from './WelfareSchemesContent';

export default function SectionTableContent({ slug, items }) {
  if (slug === 'constitution_laws') {
    return <ConstitutionLawsContent items={items} />;
  }

  if (slug === 'government_manifesto') {
    return (
      <div className="section-table-content">
        <WelfareSchemesContent items={items} />
      </div>
    );
  }

  return null;
}
