import { supabase } from './supabase.js';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function request(path, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.access_token}`,
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || res.statusText);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const notesApi = {
  list: () => request('/api/notes'),
  get: (id) => request(`/api/notes/${id}`),
  create: (title, content) => request('/api/notes', {
    method: 'POST',
    body: JSON.stringify({ title, content }),
  }),
  update: (id, title, content) => request(`/api/notes/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title, content }),
  }),
  delete: (id) => request(`/api/notes/${id}`, { method: 'DELETE' }),
};
