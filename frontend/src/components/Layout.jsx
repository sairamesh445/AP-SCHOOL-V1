import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HIERARCHY_LINKS = [
  { to: '/learn-hierarchies', label: 'Choose Hierarchy', end: true },
  { to: '/learn-hierarchies/assembly', label: 'Assembly Hierarchy' },
  { to: '/learn-hierarchies/court', label: 'Court Hierarchy' }
];

export default function Layout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isLearnActive = location.pathname.startsWith('/learn-hierarchies');

  useEffect(() => {
    setSidebarOpen(false);
    setUserMenuOpen(false);
    setLearnOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const handleLogout = () => {
    setSidebarOpen(false);
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';

  const roleLinks = [
    ...(user?.role === 'platform_admin'
      ? [{ to: '/admin', label: 'Admin Dashboard', icon: '🛠️' }]
      : []),
    ...(user?.role === 'school_admin'
      ? [{ to: '/school-admin', label: 'Manage Students', icon: '🎓' }]
      : [])
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <button
            type="button"
            className="menu-toggle"
            aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className={`hamburger${sidebarOpen ? ' open' : ''}`}>
              <span /><span /><span />
            </span>
          </button>
          <div className="navbar-brand">
            <img src="/ap-gov-logo.png" alt="Government of Andhra Pradesh" className="ap-gov-logo" />
            <span className="navbar-title">AP Civic Education</span>
          </div>
        </div>

        <div className="navbar-nav desktop-nav">
          <NavLink to="/" end className={({ isActive }) => `nav-btn${isActive ? ' active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/know-ap" className={({ isActive }) => `nav-btn${isActive ? ' active' : ''}`}>
            Know AP
          </NavLink>

          <div className={`nav-dropdown${learnOpen ? ' open' : ''}`}>
            <button
              type="button"
              className={`nav-btn nav-dropdown-btn${isLearnActive ? ' active' : ''}`}
              onClick={() => setLearnOpen(!learnOpen)}
              aria-expanded={learnOpen}
            >
              Learn Hierarchies ▾
            </button>
            {learnOpen && (
              <div className="nav-dropdown-menu">
                {HIERARCHY_LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) => `nav-dropdown-item${isActive ? ' active' : ''}`}
                    onClick={() => setLearnOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          <NavLink
            to="/explore-districts"
            className={({ isActive }) => `nav-btn nav-btn-explore${isActive ? ' active' : ''}`}
          >
            Explore Andhra Pradesh Districts
          </NavLink>

          <NavLink
            to="/quiz"
            className={({ isActive }) => `nav-btn nav-btn-explore${isActive ? ' active' : ''}`}
          >
            Test Knowledge
          </NavLink>

          {roleLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-btn${isActive ? ' active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}

          <div className="user-menu-wrapper desktop-user">
            <button type="button" className="user-profile-btn" onClick={() => setUserMenuOpen(!userMenuOpen)}>
              <span className="user-avatar">{initials}</span>
              <span className="user-name-text">{user?.name}</span>
              <span>▼</span>
            </button>
            {userMenuOpen && (
              <div className="user-dropdown">
                <div className="user-dropdown-info">
                  <strong>{user?.name}</strong>
                  <span>{user?.role?.replace(/_/g, ' ')}</span>
                  {user?.schoolName && <span>{user.schoolName}</span>}
                </div>
                <button type="button" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          className="user-profile-btn mobile-header-user"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <span className="user-avatar">{initials}</span>
        </button>
      </nav>

      <div
        className={`sidebar-overlay${sidebarOpen ? ' visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="sidebar-header">
          <img src="/ap-gov-logo.png" alt="" className="sidebar-logo" />
          <div>
            <p className="sidebar-app-name">AP Civic Education</p>
            <p className="sidebar-tagline">Andhra Pradesh</p>
          </div>
          <button type="button" className="sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <div className="sidebar-user-card">
          <span className="user-avatar large">{initials}</span>
          <div>
            <strong>{user?.name}</strong>
            <p>{user?.role?.replace(/_/g, ' ')}</p>
            {user?.schoolName && <p className="sidebar-school">{user.schoolName}</p>}
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" end className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`} onClick={() => setSidebarOpen(false)}>
            <span className="sidebar-link-icon">🏠</span><span>Home</span>
          </NavLink>
          <NavLink to="/know-ap" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`} onClick={() => setSidebarOpen(false)}>
            <span className="sidebar-link-icon">📚</span><span>Know Andhra Pradesh</span>
          </NavLink>
          <NavLink to="/explore-districts" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`} onClick={() => setSidebarOpen(false)}>
            <span className="sidebar-link-icon">🗺️</span><span>Explore AP Districts</span>
          </NavLink>
          <NavLink to="/quiz" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`} onClick={() => setSidebarOpen(false)}>
            <span className="sidebar-link-icon">🎯</span><span>Test Knowledge</span>
          </NavLink>

          {roleLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sidebar-link-icon">{link.icon}</span><span>{link.label}</span>
            </NavLink>
          ))}

          <p className="sidebar-section-label">Learn Hierarchies</p>
          {HIERARCHY_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `sidebar-link sidebar-sublink${isActive ? ' active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span>{link.label}</span>
            </NavLink>
          ))}

        </nav>

        <div className="sidebar-footer">
          <button type="button" className="sidebar-logout" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="page-footer">
        © {new Date().getFullYear()} Andhra Pradesh Civic Education Portal — For Schools
      </footer>
    </>
  );
}
