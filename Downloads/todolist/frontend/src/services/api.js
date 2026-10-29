const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
  } catch {
    throw new Error('Unable to reach the server. Check that the backend is running.');
  }
  if (!response.ok) {
    let message = `Request failed (${response.status}).`;
    try { message = (await response.json()).message || message; } catch { /* no response body */ }
    throw new Error(message);
  }
  return response.status === 204 ? null : response.json();
}

export const taskApi = {
  list: (search = '') => request(`/tasks?${new URLSearchParams({ search })}`),
  create: (task) => request('/tasks', { method: 'POST', body: JSON.stringify(task) }),
  update: (id, changes) => request(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(changes) }),
  remove: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
};
