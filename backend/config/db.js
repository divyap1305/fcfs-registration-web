const mongoose = require('mongoose');

async function connectDB(uri) {
  if (!uri) {
    throw new Error('Missing MONGO_URI. Please set environment variable.');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    dbName: process.env.DB_NAME || undefined,
  });
  return mongoose.connection;
}

module.exports = { connectDB };
