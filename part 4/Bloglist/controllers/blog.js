const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// GET route to fetch all blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

// POST route to add a new blog
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.title || !body.url) {
    return response.status(400).json({
      error: 'title or url missing'
    })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  })

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

// DELETE route to remove a blog
blogsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params
  const result = await Blog.findByIdAndRemove(id)
  if (result) {
    response.status(204).end()
  } else {
    response.status(404).json({
      error: 'blog not found'
    })
  }
})

// PUT route to update a blog
blogsRouter.put('/:id', async (request, response) => {
  const { id } = request.params
  const body = request.body

  const updatedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  const result = await Blog.findByIdAndUpdate(id, updatedBlog, { new: true, runValidators: true, context: 'query' })

  if (result) {
    response.json(result)
  } else {
    response.status(404).json({
      error: 'blog not found'
    })
  }
})

module.exports = blogsRouter
