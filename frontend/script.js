if (!localStorage.getItem('token')) {

    window.location.href = 'login.html';

}

const API_URL = 'https://cloudtasks-api-gncaf0h8cwcqgkfh.eastus2-01.azurewebsites.net/api/tasks';
const token = localStorage.getItem('token');

const taskList = document.getElementById('taskList');

const totalTasks = document.getElementById('totalTasks');

const completedTasks = document.getElementById('completedTasks');

const themeToggle = document.getElementById('themeToggle');
const notificationBox = document.getElementById('notificationBox');
let taskChart;



// =========================
// THEME MODE
// =========================

if (localStorage.getItem('theme') === 'light') {

    document.body.classList.add('light-mode');

}

themeToggle.addEventListener('click', () => {

    document.body.classList.toggle('light-mode');

    if (document.body.classList.contains('light-mode')) {

        localStorage.setItem('theme', 'light');

    } else {

        localStorage.setItem('theme', 'dark');

    }

});


function renderChart(tasks) {

    const completed = tasks.filter(task => task.completed).length;

    const pending = tasks.filter(task => !task.completed).length;

    const alta = tasks.filter(task => task.priority === 'Alta').length;

    const media = tasks.filter(task => task.priority === 'Media').length;

    const baja = tasks.filter(task => task.priority === 'Baja').length;



    const ctx = document.getElementById('taskChart');



    if (taskChart) {

        taskChart.destroy();

    }



    taskChart = new Chart(ctx, {

        type: 'bar',

        data: {

            labels: [

                'Completadas',

                'Pendientes',

                'Alta',

                'Media',

                'Baja'

            ],

            datasets: [{

                label: 'Tareas',

                data: [

                    completed,

                    pending,

                    alta,

                    media,

                    baja

                ],

                backgroundColor: [

                    '#28a745',

                    '#dc3545',

                    '#ff4d4d',

                    '#ffb84d',

                    '#4dff88'

                ],

                borderRadius: 8

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    display: false
                }

            },

            scales: {

                y: {

                    beginAtZero: true,

                    ticks: {

                        color: localStorage.getItem('theme') === 'light'
                            ? '#222'
                            : '#fff'
                    }

                },

                x: {

                    ticks: {

                        color: localStorage.getItem('theme') === 'light'
                            ? '#222'
                            : '#fff'
                    }

                }

            }

        }

    });

}

// =========================
// FETCH TASKS
// =========================

async function fetchTasks() {

    const response = await fetch(API_URL, {

    headers: {

        Authorization: `Bearer ${token}`

    }

});
    const tasks = await response.json();

    renderTasks(tasks);
    renderChart(tasks);
}



// =========================
// RENDER TASKS
// =========================

function renderTasks(tasks) {

    taskList.innerHTML = '';

    totalTasks.textContent = tasks.length;

    const completed = tasks.filter(task => task.completed);

    completedTasks.textContent = completed.length;

    const pendingTasks = tasks.length - completed.length;

notificationBox.innerHTML = `
    ⚠️ Tienes ${pendingTasks} tareas pendientes
`;

    tasks.forEach(task => {

        const today = new Date();

today.setHours(0, 0, 0, 0);

const dueDate = task.dueDate
    ? new Date(task.dueDate)
    : null;

if (dueDate) {
    dueDate.setHours(0, 0, 0, 0);
}

let statusClass = '';

let statusText = '';



if (dueDate) {

    if (dueDate < today && !task.completed) {

        statusClass = 'overdue';

        statusText = '⚠️ Vencida';

    }

    else {

        const diffTime = dueDate - today;

        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        if (diffDays <= 2 && !task.completed) {

            statusClass = 'soon';

            statusText = '⏳ Próxima';

        }

    }

}

        const li = document.createElement('li');



        let priorityClass = '';

        if (task.priority === 'Alta') {

            priorityClass = 'priority-alta';

        } else if (task.priority === 'Media') {

            priorityClass = 'priority-media';

        } else {

            priorityClass = 'priority-baja';

        }



li.className = `task ${priorityClass} ${statusClass}`;
        if (task.completed) {

            li.classList.add('completed');

        }



        li.innerHTML = `

            <div class="task-info">

                <h3>${task.title}</h3>

                <p>📂 Categoría: <strong>${task.category || 'General'}</strong></p>

                <p>⚡ Prioridad: <strong>${task.priority || 'Media'}</strong></p>

                <p>
                <p>
    <strong>${statusText}</strong>
</p>
                    📅 Fecha límite:
                    <strong>
                        ${
                            task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString('es-MX', {
    timeZone: 'UTC'
})
                            : 'Sin fecha'
                        }
                    </strong>
                </p>

            </div>

            <div class="task-buttons">

                <button
                    class="complete-btn"
                    onclick="toggleTask('${task._id}')"
                >
                    ✓
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask('${task._id}')"
                >
                    X
                </button>

            </div>
        `;

        taskList.appendChild(li);

    });
}



// =========================
// ADD TASK
// =========================

async function addTask() {

    const taskInput = document.getElementById('taskInput');

    const categoryInput = document.getElementById('categoryInput');

    const priorityInput = document.getElementById('priorityInput');

    const dueDateInput = document.getElementById('dueDateInput');



    if (taskInput.value.trim() === '') return;



    await fetch(API_URL, {

        method: 'POST',

        headers: {

            'Content-Type': 'application/json',

            Authorization: `Bearer ${token}`

        },

        body: JSON.stringify({

            title: taskInput.value,

            category: categoryInput.value,

            priority: priorityInput.value,

            dueDate: dueDateInput.value

        })

    });



    taskInput.value = '';

    dueDateInput.value = '';



    fetchTasks();

}

// =========================
// DELETE TASK
// =========================

async function deleteTask(id) {

    await fetch(`${API_URL}/${id}`, {

    method: 'DELETE',

    headers: {

        Authorization: `Bearer ${token}`

    }

});
    fetchTasks();
}



// =========================
// TOGGLE TASK
// =========================

async function toggleTask(id) {

    await fetch(`${API_URL}/${id}`, {

    method: 'PUT',

    headers: {

        Authorization: `Bearer ${token}`

    }

});

    fetchTasks();
}



// =========================
// INITIAL LOAD
// =========================

fetchTasks();

function logout() {

    localStorage.removeItem('token');

    localStorage.removeItem('user');



    window.location.href = 'login.html';

}