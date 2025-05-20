import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
// Using dynamic import for bcrypt to avoid Edge runtime issues
// @ts-ignore - We'll handle bcrypt in the authorize function
import * as bcrypt from 'bcryptjs';

// Auth options
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Please enter email and password');
          }

          await connectToDatabase();

          const user = await User.findOne({ email: credentials.email }).select('+password');

          if (!user) {
            throw new Error('Invalid email or password');
          }

          const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordMatch) {
            throw new Error('Invalid email or password');
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            createdAt: user.createdAt
          };
        } catch (error) {
          console.error('Authentication error:', error);
          throw new Error('Authentication failed');
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/signin'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.createdAt = user.createdAt;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id ?? '';
        session.user.createdAt = token.createdAt;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};
