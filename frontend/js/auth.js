// ── Tab switching ──
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// ── Alert helper ──
function showAlert(id, message, type = 'error') {
  const el = document.getElementById(id);
  el.textContent = message;
  el.className = `alert ${type} show`;
}
function hideAlert(id) {
  document.getElementById(id).className = 'alert';
}

// ── Signup ──
document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  hideAlert('signup-alert');

  const btn  = e.target.querySelector('button[type=submit]');
  const username = e.target.username.value.trim();
  const email    = e.target.email.value.trim();
  const password = e.target.password.value;

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>';

  const data = await api.post('/auth/signup', { username, email, password });

  btn.disabled = false;
  btn.textContent = 'Create account';

  if (data.success) {
    showAlert('signup-alert', 'Account created! Check your email to verify.', 'success');
    e.target.reset();
  } else {
    showAlert('signup-alert', data.message || 'Signup failed');
  }
});

// ── Login ──
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  hideAlert('login-alert');

  const btn      = e.target.querySelector('button[type=submit]');
  const email    = e.target.email.value.trim();
  const password = e.target.password.value;

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>';

  const data = await api.post('/auth/signin', { email, password });

  btn.disabled = false;
  btn.textContent = 'Sign in';

  if (data.success) {
    token.set(data.data.accessToken);
    window.location.href = '/dashboard.html';
  } else {
    showAlert('login-alert', data.message || 'Invalid credentials');
  }
});

// ── Google OAuth ──
document.getElementById('google-btn').addEventListener('click', () => {
  window.location.href = '/api/v1/auth/google';
});

// ── Already logged in? ──
if (token.get()) window.location.href = '/dashboard.html';
