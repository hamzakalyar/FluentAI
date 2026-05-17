const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Automatically fall back to MONGODB_URL if MONGODB_URI is not provided (robust support)
    const dbUri = process.env.MONGODB_URI || process.env.MONGODB_URL;

    console.log("🔍 Diagnostic - Selected Database Key:", process.env.MONGODB_URI ? "MONGODB_URI" : "MONGODB_URL");
    console.log("🔍 Diagnostic - Selected connection type:", typeof dbUri);

    const conn = await mongoose.connect(dbUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
