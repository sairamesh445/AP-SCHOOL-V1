import { useState, useEffect } from 'react';
import { api, resolveImageUrl } from '../api/client';
import ImageUpload from './ImageUpload';
import { getImageSrc } from '../utils/image';

const COURT_SLOTS = [
  'chief_justice', 'judges_entry', 'court_officers_entry', 'senior_counsel',
  'accused', 'victim', 'court_officers_left', 'court_officers_right',
  'govt_advocates', 'defense_advocates', 'registrar', 'public_gallery', 'other'
];

const ASSEMBLY_SLOTS = [
  'speaker', 'secretariat_left', 'secretariat_right', 'central_well',
  'treasury_cm', 'treasury_deputy', 'treasury_ministers', 'treasury_mlas',
  'opposition_leader', 'opposition_deputy', 'opposition_senior', 'opposition_mlas',
  'gallery_press', 'gallery_public', 'other'
];

export default function AdminCourtPanel({ activeTab, onMessage, onError }) {
  const [positions, setPositions] = useState([]);
  const [authorities, setAuthorities] = useState([]);
  const [editId, setEditId] = useState(null);
  const [posForm, setPosForm] = useState({
    title: '', designation: '', personName: '', responsibilities: '', slot: 'chief_justice', order: 0
  });
  const [authForm, setAuthForm] = useState({
    name: '', designation: '', role: '', responsibilities: '', order: 0
  });
  const [posPhoto, setPosPhoto] = useState(null);
  const [posPhotoUrl, setPosPhotoUrl] = useState('');
  const [authPhoto, setAuthPhoto] = useState(null);
  const [authPhotoUrl, setAuthPhotoUrl] = useState('');

  const load = async () => {
    const [p, a] = await Promise.all([api.getAdminCourtPositions(), api.getAdminCourtAuthorities()]);
    setPositions(p);
    setAuthorities(a);
  };

  useEffect(() => { load().catch((e) => onError(e.message)); }, []);

  const cancel = () => {
    setEditId(null);
    setPosForm({ title: '', designation: '', personName: '', responsibilities: '', slot: 'chief_justice', order: 0 });
    setAuthForm({ name: '', designation: '', role: '', responsibilities: '', order: 0 });
    setPosPhoto(null);
    setAuthPhoto(null);
    setPosPhotoUrl('');
    setAuthPhotoUrl('');
  };

  const handlePos = async (e) => {
    e.preventDefault();
    try {
      const personPhoto = await resolveImageUrl(posPhoto, posPhotoUrl);
      const payload = { ...posForm, personPhoto: personPhoto || posPhotoUrl };
      if (editId) {
        await api.updateCourtPosition(editId, payload);
        onMessage('Court position updated!');
      } else {
        await api.createCourtPosition(payload);
        onMessage('Court position added!');
      }
      cancel();
      load();
    } catch (e) { onError(e.message); }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const photoUrl = await resolveImageUrl(authPhoto, authPhotoUrl);
      const payload = { ...authForm, photoUrl: photoUrl || authPhotoUrl };
      if (editId) {
        await api.updateCourtAuthority(editId, payload);
        onMessage('Court authority updated!');
      } else {
        await api.createCourtAuthority(payload);
        onMessage('Court authority added!');
      }
      cancel();
      load();
    } catch (e) { onError(e.message); }
  };

  if (activeTab === 'court_positions') {
    return (
      <>
        {editId && <div className="edit-banner">Editing — <button type="button" onClick={cancel}>Cancel</button></div>}
        <h3>{editId ? 'Update' : 'Add'} Court Diagram Position</h3>
        <form className="admin-form" onSubmit={handlePos}>
          <div className="form-group">
            <label>Slot (diagram area)</label>
            <select value={posForm.slot} onChange={(e) => setPosForm({ ...posForm, slot: e.target.value })}>
              {COURT_SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Title</label><input value={posForm.title} onChange={(e) => setPosForm({ ...posForm, title: e.target.value })} required /></div>
          <div className="form-group"><label>Person Name</label><input value={posForm.personName} onChange={(e) => setPosForm({ ...posForm, personName: e.target.value })} /></div>
          <div className="form-group"><label>Designation</label><input value={posForm.designation} onChange={(e) => setPosForm({ ...posForm, designation: e.target.value })} /></div>
          <div className="form-group"><label>Responsibilities</label><textarea value={posForm.responsibilities} onChange={(e) => setPosForm({ ...posForm, responsibilities: e.target.value })} rows={2} /></div>
          <ImageUpload label="Photo" currentUrl={posPhotoUrl} onFileChange={setPosPhoto} />
          <button type="submit" className="btn-secondary">{editId ? 'Update' : 'Add'}</button>
        </form>
        <table className="admin-table">
          <thead><tr><th>Slot</th><th>Title</th><th>Person</th><th>Actions</th></tr></thead>
          <tbody>
            {positions.map((p) => (
              <tr key={p.id}>
                <td>{p.slot}</td><td>{p.title}</td><td>{p.personName}</td>
                <td className="action-cell">
                  <button type="button" className="btn-edit" onClick={() => { setEditId(p.id); setPosForm(p); setPosPhotoUrl(p.personPhoto || ''); }}>Edit</button>
                  <button type="button" className="btn-danger" onClick={() => api.deleteCourtPosition(p.id).then(load)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  }

  return (
    <>
      {editId && <div className="edit-banner">Editing — <button type="button" onClick={cancel}>Cancel</button></div>}
      <h3>{editId ? 'Update' : 'Add'} High Court Authority</h3>
      <form className="admin-form" onSubmit={handleAuth}>
        <div className="form-group"><label>Name</label><input value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} required /></div>
        <div className="form-group"><label>Designation</label><input value={authForm.designation} onChange={(e) => setAuthForm({ ...authForm, designation: e.target.value })} /></div>
        <div className="form-group"><label>Role</label><input value={authForm.role} onChange={(e) => setAuthForm({ ...authForm, role: e.target.value })} placeholder="Chief Justice, Puisne Judge" /></div>
        <div className="form-group"><label>Responsibilities</label><textarea value={authForm.responsibilities} onChange={(e) => setAuthForm({ ...authForm, responsibilities: e.target.value })} rows={3} /></div>
        <ImageUpload label="Photo" currentUrl={authPhotoUrl} onFileChange={setAuthPhoto} />
        <button type="submit" className="btn-secondary">{editId ? 'Update' : 'Add'} Authority</button>
      </form>
      <table className="admin-table">
        <thead><tr><th>Photo</th><th>Name</th><th>Designation</th><th>Actions</th></tr></thead>
        <tbody>
          {authorities.map((a) => (
            <tr key={a.id}>
              <td>{a.photoUrl ? <img className="table-thumb" src={getImageSrc(a.photoUrl)} alt="" /> : '—'}</td>
              <td>{a.name}</td><td>{a.designation}</td>
              <td className="action-cell">
                <button type="button" className="btn-edit" onClick={() => { setEditId(a.id); setAuthForm(a); setAuthPhotoUrl(a.photoUrl || ''); }}>Edit</button>
                <button type="button" className="btn-danger" onClick={() => api.deleteCourtAuthority(a.id).then(load)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export { ASSEMBLY_SLOTS };
