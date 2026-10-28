const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
export async function request(path, options = {}) {
  const response = await fetch(`${base}${path}`, { credentials: 'include', ...options, headers: { 'Content-Type': 'application/json', ...options.headers } });
  const body = await response.json();
  if (!response.ok || !body.success) throw new Error(body.error?.message || 'Something went wrong. Please try again.');
  return body.data;
}
export const createCase = (input) => request('/cases', { method: 'POST', body: JSON.stringify(input) });
export const getCase = (id) => request(`/cases/${id}`);
export const submitAccusation = (id, suspectId) => request(`/cases/${id}/accusations`, { method: 'POST', body: JSON.stringify({ suspectId }) });
export const listCases = () => request('/cases');
export const getResult = (id) => request(`/cases/${id}/result`);
