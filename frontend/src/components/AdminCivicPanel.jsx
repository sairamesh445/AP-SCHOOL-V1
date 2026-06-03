import { useState, useEffect } from 'react';
import { api, resolveImageUrl } from '../api/client';
import ImageUpload from './ImageUpload';

const TAB_CONFIG = {
  civic_districts: {
    title: 'District',
    listKey: 'districts',
    empty: {
      state: 'Andhra Pradesh',
      name: '',
      mapId: '',
      imageUrl: '',
      famousFor: '',
      headquarters: '',
      region: '',
      areaSqKm: '',
      population: '',
      established: '',
      website: '',
      mandalsCount: '',
      collectorName: '',
      spName: '',
      collectorEmail: '',
      collectorPhone: '',
      spEmail: '',
      spPhone: '',
      order: 0
    },
    fields: (form, setForm) => (
      <>
        <div className="form-group">
          <label>State</label>
          <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="Andhra Pradesh" />
        </div>
        <div className="form-group"><label>District Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
        <div className="form-group">
          <label>Map ID (for interactive AP map)</label>
          <input
            value={form.mapId}
            onChange={(e) => setForm({ ...form, mapId: e.target.value.toUpperCase().trim() })}
            placeholder="e.g. VIZ, NTR, KUR..."
          />
          <small style={{ display: 'block', opacity: 0.75, marginTop: '0.25rem' }}>
            Tip: Use one of these codes: SRI, VIZ, VIS, EGA, WGE, KRI, GUN, KUR, PRA, YSR, SPS, ANA, CHI, TIR, ANN, SSS, BAP, PMA, ELU, ASR, KON, KAK, ANK, NAN, NTR, PAL
          </small>
        </div>
        <ImageUpload
          label="District Image"
          currentUrl={form.imageUrl}
          onFileChange={(file) => setForm({ ...form, imageFile: file })}
          hint="Upload a district photo/logo (optional) — max 5MB"
        />
        <div className="form-group">
          <label>What is famous there?</label>
          <input value={form.famousFor} onChange={(e) => setForm({ ...form, famousFor: e.target.value })} placeholder="e.g. Tirumala temple, beaches, mangoes..." />
        </div>
        <div className="form-group">
          <label>Headquarters</label>
          <input value={form.headquarters} onChange={(e) => setForm({ ...form, headquarters: e.target.value })} placeholder="e.g. Tirupati" />
        </div>
        <div className="form-group">
          <label>Region (optional)</label>
          <input value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} placeholder="e.g. Rayalaseema / Coastal Andhra / North Andhra" />
        </div>
        <div className="form-group">
          <label>Area (sq km)</label>
          <input type="number" value={form.areaSqKm} onChange={(e) => setForm({ ...form, areaSqKm: e.target.value })} placeholder="e.g. 8827" min={0} />
        </div>
        <div className="form-group">
          <label>Population</label>
          <input type="number" value={form.population} onChange={(e) => setForm({ ...form, population: e.target.value })} placeholder="e.g. 2189471" min={0} />
        </div>
        <div className="form-group">
          <label>Established (optional)</label>
          <input value={form.established} onChange={(e) => setForm({ ...form, established: e.target.value })} placeholder="e.g. 2022-04-04" />
        </div>
        <div className="form-group">
          <label>Official website (optional)</label>
          <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://..." />
        </div>
        <div className="form-group">
          <label>How many mandals?</label>
          <input
            type="number"
            value={form.mandalsCount}
            onChange={(e) => setForm({ ...form, mandalsCount: e.target.value })}
            placeholder="e.g. 50"
            min={0}
          />
        </div>
        <div className="form-group"><label>Collector Name</label><input value={form.collectorName} onChange={(e) => setForm({ ...form, collectorName: e.target.value })} required /></div>
        <div className="form-group"><label>Collector Email</label><input type="email" value={form.collectorEmail} onChange={(e) => setForm({ ...form, collectorEmail: e.target.value })} /></div>
        <div className="form-group"><label>Collector Phone</label><input value={form.collectorPhone} onChange={(e) => setForm({ ...form, collectorPhone: e.target.value })} /></div>
        <div className="form-group"><label>SP Name</label><input value={form.spName} onChange={(e) => setForm({ ...form, spName: e.target.value })} required /></div>
        <div className="form-group"><label>SP Email</label><input type="email" value={form.spEmail} onChange={(e) => setForm({ ...form, spEmail: e.target.value })} /></div>
        <div className="form-group"><label>SP Phone</label><input value={form.spPhone} onChange={(e) => setForm({ ...form, spPhone: e.target.value })} /></div>
      </>
    ),
    tableHead: ['State', 'District', 'Famous for', 'Mandals', 'Collector', 'SP'],
    tableRow: (r) => [r.state || '—', r.name, r.famousFor || '—', r.mandalsCount ?? '—', r.collectorName, r.spName],
    load: () => api.getAdminDistricts(),
    create: (p) => api.createDistrict(p),
    update: (id, p) => api.updateDistrict(id, p),
    remove: (id) => api.deleteDistrict(id),
    preparePayload: async (form) => {
      const imageUrl = await resolveImageUrl(form.imageFile, form.imageUrl);
      return {
        state: form.state || 'Andhra Pradesh',
        name: form.name,
        mapId: (form.mapId || '').toUpperCase().trim(),
        imageUrl: imageUrl || form.imageUrl || '',
        famousFor: form.famousFor || '',
        headquarters: form.headquarters || '',
        region: form.region || '',
        areaSqKm: form.areaSqKm === '' ? null : Number(form.areaSqKm),
        population: form.population === '' ? null : Number(form.population),
        established: form.established || '',
        website: form.website || '',
        mandalsCount: form.mandalsCount === '' ? null : Number(form.mandalsCount),
        collectorName: form.collectorName,
        spName: form.spName,
        collectorEmail: form.collectorEmail || '',
        collectorPhone: form.collectorPhone || '',
        spEmail: form.spEmail || '',
        spPhone: form.spPhone || '',
        order: Number(form.order) || 0
      };
    },
    toForm: (r) => ({
      state: r.state || 'Andhra Pradesh',
      name: r.name,
      mapId: (r.mapId || '').toUpperCase().trim(),
      imageUrl: r.imageUrl || '',
      famousFor: r.famousFor || '',
      headquarters: r.headquarters || '',
      region: r.region || '',
      areaSqKm: typeof r.areaSqKm === 'number' ? r.areaSqKm : '',
      population: typeof r.population === 'number' ? r.population : '',
      established: r.established || '',
      website: r.website || '',
      mandalsCount: typeof r.mandalsCount === 'number' ? r.mandalsCount : '',
      imageFile: null,
      collectorName: r.collectorName,
      spName: r.spName,
      collectorEmail: r.collectorEmail || '',
      collectorPhone: r.collectorPhone || '',
      spEmail: r.spEmail || '',
      spPhone: r.spPhone || '',
      order: r.order
    })
  },
  civic_police: {
    title: 'Police Authority',
    listKey: 'police',
    empty: { designation: '', name: '', details: '', order: 0 },
    fields: (form, setForm) => (
      <>
        <div className="form-group"><label>Designation</label><input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} required /></div>
        <div className="form-group"><label>Officer Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div className="form-group"><label>Details</label><textarea value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} rows={3} /></div>
      </>
    ),
    tableHead: ['Designation', 'Name'],
    tableRow: (r) => [r.designation, r.name],
    load: () => api.getAdminPolice(),
    create: (p) => api.createPolice(p),
    update: (id, p) => api.updatePolice(id, p),
    remove: (id) => api.deletePolice(id),
    toForm: (r) => ({ designation: r.designation, name: r.name, details: r.details, order: r.order })
  },
  civic_grievance: {
    title: 'Grievance Topic',
    listKey: 'grievance',
    empty: { title: '', icon: '📞', summary: '', content: '', order: 0 },
    fields: (form, setForm) => (
      <>
        <div className="form-group"><label>Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
        <div className="form-group"><label>Icon (emoji)</label><input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} /></div>
        <div className="form-group"><label>Short Summary</label><input value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} /></div>
        <div className="form-group"><label>Content (use • for bullet points)</label><textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} required /></div>
      </>
    ),
    tableHead: ['Title', 'Summary'],
    tableRow: (r) => [r.title, r.summary],
    load: () => api.getAdminGrievance(),
    create: (p) => api.createGrievance(p),
    update: (id, p) => api.updateGrievance(id, p),
    remove: (id) => api.deleteGrievance(id),
    toForm: (r) => ({ title: r.title, icon: r.icon, summary: r.summary, content: r.content, order: r.order })
  },
  civic_whatsapp: {
    title: 'WhatsApp Service Guide',
    listKey: 'whatsapp',
    empty: { title: '', icon: '💬', summary: '', content: '', contactPhone: '9552300009', order: 0 },
    fields: (form, setForm) => (
      <>
        <div className="form-group"><label>Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
        <div className="form-group"><label>Icon (emoji)</label><input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} /></div>
        <div className="form-group"><label>WhatsApp Number</label><input value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} placeholder="9552300009" /></div>
        <div className="form-group"><label>Short Summary</label><input value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} /></div>
        <div className="form-group"><label>Content (use • for bullet points)</label><textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} required /></div>
      </>
    ),
    tableHead: ['Title', 'Phone', 'Summary'],
    tableRow: (r) => [r.title, r.contactPhone || '9552300009', r.summary],
    load: () => api.getAdminWhatsapp(),
    create: (p) => api.createWhatsapp(p),
    update: (id, p) => api.updateWhatsapp(id, p),
    remove: (id) => api.deleteWhatsapp(id),
    toForm: (r) => ({
      title: r.title,
      icon: r.icon,
      summary: r.summary,
      content: r.content,
      contactPhone: r.contactPhone || '9552300009',
      order: r.order
    })
  },
  civic_assembly: {
    title: 'Assembly Topic',
    listKey: 'assembly',
    empty: { title: '', icon: '🏛️', summary: '', content: '', order: 0 },
    fields: (form, setForm) => (
      <>
        <div className="form-group"><label>Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
        <div className="form-group"><label>Icon (emoji)</label><input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} /></div>
        <div className="form-group"><label>Short Summary</label><input value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} /></div>
        <div className="form-group"><label>Content (use • for bullet points)</label><textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} required /></div>
      </>
    ),
    tableHead: ['Title', 'Summary'],
    tableRow: (r) => [r.title, r.summary],
    load: () => api.getAdminAssembly(),
    create: (p) => api.createAssembly(p),
    update: (id, p) => api.updateAssembly(id, p),
    remove: (id) => api.deleteAssembly(id),
    toForm: (r) => ({ title: r.title, icon: r.icon, summary: r.summary, content: r.content, order: r.order })
  },
  civic_parliament: {
    title: 'Parliament Topic',
    listKey: 'parliament',
    empty: { title: '', icon: '📖', summary: '', content: '', order: 0 },
    fields: (form, setForm) => (
      <>
        <div className="form-group"><label>Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
        <div className="form-group"><label>Icon (emoji)</label><input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} /></div>
        <div className="form-group"><label>Short Summary</label><input value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} /></div>
        <div className="form-group"><label>Content (use • for bullet points)</label><textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} required /></div>
      </>
    ),
    tableHead: ['Title', 'Summary'],
    tableRow: (r) => [r.title, r.summary],
    load: () => api.getAdminParliament(),
    create: (p) => api.createParliament(p),
    update: (id, p) => api.updateParliament(id, p),
    remove: (id) => api.deleteParliament(id),
    toForm: (r) => ({ title: r.title, icon: r.icon, summary: r.summary, content: r.content, order: r.order })
  },
  civic_mla_history: {
    title: 'MLA History Record',
    listKey: 'mlaHistory',
    empty: { districtName: '', constituency: '', mlaName: '', party: '', termPeriod: '', majorityMargin: '', termRank: 1, order: 0 },
    fields: (form, setForm) => (
      <>
        <div className="form-group"><label>District</label><input value={form.districtName} onChange={(e) => setForm({ ...form, districtName: e.target.value })} required /></div>
        <div className="form-group"><label>Assembly Constituency</label><input value={form.constituency} onChange={(e) => setForm({ ...form, constituency: e.target.value })} required /></div>
        <div className="form-group"><label>MLA Name</label><input value={form.mlaName} onChange={(e) => setForm({ ...form, mlaName: e.target.value })} required /></div>
        <div className="form-group"><label>Party</label><input value={form.party} onChange={(e) => setForm({ ...form, party: e.target.value })} /></div>
        <div className="form-group"><label>Term Period</label><input value={form.termPeriod} onChange={(e) => setForm({ ...form, termPeriod: e.target.value })} placeholder="2024–2029" /></div>
        <div className="form-group"><label>Majority Won By</label><input value={form.majorityMargin} onChange={(e) => setForm({ ...form, majorityMargin: e.target.value })} placeholder="51,150 votes (27.14%)" /></div>
        <div className="form-group">
          <label>Term rank (1 = most recent, up to 5)</label>
          <select value={form.termRank} onChange={(e) => setForm({ ...form, termRank: Number(e.target.value) })}>
            <option value={1}>1 — Most Recent</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5 — Oldest</option>
          </select>
        </div>
      </>
    ),
    tableHead: ['Constituency', 'MLA', 'Rank', 'Margin'],
    tableRow: (r) => [r.constituency || r.districtName, r.mlaName, r.termRank, r.majorityMargin],
    load: () => api.getAdminMlaHistory(),
    create: (p) => api.createMlaHistory(p),
    update: (id, p) => api.updateMlaHistory(id, p),
    remove: (id) => api.deleteMlaHistory(id),
    toForm: (r) => ({
      districtName: r.districtName,
      constituency: r.constituency || '',
      mlaName: r.mlaName,
      party: r.party,
      termPeriod: r.termPeriod,
      majorityMargin: r.majorityMargin,
      termRank: r.termRank,
      order: r.order
    })
  }
};

export default function AdminCivicPanel({ activeTab, onMessage, onError }) {
  const config = TAB_CONFIG[activeTab];
  const [rows, setRows] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(config?.empty || {});

  const load = async () => {
    if (!config) return;
    try {
      setRows(await config.load());
    } catch (e) {
      onError(e.message);
    }
  };

  useEffect(() => {
    if (config) {
      setForm(config.empty);
      setEditId(null);
      load();
    }
  }, [activeTab]);

  if (!config) return null;

  const cancel = () => {
    setEditId(null);
    setForm(config.empty);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = config.preparePayload ? await config.preparePayload(form) : form;
      if (editId) {
        await config.update(editId, payload);
        onMessage(`${config.title} updated!`);
      } else {
        await config.create(payload);
        onMessage(`${config.title} added!`);
      }
      cancel();
      load();
    } catch (err) {
      onError(err.message);
    }
  };

  return (
    <>
      {editId && (
        <div className="edit-banner">
          Editing — <button type="button" onClick={cancel}>Cancel</button>
        </div>
      )}
      <h3>{editId ? `Update ${config.title}` : `Add ${config.title}`}</h3>
      <form className="admin-form" onSubmit={handleSubmit}>
        {config.fields(form, setForm)}
        <div className="form-group">
          <label>Display Order</label>
          <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
        </div>
        <button type="submit" className="btn-secondary">{editId ? 'Update' : 'Add'}</button>
        {editId && <button type="button" className="btn-cancel" onClick={cancel}>Cancel</button>}
      </form>
      <table className="admin-table">
        <thead>
          <tr>
            {config.tableHead.map((h) => <th key={h}>{h}</th>)}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {config.tableRow(row).map((cell, i) => <td key={i}>{cell}</td>)}
              <td className="action-cell">
                <button type="button" className="btn-edit" onClick={() => { setEditId(row.id); setForm(config.toForm(row)); }}>Edit</button>
                <button type="button" className="btn-danger" onClick={() => config.remove(row.id).then(load)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
