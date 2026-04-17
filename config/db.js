// Import mongoose (MongoDB library)
const mongoose = require('mongoose');

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Connect to MongoDB using connection string from .env
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Success message
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database Name: ${conn.connection.name}`);
  } catch (error) {
    // If connection fails, show error and exit
    console.error(`❌ Error: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

// Export so we can use in server.js
module.exports = connectDB;