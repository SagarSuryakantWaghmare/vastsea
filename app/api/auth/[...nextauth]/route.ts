import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import bcrypt from 'bcryptjs';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
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
        };
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    }
  }
});

export { handler as GET, handler as POST };