const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()

  const newBlog = {
    title: 'First Blog',
    author: 'Author',
    url: 'http://example.com',
    likes: 1,
    user: user._id
  }

  const blog = new Blog(newBlog)
  await blog.save()
})

test('a valid blog can be added', async () => {
  const usersAtStart = await User.find({})
  const user = usersAtStart[0]

  const newBlog = {
    title: 'New Blog',
    author: 'Author',
    url: 'http://example.com',
    likes: 5,
    user: user._id
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await Blog.find({}).populate('user', { username: 1, name: 1 })
  expect(blogsAtEnd).toHaveLength(2)

  const contents = blogsAtEnd.map(b => b.title)
  expect(contents).toContain('New Blog')
})

afterAll(() => {
  mongoose.connection.close()
})
