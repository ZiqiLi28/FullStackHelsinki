const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'First blog',
    author: 'Author 1',
    url: 'http://example.com/1',
    likes: 1,
  },
  {
    title: 'Second blog',
    author: 'Author 2',
    url: 'http://example.com/2',
    likes: 2,
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length)
})

test('unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body

  blogs.forEach(blog => {
    expect(blog.id).toBeDefined()
  })
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'New blog',
    author: 'New Author',
    url: 'http://example.com/new',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const titles = response.body.map(r => r.title)

  expect(response.body).toHaveLength(initialBlogs.length + 1)
  expect(titles).toContain('New blog')
})

test('if likes property is missing from request, it will default to 0', async () => {
  const newBlog = {
    title: 'Blog without likes',
    author: 'No Likes Author',
    url: 'http://example.com/nolikes',
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  expect(response.body.likes).toBe(0)
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'No Title Author',
    url: 'http://example.com/notitle',
    likes: 1,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length)
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'Blog without url',
    author: 'No URL Author',
    likes: 1,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length)
})

afterAll(() => {
  mongoose.connection.close()
})
