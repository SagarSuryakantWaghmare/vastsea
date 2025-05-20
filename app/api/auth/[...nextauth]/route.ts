import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
// @ts-ignore
import bcrypt from 'bcryptjs';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';

// Extend NextAuth session and user types
declare module 'next-auth' {
  interface Session {
    // @ts-ignore
    user: {
      id: string;
      name: string | null;
      email: string | null;
      image?: string | null;
      createdAt?: string;
    }
  }

  interface User {
    id: string;
    name: string;
    email: string;
    createdAt?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    createdAt?: string;
  }
}

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

// Handler for API route
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
