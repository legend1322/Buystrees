
// lib/db.js

import mongoose from "mongoose";

// Ensure that MONGO_URI is properly loaded from the environment variables
const MONGO_URI = process.env.MONGO_URI;

// Log the Mongo URI to verify that it is being loaded correctly
console.log("Mongo URI:", MONGO_URI);

if (!MONGO_URI) {
  // If the MONGO_URI is not available, throw an error and stop the process
  throw new Error("❌ MONGO_URI is not defined. Please check your .env file.");
}

// Establish a connection to MongoDB if not already connected
export const connectDB = async () => {
  try {
    // Check if MongoDB is already connected
    if (mongoose.connection.readyState >= 1) {
      console.log("✅ MongoDB already connected.");
      return;
    }

    // Attempt to connect to MongoDB
    console.log("🔄 Attempting to connect to MongoDB...");
    await mongoose.connect(MONGO_URI, { dbName: "buyteees_db" });

    console.log("✅ MongoDB Connected");
  } catch (error) {
    // Log the error and include a more specific message
    console.error("❌ MongoDB Connection Error:", error.message);
    console.error("Full Error Stack:", error.stack);
    process.exit(1); // Exit the application if the connection fails
  }
};
