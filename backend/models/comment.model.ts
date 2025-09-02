import mongoose, { Schema, model, Document, Types } from "mongoose";

export interface IComment extends Document {
  content: string;
  author: Types.ObjectId;
  post: Types.ObjectId;
  likes: Types.ObjectId[];
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: [true, "Comment content cannot be empty."],
      trim: true,
      minlength: [1, "Comment must be at least 1 character long."],
      maxlength: [1000, "Comment cannot be more than 1000 characters long."],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A comment must have an author."],
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "A comment must be associated with a post."],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

commentSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

commentSchema.set("toJSON", { virtuals: true });
commentSchema.set("toObject", { virtuals: true });

commentSchema.index({ createdAt: -1 });

commentSchema.index({ tags: 1 });

commentSchema.index({ author: 1 });

const Comment = model<IComment>("Comment", commentSchema);

export default Comment;
