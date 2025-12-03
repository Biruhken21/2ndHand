const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Attempting MongoDB connection...');
    
    // For LOCAL MongoDB - no authentication needed
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/UsedProducs', {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', err => {
      console.error('❌ MongoDB connection error:', err.message);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected. Attempting to reconnect...');
      setTimeout(connectDB, 5000);
    });
    
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('Error:', error.message);
    
    console.log('\n🔧 Solutions for LOCAL MongoDB:');
    console.log('1. Start MongoDB service:');
    console.log('   - Press Win + R, type "services.msc"');
    console.log('   - Find "MongoDB", right-click → Start');
    console.log('2. Install MongoDB from: https://www.mongodb.com/try/download/community');
    console.log('3. Use Docker: docker run -d -p 27017:27017 --name mongodb mongo');
    
    // Don't exit - keep trying in development
    console.log('\n⚠️  Retrying in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;