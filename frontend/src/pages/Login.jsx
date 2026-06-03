import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(username, password);
      if (user.role === 'platform_admin') navigate('/admin');
      else if (user.role === 'school_admin') navigate('/school-admin');
      else navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img src={import.meta.env.BASE_URL + 'ap-gov-logo.png'} alt="Government of Andhra Pradesh" className="login-logo" />
        <h1>AP Civic Education Portal</h1>
        <p>Login with credentials provided by your school administrator</p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#999' }}>
          Student accounts are created by your School System Admin only.
        </p>
        <p style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#aaa' }}>
          Platform admin demo: username <strong>admin</strong>, password <strong>admin123</strong>
        </p>
      </div>
    </div>
  );
}
