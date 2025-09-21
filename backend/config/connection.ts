import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable");
}

// Attach the Mongoose connection cache to the global object.
// This is the most reliable way to persist state across serverless invocations.
let globalWithMongoose = global as typeof globalThis & {
  mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

let cached = globalWithMongoose.mongoose;

if (!cached) {
  cached = globalWithMongoose.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    console.log("✅ Using cached database connection.");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log(" Mongoose is establishing a new connection...");
    cached.promise = mongoose
      .connect(MONGO_URI as string, opts)
      .then((mongooseInstance) => {
        console.log(" Mongoose connected successfully.");
        return mongooseInstance;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Reset the promise on failure
    throw e;
  }

  return cached.conn;
}

export default connectDB;
