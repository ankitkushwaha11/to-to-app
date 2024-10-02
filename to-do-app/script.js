// Select Elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const todoList = document.getElementById('todo-list');
const undoBtn = document.getElementById('undo-btn');

// Load tasks from local storage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Global variable to store the last deleted task
let lastDeletedTask = null;

// Display tasks from local storage on load
document.addEventListener('DOMContentLoaded', displayTasks);

// Add Task Event Listener
addTaskBtn.addEventListener('click', addTask);

// Display tasks in the list
function displayTasks() {
  tasks.forEach(task => {
    createTaskElement(task);
  });
}

// Add Task
function addTask() {
  const taskText = taskInput.value;
  if (taskText) {
    const task = { id: Date.now(), text: taskText, completed: false };
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    createTaskElement(task);
    taskInput.value = '';
  }
}

// Create Task Element
function createTaskElement(task) {
  const li = document.createElement('li');
  li.classList.add('todo-item');
  if (task.completed) li.classList.add('completed'); // Add 'completed' class if task is completed
  li.setAttribute('data-id', task.id);

  li.innerHTML = `
    <span class="task-text">${task.text}</span>
    <button class="mark-btn">${task.completed ? 'Unmark' : 'Mark'}</button>
    <button class="edit-btn">Edit</button>
    <button class="delete-btn">Delete</button>
  `;

  todoList.appendChild(li);

  // Mark Task Completed/Uncompleted
  const markBtn = li.querySelector('.mark-btn');
  markBtn.addEventListener('click', () => {
    toggleCompleteTask(task.id, li);
  });

  // Delete Task
  const deleteBtn = li.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', () => {
    deleteTask(task.id, li);
  });

  // Edit Task
  const editBtn = li.querySelector('.edit-btn');
  editBtn.addEventListener('click', () => {
    editTask(task.id, li);
  });
}

// Toggle Complete/Incomplete Task
function toggleCompleteTask(taskId, taskElement) {
  const task = tasks.find(t => t.id === taskId);
  task.completed = !task.completed;
  localStorage.setItem('tasks', JSON.stringify(tasks));
  taskElement.classList.toggle('completed');
  taskElement.querySelector('.mark-btn').textContent = task.completed ? 'Unmark' : 'Mark';
}

// Delete Task
function deleteTask(taskId, taskElement) {
  // Store the deleted task
  lastDeletedTask = tasks.find(task => task.id === taskId);

  // Remove the task from the list
  tasks = tasks.filter(task => task.id !== taskId);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  taskElement.remove();

  // Show the Undo button for 5 seconds
  undoBtn.style.display = 'block';
  setTimeout(() => {
    undoBtn.style.display = 'none';
    lastDeletedTask = null; // Clear the last deleted task after the Undo button hides
  }, 5000); // Hide the Undo button after 5 seconds
}

// Undo Functionality
undoBtn.addEventListener('click', () => {
  if (lastDeletedTask) {
    // Add the deleted task back to the task list
    tasks.push(lastDeletedTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Recreate the task element in the UI
    createTaskElement(lastDeletedTask);

    // Hide the Undo button
    undoBtn.style.display = 'none';

    // Clear the last deleted task
    lastDeletedTask = null;
  }
});

// Edit Task
function editTask(taskId, taskElement) {
  const newTaskText = prompt('Edit your task:', taskElement.querySelector('.task-text').textContent);
  if (newTaskText) {
    const task = tasks.find(t => t.id === taskId);
    task.text = newTaskText;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskElement.querySelector('.task-text').textContent = newTaskText;
  }
}
