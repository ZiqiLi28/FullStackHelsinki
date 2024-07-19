const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

let token = ''

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

  token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '1h' })
})

test('a valid blog can be added', async () => {
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

  const blogsAtEnd = await Blog.find({}).populate('user', { username: 1, name: 1 })
  expect(blogsAtEnd).toHaveLength(1)

  const contents = blogsAtEnd.map(b => b.title)
  expect(contents).toContain('New Blog')
})

afterAll(() => {
  mongoose.connection.close()
})
