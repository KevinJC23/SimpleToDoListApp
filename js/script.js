document.addEventListener("DOMContentLoaded", () => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));

    if(storedTasks) {
        tasks = storedTasks;
        updateTasksList();
        updateStatus();
    }

    checkDueDates();
});

let tasks = [];

const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

const addTask = () => {
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const text = taskInput.value.trim();
    const dueDate = dueDateInput.value;

    if (text) {
        tasks.push({ text: text, completed: false, dueDate: dueDate });
        taskInput.value = "";
        dueDateInput.value = "";
        updateTasksList();
        updateStatus();
        saveTasks();
    }
};

const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateTasksList();
    updateStatus();
    saveTasks();
};

const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateTasksList();
    updateStatus();
    saveTasks();
};

const editTask = (index) => {
    const taskInput = document.getElementById('taskInput');
    taskInput.value = tasks[index].text;

    tasks.splice(index, 1);
    updateTasksList();
    updateStatus();
    saveTasks();
};

const updateStatus = () => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;

    if (totalTasks === 0) {
        document.getElementById('progress').style.width = `0%`;
        document.getElementById('numbers').innerText = `0 / 0`;
        return;
    }

    const progress = (completedTasks/totalTasks) * 100;
    document.getElementById('progress').style.width = `${progress}%`;

    document.getElementById('numbers').innerText = `${completedTasks} / ${totalTasks}`;

    if(tasks.length && completedTasks === totalTasks) {
        launchConfetti();
    }
}

const updateTasksList = () => {
    const taskList = document.querySelector('.task-list');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');

        listItem.innerHTML = `
            <div class="taskItem">
                <div class="task ${task.completed ? 'completed' : ''}">
                    <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""}/>
                    <div class="task-text-container">
                    <p>${task.text}</p>
                    <p class="due-date">${task.dueDate ? `Due: ${task.dueDate}` : 'No Due Date'}</p>
                </div>
                </div>
                <div class="icons">
                    <img src="assets/edit-icon.png" alt="Edit" class="edit-icon">
                    <img src="assets/delete-icon.png" alt="Delete" class="delete-icon">
                </div>
            </div>
        `;

        const checkbox = listItem.querySelector('.checkbox');
        checkbox.addEventListener('change', () => toggleTaskComplete(index));

        const editIcon = listItem.querySelector('.edit-icon');
        editIcon.addEventListener('click', () => editTask(index));

        const deleteIcon = listItem.querySelector('.delete-icon');
        deleteIcon.addEventListener('click', () => deleteTask(index));

        taskList.appendChild(listItem);
    });
};

const checkDueDates = () => {
    const today = new Date().toISOString().split('T')[0];

    tasks.forEach((task, index) => {
        if (task.dueDate && task.dueDate === today) {
            alert(`Reminder: Your Task "${task.text}" is Due Today!`);
        }
    });
}

document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    addTask();
});

const launchConfetti = () => {
    const count = 200,
    defaults = {
        origin: { y: 0.7 },
    };

    function fire(particleRatio, opts) {
        confetti(
            Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio),
            })
        );
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });

    fire(0.2, {
        spread: 60,
    });

    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
}
