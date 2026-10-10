// ---------------------------------------------------------------------------
// ClassStream API client — maps 1:1 to the Express backend in /api/v1
// ---------------------------------------------------------------------------
const API = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1').replace(/\/$/, '');
export const API_ORIGIN = API.replace(/\/api\/v1$/, '');
const TOKEN_KEY = 'classstream_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY));

// Local uploads are returned as "/upload/xyz.mp4" — make them absolute.
export const mediaUrl = (u) => (!u ? '' : /^https?:\/\//i.test(u) ? u : `${API_ORIGIN}${u}`);

export class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.status = status;
    this.code = code; // e.g. NO_SUBSCRIPTION, LIMIT_REACHED, DELETION_PENDING
  }
}

async function request(path, { method = 'GET', body, form } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload;
  if (form) payload = form; // multipart — browser sets the boundary
  else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`${API}${path}`, { method, headers, body: payload, credentials: 'include' });
  } catch {
    throw new ApiError('Cannot reach the server. Is the backend running?', 0);
  }
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* empty body */
  }
  if (!res.ok || data?.success === false) {
    if (res.status === 404 && !data) {
      // Express' default "Cannot GET /x" page — the route doesn't exist on the running server.
      throw new ApiError(
        `Endpoint not found: ${method} ${path}. The backend running at ${API_ORIGIN} doesn't have this route — restart it from the latest backend code.`,
        404
      );
    }
    throw new ApiError(data?.message || `Request failed (${res.status})`, res.status, data?.errorCode);
  }
  return data;
}

const q = (obj) => {
  const s = new URLSearchParams(Object.entries(obj).filter(([, v]) => v !== undefined && v !== ''));
  return s.toString() ? `?${s}` : '';
};

export const api = {
  // ---- auth / profile
  register: (b) => request('/register', { method: 'POST', body: b }),
  login: (b) => request('/login', { method: 'POST', body: b }),
  logout: () => request('/logout', { method: 'POST' }),
  me: () => request('/me'),
  updateMe: (b) => request('/me/update', { method: 'PUT', body: b }),
  verifyDeletePassword: (password) => request('/me/delete-account/verify', { method: 'POST', body: { password } }),
  requestDeletion: (b) => request('/me/delete-account/request', { method: 'POST', body: b }),

  // ---- public / student
  growthHighlights: () => request('/growth-highlights'),
  plans: () => request('/plans'),
  lessons: () => request('/lessons'),
  accessVideo: (lessonId, videoId) => request(`/lessons/${lessonId}/videos/${videoId}/access`, { method: 'POST' }),
  mySubscription: () => request('/subscription/me'),
  createSubscriptionOrder: (planId) => request('/subscription/create-order', { method: 'POST', body: { planId } }),
  verifySubscription: (b) => request('/subscription/verify', { method: 'POST', body: b }),
  myPayments: () => request('/payment/my-payments'),

  // ---- admin: stats / payments
  adminStats: () => request('/admin/stats'),
  adminPayments: () => request('/admin/payments'),
  adminSubscriptions: () => request('/admin/subscriptions'),
  cancelSubscription: (id) => request(`/admin/subscription/${id}/cancel`, { method: 'PATCH' }),

  // ---- admin: users
  users: () => request('/users'),
  user: (id) => request(`/user/${id}`),
  createUser: (b) => request('/admin/users', { method: 'POST', body: b }),
  updateUser: (id, b) => request(`/user/${id}`, { method: 'PUT', body: b }),
  deleteUser: (id) => request(`/user/${id}`, { method: 'DELETE' }),
  deletionRequests: () => request('/admin/deletion-requests'),
  approveDeletion: (id) => request(`/admin/deletion-requests/${id}/approve`, { method: 'PUT' }),
  rejectDeletion: (id) => request(`/admin/deletion-requests/${id}/reject`, { method: 'PUT' }),

  // ---- admin: plans
  adminPlans: () => request('/admin/plans'),
  createPlan: (b) => request('/plan', { method: 'POST', body: b }),
  updatePlan: (id, b) => request(`/plan/${id}`, { method: 'PUT', body: b }),
  deletePlan: (id) => request(`/plan/${id}`, { method: 'DELETE' }),

  // ---- admin: classes (lessons) + videos
  adminLessons: () => request('/admin/lessons'),
  createLesson: (b) => request('/lesson', { method: 'POST', body: b }),
  updateLesson: (id, b) => request(`/lesson/${id}`, { method: 'PUT', body: b }),
  deleteLesson: (id) => request(`/lesson/${id}`, { method: 'DELETE' }),
  addVideo: (id, form) => request(`/lesson/${id}/videos`, { method: 'POST', form }),
  updateVideo: (id, vid, form) => request(`/lesson/${id}/videos/${vid}`, { method: 'PUT', form }),
  deleteVideo: (id, vid) => request(`/lesson/${id}/videos/${vid}`, { method: 'DELETE' }),
};
export { q };
