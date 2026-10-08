import { apiFetch } from './http.js';

export function getCategories(filters = {}) {
  const searchParams = new URLSearchParams();

  if (filters.q) {
    searchParams.set('q', filters.q);
  }

  const query = searchParams.toString();
  return apiFetch(`/categories${query ? `?${query}` : ''}`);
}
