import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function NotFoundPage() {
  const { user, isAuthenticated } = useAuth();
  const destination = isAuthenticated
    ? user.role === 'staff'
      ? '/staff/requests'
      : '/student/requests'
    : '/login';

  return (
    <main className="not-found-page">
      <h1>Page not found</h1>
      <p>The page you requested does not exist.</p>
      <Link to={destination}>Return to the application</Link>
    </main>
  );
}
