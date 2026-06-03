import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export default function SchoolDashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    username: '',
    password: '',
    name: '',
    className: '',
    rollNumber: ''
  });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const load = () => {
    api.getStudents().then(setStudents).catch((e) => setErr(e.message));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await api.createStudent(form);
      setForm({ username: '', password: '', name: '', className: '', rollNumber: '' });
      setMsg('Student profile created successfully!');
      setTimeout(() => setMsg(''), 3000);
      load();
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="dashboard container">
      <h1>🎓 School Admin — Student Management</h1>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        School: <strong>{user?.schoolName}</strong> — Create login credentials for your students here.
        Sign up is only available through this panel.
      </p>

      {msg && <div className="success-msg">{msg}</div>}
      {err && <div className="error-msg">{err}</div>}

      <div className="admin-panel">
        <h3>Create Student Profile (Sign Up)</h3>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Class</label>
            <input value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })} placeholder="e.g. 10-A" />
          </div>
          <div className="form-group">
            <label>Roll Number</label>
            <input value={form.rollNumber} onChange={(e) => setForm({ ...form, rollNumber: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Username (Login ID)</label>
            <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="btn-secondary">Create Student Account</button>
        </form>

        <h3 style={{ marginTop: '2rem' }}>Students in Your School ({students.length})</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Class</th>
              <th>Roll No</th>
              <th>Username</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.className || '—'}</td>
                <td>{s.rollNumber || '—'}</td>
                <td>{s.username}</td>
                <td>
                  <button className="btn-danger" onClick={() => api.deleteStudent(s.id).then(load)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: '#888' }}>
                  No students yet. Create the first student profile above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
