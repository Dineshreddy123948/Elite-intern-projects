class TodoApp {
  constructor(taskInputId, taskListId) {
    this.tasks = [];
    this.taskInput = document.getElementById(taskInputId);
    this.taskList = document.getElementById(taskListId);
  }

  addTask() {
    const task = this.taskInput.value.trim();
    if (task) {
      this.tasks.push(task);
      this.taskInput.value = "";
      this.renderTasks();
    }
  }

  deleteTask(index) {
    this.tasks.splice(index, 1);
    this.renderTasks();
  }

  renderTasks() {
    this.taskList.innerHTML = "";
    this.tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.textContent = task;

      const btn = document.createElement("button");
      btn.textContent = "Delete";
      btn.onclick = () => this.deleteTask(index);

      li.appendChild(btn);
      this.taskList.appendChild(li);
    });
  }
}

const app = new TodoApp("taskInput", "taskList");
document.getElementById("addBtn").addEventListener("click", () => app.addTask());
