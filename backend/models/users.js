const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    salt:{
        type: String,
        required: true
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // Don't include password in queries by default
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin", "moderator", "editor"],
        message: "Role must be either user, admin, moderator, or editor",
      },
      default: "user",
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
      default: "",
    },
    // website: {
    //   type: String,
    //   default: "",
    //   validate: {
    //     validator: (v) => {
    //       if (!v) return true // Allow empty string
    //       return /^https?:\/\/.+/.test(v)
    //     },
    //     message: "Website must be a valid URL starting with http:// or https://",
    //   },
    // },
    // socialLinks: {
    //   twitter: {
    //     type: String,
    //     default: "",
    //   },
    //   linkedin: {
    //     type: String,
    //     default: "",
    //   },
    //   github: {
    //     type: String,
    //     default: "",
    //   },
    // },
    // isActive: {
    //   type: Boolean,
    //   default: true,
    // },
    // isEmailVerified: {
    //   type: Boolean,
    //   default: false,
    // },
    // emailVerificationToken: {
    //   type: String,
    //   select: false,
    // },
    // emailVerificationExpires: {
    //   type: Date,
    //   select: false,
    // },
    // passwordResetToken: {
    //   type: String,
    //   select: false,
    // },
    // passwordResetExpires: {
    //   type: Date,
    //   select: false,
    // },
    // lastLogin: {
    //   type: Date,
    // },
    // loginAttempts: {
    //   type: Number,
    //   default: 0,
    // },
    // lockUntil: {
    //   type: Date,
    // },
    // preferences: {
    //   emailNotifications: {
    //     type: Boolean,
    //     default: true,
    //   },
    //   newsletter: {
    //     type: Boolean,
    //     default: false,
    //   },
    //   theme: {
    //     type: String,
    //     enum: ["light", "dark", "auto"],
    //     default: "auto",
    //   },
    // },
    // permissions: {
    //   canCreatePosts: {
    //     type: Boolean,
    //     default: function () {
    //       return this.role !== "user"
    //     },
    //   },
    //   canEditPosts: {
    //     type: Boolean,
    //     default: function () {
    //       return ["admin", "editor", "moderator"].includes(this.role)
    //     },
    //   },
    //   canDeletePosts: {
    //     type: Boolean,
    //     default: function () {
    //       return ["admin", "moderator"].includes(this.role)
    //     },
    //   },
    //   canManageUsers: {
    //     type: Boolean,
    //     default: function () {
    //       return this.role === "admin"
    //     },
    //   },
    //   canModerateComments: {
    //     type: Boolean,
    //     default: function () {
    //       return ["admin", "moderator"].includes(this.role)
    //     },
    //   },
    // },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.password
        delete ret.emailVerificationToken
        delete ret.emailVerificationExpires
        delete ret.passwordResetToken
        delete ret.passwordResetExpires
        return ret
      },
    },
    toObject: {
      virtuals: true,
    },
  },
)

// Virtual for full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`
})

// Virtual for account lock status
// userSchema.virtual("isLocked").get(function () {
//   return !!(this.lockUntil && this.lockUntil > Date.now())
// })

// Indexes
// userSchema.index({ email: 1 })
// userSchema.index({ username: 1 })
// userSchema.index({ role: 1 })
// userSchema.index({ isActive: 1 })

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next()

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12)
    this.salt = salt
    this.password = await bcrypt.hash(this.password, salt)
    
    next()
  } catch (error) {
    next(error)
  }
})

// Pre-save middleware to set permissions based on role
// userSchema.pre("save", function (next) {
//   if (this.isModified("role")) {
//     switch (this.role) {
//       case "admin":
//         this.permissions = {
//           canCreatePosts: true,
//           canEditPosts: true,
//           canDeletePosts: true,
//           canManageUsers: true,
//           canModerateComments: true,
//         }
//         break
//       case "moderator":
//         this.permissions = {
//           canCreatePosts: true,
//           canEditPosts: true,
//           canDeletePosts: true,
//           canManageUsers: false,
//           canModerateComments: true,
//         }
//         break
//       case "editor":
//         this.permissions = {
//           canCreatePosts: true,
//           canEditPosts: true,
//           canDeletePosts: false,
//           canManageUsers: false,
//           canModerateComments: false,
//         }
//         break
//       case "user":
//       default:
//         this.permissions = {
//           canCreatePosts: false,
//           canEditPosts: false,
//           canDeletePosts: false,
//           canManageUsers: false,
//           canModerateComments: false,
//         }
//         break
//     }
//   }
//   next()
// })

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false
  return await bcrypt.compare(candidatePassword, this.password)
}

// Instance method to check if user has permission
// userSchema.methods.hasPermission = function (permission) {
//   return this.permissions[permission] === true
// }

// Instance method to check if user has role
userSchema.methods.hasRole = function (role) {
  if (Array.isArray(role)) {
    return role.includes(this.role)
  }
  return this.role === role
}

// Instance method to increment login attempts
// userSchema.methods.incLoginAttempts = function () {
//   // If we have a previous lock that has expired, restart at 1
//   if (this.lockUntil && this.lockUntil < Date.now()) {
//     return this.updateOne({
//       $unset: { lockUntil: 1 },
//       $set: { loginAttempts: 1 },
//     })
//   }

//   const updates = { $inc: { loginAttempts: 1 } }

  // Lock account after 5 failed attempts for 2 hours
//   if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
//     updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 } // 2 hours
//   }

//   return this.updateOne(updates)
// }

// Instance method to reset login attempts
// userSchema.methods.resetLoginAttempts = function () {
//   return this.updateOne({
//     $unset: { loginAttempts: 1, lockUntil: 1 },
//     $set: { lastLogin: new Date() },
//   })
// }

// Static method to find users by role
userSchema.statics.findByRole = function (role) {
  return this.find({ role, isActive: true })
}

// Static method to find admins
userSchema.statics.findAmethods.resetLoginAttempts = function () {
//   return this.updateOne({
//     $unset: { loginAttempts: 1, lockUntil: 1 },
//     $set: { lastLogin: new Date() },
//   })
// }dmins = function () {
  return this.find({ role: "admin", isActive: true })
}

// Static method to get user stats
// userSchema.statics.getUserStats = async function () {
//   const stats = await this.aggregate([
//     {
//       $group: {
//         _id: "$role",
//         count: { $sum: 1 },
//         active: {
//           $sum: {
//             $cond: [{ $eq: ["$isActive", true] }, 1, 0],
//           },
//         },
//         verified: {
//           $sum: {
//             $cond: [{ $eq: ["$isEmailVerified", true] }, 1, 0],
//           },
//         },
//       },
//     },
//   ])

//   const totalUsers = await this.countDocuments()
//   const activeUsers = await this.countDocuments({ isActive: true })
//   const verifiedUsers = await this.countDocuments({ isEmailVerified: true })

//   return {
//     total: totalUsers,
//     active: activeUsers,
//     verified: verifiedUsers,
//     byRole: stats,
//   }
// }

module.exports = mongoose.model("User", userSchema)
