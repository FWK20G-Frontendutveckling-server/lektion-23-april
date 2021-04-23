/**
 * TODO API
 * 
 * Endpoints:
 * 
 * Hämta alla todos
 * URL: /api/todo
 * Method: GET
 * 
 * Lägg till en ny todo
 * URL: /api/todo
 * Method: POST
 * 
 * Ta bort en todo
 * URL: /api/todo/:id
 * Method: DELETE
 */

/**
 * Databas - hur ska denna se ut?
 * Vad är databasen till för? Vad är dess syfte?
 * Lägga till, hämta och ta bort todos
 *
 * Vad vill vi spara för data?
 * Vi vill spara själva todo-texten och ett unikt id till varje todo
 * 
 * Vad är det för typ av data vi vill spara? Hur ska den se ut? (Arrayer, nummer, strängar, booleans)
 * En array med objekt där varje objekt är en todo-item.
 * Ex: 
 *    { 
 *      todos: [
 *          {
 *            task: String
 *            id: Number
 *          }
 *      ]
 *    }
 */

const express = require('express');
const lowdb = require('lowdb');
const { nanoid } = require('nanoid');
const cors = require('cors');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('todos.json');
const database = lowdb(adapter);

const app = express();

app.use(express.json());
app.use(express.static('../todo-app-frontend'));

//cors() används för att tillåta request från andra servrar till detta API
//app.use(cors());

function initDatabase() {
  database.defaults({ todos: [] }).write();
}

app.post('/api/todo', (request, response) => {
  const todoItem = request.body;
  todoItem.id = nanoid();
  console.log(todoItem);
  const todos = database.get('todos').push(todoItem).write();
  console.log(todos);

  let result = {};

  if(todos.length > 0) {
    result.success = true;
    result.todos = todos;
  } else {
    result.success = false;
    result.message = 'Kunde inte lägga till ny todo';
  }

  response.json(result);
});

app.get('/api/todo', (request, response) => {
  const todos = database.get('todos').value();

  let result = {};

  if(todos.length > 0) {
    result.success = true;
    result.todos = todos;
  } else {
    result.success = false;
    result.message = 'Kunde inte hämta todos';
  }

  response.json(result);
});

app.delete('/api/todo/:id', (request, response) => {
  const todoId = request.params.id;
  const todos = database.get('todos').remove({ id: todoId }).write();
  
  let result = {};

  if(todos.length > 0) {
    result.success = true;
  } else {
    result.success = false;
    result.message = 'Kunde inte ta bort todo';
  }

  response.json(result);
});


app.listen(7000, () => {
  console.log('Server started');
  initDatabase();
});