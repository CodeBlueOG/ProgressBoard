const tasks = JSON.parse(localStorage.getItem("progressboard-tasks")) || [];
console.log("Loaded tasks:", tasks);
function saveTasks() {
    localStorage.setItem("progressboard-tasks", JSON.stringify(tasks));
}
function renderFocusTasks() {
    const focusContainer = document.querySelector("#focus-tasks");

    focusContainer.replaceChildren();

    const today = new Date().toDateString();

    const focusedTasks = tasks.filter(function(item) {
        return item.focusDate === today;
    });

    focusedTasks.forEach(function(item) {
        const focusCard = document.createElement("div");
        focusCard.className = "focus-item";

        const taskName = document.createElement("span");
        taskName.textContent = item.name;

        focusCard.appendChild(taskName);
        const statusText = document.createElement("span");
        statusText.className = "focus-status";

        if (item.status === "todo") {
            statusText.textContent = "To Do";
        }
        else if (item.status === "progress") {
            statusText.textContent = "In Progress";
        }
        else if (item.status === "completed") {
            statusText.textContent = "Completed";
        }

        focusCard.appendChild(statusText);
        focusContainer.appendChild(focusCard);
    });
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

    const focusButton = document.createElement("button");

    focusButton.textContent = task.focusDate === new Date().toDateString()
        ? "Remove from Focus"
        : "+ Focus";
    focusButton.className = "focus-button";

    focusButton.addEventListener("click", function() {
    const today = new Date().toDateString();

    if (task.focusDate === today) {
        task.focusDate = null;
        focusButton.textContent = "+ Focus";
    }
    else {
        const selectedCount = tasks.filter(function(item) {
            return item.focusDate === today;
        }).length;

        if (selectedCount >= 3) {
            alert("You can only select three daily challenges.");
            return;
        }

        task.focusDate = today;
        focusButton.textContent = "Remove from Focus";
    }

    saveTasks();
    renderFocusTasks();
});
    newCard.appendChild(focusButton);

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
        renderFocusTasks();
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
        renderFocusTasks();
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
        completed: false,
        focusDate: null,
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
    renderFocusTasks();
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
