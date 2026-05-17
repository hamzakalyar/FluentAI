const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Safe production diagnostics to print key presence without exposing sensitive passwords
    console.log("🔍 Diagnostic - Loaded Env Keys:", 
      Object.keys(process.env).filter(k => k.includes("MONGO") || k.includes("URI") || k.includes("PORT") || k.includes("PYTHON"))
    );
    console.log("🔍 Diagnostic - MONGODB_URI type:", typeof process.env.MONGODB_URI);

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
