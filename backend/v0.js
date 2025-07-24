const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/blogapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error))

// Blog Post Schema
const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: String,
      default: "General",
    },
    published: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    excerpt: {
      type: String,
      maxlength: 300,
    },
    featuredImage: {
      type: String,
      default: "",
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Create slug from title
blogPostSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
  }
  next()
})

const BlogPost = mongoose.model("BlogPost", blogPostSchema)

// Routes

// GET /api/posts - Get all blog posts with pagination and filtering
app.get("/api/posts", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    // Build filter object
    const filter = {}
    if (req.query.published !== undefined) {
      filter.published = req.query.published === "true"
    }
    if (req.query.category) {
      filter.category = req.query.category
    }
    if (req.query.author) {
      filter.author = new RegExp(req.query.author, "i")
    }
    if (req.query.search) {
      filter.$or = [
        { title: new RegExp(req.query.search, "i") },
        { content: new RegExp(req.query.search, "i") },
        { tags: { $in: [new RegExp(req.query.search, "i")] } },
      ]
    }

    const posts = await BlogPost.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).select("-content") // Exclude full content for list view

    const total = await BlogPost.countDocuments(filter)
    const totalPages = Math.ceil(total / limit)

    res.json({
      success: true,
      data: posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts: total,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching posts",
      error: error.message,
    })
  }
})

// GET /api/posts/:id - Get single blog post by ID
app.get("/api/posts/:id", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      })
    }

    // Increment view count
    post.views += 1
    await post.save()

    res.json({
      success: true,
      data: post,
    })
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      })
    }
    res.status(500).json({
      success: false,
      message: "Error fetching post",
      error: error.message,
    })
  }
})

// GET /api/posts/slug/:slug - Get single blog post by slug
app.get("/api/posts/slug/:slug", async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug })

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      })
    }

    // Increment view count
    post.views += 1
    await post.save()

    res.json({
      success: true,
      data: post,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching post",
      error: error.message,
    })
  }
})

// POST /api/posts - Create new blog post
app.post("/api/posts", async (req, res) => {
  try {
    const { title, content, author, tags, category, published, excerpt, featuredImage } = req.body

    // Validation
    if (!title || !content || !author) {
      return res.status(400).json({
        success: false,
        message: "Title, content, and author are required",
      })
    }

    // Generate slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")

    // Check if slug already exists
    const existingPost = await BlogPost.findOne({ slug })
    if (existingPost) {
      return res.status(400).json({
        success: false,
        message: "A post with this title already exists",
      })
    }

    const newPost = new BlogPost({
      title,
      content,
      author,
      tags: tags || [],
      category: category || "General",
      published: published || false,
      slug,
      excerpt: excerpt || content.substring(0, 300),
      featuredImage: featuredImage || "",
    })

    const savedPost = await newPost.save()

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: savedPost,
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A post with this slug already exists",
      })
    }
    res.status(500).json({
      success: false,
      message: "Error creating post",
      error: error.message,
    })
  }
})

// PUT /api/posts/:id - Update blog post
app.put("/api/posts/:id", async (req, res) => {
  try {
    const { title, content, author, tags, category, published, excerpt, featuredImage } = req.body

    const post = await BlogPost.findById(req.params.id)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      })
    }

    // Update slug if title changed
    let newSlug = post.slug
    if (title && title !== post.title) {
      newSlug = title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")

      // Check if new slug already exists
      const existingPost = await BlogPost.findOne({ slug: newSlug, _id: { $ne: req.params.id } })
      if (existingPost) {
        return res.status(400).json({
          success: false,
          message: "A post with this title already exists",
        })
      }
    }

    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      {
        title: title || post.title,
        content: content || post.content,
        author: author || post.author,
        tags: tags !== undefined ? tags : post.tags,
        category: category || post.category,
        published: published !== undefined ? published : post.published,
        slug: newSlug,
        excerpt: excerpt || (content ? content.substring(0, 300) : post.excerpt),
        featuredImage: featuredImage !== undefined ? featuredImage : post.featuredImage,
      },
      { new: true, runValidators: true },
    )

    res.json({
      success: true,
      message: "Post updated successfully",
      data: updatedPost,
    })
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      })
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A post with this slug already exists",
      })
    }
    res.status(500).json({
      success: false,
      message: "Error updating post",
      error: error.message,
    })
  }
})

// DELETE /api/posts/:id - Delete blog post
app.delete("/api/posts/:id", async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      })
    }

    res.json({
      success: true,
      message: "Post deleted successfully",
      data: post,
    })
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      })
    }
    res.status(500).json({
      success: false,
      message: "Error deleting post",
      error: error.message,
    })
  }
})

// GET /api/categories - Get all unique categories
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await BlogPost.distinct("category")
    res.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message,
    })
  }
})

// GET /api/tags - Get all unique tags
app.get("/api/tags", async (req, res) => {
  try {
    const tags = await BlogPost.distinct("tags")
    res.json({
      success: true,
      data: tags,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching tags",
      error: error.message,
    })
  }
})

// GET /api/stats - Get blog statistics
app.get("/api/stats", async (req, res) => {
  try {
    const totalPosts = await BlogPost.countDocuments()
    const publishedPosts = await BlogPost.countDocuments({ published: true })
    const draftPosts = await BlogPost.countDocuments({ published: false })
    const totalViews = await BlogPost.aggregate([{ $group: { _id: null, totalViews: { $sum: "$views" } } }])

    res.json({
      success: true,
      data: {
        totalPosts,
        publishedPosts,
        draftPosts,
        totalViews: totalViews[0]?.totalViews || 0,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching stats",
      error: error.message,
    })
  }
})

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Blog API is running",
    timestamp: new Date().toISOString(),
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  })
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack)
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/api/health`)
})

module.exports = app
