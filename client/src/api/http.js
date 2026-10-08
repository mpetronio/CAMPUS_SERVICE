export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
).replace(/\/$/, '');

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('csr_token');
  const headers = new Headers(options.headers);

  headers.set('Accept', 'application/json');
  if (options.body !== undefined && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  let payload;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok || payload?.success !== true) {
    const error = new Error(
      payload?.error?.message || 'Unable to complete the request.',
    );
    error.code = payload?.error?.code || 'INTERNAL_ERROR';
    error.status = response.status;
    error.details = payload?.error?.details;
    throw error;
  }

  return payload.data;
}
