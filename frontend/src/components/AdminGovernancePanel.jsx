import { useState, useEffect } from 'react';
import { api, resolveImageUrl } from '../api/client';
import ImageUpload from './ImageUpload';
import { getImageSrc } from '../utils/image';

export default function AdminGovernancePanel({ activeTab = 'ministries', onMessage, onError }) {
  const tab = activeTab;
  const [ministries, setMinistries] = useState([]);
  const [mps, setMps] = useState([]);
  const [mlas, setMlas] = useState([]);
  const [editId, setEditId] = useState(null);

  const [minForm, setMinForm] = useState({ name: '', ministerName: '', department: '', responsibilities: '', order: 0 });
  const [mpForm, setMpForm] = useState({ name: '', constituency: '', party: '', responsibilities: '', order: 0 });
  const [mlaForm, setMlaForm] = useState({ name: '', constituency: '', party: '', order: 0 });
  const [minPhoto, setMinPhoto] = useState(null);
  const [mpPhoto, setMpPhoto] = useState(null);
  const [minPhotoUrl, setMinPhotoUrl] = useState('');
  const [mpPhotoUrl, setMpPhotoUrl] = useState('');

  const load = async () => {
    try {
      const [min, mp, mla] = await Promise.all([
        api.getAdminMinistries(),
        api.getAdminMps(),
        api.getAdminMlas()
      ]);
      setMinistries(min);
      setMps(mp);
      setMlas(mla);
    } catch (e) {
      onError(e.message);
    }
  };

  useEffect(() => { load(); }, []);

  const cancel = () => {
    setEditId(null);
    setMinForm({ name: '', ministerName: '', department: '', responsibilities: '', order: 0 });
    setMpForm({ name: '', constituency: '', party: '', responsibilities: '', order: 0 });
    setMlaForm({ name: '', constituency: '', party: '', order: 0 });
    setMinPhoto(null);
    setMpPhoto(null);
    setMinPhotoUrl('');
    setMpPhotoUrl('');
  };

  const ActionButtons = ({ onEdit, onDelete }) => (
    <td className="action-cell">
      <button type="button" className="btn-edit" onClick={onEdit}>Edit</button>
      <button type="button" className="btn-danger" onClick={onDelete}>Delete</button>
    </td>
  );

  const handleMinistry = async (e) => {
    e.preventDefault();
    try {
      const photoUrl = await resolveImageUrl(minPhoto, minPhotoUrl);
      const payload = { ...minForm, photoUrl: photoUrl || minPhotoUrl };
      if (editId) {
        await api.updateMinistry(editId, payload);
        onMessage('Ministry updated!');
      } else {
        await api.createMinistry(payload);
        onMessage('Ministry created!');
      }
      cancel();
      load();
    } catch (e) { onError(e.message); }
  };

  const handleMp = async (e) => {
    e.preventDefault();
    try {
      const photoUrl = await resolveImageUrl(mpPhoto, mpPhotoUrl);
      const payload = { ...mpForm, photoUrl: photoUrl || mpPhotoUrl };
      if (editId) {
        await api.updateMp(editId, payload);
        onMessage('MP updated!');
      } else {
        await api.createMp(payload);
        onMessage('MP created!');
      }
      cancel();
      load();
    } catch (e) { onError(e.message); }
  };

  const handleMla = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.updateMla(editId, mlaForm);
        onMessage('MLA updated!');
      } else {
        await api.createMla(mlaForm);
        onMessage('MLA created!');
      }
      cancel();
      load();
    } catch (e) { onError(e.message); }
  };

  return (
    <>
      {editId && (
        <div className="edit-banner">
          Editing — <button type="button" onClick={cancel}>Cancel</button>
        </div>
      )}

      {tab === 'ministries' && (
        <>
          <h3>{editId ? 'Update Ministry' : 'Add Ministry'}</h3>
          <form className="admin-form" onSubmit={handleMinistry}>
            <div className="form-group"><label>Ministry Name</label><input value={minForm.name} onChange={(e) => setMinForm({ ...minForm, name: e.target.value })} required /></div>
            <div className="form-group"><label>Minister Name</label><input value={minForm.ministerName} onChange={(e) => setMinForm({ ...minForm, ministerName: e.target.value })} required /></div>
            <div className="form-group"><label>Department</label><input value={minForm.department} onChange={(e) => setMinForm({ ...minForm, department: e.target.value })} /></div>
            <div className="form-group"><label>Responsibilities</label><textarea value={minForm.responsibilities} onChange={(e) => setMinForm({ ...minForm, responsibilities: e.target.value })} rows={3} /></div>
            <div className="form-group"><label>Order</label><input type="number" value={minForm.order} onChange={(e) => setMinForm({ ...minForm, order: Number(e.target.value) })} /></div>
            <ImageUpload label="Minister Photo" currentUrl={minPhotoUrl} onFileChange={setMinPhoto} />
            <button type="submit" className="btn-secondary">{editId ? 'Update' : 'Add'} Ministry</button>
          </form>
          <table className="admin-table">
            <thead><tr><th>#</th><th>Ministry</th><th>Minister</th><th>Actions</th></tr></thead>
            <tbody>
              {ministries.map((m, i) => (
                <tr key={m.id}>
                  <td>{i + 1}</td>
                  <td>{m.name}</td>
                  <td>{m.ministerName}</td>
                  <ActionButtons
                    onEdit={() => {
                      setEditId(m.id);
                      setMinForm({ name: m.name, ministerName: m.ministerName, department: m.department, responsibilities: m.responsibilities, order: m.order });
                      setMinPhotoUrl(m.photoUrl || '');
                    }}
                    onDelete={() => api.deleteMinistry(m.id).then(load)}
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {tab === 'mps' && (
        <>
          <h3>{editId ? 'Update MP' : 'Add MP'}</h3>
          <form className="admin-form" onSubmit={handleMp}>
            <div className="form-group"><label>MP Name</label><input value={mpForm.name} onChange={(e) => setMpForm({ ...mpForm, name: e.target.value })} required /></div>
            <div className="form-group"><label>Lok Sabha Constituency</label><input value={mpForm.constituency} onChange={(e) => setMpForm({ ...mpForm, constituency: e.target.value })} required /></div>
            <div className="form-group"><label>Party</label><input value={mpForm.party} onChange={(e) => setMpForm({ ...mpForm, party: e.target.value })} /></div>
            <div className="form-group"><label>Role & Responsibilities</label><textarea value={mpForm.responsibilities} onChange={(e) => setMpForm({ ...mpForm, responsibilities: e.target.value })} rows={3} /></div>
            <ImageUpload label="MP Photo" currentUrl={mpPhotoUrl} onFileChange={setMpPhoto} />
            <button type="submit" className="btn-secondary">{editId ? 'Update' : 'Add'} MP</button>
          </form>
          <table className="admin-table">
            <thead><tr><th>Photo</th><th>Name</th><th>Constituency</th><th>Actions</th></tr></thead>
            <tbody>
              {mps.map((mp) => (
                <tr key={mp.id}>
                  <td>{mp.photoUrl ? <img className="table-thumb" src={getImageSrc(mp.photoUrl)} alt="" /> : '—'}</td>
                  <td>{mp.name}</td>
                  <td>{mp.constituency}</td>
                  <ActionButtons
                    onEdit={() => {
                      setEditId(mp.id);
                      setMpForm({ name: mp.name, constituency: mp.constituency, party: mp.party, responsibilities: mp.responsibilities, order: mp.order });
                      setMpPhotoUrl(mp.photoUrl || '');
                    }}
                    onDelete={() => api.deleteMp(mp.id).then(load)}
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {tab === 'mlas' && (
        <>
          <h3>{editId ? 'Update MLA' : 'Add MLA'}</h3>
          <form className="admin-form" onSubmit={handleMla}>
            <div className="form-group"><label>MLA Name</label><input value={mlaForm.name} onChange={(e) => setMlaForm({ ...mlaForm, name: e.target.value })} required /></div>
            <div className="form-group"><label>Assembly Constituency</label><input value={mlaForm.constituency} onChange={(e) => setMlaForm({ ...mlaForm, constituency: e.target.value })} required /></div>
            <div className="form-group"><label>Party</label><input value={mlaForm.party} onChange={(e) => setMlaForm({ ...mlaForm, party: e.target.value })} /></div>
            <div className="form-group"><label>Order</label><input type="number" value={mlaForm.order} onChange={(e) => setMlaForm({ ...mlaForm, order: Number(e.target.value) })} /></div>
            <button type="submit" className="btn-secondary">{editId ? 'Update' : 'Add'} MLA</button>
          </form>
          <table className="admin-table">
            <thead><tr><th>#</th><th>Name</th><th>Constituency</th><th>Party</th><th>Actions</th></tr></thead>
            <tbody>
              {mlas.map((mla, i) => (
                <tr key={mla.id}>
                  <td>{i + 1}</td>
                  <td>{mla.name}</td>
                  <td>{mla.constituency}</td>
                  <td>{mla.party}</td>
                  <ActionButtons
                    onEdit={() => {
                      setEditId(mla.id);
                      setMlaForm({ name: mla.name, constituency: mla.constituency, party: mla.party, order: mla.order });
                    }}
                    onDelete={() => api.deleteMla(mla.id).then(load)}
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}
