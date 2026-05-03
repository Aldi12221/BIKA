const API_BASE = '/api';

const api = {
  // ===== Auth =====
  loginGoogle: (data) =>
    fetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  updateProfile: (id, data) =>
    fetch(`${API_BASE}/user/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  // ===== Contents =====
  getContents: (kategori) =>
    fetch(`${API_BASE}/contents/${kategori}`).then(r => r.json()),

  createContent: (data) =>
    fetch(`${API_BASE}/contents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  updateContent: (id, data) =>
    fetch(`${API_BASE}/contents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  deleteContent: (id) =>
    fetch(`${API_BASE}/contents/${id}`, { method: 'DELETE' }).then(r => r.json()),

  // ===== Quizzes =====
  getQuizzes: () =>
    fetch(`${API_BASE}/quizzes`).then(r => r.json()),

  getQuizDetail: (id) =>
    fetch(`${API_BASE}/quizzes/${id}`).then(r => r.json()),

  createQuiz: (data) =>
    fetch(`${API_BASE}/quizzes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  updateQuiz: (id, data) =>
    fetch(`${API_BASE}/quizzes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  deleteQuiz: (id) =>
    fetch(`${API_BASE}/quizzes/${id}`, { method: 'DELETE' }).then(r => r.json()),

  addQuestion: (quizId, data) =>
    fetch(`${API_BASE}/quizzes/${quizId}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  deleteQuestion: (quizId, questionId) =>
    fetch(`${API_BASE}/quizzes/${quizId}/questions/${questionId}`, { method: 'DELETE' }).then(r => r.json()),

  // ===== Admin =====
  adminLogin: (data) =>
    fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  adminVerify: (token) =>
    fetch(`${API_BASE}/admin/verify`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json()),

  adminStats: () =>
    fetch(`${API_BASE}/admin/stats`).then(r => r.json()),

  adminRegister: (data) =>
    fetch(`${API_BASE}/admin/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
};

export default api;
