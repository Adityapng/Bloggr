import { Server } from "http";
import { DatabaseConnection } from "./connection"; // Adjust import path as needed

const gracefulShutdown = async (
  signal: string,
  server: Server
): Promise<void> => {
  console.log(`Received ${signal}, shutting down gracefully...`);

  // Stop accepting new requests
  server.close(async () => {
    try {
      // Close database connections
      const dbConnection = DatabaseConnection.getInstance();
      await dbConnection.disconnect();

      console.log("All connections closed successfully");
      process.exit(0);
    } catch (error) {
      console.error("Error during shutdown:", error);
      process.exit(1);
    }
  });

  // Force shutdown if graceful shutdown takes too long
  setTimeout(() => {
    console.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000); // 10 seconds
};

// Usage in your index.ts
export const setupGracefulShutdown = (server: Server): void => {
  process.on("SIGINT", () => gracefulShutdown("SIGINT", server));
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM", server));
};
