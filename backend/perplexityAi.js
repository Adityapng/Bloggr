const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
require('dotenv').config();

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// Blog Post Schema
const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: [10000, 'Content cannot exceed 10000 characters']
  },
  excerpt: {
    type: String,
    maxlength: [300, 'Excerpt cannot exceed 300 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  readTime: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Generate slug before saving
blogPostSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  
  // Calculate read time (average 200 words per minute)
  if (this.isModified('content')) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200);
  }
  
  next();
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

// JWT Authentication Middleware
const authenticateToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
});

// Validation Rules
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

const blogPostValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title is required and must be less than 100 characters'),
  body('content')
    .trim()
    .isLength({ min: 1, max: 10000 })
    .withMessage('Content is required and must be less than 10000 characters'),
  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Excerpt must be less than 300 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Status must be draft, published, or archived')
];

// Validation Error Handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation errors',
      errors: errors.array()
    });
  }
  next();
};

// Authentication Routes
app.post('/api/auth/register', authLimiter, registerValidation, handleValidationErrors, asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    return res.status(400).json({
      message: 'User already exists with this email or username'
    });
  }

  // Create new user
  const user = new User({ username, email, password });
  await user.save();

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
}));

app.post('/api/auth/login', authLimiter, loginValidation, handleValidationErrors, asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
}));

// Blog Post Routes

// GET /api/posts - Get all blog posts with pagination and filtering
app.get('/api/posts', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const { status, author, tags, search } = req.query;

  // Build filter object
  let filter = {};
  
  if (status) filter.status = status;
  if (author) filter.author = author;
  if (tags) filter.tags = { $in: tags.split(',') };
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } }
    ];
  }

  const posts = await BlogPost.find(filter)
    .populate('author', 'username email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await BlogPost.countDocuments(filter);

  res.json({
    posts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// GET /api/posts/:id - Get single blog post
app.get('/api/posts/:id', asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id)
    .populate('author', 'username email')
    .populate('comments.user', 'username');

  if (!post) {
    return res.status(404).json({ message: 'Blog post not found' });
  }

  // Increment views
  post.views += 1;
  await post.save();

  res.json(post);
}));

// POST /api/posts - Create new blog post
app.post('/api/posts', authenticateToken, blogPostValidation, handleValidationErrors, asyncHandler(async (req, res) => {
  const { title, content, excerpt, tags, status } = req.body;

  const post = new BlogPost({
    title,
    content,
    excerpt,
    author: req.user._id,
    tags: tags || [],
    status: status || 'draft'
  });

  await post.save();
  await post.populate('author', 'username email');

  res.status(201).json({
    message: 'Blog post created successfully',
    post
  });
}));

// PUT /api/posts/:id - Update blog post
app.put('/api/posts/:id', authenticateToken, blogPostValidation, handleValidationErrors, asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: 'Blog post not found' });
  }

  // Check if user is the author or admin
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to update this post' });
  }

  const { title, content, excerpt, tags, status } = req.body;

  post.title = title || post.title;
  post.content = content || post.content;
  post.excerpt = excerpt || post.excerpt;
  post.tags = tags || post.tags;
  post.status = status || post.status;

  await post.save();
  await post.populate('author', 'username email');

  res.json({
    message: 'Blog post updated successfully',
    post
  });
}));

// DELETE /api/posts/:id - Delete blog post
app.delete('/api/posts/:id', authenticateToken, asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: 'Blog post not found' });
  }

  // Check if user is the author or admin
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to delete this post' });
  }

  await BlogPost.findByIdAndDelete(req.params.id);

  res.json({ message: 'Blog post deleted successfully' });
}));

// Comment Routes

// POST /api/posts/:id/comments - Add comment to blog post
app.post('/api/posts/:id/comments', authenticateToken, [
  body('text')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Comment text is required and must be less than 500 characters')
], handleValidationErrors, asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: 'Blog post not found' });
  }

  const { text } = req.body;

  const comment = {
    user: req.user._id,
    text,
    createdAt: new Date()
  };

  post.comments.push(comment);
  await post.save();
  await post.populate('comments.user', 'username');

  res.status(201).json({
    message: 'Comment added successfully',
    comment: post.comments[post.comments.length - 1]
  });
}));

// DELETE /api/posts/:postId/comments/:commentId - Delete comment
app.delete('/api/posts/:postId/comments/:commentId', authenticateToken, asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.postId);

  if (!post) {
    return res.status(404).json({ message: 'Blog post not found' });
  }

  const comment = post.comments.id(req.params.commentId);

  if (!comment) {
    return res.status(404).json({ message: 'Comment not found' });
  }

  // Check if user is the comment author or admin
  if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to delete this comment' });
  }

  comment.remove();
  await post.save();

  res.json({ message: 'Comment deleted successfully' });
}));

// User Profile Routes

// GET /api/profile - Get current user profile
app.get('/api/profile', authenticateToken, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
}));

// PUT /api/profile - Update user profile
app.put('/api/profile', authenticateToken, [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
], handleValidationErrors, asyncHandler(async (req, res) => {
  const { username, email } = req.body;

  // Check if username or email is already taken by another user
  if (username || email) {
    const existingUser = await User.findOne({
      $and: [
        { _id: { $ne: req.user._id } },
        { $or: [{ username }, { email }] }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Username or email already taken by another user'
      });
    }
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { ...(username && { username }), ...(email && { email }) },
    { new: true, runValidators: true }
  ).select('-password');

  res.json({
    message: 'Profile updated successfully',
    user
  });
}));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      message: 'Validation Error',
      errors
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      message: `${field} already exists`
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});
