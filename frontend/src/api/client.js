/** Dev/preview: Vite proxies /api → localhost:5000. Set VITE_API_URL if needed (e.g. http://localhost:5000/api). */
const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const headers = { ...options.headers };
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch {
    throw new Error(
      import.meta.env.PROD
        ? 'Cannot reach the server. Wait a moment and refresh — the site may be starting up.'
        : 'Cannot reach the API server. Keep the backend running: open a terminal, run "cd backend" then "npm run dev" (or from project root: "npm start"). Backend must stay on http://localhost:5000.'
    );
  }

  const text = await res.text();
  let data = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      if (!res.ok) {
        throw new Error(
          'API server is not running. Start backend: cd backend && npm run dev (leave that terminal open).'
        );
      }
    }
  }

  if (!res.ok) {
    if (res.status === 502 || res.status === 503 || res.status === 504 || (res.status >= 500 && !data.error)) {
      throw new Error(
        'API server is not running. Start backend: cd backend && npm run dev (leave that terminal open).'
      );
    }
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  login: (username, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),

  getMe: () => request('/auth/me'),

  uploadImage: (file) => {
    const form = new FormData();
    form.append('image', file);
    return request('/upload', { method: 'POST', body: form });
  },

  getSections: () => request('/content/sections'),
  getCarousel: () => request('/content/carousel'),
  getHierarchy: () => request('/hierarchy/'),
  getMinistries: () => request('/governance/ministries'),
  getMps: () => request('/governance/mps'),
  getMlas: () => request('/governance/mlas'),
  getCourtPositions: () => request('/court/positions'),
  getCourtAuthorities: () => request('/court/authorities'),
  getCivicOverview: () => request('/civic/overview'),
  getCivicDistricts: () => request('/civic/districts'),
  getCivicPolice: () => request('/civic/police-authorities'),
  getCivicOsds: () => request('/civic/minister-osds'),
  getCivicIas: () => request('/civic/district-ias'),
  getCivicParliament: () => request('/civic/parliament-topics'),
  getCivicAssembly: () => request('/civic/assembly-topics'),
  getCivicMlaHistory: () => request('/civic/mla-history'),
  getQuiz: () => request('/quiz/'),
  submitQuiz: (answers, count) =>
    request('/quiz/submit', { method: 'POST', body: JSON.stringify({ answers, count }) }),

  // Platform admin
  getSchools: () => request('/schools/'),
  createSchool: (data) =>
    request('/schools/', { method: 'POST', body: JSON.stringify(data) }),
  updateSchool: (id, data) =>
    request(`/schools/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSchool: (id) => request(`/schools/${id}`, { method: 'DELETE' }),

  getAdminCategories: () => request('/content/admin/categories'),
  createCategory: (data) =>
    request('/content/admin/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id, data) =>
    request(`/content/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id) => request(`/content/admin/categories/${id}`, { method: 'DELETE' }),

  getAdminItems: (categoryId) =>
    request(`/content/admin/items${categoryId ? `?categoryId=${categoryId}` : ''}`),
  createItem: (data) =>
    request('/content/admin/items', { method: 'POST', body: JSON.stringify(data) }),
  updateItem: (id, data) =>
    request(`/content/admin/items/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteItem: (id) => request(`/content/admin/items/${id}`, { method: 'DELETE' }),

  getAdminCarousel: () => request('/content/admin/carousel'),
  createCarousel: (data) =>
    request('/content/admin/carousel', { method: 'POST', body: JSON.stringify(data) }),
  updateCarousel: (id, data) =>
    request(`/content/admin/carousel/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCarousel: (id) => request(`/content/admin/carousel/${id}`, { method: 'DELETE' }),

  getAdminHierarchy: () => request('/hierarchy/admin'),
  createHierarchy: (data) =>
    request('/hierarchy/admin', { method: 'POST', body: JSON.stringify(data) }),
  updateHierarchy: (id, data) =>
    request(`/hierarchy/admin/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteHierarchy: (id) => request(`/hierarchy/admin/${id}`, { method: 'DELETE' }),

  getAdminQuiz: () => request('/quiz/admin'),
  createQuiz: (data) =>
    request('/quiz/admin', { method: 'POST', body: JSON.stringify(data) }),
  updateQuiz: (id, data) =>
    request(`/quiz/admin/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteQuiz: (id) => request(`/quiz/admin/${id}`, { method: 'DELETE' }),

  getAdminMinistries: () => request('/governance/admin/ministries'),
  createMinistry: (data) => request('/governance/admin/ministries', { method: 'POST', body: JSON.stringify(data) }),
  updateMinistry: (id, data) => request(`/governance/admin/ministries/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMinistry: (id) => request(`/governance/admin/ministries/${id}`, { method: 'DELETE' }),

  getAdminMps: () => request('/governance/admin/mps'),
  createMp: (data) => request('/governance/admin/mps', { method: 'POST', body: JSON.stringify(data) }),
  updateMp: (id, data) => request(`/governance/admin/mps/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMp: (id) => request(`/governance/admin/mps/${id}`, { method: 'DELETE' }),

  getAdminMlas: () => request('/governance/admin/mlas'),
  createMla: (data) => request('/governance/admin/mlas', { method: 'POST', body: JSON.stringify(data) }),
  updateMla: (id, data) => request(`/governance/admin/mlas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMla: (id) => request(`/governance/admin/mlas/${id}`, { method: 'DELETE' }),

  getAdminCourtPositions: () => request('/court/admin/positions'),
  createCourtPosition: (data) => request('/court/admin/positions', { method: 'POST', body: JSON.stringify(data) }),
  updateCourtPosition: (id, data) => request(`/court/admin/positions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCourtPosition: (id) => request(`/court/admin/positions/${id}`, { method: 'DELETE' }),

  getAdminCourtAuthorities: () => request('/court/admin/authorities'),
  createCourtAuthority: (data) => request('/court/admin/authorities', { method: 'POST', body: JSON.stringify(data) }),
  updateCourtAuthority: (id, data) => request(`/court/admin/authorities/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCourtAuthority: (id) => request(`/court/admin/authorities/${id}`, { method: 'DELETE' }),

  getAdminDistricts: () => request('/civic/admin/districts'),
  createDistrict: (data) => request('/civic/admin/districts', { method: 'POST', body: JSON.stringify(data) }),
  updateDistrict: (id, data) => request(`/civic/admin/districts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteDistrict: (id) => request(`/civic/admin/districts/${id}`, { method: 'DELETE' }),

  getAdminPolice: () => request('/civic/admin/police-authorities'),
  createPolice: (data) => request('/civic/admin/police-authorities', { method: 'POST', body: JSON.stringify(data) }),
  updatePolice: (id, data) => request(`/civic/admin/police-authorities/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePolice: (id) => request(`/civic/admin/police-authorities/${id}`, { method: 'DELETE' }),

  getAdminGrievance: () => request('/civic/admin/grievance-topics'),
  createGrievance: (data) => request('/civic/admin/grievance-topics', { method: 'POST', body: JSON.stringify(data) }),
  updateGrievance: (id, data) => request(`/civic/admin/grievance-topics/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteGrievance: (id) => request(`/civic/admin/grievance-topics/${id}`, { method: 'DELETE' }),

  getAdminWhatsapp: () => request('/civic/admin/whatsapp-services'),
  createWhatsapp: (data) => request('/civic/admin/whatsapp-services', { method: 'POST', body: JSON.stringify(data) }),
  updateWhatsapp: (id, data) => request(`/civic/admin/whatsapp-services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteWhatsapp: (id) => request(`/civic/admin/whatsapp-services/${id}`, { method: 'DELETE' }),

  getAdminParliament: () => request('/civic/admin/parliament-topics'),
  createParliament: (data) => request('/civic/admin/parliament-topics', { method: 'POST', body: JSON.stringify(data) }),
  updateParliament: (id, data) => request(`/civic/admin/parliament-topics/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteParliament: (id) => request(`/civic/admin/parliament-topics/${id}`, { method: 'DELETE' }),

  getAdminAssembly: () => request('/civic/admin/assembly-topics'),
  createAssembly: (data) => request('/civic/admin/assembly-topics', { method: 'POST', body: JSON.stringify(data) }),
  updateAssembly: (id, data) => request(`/civic/admin/assembly-topics/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAssembly: (id) => request(`/civic/admin/assembly-topics/${id}`, { method: 'DELETE' }),

  getAdminMlaHistory: () => request('/civic/admin/district-mla-history'),
  createMlaHistory: (data) => request('/civic/admin/district-mla-history', { method: 'POST', body: JSON.stringify(data) }),
  updateMlaHistory: (id, data) => request(`/civic/admin/district-mla-history/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMlaHistory: (id) => request(`/civic/admin/district-mla-history/${id}`, { method: 'DELETE' }),

  // School admin
  getStudents: () => request('/users/students'),
  createStudent: (data) =>
    request('/users/students', { method: 'POST', body: JSON.stringify(data) }),
  deleteStudent: (id) => request(`/users/students/${id}`, { method: 'DELETE' })
};

export async function resolveImageUrl(file, existingUrl = '') {
  if (file) {
    const { url } = await api.uploadImage(file);
    return url;
  }
  return existingUrl;
}
