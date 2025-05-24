import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

interface ConnectionCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Configure mongoose settings
mongoose.set('strictQuery', true);

/**
 * Global variable to maintain connection across hot reloads
 */
let cached: ConnectionCache = (global as any).mongoose || { conn: null, promise: null };

/**
 * Connect to MongoDB database
 */
export async function connectToDatabase() {
  // If connection exists, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection is in progress, wait for it
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      family: 4, // Use IPv4, skip trying IPv6
    };
    // @ts-ignore
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('✅ Connected to MongoDB successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
        
        // More user-friendly error messages
        if (error.code === 8000 || error.message.includes('bad auth')) {
          console.error('Authentication failed: Please check your username and password in MONGODB_URI');
        } else if (error.code === 'ENOTFOUND') {
          console.error('Connection failed: Could not reach the database server. Check your connection and cluster URL.');
        }
        
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}

// Save connection in global for persistence between hot reloads
(global as any).mongoose = cached;