const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
];

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/info', (req, res) => {
  const numberOfPersons = persons.length;
  const date = new Date();

  res.send(`
    <p>Phonebook has info for ${numberOfPersons} people</p>
    <p>${date}</p>
  `);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).send({ error: 'Person not found' });
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);

  res.status(204).end();
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number is missing'
    });
  }

  if (persons.some(person => person.name === body.name)) {
    return res.status(400).json({
      error: 'name must be unique'
    });
  }

  const newPerson = {
    id: Math.floor(Math.random() * 1000000),
    name: body.name,
    number: body.number
  };

  persons = persons.concat(newPerson);

  res.json(newPerson);
});

app.put('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const body = req.body;

  const person = persons.find(person => person.id === id);

  if (!person) {
    return res.status(404).json({ error: 'Person not found' });
  }

  const updatedPerson = { ...person, number: body.number };

  persons = persons.map(p => p.id !== id ? p : updatedPerson);

  res.json(updatedPerson);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
