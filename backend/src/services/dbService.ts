import mongoose from "mongoose";

// Hardcoded config since env vars aren't loading
const MONGODB_URI = 'mongodb+srv://aryasingh8405:arya123@cluster0.jbw7o.mongodb.net/contest-tracker';

export class DbService {
  static async connect(): Promise<void> {
    try {
      console.log(`Connecting to MongoDB using hardcoded URI`);
      
      await mongoose.connect(MONGODB_URI);
      
      console.log("MongoDB connection established successfully");
      
      // Set up error handlers
      mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
      });
      
      mongoose.connection.on("disconnected", () => {
        console.warn("MongoDB disconnected, attempting to reconnect...");
        this.connect().catch(err => console.error("Failed to reconnect to MongoDB:", err));
      });
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      throw error;
    }
  }
}
