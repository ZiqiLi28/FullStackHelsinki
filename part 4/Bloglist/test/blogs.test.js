const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

const initialUsers = [
  {
    username: 'testuser',
    name: 'Test User',
    password: 'password123',
  }
]

const getToken = async () => {
  const response = await api
    .post('/api/login')
    .send({ username: initialUsers[0].username, password: initialUsers[0].password })

  return response.body.token
}

module.exports = {
  initialUsers,
  getToken,
}
