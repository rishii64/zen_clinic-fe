const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('zenxnic_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {})
  };

  const response = await fetch(url, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }
  return data;
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (user) => request('/auth/register', { method: 'POST', body: JSON.stringify(user) }),
  getSetupStatus: () => request('/auth/setup-status'),
  getMe: () => request('/auth/me'),
  getUsers: () => request('/auth/users'),
  createUser: (user) => request('/auth/users', { method: 'POST', body: JSON.stringify(user) }),
  updateUser: (id, user) => request(`/auth/users/${id}`, { method: 'PUT', body: JSON.stringify(user) }),

  // Patients
  getPatients: (search = '') => request(`/patients?search=${encodeURIComponent(search)}`),
  getPatientById: (id) => request(`/patients/${id}`),
  createPatient: (patient) => request('/patients', { method: 'POST', body: JSON.stringify(patient) }),
  updatePatient: (id, patient) => request(`/patients/${id}`, { method: 'PUT', body: JSON.stringify(patient) }),
  deletePatient: (id) => request(`/patients/${id}`, { method: 'DELETE' }),

  // Tests
  getTests: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/tests?${q}`);
  },
  syncTariff: () => request('/tests/sync-tariff', { method: 'POST' }),
  getTestById: (id) => request(`/tests/${id}`),
  createTest: (test) => request('/tests', { method: 'POST', body: JSON.stringify(test) }),
  updateTest: (id, test) => request(`/tests/${id}`, { method: 'PUT', body: JSON.stringify(test) }),
  deleteTest: (id) => request(`/tests/${id}`, { method: 'DELETE' }),

  // Billing
  getBills: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/billing?${q}`);
  },
  getBillById: (id) => request(`/billing/${id}`),
  createBill: (billData) => request('/billing', { method: 'POST', body: JSON.stringify(billData) }),
  addPayment: (id, paymentData) => request(`/billing/${id}/payments`, { method: 'POST', body: JSON.stringify(paymentData) }),
  cancelBill: (id, reason) => request(`/billing/${id}/cancel`, { method: 'POST', body: JSON.stringify({ reason }) }),

  // Reports
  getReports: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/reports?${q}`);
  },
  getReportById: (id) => request(`/reports/${id}`),
  updateReportResults: (id, data) => request(`/reports/${id}/results`, { method: 'PUT', body: JSON.stringify(data) }),
  approveReport: (id, data) => request(`/reports/${id}/approve`, { method: 'PUT', body: JSON.stringify(data) }),
  deliverReport: (id) => request(`/reports/${id}/deliver`, { method: 'PUT' }),

  // Dashboard
  getDashboardStats: () => request('/dashboard/stats'),

  // Config
  getConfig: () => request('/config'),
  updateConfig: (config) => request('/config', { method: 'PUT', body: JSON.stringify(config) })
};
