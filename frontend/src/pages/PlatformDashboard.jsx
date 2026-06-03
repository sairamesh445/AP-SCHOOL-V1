import { useState, useEffect } from 'react';
import { api, resolveImageUrl } from '../api/client';
import ImageUpload from '../components/ImageUpload';
import AdminGovernancePanel from '../components/AdminGovernancePanel';
import AdminCourtPanel, { ASSEMBLY_SLOTS } from '../components/AdminCourtPanel';
import AdminCivicPanel from '../components/AdminCivicPanel';
import { getImageSrc } from '../utils/image';

const TAB_GROUPS = [
  { label: 'Schools & Home', tabs: ['schools', 'categories', 'content', 'carousel', 'quiz'] },
  { label: 'Hierarchies', tabs: ['assembly', 'court_positions', 'court_authorities', 'ministries', 'mps', 'mlas'] },
  {
    label: 'Know AP (Civic Knowledge)',
    tabs: ['civic_districts', 'civic_police', 'civic_grievance', 'civic_whatsapp', 'civic_assembly', 'civic_parliament', 'civic_mla_history']
  }
];

const TABS = TAB_GROUPS.flatMap((g) => g.tabs);

const TAB_LABELS = {
  mps: 'MPs',
  mlas: 'MLAs',
  assembly: 'Assembly',
  court_positions: 'Court Layout',
  court_authorities: 'Court Authorities',
  civic_districts: 'AP Districts',
  civic_police: 'Police',
  civic_grievance: 'Grievance',
  civic_whatsapp: 'WhatsApp',
  civic_assembly: 'Assembly',
  civic_parliament: 'Parliament',
  civic_mla_history: 'MLA History'
};

const emptySchool = { name: '', address: '', adminName: '', adminUsername: '', adminPassword: '' };
const emptyCat = { name: '', slug: '', description: '', icon: '📋', order: 0 };
const emptyItem = { categoryId: '', title: '', description: '', order: 0 };
const emptySlide = { caption: '', order: 0 };
const emptyHier = {
  title: '', designation: '', personName: '', responsibilities: '',
  slot: 'speaker', order: 0, level: 'assembly'
};
const emptyQuiz = { question: '', options: '', correctAnswer: '', explanation: '' };

export default function PlatformDashboard() {
  const [tab, setTab] = useState('schools');
  const [schools, setSchools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [carousel, setCarousel] = useState([]);
  const [hierarchy, setHierarchy] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const [editId, setEditId] = useState(null);
  const [schoolForm, setSchoolForm] = useState(emptySchool);
  const [catForm, setCatForm] = useState(emptyCat);
  const [itemForm, setItemForm] = useState(emptyItem);
  const [slideForm, setSlideForm] = useState(emptySlide);
  const [hierForm, setHierForm] = useState(emptyHier);
  const [quizForm, setQuizForm] = useState(emptyQuiz);

  const [itemImage, setItemImage] = useState(null);
  const [slideImage, setSlideImage] = useState(null);
  const [hierImage, setHierImage] = useState(null);
  const [itemImageUrl, setItemImageUrl] = useState('');
  const [slideImageUrl, setSlideImageUrl] = useState('');
  const [hierImageUrl, setHierImageUrl] = useState('');

  const load = async () => {
    try {
      const [s, c, i, car, h, q] = await Promise.all([
        api.getSchools(),
        api.getAdminCategories(),
        api.getAdminItems(),
        api.getAdminCarousel(),
        api.getAdminHierarchy(),
        api.getAdminQuiz()
      ]);
      setSchools(s);
      setCategories(c);
      setItems(i);
      setCarousel(car);
      setHierarchy(h);
      setQuiz(q);
    } catch (e) {
      setErr(e.message);
    }
  };

  useEffect(() => { load(); }, []);

  const showSuccess = (text) => { setMsg(text); setErr(''); setTimeout(() => setMsg(''), 3000); };
  const cancelEdit = () => {
    setEditId(null);
    setSchoolForm(emptySchool);
    setCatForm(emptyCat);
    setItemForm(emptyItem);
    setSlideForm(emptySlide);
    setHierForm(emptyHier);
    setQuizForm(emptyQuiz);
    setItemImage(null);
    setSlideImage(null);
    setHierImage(null);
    setItemImageUrl('');
    setSlideImageUrl('');
    setHierImageUrl('');
  };

  const handleSchoolSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.updateSchool(editId, schoolForm);
        showSuccess('School updated!');
      } else {
        await api.createSchool(schoolForm);
        showSuccess('School and admin created!');
      }
      cancelEdit();
      load();
    } catch (e) { setErr(e.message); }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.updateCategory(editId, catForm);
        showSuccess('Category updated!');
      } else {
        await api.createCategory(catForm);
        showSuccess('Category created!');
      }
      cancelEdit();
      load();
    } catch (e) { setErr(e.message); }
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    try {
      const imageUrl = await resolveImageUrl(itemImage, itemImageUrl);
      if (!editId && !imageUrl) {
        setErr('Please upload an image for this item');
        return;
      }
      const payload = { ...itemForm, imageUrl: imageUrl || itemImageUrl };
      if (editId) {
        await api.updateItem(editId, payload);
        showSuccess('Content item updated!');
      } else {
        await api.createItem(payload);
        showSuccess('Content item created!');
      }
      cancelEdit();
      load();
    } catch (e) { setErr(e.message); }
  };

  const handleSlideSubmit = async (e) => {
    e.preventDefault();
    try {
      const imageUrl = await resolveImageUrl(slideImage, slideImageUrl);
      if (!editId && !imageUrl) {
        setErr('Please upload a carousel image');
        return;
      }
      const payload = { ...slideForm, imageUrl: imageUrl || slideImageUrl };
      if (editId) {
        await api.updateCarousel(editId, payload);
        showSuccess('Carousel slide updated!');
      } else {
        await api.createCarousel(payload);
        showSuccess('Carousel slide added!');
      }
      cancelEdit();
      load();
    } catch (e) { setErr(e.message); }
  };

  const handleHierarchySubmit = async (e) => {
    e.preventDefault();
    try {
      const personPhoto = await resolveImageUrl(hierImage, hierImageUrl);
      const payload = {
        ...hierForm,
        personPhoto: personPhoto || hierImageUrl,
        order: Number(hierForm.order)
      };
      if (editId) {
        await api.updateHierarchy(editId, payload);
        showSuccess('Position updated!');
      } else {
        await api.createHierarchy(payload);
        showSuccess('Position added!');
      }
      cancelEdit();
      load();
    } catch (e) { setErr(e.message); }
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        question: quizForm.question,
        options: quizForm.options.split(',').map((o) => o.trim()),
        correctAnswer: quizForm.correctAnswer,
        explanation: quizForm.explanation
      };
      if (editId) {
        await api.updateQuiz(editId, payload);
        showSuccess('Quiz question updated!');
      } else {
        await api.createQuiz(payload);
        showSuccess('Quiz question added!');
      }
      cancelEdit();
      load();
    } catch (e) { setErr(e.message); }
  };

  const startEditSchool = (s) => {
    setEditId(s.id);
    setSchoolForm({
      name: s.name,
      address: s.address || '',
      adminName: s.admin?.name || '',
      adminUsername: s.admin?.username || '',
      adminPassword: ''
    });
  };

  const startEditCategory = (c) => {
    setEditId(c.id);
    setCatForm({ name: c.name, slug: c.slug, description: c.description, icon: c.icon, order: c.order });
  };

  const startEditItem = (i) => {
    setEditId(i.id);
    setItemForm({ categoryId: i.categoryId, title: i.title, description: i.description, order: i.order });
    setItemImageUrl(i.imageUrl || '');
    setItemImage(null);
  };

  const startEditSlide = (s) => {
    setEditId(s.id);
    setSlideForm({ caption: s.caption, order: s.order });
    setSlideImageUrl(s.imageUrl || '');
    setSlideImage(null);
  };

  const startEditHierarchy = (h) => {
    setEditId(h.id);
    setHierForm({
      title: h.title,
      designation: h.designation,
      personName: h.personName,
      responsibilities: h.responsibilities,
      slot: h.slot || 'other',
      order: h.order,
      level: h.level || 'assembly'
    });
    setHierImageUrl(h.personPhoto || '');
    setHierImage(null);
  };

  const startEditQuiz = (q) => {
    setEditId(q.id);
    setQuizForm({
      question: q.question,
      options: q.options.join(', '),
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || ''
    });
  };

  const ActionButtons = ({ onEdit, onDelete }) => (
    <td className="action-cell">
      <button type="button" className="btn-edit" onClick={onEdit}>Edit</button>
      <button type="button" className="btn-danger" onClick={onDelete}>Delete</button>
    </td>
  );

  return (
    <div className="dashboard container">
      <h1>🛠️ Platform Admin Dashboard</h1>
      {msg && <div className="success-msg">{msg}</div>}
      {err && <div className="error-msg">{err}</div>}

      <div className="admin-tab-groups">
        {TAB_GROUPS.map((group) => (
          <div key={group.label} className="admin-tab-group">
            <p className="admin-tab-group-label">{group.label}</p>
            <div className="tabs">
              {group.tabs.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`tab-btn${tab === t ? ' active' : ''}${t.startsWith('civic_') ? ' tab-btn-civic' : ''}`}
                  onClick={() => { setTab(t); cancelEdit(); }}
                >
                  {TAB_LABELS[t] || t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="admin-panel">
        {editId && (
          <div className="edit-banner">
            Editing record — <button type="button" onClick={cancelEdit}>Cancel</button>
          </div>
        )}

        {tab === 'schools' && (
          <>
            <h3>{editId ? 'Update School' : 'Create School & School Admin'}</h3>
            <form className="admin-form" onSubmit={handleSchoolSubmit}>
              <div className="form-group"><label>School Name</label><input value={schoolForm.name} onChange={(e) => setSchoolForm({ ...schoolForm, name: e.target.value })} required /></div>
              <div className="form-group"><label>Address</label><input value={schoolForm.address} onChange={(e) => setSchoolForm({ ...schoolForm, address: e.target.value })} /></div>
              <div className="form-group"><label>Admin Name</label><input value={schoolForm.adminName} onChange={(e) => setSchoolForm({ ...schoolForm, adminName: e.target.value })} /></div>
              <div className="form-group"><label>Admin Username</label><input value={schoolForm.adminUsername} onChange={(e) => setSchoolForm({ ...schoolForm, adminUsername: e.target.value })} required={!editId} /></div>
              <div className="form-group"><label>{editId ? 'New Password (optional)' : 'Admin Password'}</label><input type="password" value={schoolForm.adminPassword} onChange={(e) => setSchoolForm({ ...schoolForm, adminPassword: e.target.value })} required={!editId} /></div>
              <button type="submit" className="btn-secondary">{editId ? 'Update School' : 'Create School'}</button>
              {editId && <button type="button" className="btn-cancel" onClick={cancelEdit}>Cancel</button>}
            </form>
            <table className="admin-table">
              <thead><tr><th>School</th><th>Admin</th><th>Students</th><th>Actions</th></tr></thead>
              <tbody>
                {schools.map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.admin?.username || '—'}</td>
                    <td>{s.studentCount}</td>
                    <ActionButtons
                      onEdit={() => startEditSchool(s)}
                      onDelete={() => api.deleteSchool(s.id).then(load)}
                    />
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {tab === 'categories' && (
          <>
            <h3>{editId ? 'Update Category' : 'Add Category'}</h3>
            <form className="admin-form" onSubmit={handleCategorySubmit}>
              <div className="form-group"><label>Name</label><input value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} required /></div>
              <div className="form-group"><label>Slug</label><input value={catForm.slug} onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })} placeholder="helpline" /></div>
              <div className="form-group"><label>Icon</label><input value={catForm.icon} onChange={(e) => setCatForm({ ...catForm, icon: e.target.value })} /></div>
              <div className="form-group"><label>Description</label><input value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} /></div>
              <div className="form-group"><label>Order</label><input type="number" value={catForm.order} onChange={(e) => setCatForm({ ...catForm, order: Number(e.target.value) })} /></div>
              <button type="submit" className="btn-secondary">{editId ? 'Update' : 'Add'} Category</button>
              {editId && <button type="button" className="btn-cancel" onClick={cancelEdit}>Cancel</button>}
            </form>
            <table className="admin-table">
              <thead><tr><th>Icon</th><th>Name</th><th>Slug</th><th>Actions</th></tr></thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td>{c.icon}</td><td>{c.name}</td><td>{c.slug}</td>
                    <ActionButtons onEdit={() => startEditCategory(c)} onDelete={() => api.deleteCategory(c.id).then(load)} />
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {tab === 'content' && (
          <>
            <h3>{editId ? 'Update Content Item' : 'Add Content Item'}</h3>
            <form className="admin-form" onSubmit={handleItemSubmit}>
              <div className="form-group">
                <label>Category</label>
                <select value={itemForm.categoryId} onChange={(e) => setItemForm({ ...itemForm, categoryId: e.target.value })} required>
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Title (h1)</label><input value={itemForm.title} onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })} required placeholder="102" /></div>
              <div className="form-group"><label>Description (h3)</label><input value={itemForm.description} onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })} placeholder="For Medical Emergency" /></div>
              <ImageUpload
                label="Card Image"
                required={!editId}
                currentUrl={itemImageUrl}
                onFileChange={setItemImage}
              />
              <button type="submit" className="btn-secondary">{editId ? 'Update Item' : 'Add Item'}</button>
              {editId && <button type="button" className="btn-cancel" onClick={cancelEdit}>Cancel</button>}
            </form>
            <table className="admin-table">
              <thead><tr><th>Image</th><th>Title</th><th>Description</th><th>Category</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i.id}>
                    <td><img className="table-thumb" src={getImageSrc(i.imageUrl)} alt="" /></td>
                    <td><strong>{i.title}</strong></td>
                    <td>{i.description}</td>
                    <td>{categories.find((c) => c.id === i.categoryId)?.name}</td>
                    <ActionButtons onEdit={() => startEditItem(i)} onDelete={() => api.deleteItem(i.id).then(load)} />
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {tab === 'carousel' && (
          <>
            <h3>{editId ? 'Update Carousel Slide' : 'Add Carousel Slide'}</h3>
            <form className="admin-form" onSubmit={handleSlideSubmit}>
              <ImageUpload
                label="Carousel Photo"
                required={!editId}
                currentUrl={slideImageUrl}
                onFileChange={setSlideImage}
              />
              <div className="form-group"><label>Caption</label><input value={slideForm.caption} onChange={(e) => setSlideForm({ ...slideForm, caption: e.target.value })} /></div>
              <div className="form-group"><label>Order</label><input type="number" value={slideForm.order} onChange={(e) => setSlideForm({ ...slideForm, order: Number(e.target.value) })} /></div>
              <button type="submit" className="btn-secondary">{editId ? 'Update Slide' : 'Add Slide'}</button>
              {editId && <button type="button" className="btn-cancel" onClick={cancelEdit}>Cancel</button>}
            </form>
            <table className="admin-table">
              <thead><tr><th>Image</th><th>Caption</th><th>Actions</th></tr></thead>
              <tbody>
                {carousel.map((s) => (
                  <tr key={s.id}>
                    <td><img className="table-thumb wide" src={getImageSrc(s.imageUrl)} alt="" /></td>
                    <td>{s.caption}</td>
                    <ActionButtons onEdit={() => startEditSlide(s)} onDelete={() => api.deleteCarousel(s.id).then(load)} />
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {tab === 'assembly' && (
          <>
            <h3>{editId ? 'Update Assembly Position' : 'Add Assembly Position'}</h3>
            <form className="admin-form" onSubmit={handleHierarchySubmit}>
              <div className="form-group">
                <label>Diagram Slot</label>
                <select value={hierForm.slot} onChange={(e) => setHierForm({ ...hierForm, slot: e.target.value })}>
                  {ASSEMBLY_SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Title</label><input value={hierForm.title} onChange={(e) => setHierForm({ ...hierForm, title: e.target.value })} required /></div>
              <div className="form-group"><label>Designation</label><input value={hierForm.designation} onChange={(e) => setHierForm({ ...hierForm, designation: e.target.value })} /></div>
              <div className="form-group"><label>Person Name</label><input value={hierForm.personName} onChange={(e) => setHierForm({ ...hierForm, personName: e.target.value })} /></div>
              <ImageUpload
                label="Person Photo (fills the large image box when students hover this seat)"
                currentUrl={hierImageUrl}
                onFileChange={setHierImage}
              />
              <div className="form-group"><label>Responsibilities</label><textarea value={hierForm.responsibilities} onChange={(e) => setHierForm({ ...hierForm, responsibilities: e.target.value })} rows={2} /></div>
              <button type="submit" className="btn-secondary">{editId ? 'Update Position' : 'Add Position'}</button>
              {editId && <button type="button" className="btn-cancel" onClick={cancelEdit}>Cancel</button>}
            </form>
            <table className="admin-table">
              <thead><tr><th>Slot</th><th>Title</th><th>Person</th><th>Actions</th></tr></thead>
              <tbody>
                {hierarchy.map((h) => (
                  <tr key={h.id}>
                    <td>{h.slot || '—'}</td>
                    <td>{h.title}</td>
                    <td>{h.personName}</td>
                    <ActionButtons onEdit={() => startEditHierarchy(h)} onDelete={() => api.deleteHierarchy(h.id).then(load)} />
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {(tab === 'court_positions' || tab === 'court_authorities') && (
          <AdminCourtPanel activeTab={tab} onMessage={showSuccess} onError={setErr} />
        )}

        {(tab === 'ministries' || tab === 'mps' || tab === 'mlas') && (
          <AdminGovernancePanel
            activeTab={tab}
            onMessage={showSuccess}
            onError={setErr}
          />
        )}

        {tab.startsWith('civic_') && (
          <AdminCivicPanel activeTab={tab} onMessage={showSuccess} onError={setErr} />
        )}

        {tab === 'quiz' && (
          <>
            <h3>{editId ? 'Update Quiz Question' : 'Add Quiz Question'}</h3>
            <form className="admin-form" onSubmit={handleQuizSubmit}>
              <div className="form-group"><label>Question</label><input value={quizForm.question} onChange={(e) => setQuizForm({ ...quizForm, question: e.target.value })} required /></div>
              <div className="form-group"><label>Options (comma-separated)</label><input value={quizForm.options} onChange={(e) => setQuizForm({ ...quizForm, options: e.target.value })} placeholder="A, B, C, D" required /></div>
              <div className="form-group"><label>Correct Answer</label><input value={quizForm.correctAnswer} onChange={(e) => setQuizForm({ ...quizForm, correctAnswer: e.target.value })} required /></div>
              <div className="form-group"><label>Explanation</label><input value={quizForm.explanation} onChange={(e) => setQuizForm({ ...quizForm, explanation: e.target.value })} /></div>
              <button type="submit" className="btn-secondary">{editId ? 'Update Question' : 'Add Question'}</button>
              {editId && <button type="button" className="btn-cancel" onClick={cancelEdit}>Cancel</button>}
            </form>
            <table className="admin-table">
              <thead><tr><th>Question</th><th>Answer</th><th>Actions</th></tr></thead>
              <tbody>
                {quiz.map((q) => (
                  <tr key={q.id}>
                    <td>{q.question}</td>
                    <td>{q.correctAnswer}</td>
                    <ActionButtons onEdit={() => startEditQuiz(q)} onDelete={() => api.deleteQuiz(q.id).then(load)} />
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
