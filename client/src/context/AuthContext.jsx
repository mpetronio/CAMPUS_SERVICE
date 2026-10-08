import { createContext, useContext, useMemo, useState } from 'react';
import { login as loginRequest } from '../api/authApi.js';

const AuthContext = createContext(null);

function readStoredUser() {
  const storedUser = localStorage.getItem('csr_user');

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem('csr_user');
    localStorage.removeItem('csr_token');
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem('csr_token'));

  async function login(credentials) {
    const data = await loginRequest(credentials);

    localStorage.setItem('csr_token', data.token);
    localStorage.setItem('csr_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);

    return data;
  }

  function logout() {
    localStorage.removeItem('csr_token');
    localStorage.removeItem('csr_user');
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      login,
      logout,
    }),
    [user, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}
