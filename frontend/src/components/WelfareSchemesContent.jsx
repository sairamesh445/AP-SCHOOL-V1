import { useMemo } from 'react';

const COLUMNS = [
  'Scheme with Description',
  'Category',
  'Benefit',
  'Eligible Beneficiaries'
];

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

export default function WelfareSchemesContent({ items }) {
  const grouped = useMemo(() => groupItemsBySubgroup(items), [items]);

  const groups = [...grouped.entries()].sort(
    (a, b) => (a[1][0]?.extra?.subgroupOrder || 0) - (b[1][0]?.extra?.subgroupOrder || 0)
  );

  return (
    <div className="welfare-schemes-content">
      {groups.map(([subgroup, rows]) => (
        <div key={subgroup} className="section-table-group">
          <h3 className="section-table-subtitle">{subgroup}</h3>
          <div className="district-table-wrap">
            <table className="civic-table section-data-table welfare-schemes-table">
              <thead>
                <tr>
                  {COLUMNS.map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((item) => (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>{item.extra?.category || '—'}</td>
                    <td>{item.extra?.benefit || '—'}</td>
                    <td>{item.extra?.beneficiaries || item.description || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
