import mongoose, { Schema, model, Document, Types } from "mongoose";

// Interface to define the properties of a Comment document for TypeScript
export interface IComment extends Document {
  content: string;
  author: Types.ObjectId; // Reference to the User who wrote the comment
  post: Types.ObjectId; // Reference to the Post this comment belongs to
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema for the Comment
const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: [true, "Comment content cannot be empty."],
      trim: true,
      minlength: [1, "Comment must be at least 1 character long."],
      maxlength: [1000, "Comment cannot be more than 1000 characters long."],
    },
    // The user who wrote the comment. Establishes a relationship with the 'User' collection.
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // This is the link to the User model
      required: [true, "A comment must have an author."],
    },
    // The post the comment belongs to. Establishes a relationship with the 'Post' collection.
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", // This is the link to the Post model
      required: [true, "A comment must be associated with a post."],
    },
  },
  {
    // This option automatically adds `createdAt` and `updatedAt` fields
    timestamps: true,
  }
);

// Create and export the Comment model
const Comment = model<IComment>("Comment", commentSchema);

export default Comment;
