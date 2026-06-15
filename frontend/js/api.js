// ── API base URL ──
const BASE = '/api/v1';

// ── Token helpers ──
const token = {
  get:    ()      => localStorage.getItem('token'),
  set:    (t)     => localStorage.setItem('token', t),
  remove: ()      => localStorage.removeItem('token'),
};

// ── Core request ──
async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  if (token.get()) headers['Authorization'] = `Bearer ${token.get()}`;

  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  // token expired or invalid → back to login
  if (res.status === 401) {
    token.remove();
    window.location.href = '/index.html';
  }

  return data;
}

// ── Shortcuts ──
const api = {
  get:    (path)        => request('GET',    path),
  post:   (path, body)  => request('POST',   path, body),
  patch:  (path, body)  => request('PATCH',  path, body),
  delete: (path)        => request('DELETE', path),
};
