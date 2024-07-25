const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60*60 })

  await api
    .post('/api/blogs')
    .send({
      title: 'initial blog',
      author: 'author',
      url: 'http://example.com',
      likes: 0,
    })
    .set('Authorization', `Bearer ${token}`)
})

test('a valid blog can be added only with a valid token', async () => {
  const users = await helper.usersInDb()
  const user = users[0]

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60*60 })

  const newBlog = {
    title: 'New Blog',
    author: 'Author',
    url: 'http://example.com',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${token}`)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(2)

  const contents = blogsAtEnd.map(b => b.title)
  expect(contents).toContain('New Blog')
})

test('a blog cannot be added without a token', async () => {
  const newBlog = {
    title: 'Unauthorized Blog',
    author: 'Author',
    url: 'http://example.com',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(1)
})

afterAll(() => {
  mongoose.connection.close()
})
