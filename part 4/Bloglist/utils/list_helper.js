const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authorCount = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1
    return acc
  }, {})

  const topAuthor = Object.keys(authorCount).reduce((top, author) => {
    return authorCount[author] > top.blogs ? { author, blogs: authorCount[author] } : top
  }, { author: '', blogs: 0 })

  return topAuthor
}

module.exports = {
  dummy,
  totalLikes,
  mostBlogs
}
