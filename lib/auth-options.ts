import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
// Dynamic import for bcrypt to avoid Edge runtime issues
// We'll dynamically import bcrypt in the authorize function

// Auth options
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Please enter email and password');
          }

          try {
            // Try to connect to the database
            await connectToDatabase();
          } catch (connectionError) {
            console.error('Database connection failed during authentication:', connectionError);
            throw new Error('Database connection error. Please try again later or contact support.');
          }

          let user;
          try {
            user = await User.findOne({ email: credentials.email }).select('+password');
          } catch (dbError) {
            console.error('Error querying user:', dbError);
            throw new Error('Authentication error. Please try again later.');
          }

          if (!user) {
            console.log(`No user found with email: ${credentials.email}`);
            throw new Error('Invalid email or password');
          }          let isPasswordMatch;
          try {
            // Dynamically import bcrypt to avoid Edge compatibility issues
            const bcrypt = await import('bcryptjs');
            isPasswordMatch = await bcrypt.compare(credentials.password, user.password);
          } catch (bcryptError) {
            console.error('Password comparison error:', bcryptError);
            throw new Error('Authentication error. Please try again later.');
          }          if (!isPasswordMatch) {
            console.log(`Password mismatch for user: ${credentials.email}`);
            throw new Error('Invalid email or password');
          }

          // Ensure proper JSON serialization of MongoDB objects
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            // Convert Date object to ISO string to ensure proper serialization
            createdAt: user.createdAt ? user.createdAt.toISOString() : new Date().toISOString()
          };
        } catch (error) {
          console.error('Authentication error:', error);
          throw new Error('Authentication failed');
        }
      }
    })
  ],  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.createdAt = user.createdAt;
      }
      return token;
    },    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id ?? '';
        session.user.createdAt = token.createdAt;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-do-not-use-in-production'
};
