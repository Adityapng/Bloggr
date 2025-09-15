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

// let cachedConnection: typeof mongoose | null = null;

// const connectDB = async () => {
//   if (cachedConnection) {
//     return cachedConnection;
//   }

//   try {
//     if (!process.env.MONGO_URI) {
//       throw new Error("MONGODB_URI is not defined.");
//     }

//     const connection = await mongoose.connect(process.env.MONGO_URI as string, {
//       bufferCommands: false,
//     });

//     cachedConnection = connection;

//     console.log("Mongoose connected.");
//     return connection;
//   } catch (err) {
//     console.error(" Mongoose connection error:", err);
//     throw err;
//   }
// };

// export default connectDB;
