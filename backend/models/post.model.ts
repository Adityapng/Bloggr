import mongoose, { Schema, model, Document, Types } from "mongoose";
import slugify from "slugify";

export interface IPost extends Document {
  title: string;
  slug: string;
  content: string;
  coverImage: string;
  author: mongoose.Schema.Types.ObjectId;
  likes: Types.ObjectId[];
  bookmarks: Types.ObjectId[];
  commenter: Types.ObjectId[];
  reads: number[];
  registeredReader: Types.ObjectId[];
  registeredReadersCount: number;
  likeCount: number;
  bookmarkCount: number;
  wordCount: number;
  readCount: number;
  commentCount: number;
  tags: Types.ObjectId[];
  status: "draft" | "published";
  readingTime: number;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, "Post title is required."],
      trim: true,
      minlength: [5, "Title must be at least 5 characters long."],
      maxlength: [150, "Title cannot be more than 150 characters long."],
    },
    slug: {
      type: String,
      unique: true,
    },
    content: {
      type: String,
      required: [true, "Post content cannot be empty."],
      minlength: [
        100,
        "Content must be at least 100 characters long to be meaningful.",
      ],
    },
    coverImage: {
      type: String,
      required: [true, "A cover image is required for the post."],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    reads: {
      type: [String],
      default: [],
    },
    registeredReader: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    wordCount: {
      type: Number,
      default: 0,
    },

    commentCount: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
        required: [true, "Minimum one tag is required."],
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published"],
    },
    readingTime: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

postSchema.pre<IPost>("save", function (next) {
  if (this.isModified("title") || this.isNew) {
    const slug = slugify(this.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    });
    this.slug = `${slug}-${this._id}`;
  }

  if (this.isModified("content") || this.isNew) {
    const wordsPerMinute = 200;
    const wordCount = this.wordCount;
    this.readingTime = Math.ceil(wordCount / wordsPerMinute);
  }

  next();
});

postSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

postSchema.virtual("bookmarkCount").get(function () {
  return this.bookmarks.length;
});

postSchema.virtual("registeredReadersCount").get(function () {
  return this.registeredReader.length;
});

postSchema.virtual("readCount").get(function () {
  return this.reads.length;
});

postSchema.set("toJSON", { virtuals: true });
postSchema.set("toObject", { virtuals: true });

postSchema.index({ createdAt: -1 });

postSchema.index({ tags: 1 });

postSchema.index({ author: 1 });

const Post = model<IPost>("Post", postSchema);

export default Post;
