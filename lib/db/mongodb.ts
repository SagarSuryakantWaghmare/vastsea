import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vastsea';

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('Connected to MongoDB');
        return mongoose;
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Add this to global to maintain a persistent connection
(global as any).mongoose = cached;