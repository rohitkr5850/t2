const LOGIN_URL = 'https://json-with-auth.onrender.com/user/login';
const TODOS_URL = 'https://json-with-auth.onrender.com/todos';

// Variables to store user information
let userAuthToken = null;
let userId = null;

// Function to log in the user
async function loginUser(username, password) {
    try {
        const response = await fetch(LOGIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            userAuthToken = data.token;
            userId = data.userId;

            // Store token and userId in local storage
            localStorage.setItem('userAuthToken', userAuthToken);
            localStorage.setItem('userId', userId);

            // Display welcome message
            displayWelcomeMessage(username);
        } else {
            alert("Login failed. Please check your credentials.");
        }
    } catch (error) {
        console.error('Error logging in:', error);
    }
}

// Function to display welcome message
function displayWelcomeMessage(username) {
    const welcomeMessage = document.getElementById('welcomeMessage');
    welcomeMessage.textContent = Hey ${username}, welcome back!;
    welcomeMessage.style.display = 'block';
}

// Function to fetch todos
async function fetchTodos() {
    try {
        const response = await fetch(${TODOS_URL}?userId=${userId}, {
            headers: {
                'Authorization': Bearer ${userAuthToken}
            }
        });

        if (response.ok) {
            const todos = await response.json();
            displayTodos(todos);
        } else {
            alert("Failed to fetch todos.");
        }
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
}

// Function to display todos in the DOM
function displayTodos(todos) {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = ''; // Clear the list

    todos.forEach(todo => {
        const todoItem = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleTodoCompletion(todo.id, checkbox.checked));

        todoItem.appendChild(checkbox);
        todoItem.appendChild(document.createTextNode(todo.title));
        todoList.appendChild(todoItem);
    });
}

// Function to toggle todo completion status
async function toggleTodoCompletion(todoId, completed) {
    try {
        await fetch(${TODOS_URL}/${todoId}, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': Bearer ${userAuthToken}
            },
            body: JSON.stringify({ completed })
        });
    } catch (error) {
        console.error('Error updating todo:', error);
    }
}

// Event listeners for login and fetching todos
document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    loginUser(username, password);
});

document.getElementById('fetchTodosButton').addEventListener('click', fetchTodos);