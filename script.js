const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const clearAllBtn = document.getElementById("clearAllBtn");

// Load tasks on page load
document.addEventListener("DOMContentLoaded", loadTasks);

// Add task
addBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  const deadline = taskDate.value;
  if (taskText === "") return;

  addTask(taskText, false, deadline);
  saveTask(taskText, false, deadline);
  taskInput.value = "";
  taskDate.value = "";
});

// Clear all
clearAllBtn.addEventListener("click", () => {
  taskList.innerHTML = "";
  localStorage.removeItem("tasks");
});

// Search filter
searchInput.addEventListener("input", () => {
  const filter = searchInput.value.toLowerCase();
  document.querySelectorAll("#taskList li").forEach(li => {
    const text = li.querySelector("span").innerText.toLowerCase();
    li.style.display = text.includes(filter) ? "flex" : "none";
  });
});

// Add Task to UI
function addTask(taskText, completed = false, deadline = "") {
  const li = document.createElement("li");
  li.innerHTML = `
    <span class="${completed ? "completed" : ""}">${taskText}</span>
    ${deadline ? `<span class="deadline">📅 ${deadline}</span>` : ""}
    <div class="action-btns">
      <button class="editBtn">✏️</button>
      <button class="deleteBtn">❌</button>
    </div>
  `;

  // Toggle complete
  li.querySelector("span").addEventListener("click", () => {
    li.querySelector("span").classList.toggle("completed");
    updateLocalStorage();
  });

  // Edit task
  li.querySelector(".editBtn").addEventListener("click", () => {
    const newTask = prompt("Edit task:", taskText);
    if (newTask) {
      li.querySelector("span").innerText = newTask;
      updateLocalStorage();
    }
  });

  // Delete task
  li.querySelector(".deleteBtn").addEventListener("click", () => {
    li.remove();
    updateLocalStorage();
  });

  taskList.appendChild(li);
}

// Save task
function saveTask(taskText, completed, deadline) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text: taskText, completed, deadline });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks
function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => addTask(task.text, task.completed, task.deadline));
}

// Update storage
function updateLocalStorage() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach(li => {
    tasks.push({
      text: li.querySelector("span").innerText,
      completed: li.querySelector("span").classList.contains("completed"),
      deadline: li.querySelector(".deadline")
        ? li.querySelector(".deadline").innerText.replace("📅 ", "")
        : ""
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


