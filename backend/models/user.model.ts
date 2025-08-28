import mongoose, { Document, Model, Schema, CallbackError } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "user" | "admin" | "moderator" | "editor";

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarURL?: string;
  bio?: string;
  fullName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: /^[a-zA-Z0-9_]+$/,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin", "moderator", "editor"] as const,
        message: "Role must be one of: user, admin, moderator, editor",
      },
      default: "user" as UserRole,
    },
    avatarURL: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc: any, ret: any): any => {
        delete ret.password;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
    },
  }
);

userSchema.virtual("fullName").get(function (this: IUser): string {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();

  bcrypt.hash(this.password as string, 14, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();
  });
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
