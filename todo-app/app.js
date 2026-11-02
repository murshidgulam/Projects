const addTodoBtn = document.getElementById("addTodoBtn");
const inputTag = document.getElementById("todoInput");
const todoListUl = document.getElementById("todoList");
const remaining = document.getElementById("remaining-count");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");

const filterButtons = document.querySelectorAll("[data-filter]");


// Store all todos
let todos = JSON.parse(localStorage.getItem("todos")) || [];

let currentFilter = "all";


// 1. Save todos to localStorage
const saveTodos = () => {
    localStorage.setItem("todos", JSON.stringify(todos));
};


// 2. Update remaining todos count
const updateRemaining = () => {
    const count = todos.filter(todo => !todo.isCompleted).length;
    remaining.innerHTML = count;
};


// 3. Display todos according to selected filter
const populateTodos = () => {

    let filteredTodos = todos;

    // Active filter
    if (currentFilter === "active") {
        filteredTodos = todos.filter(todo => !todo.isCompleted);
    }

    // Completed filter
    else if (currentFilter === "completed") {
        filteredTodos = todos.filter(todo => todo.isCompleted);
    }

    let html = "";

    filteredTodos.forEach(todo => {

        html += `
            <li id="${todo.id}" class="todo-item ${todo.isCompleted ? "completed" : ""}">

                <input 
                    type="checkbox" 
                    class="todo-checkbox"
                    ${todo.isCompleted ? "checked" : ""}
                >

                <span class="todo-text">${todo.title}</span>

                <button class="delete-btn">×</button>

            </li>
        `;
    });

    todoListUl.innerHTML = html;

    updateRemaining();
};


// 4. Add a new todo
addTodoBtn.addEventListener("click", () => {

    const title = inputTag.value.trim();

    if (title.length < 4) {
        alert("Todo must contain at least 4 characters!");
        return;
    }

    const newTodo = {
        id: "todo-" + Date.now(),
        title: title,
        isCompleted: false
    };

    todos.push(newTodo);

    inputTag.value = "";

    saveTodos();
    populateTodos();

});


// 5. Handle checkbox functionality
todoListUl.addEventListener("change", (e) => {

    if (e.target.classList.contains("todo-checkbox")) {

        const todoId = e.target.parentNode.id;

        todos = todos.map(todo => {

            if (todo.id === todoId) {
                return {
                    ...todo,
                    isCompleted: e.target.checked
                };
            }

            return todo;

        });

        saveTodos();
        populateTodos();
    }

});


// 6. Handle delete functionality
todoListUl.addEventListener("click", (e) => {

    if (e.target.classList.contains("delete-btn")) {

        const confirmation = confirm("Do you want to delete this todo?");

        if (confirmation) {

            const todoId = e.target.parentNode.id;

            todos = todos.filter(todo => todo.id !== todoId);

            saveTodos();
            populateTodos();
        }

    }

});


// 7. Clear all completed todos
clearCompletedBtn.addEventListener("click", () => {

    todos = todos.filter(todo => !todo.isCompleted);

    saveTodos();
    populateTodos();

});


// 8. Handle All, Active and Completed filters
filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        currentFilter = button.dataset.filter;

        // Update active button styling
        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        populateTodos();

    });

});


// 9. Initial rendering
populateTodos();