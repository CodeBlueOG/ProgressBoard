const tasks = JSON.parse(localStorage.getItem("progressboard-tasks")) || [];
console.log("Loaded tasks:", tasks);
function saveTasks() {
    localStorage.setItem("progressboard-tasks", JSON.stringify(tasks));
}
function renderTask(task) {
     const newCard = document.createElement("div");

    newCard.textContent = task.name;

    newCard.className = "task-card";

    const moveButton = document.createElement("button");
    if (task.status === "todo") {
        moveButton.textContent = "Move to In Progress";
    }
    else if (task.status === "progress") {
        moveButton.textContent = "Move to Completed";
    }
    else if (task.status === "completed") {
        moveButton.textContent = "Success!";
        moveButton.disabled = true;
    }

    newCard.appendChild(moveButton);
    const deleteButton = document.createElement("button");

    deleteButton.textContent = "🗑 Delete Task";

    deleteButton.className = "delete-task";

    newCard.appendChild(deleteButton);
    deleteButton.addEventListener("click", function() {
        const confirmed = confirm("Are you sure you want to delete this task?");
        if (!confirmed) {
            return;
        }
        const taskIndex = tasks.indexOf(task);
        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
            saveTasks();
        }
        newCard.remove();
        });

    moveButton.addEventListener("click", function() {
        console.log("Current Column:", newCard.parentElement.id);
        if (newCard.parentElement.id === "todo-column") {
            progressColumn.appendChild(newCard);
            task.status = "progress";
            moveButton.textContent = "Move to Completed";
        }
        else if (newCard.parentElement.id === "progress-column") {
            completedColumn.appendChild(newCard);
            moveButton.textContent = "Success!";
            task.status = "completed";
            task.completed = true;
            moveButton.disabled = true;
        }
        console.log(task.status, task.completed);
        saveTasks();
    });

    if (task.status === "todo") {
        const toDoColumn = document.querySelector("#todo-column");
        toDoColumn.appendChild(newCard);
    }
    else if (task.status === "progress") {
        progressColumn.appendChild(newCard);
    }
    else if (task.status === "completed") {
        completedColumn.appendChild(newCard);
    }
}

const addTaskButton =document.querySelector("#add-task");
const resetButton = document.querySelector("#reset-board");
const taskInput = document.querySelector("#task-input");
function addTask() {
    const taskName = taskInput.value.trim();
    if (taskName === "") {
        return;
    }

    const task = {
        name: taskName,
        status: "todo",
        completed: false
    };

    tasks.push(task);
    console.log(tasks);
    saveTasks();

    renderTask(task);

    taskInput.value = "";
};

function resetBoard() {
    const confirmed = confirm("Are you sure you want to delete all tasks?");

    if (!confirmed) {
        return;
    }

    tasks.length = 0;

    localStorage.removeItem("progressboard-tasks");

    document.querySelectorAll(".task-card").forEach(function(card) {
        card.remove();
    });
}

addTaskButton.addEventListener("click", addTask);
resetButton.addEventListener("click", resetBoard);
taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

const progressColumn = document.querySelector("#progress-column");

const completedColumn = document.querySelector("#completed-column");

tasks.forEach(renderTask);
