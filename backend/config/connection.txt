// import mongoose from "mongoose";

// const connectDB = async (): Promise<void> => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI as string);
//     console.log("MongoDB Connected");
//   } catch (error) {
//     console.error((error as Error).message);
//     process.exit(1);
//   }
// };

// export default connectDB;

// lib/mongodb.ts

import mongoose from "mongoose";
 

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGO_URI environment variable inside .env"
  );
}

// Define an interface for the cached connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the NodeJS global type to include our mongoose cache
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

// Initialize the global cache if not already set
const cached = global.mongoose || { conn: null, promise: null };
global.mongoose = cached;

// Main function to connect to MongoDB
const connectDB = async (): Promise<typeof mongoose> => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((mongooseInstance) => {
      console.log("✅ MongoDB Connected");
      return mongooseInstance;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
