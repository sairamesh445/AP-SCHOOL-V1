import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CONSTITUTION_CATEGORIES } from '../data/constitution-categories';

const PAGE_TITLE = 'Basic Constitutional Rights & Important Laws in India';

function groupItemsBySubgroup(items) {
  const map = new Map();
  for (const item of items) {
    const key = item.extra?.subgroup;
    if (!key) continue;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  for (const rows of map.values()) {
    rows.sort((a, b) => (a.order || 0) - (b.order || 0));
  }
  return map;
}

function CategoryTable({ category, rows }) {
  const threeCol = category.threeCol;

  return (
    <div className="constitution-category-block" id={`category-${category.id}`}>
      <h3 className="constitution-category-heading">
        Category {category.id}: {category.title}
      </h3>
      <div className="district-table-wrap">
        <table className="civic-table section-data-table">
          <thead>
            <tr>
              {category.columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                {threeCol && <td>{item.extra?.article || '—'}</td>}
                <td>{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ConstitutionLawsContent({ items }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCat = searchParams.get('cat');
  const activeId = activeCat ? parseInt(activeCat, 10) : null;

  const grouped = useMemo(() => groupItemsBySubgroup(items), [items]);

  const categoriesWithRows = CONSTITUTION_CATEGORIES.map((cat) => ({
    ...cat,
    rows: grouped.get(cat.subgroup) || []
  }));

  const visibleCategories =
    activeId && categoriesWithRows.find((c) => c.id === activeId)
      ? categoriesWithRows.filter((c) => c.id === activeId)
      : categoriesWithRows;

  return (
    <div className="constitution-laws-content">
      <h3 className="section-table-page-title">{PAGE_TITLE}</h3>

      <p className="constitution-laws-intro">Select a category to view its laws and rights:</p>

      <div className="constitution-category-grid">
        {categoriesWithRows.map((cat) => {
          const count = cat.rows.length;
          const isActive = activeId === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              className={`constitution-category-card${isActive ? ' active' : ''}`}
              onClick={() => setSearchParams({ cat: String(cat.id) })}
            >
              <span className="constitution-category-num">Category {cat.id}</span>
              <span className="constitution-category-name">{cat.title}</span>
              <span className="constitution-category-count">{count} entries</span>
            </button>
          );
        })}
      </div>

      {activeId && (
        <div className="constitution-view-all">
          <Link to="/section/constitution_laws">← View all 4 categories</Link>
        </div>
      )}

      <div className="constitution-categories-list">
        {visibleCategories.map((cat) =>
          cat.rows.length > 0 ? (
            <CategoryTable key={cat.id} category={cat} rows={cat.rows} />
          ) : (
            <div key={cat.id} className="constitution-category-block">
              <h3 className="constitution-category-heading">
                Category {cat.id}: {cat.title}
              </h3>
              <p className="civic-empty">No content in this category yet.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
