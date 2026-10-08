import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function landingPageFor(role) {
  return role === 'staff' ? '/staff/requests' : '/student/requests';
}

export default function LoginPage() {
  const { user, isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to={landingPageFor(user.role)} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const data = await login({ email, password });
      navigate(landingPageFor(data.user.role), { replace: true });
    } catch (loginError) {
      setError(loginError.message || 'Unable to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-heading">
        <h1 id="login-heading">Campus Service Request System</h1>
        <p>Sign in with your campus account.</p>

        {error ? <ErrorMessage message={error} /> : null}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            autoComplete="email"
            id="email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />

          <label htmlFor="password">Password</label>
          <input
            autoComplete="current-password"
            id="password"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />

          <button disabled={isSubmitting} type="submit">
            {isSubmitting ? (
              <LoadingSpinner label="Signing in…" size="small" />
            ) : (
              'Sign in'
            )}
          </button>
        </form>
      </section>
    </main>
  );
}
