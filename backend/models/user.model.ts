import mongoose, { Document, Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "user" | "admin" | "moderator" | "editor";

export interface IUser extends Document {
  username: string; //
  email: string;
  password?: string; //
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarURL?: string; //
  bio?: string; //
  about: string; //
  followers: Types.ObjectId[];
  followerCount: number;
  following: Types.ObjectId[];
  followingCount: number;
  instagramLink: string; //
  twitterLink: string; //
  externalLinks: string[]; //
  totalReads: number;
  profilePicturePublicID?: string;
  fullName?: string; //
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
    totalReads: {
      type: Number,
      default: 0,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    instagramLink: { type: String, maxlength: 100, default: "" },
    twitterLink: { type: String, maxlength: 100, default: "" },

    externalLinks: {
      type: [String],
      validate: {
        validator: function (v: string[]) {
          return v.length <= 5; // 👈 max 5 links
        },
        message: `You can store at most 5 links, but got `,
      },
      default: [],
    },

    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },
    profilePicturePublicID: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      maxlength: 1000,
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
userSchema.pre<IUser>("save", function (next) {
  if (!this.isModified("password")) return next();

  bcrypt.hash(this.password as string, 14, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();
  });
});

userSchema.pre<IUser>("save", function (next) {
  if (this.externalLinks && this.externalLinks.length > 3) {
    this.externalLinks = this.externalLinks.slice(0, 3); // only keep first 5
  }
  next();
});

userSchema.virtual("fullName").get(function (this: IUser): string {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual("followerCount").get(function (this: IUser): number {
  return this.followers ? this.followers.length : 0;
});
userSchema.virtual("followingCount").get(function (this: IUser): number {
  return this.following ? this.following.length : 0;
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
