// 1. Initialize environment variables at the absolute top
require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const port = process.env.PORT || 5000;

// 2. Establish Cloud Database Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`\n✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    
    // 3. Start Listening for Server Requests only after DB connects successfully
    app.listen(port, () => {
      console.log(`🚀 Backend server successfully running on port ${port}`);
    });
  } catch (error) {
    console.error(`❌ Database Connection Failure: ${error.message}`);
    process.exit(1); // Crash the server immediately if connection string is broken
  }
};

connectDB();