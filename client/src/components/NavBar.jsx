import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const linksByRole = {
  student: [
    { to: '/student/requests', label: 'My Requests', end: true },
    { to: '/student/requests/new', label: 'New Request' },
  ],
  staff: [{ to: '/staff/requests', label: 'Dashboard', end: true }],
};

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = linksByRole[user?.role] || [];

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary navigation">
        <NavLink className="site-brand" to={links[0]?.to || '/login'}>
          Campus Services
        </NavLink>

        <div className="site-nav__links">
          {links.map((link) => (
            <NavLink
              className={({ isActive }) =>
                `site-nav__link${isActive ? ' site-nav__link--active' : ''}`
              }
              end={link.end}
              key={link.label}
              to={link.to}
            >
              {link.label}
            </NavLink>
          ))}
          <button className="site-nav__logout" onClick={handleLogout} type="button">
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}
