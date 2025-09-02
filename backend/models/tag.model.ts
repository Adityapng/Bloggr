import mongoose, { Schema, model, Document } from "mongoose";
import slugify from "slugify";

// List of allowed categories. Using an enum enforces data consistency.
// You can expand this list as your blog grows.
const TAG_CATEGORIES = [
  "All",
  "Technology",
  "Business Career",
  "Lifestyle Wellness",
  "Arts Culture",
  "Travel Food",
  "Hobbies",
];

// Interface to define the properties of a Tag document for TypeScript
export interface ITag extends Document {
  name: string;
  slug: string;
  category: string;
}

// Mongoose Schema for the Tag
const tagSchema = new Schema<ITag>(
  {
    name: {
      type: String,
      required: [true, "Tag name is required."],
      trim: true,
      unique: true, // No two tags can have the same name
      minlength: [1, "Tag name must be at least 1 character long."],
      maxlength: [50, "Tag name cannot be more than 50 characters long."],
      // Automatically convert the tag name to lowercase before saving
      lowercase: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: [true, "Tag category is required."],
      enum: {
        values: TAG_CATEGORIES,
        message: "{VALUE} is not a supported category.",
      },
    },
  },
  {
    timestamps: true,
  }
);

// --- Mongoose Middleware (Hook) ---

// Before saving a tag, automatically generate the slug from the name
tagSchema.pre<ITag>("save", function (next) {
  // Only generate slug if the name is modified or it's a new tag
  if (this.isModified("name") || this.isNew) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }
  next();
});

// Create and export the Tag model
const Tag = model<ITag>("Tag", tagSchema);

export default Tag;
