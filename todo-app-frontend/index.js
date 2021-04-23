//let todos = [];

function createTodoElem(todo, todosElem) {
    const todoElem = document.createElement('li');

    todoElem.innerHTML = todo.task;
    todosElem.append(todoElem);

    todoElem.addEventListener('click', function(event) {
        console.log('Du klickade på mig: ', event.target.innerHTML);
        event.target.classList.toggle('done');
    });
}

function displayTodos(todos) {
    const todosElem = document.querySelector('#todos');
    todosElem.innerHTML = '';

    for(let i = 0; i < todos.length; i++) {
        console.log('i: ', i);
        console.log('Todo: ', todos[i]);
        createTodoElem(todos[i], todosElem);
    }
}

async function getTodos() {
    const response = await fetch('http://localhost:7000/api/todo');
    const data = await response.json();
    console.log(data);
    displayTodos(data.todos);
}

async function addTodo(todoText) {
    const todoItem = {
        task: todoText
    }

    const response = await fetch('http://localhost:7000/api/todo', {
        method: 'POST',
        body: JSON.stringify(todoItem),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const data = await response.json();
    console.log(data);
    displayTodos(data.todos);
}

document.querySelector('#add-todo').addEventListener('click', function() {
    const todo = document.querySelector('#todo').value;
    addTodo(todo);
});

getTodos();