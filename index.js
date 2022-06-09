const { response } = require('express');
const express = require('express');
const morgan = require('morgan');
const nodemon = require('nodemon');

const app = express();

morgan.token('type', (req) => JSON.stringify(req.body));
app.use(morgan(
  ':method :url :status :res[content-length] - :response-time ms :type'
));

app.use(express.json());

let phoneBook = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
];

app.get('/api/persons', (req, res) => {
  res.json(phoneBook);
});

app.get('/info', (req, res) => {
  const numPeople = Math.max(...phoneBook.map(x => x.id));
  const date = new Date();
  res.send(`<p>phonebook has info for ${numPeople} people</><p>${date}</>`);
});

app.get('/api/persons/:id', (req, res) => {
  const numPerson = Number(req.params.id);
  const person = phoneBook.find(p => p.id === numPerson);
  if (person) {
    res.json(person);
  }
  res.status(404).end();
});

app.delete('/api/persons/:id', (req, res) => {
  const numPerson = Number(req.params.id);
  phoneBook = phoneBook.filter(person => person.id !== numPerson);

  res.status(204).end();
});

app.post('/api/persons', (req, res) => {
  const randId = Math.ceil(Math.random() * 10000);
  const body = req.body;

  if (!body.name || phoneBook.find(p => p.name === body.name)) {
    res.status(400).send('Missing name parameter or person with the name already exists');
  }
  const person = {
    "id": randId,
    "name": body.name,
    "number": body.number 
  }; 

  phoneBook.concat(person);

  res.json(person);
});


app.listen(8000);
