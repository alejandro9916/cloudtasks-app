const API_URL = 'http://localhost:3000/api/tasks';

const taskList = document.getElementById('taskList');

const totalTasks = document.getElementById('totalTasks');

const completedTasks = document.getElementById('completedTasks');

async function fetchTasks(){

    const response = await fetch(API_URL);

    const tasks = await response.json();

    renderTasks(tasks);
}

function renderTasks(tasks){

    taskList.innerHTML = '';

    totalTasks.textContent = tasks.length;

    const completed = tasks.filter(task => task.completed);

    completedTasks.textContent = completed.length;

    tasks.forEach(task => {

        const li = document.createElement('li');

        li.classList.add('task');

        if(task.completed){
            li.classList.add('completed');
        }

        li.innerHTML = `
            <span>${task.title}</span>

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

async function addTask(){

    const input = document.getElementById('taskInput');

    if(input.value.trim() === '') return;

    await fetch(API_URL, {

        method:'POST',

        headers:{
            'Content-Type':'application/json'
        },

        body:JSON.stringify({
            title:input.value
        })
    });

    input.value = '';

    fetchTasks();
}

async function deleteTask(id){

    await fetch(`${API_URL}/${id}`, {
        method:'DELETE'
    });

    fetchTasks();
}

async function toggleTask(id){

    await fetch(`${API_URL}/${id}`, {
        method:'PUT'
    });

    fetchTasks();
}

fetchTasks();