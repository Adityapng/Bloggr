import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error((error as Error).message);
    process.exit(1);
  }
};

export default connectDB;

// import mongoose from "mongoose";

// const MONGO_URI = process.env.MONGO_URI;

// if (!MONGO_URI) {
//   throw new Error(
//     "Please define the MONGO_URI environment variable inside .env"
//   );
// }

// let globalWithMongoose = global as typeof globalThis & {
//   mongoose: {
//     conn: typeof mongoose | null;
//     promise: Promise<typeof mongoose> | null;
//   };
// };

// let cached = globalWithMongoose.mongoose;

// if (!cached) {
//   cached = globalWithMongoose.mongoose = { conn: null, promise: null };
// }

// async function connectDB() {
//   if (cached.conn) {
//     console.log("✅ Using cached database connection.");
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//     };

//     console.log(" Mongoose is establishing a new connection...");
//     cached.promise = mongoose.connect(MONGO_URI!, opts).then((mongoose) => {
//       console.log(" Mongoose connected successfully.");
//       return mongoose;
//     });
//   }

//   try {
//     cached.conn = await cached.promise;
//   } catch (e) {
//     cached.promise = null;
//     throw e;
//   }

//   return cached.conn;
// }

// export default connectDB;
