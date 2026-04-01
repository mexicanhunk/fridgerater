const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function getToken() {
  return localStorage.getItem('fr_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.error || `Request failed: ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  // Auth
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),

  // Fridges
  getFridges: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v != null && v !== '' && v !== 'All')
    ).toString();
    return request(`/fridges${qs ? `?${qs}` : ''}`);
  },
  getFridge: (id) => request(`/fridges/${id}`),
  submitFridge: (body) => request('/fridges', { method: 'POST', body: JSON.stringify(body) }),

  // Reviews
  getReviews: (fridgeId, params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/fridges/${fridgeId}/reviews${qs ? `?${qs}` : ''}`);
  },
  submitReview: (fridgeId, body) =>
    request(`/fridges/${fridgeId}/reviews`, { method: 'POST', body: JSON.stringify(body) }),
  vote: (fridgeId, reviewId, helpful) =>
    request(`/fridges/${fridgeId}/reviews/${reviewId}/vote`, { method: 'POST', body: JSON.stringify({ helpful }) }),
  deleteReview: (fridgeId, reviewId) =>
    request(`/fridges/${fridgeId}/reviews/${reviewId}`, { method: 'DELETE' }),
};
