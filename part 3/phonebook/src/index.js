import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.json());

app.use(morgan('tiny'));

app.get('/api/persons', (_req, res) => {
  res.json(persons);
});

app.post('/api/persons', (req, res) => {
  const newPerson = req.body;
  newPerson.id = generateId();
  persons = persons.concat(newPerson);
  res.json(newPerson);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);
  res.status(204).end();
});


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
