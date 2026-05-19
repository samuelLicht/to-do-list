// ── Selección de elementos ──
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const clearBtn = document.getElementById('clear-btn');
const filterBtns = document.querySelectorAll('.filter-btn');

// ── Estado de la app ──
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// ── Guardar en localStorage ──
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ── Actualizar contador ──
function updateCount() {
  const pending = tasks.filter(t => !t.completed).length;
  taskCount.textContent = `${pending} tarea${pending !== 1 ? 's' : ''} pendiente${pending !== 1 ? 's' : ''}`;
}

// ── Renderizar lista ──
function renderTasks() {
  taskList.innerHTML = '';

  const filtered = tasks.filter(t => {
    if (currentFilter === 'pending') return !t.completed;
    if (currentFilter === 'completed') return t.completed;
    return true;
  });

  if (filtered.length === 0) {
    taskList.innerHTML = `<li style="text-align:center; color:#484f58; padding: 20px 0;">No hay tareas aquí.</li>`;
  }

  filtered.forEach(task => {
    const li = document.createElement('li');
    li.classList.add('task-item');
    if (task.completed) li.classList.add('completed');

    li.innerHTML = `
      <div class="task-checkbox" data-id="${task.id}">
        ${task.completed ? '✓' : ''}
      </div>
      <span class="task-text">${task.text}</span>
      <button class="task-delete" data-id="${task.id}">✕</button>
    `;

    taskList.appendChild(li);
  });

  updateCount();
}

// ── Agregar tarea ──
function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  const newTask = {
    id: Date.now(),
    text,
    completed: false
  };

  tasks.unshift(newTask);
  saveTasks();
  renderTasks();
  taskInput.value = '';
  taskInput.focus();
}

// ── Completar tarea ──
function toggleTask(id) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTasks();
  renderTasks();
}

// ── Eliminar tarea ──
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

// ── Limpiar completadas ──
function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
}

// ── Eventos ──
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

taskList.addEventListener('click', e => {
  const id = parseInt(e.target.dataset.id || e.target.closest('[data-id]')?.dataset.id);
  if (!id) return;

  if (e.target.classList.contains('task-delete')) {
    deleteTask(id);
  } else if (e.target.classList.contains('task-checkbox') || e.target.closest('.task-checkbox')) {
    toggleTask(id);
  }
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

clearBtn.addEventListener('click', clearCompleted);

// ── Iniciar app ──
renderTasks();