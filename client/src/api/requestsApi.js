import { apiFetch } from './http.js';

function withFilters(path, filters) {
  const searchParams = new URLSearchParams();

  if (filters.status) {
    searchParams.set('status', filters.status);
  }
  if (filters.categoryId) {
    searchParams.set('categoryId', filters.categoryId);
  }

  const query = searchParams.toString();
  return `${path}${query ? `?${query}` : ''}`;
}

export function createRequest(payload) {
  return apiFetch('/requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getRequests(filters = {}) {
  return apiFetch(withFilters('/requests', filters));
}

export function getRequestById(id) {
  return apiFetch(`/requests/${encodeURIComponent(id)}`);
}

export function updateRequestStatus(id, status) {
  return apiFetch(`/requests/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
