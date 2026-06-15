// ── Guard: must be logged in ──
if (!token.get()) window.location.href = '/index.html';

// ── State ──
let tasks      = [];
let editingId  = null;

// ── DOM refs ──
const taskList  = document.getElementById('task-list');
const form      = document.getElementById('task-form');
const formTitle = document.getElementById('form-title');
const cancelBtn = document.getElementById('cancel-btn');
const alert     = document.getElementById('form-alert');
const filterSel = document.getElementById('filter-status');
const searchInp = document.getElementById('search');

// ── Load user info & tasks ──
async function init() {
  const dash = await api.get('/auth/dashboard');
  if (!dash.success) return;

  document.getElementById('username').textContent = dash.data.user.username;
  document.getElementById('avatar').innerHTML   =`<img src=${dash.data.user.avatar}></img>`

  tasks = dash.data.tasks || [];
  renderTasks();
  renderStats(dash.data);
}

// ── Stats ──
function renderStats(data) {
  document.getElementById('stat-total').textContent     = data.tasks?.length ?? 0;
  document.getElementById('stat-done').textContent      = data.completedTasks?.length ?? 0;
  document.getElementById('stat-progress').textContent  = data.inProgressTasks?.length ?? 0;
  document.getElementById('stat-todo').textContent      = data.toDoTasks?.length ?? 0;
}

// ── Render task list ──
function renderTasks() {
  const status = filterSel.value;
  const query  = searchInp.value.toLowerCase();

  const filtered = tasks.filter(t => {
    const matchStatus = status === 'all' || t.status === status;
    const matchSearch = t.title.toLowerCase().includes(query);
    return matchStatus && matchSearch;
  });

  if (filtered.length === 0) {
    taskList.innerHTML = `
      <div class="empty">
        <span>📋</span>
        No tasks found
      </div>`;
    return;
  }

  taskList.innerHTML = filtered.map(t => `
    <div class="task-card" data-id="${t.id}">
      <div class="task-header">
        <span class="task-title">${escHtml(t.title)}</span>
        <div class="task-actions">
          <button class="btn-icon" onclick="editTask(${t.id})" title="Edit">✏️</button>
          <button class="btn-icon" onclick="deleteTask(${t.id})" title="Delete">🗑️</button>
        </div>
      </div>
      ${t.description ? `<p class="task-desc">${escHtml(t.description)}</p>` : ''}
      <div class="task-meta">
        <span class="badge ${t.priority}">${t.priority}</span>
        <span class="badge ${t.status}">${t.status}</span>
        ${t.dueDate ? `<span class="due-date">📅 ${formatDate(t.dueDate)}</span>` : ''}
      </div>
    </div>
  `).join('');
}

// ── Create / Update task ──
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideAlert();

  const btn  = form.querySelector('button[type=submit]');
  const body = {
    title:       form.title.value.trim(),
    description: form.description.value.trim() || undefined,
    priority:    form.priority.value,
    status:      form.status.value,
    dueDate:     form.dueDate.value ? new Date(form.dueDate.value).toISOString() : undefined,
  };

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>';

  let data;
  if (editingId) {
    data = await api.patch(`/tasks/${editingId}`, body);
  } else {
    data = await api.post('/tasks', body);
  }

  btn.disabled = false;
  btn.textContent = editingId ? 'Update task' : 'Add task';

  if (data.success) {
    resetForm();
    await init();
  } else {
    showAlert(data.message || (data.errors?.[0]?.message) || 'Something went wrong');
  }
});

// ── Edit task ──
function editTask(id) {
  const t = tasks.find(t => t.id === id);
  if (!t) return;

  editingId = id;
  formTitle.textContent = 'Edit Task';
  form.title.value       = t.title;
  form.description.value = t.description || '';
  form.priority.value    = t.priority;
  form.status.value      = t.status;
  form.dueDate.value     = t.dueDate ? t.dueDate.slice(0, 16) : '';
  cancelBtn.style.display = 'inline-block';
  form.querySelector('button[type=submit]').textContent = 'Update task';
  form.scrollIntoView({ behavior: 'smooth' });
}

// ── Delete task ──
async function deleteTask(id) {
  if (!confirm('Delete this task?')) return;
  const data = await api.delete(`/tasks/${id}`);
  if (data.success) await init();
}

// ── Cancel edit ──
cancelBtn.addEventListener('click', resetForm);

function resetForm() {
  editingId = null;
  form.reset();
  formTitle.textContent = 'New Task';
  cancelBtn.style.display = 'none';
  form.querySelector('button[type=submit]').textContent = 'Add task';
  hideAlert();
}

// ── Filter & Search ──
filterSel.addEventListener('change', renderTasks);
searchInp.addEventListener('input',  renderTasks);

// ── Signout ──
document.getElementById('signout-btn').addEventListener('click', async () => {
  await api.post('/auth/signout');
  token.remove();
  window.location.href = '/index.html';
});

// ── Helpers ──
function showAlert(msg) {
  alert.textContent = msg;
  alert.classList.add('show');
}
function hideAlert() {
  alert.classList.remove('show');
}
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
}
function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── Start ──
init();
