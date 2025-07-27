// ===================================
// 1. EXPRESS BACKEND (Node.js + Express)
// ===================================

// routes/auth.js (Express backend)
const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../models/User'); // Your database model
const router = express.Router();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;

    // Validate input (you might want more robust validation)
    if (!firstName || !lastName || !email || !username || !password) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ 
      email: email.toLowerCase() 
    });
    
    if (existingEmail) {
      return res.status(400).json({
        error: 'Email already exists'
      });
    }
    
    // Check if username already exists
    const existingUsername = await User.findOne({ 
      username: username.toLowerCase() 
    });
    
    if (existingUsername) {
      return res.status(400).json({
        error: 'Username already exists'
      });
    }
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const newUser = new User({
      firstName,
      lastName,
    email: email.toLowerCase(),
      username: username.toLowerCase(),
      password: hashedPassword,
    });
    
    const savedUser = await newUser.save();
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = savedUser.toObject();
    
    res.status(201).json({
      message: 'User created successfully',
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

module.exports = router;

// ===================================
// 2. EXPRESS SERVER SETUP
// ===================================

// server.js (Express server)
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Your Next.js frontend URL
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB (or your preferred database)
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ===================================
// 3. DATABASE MODEL (MongoDB example)
// ===================================

// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

module.exports = { User: mongoose.model('User', userSchema) };

// ===================================
// 4. UPDATED NEXT.JS FRONTEND COMPONENT
// ===================================

// Replace the handleSubmit function in your React component:

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!validateForm()) {
    return
  }

  setIsLoading(true)
  setErrors({})

  try {
    // Call your Express backend
    const response = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // If you're using cookies
      body: JSON.stringify(formData),
    })

    const data = await response.json()

    if (!response.ok) {
      // Handle specific error cases from your Express backend
      if (data.error === 'Email already exists') {
        setErrors({ email: 'This email is already registered' })
      } else if (data.error === 'Username already exists') {
        setErrors({ username: 'This username is already taken' })
      } else {
        setErrors({ general: data.error || 'Something went wrong' })
      }
      return
    }

    // Success!
    setIsSuccess(true)
    
    // Optional: Store user data, redirect, etc.
    // You might want to store JWT token or user info
    console.log('User created:', data.user)
    
  } catch (error) {
    console.error('Network error:', error)
    setErrors({ 
      general: 'Network error. Please check your connection and try again.' 
    })
  } finally {
    setIsLoading(false)
  }
}

// ===================================
// 5. ENVIRONMENT SETUP
// ===================================

/*
EXPRESS BACKEND (.env):
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/your-app-name
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name

NEXT.JS FRONTEND (.env.local):
NEXT_PUBLIC_API_URL=http://localhost:5000
*/

// ===================================
// 6. PACKAGE.JSON DEPENDENCIES
// ===================================

/*
EXPRESS BACKEND:
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express-validator": "^7.0.1", // Optional for validation
    "express-rate-limit": "^6.8.1" // Optional for rate limiting
  }
}

NEXT.JS FRONTEND:
Your existing dependencies are fine, just make sure you have:
- React
- TypeScript (if using TS)
- Your UI components (shadcn/ui)
*/

// ===================================
// 7. DEVELOPMENT SETUP
// ===================================

/*
1. Start Express backend:
   cd backend
   npm run dev (or node server.js)
   
2. Start Next.js frontend:
   cd frontend
   npm run dev
   
3. Backend runs on: http://localhost:5000
   Frontend runs on: http://localhost:3000
*/