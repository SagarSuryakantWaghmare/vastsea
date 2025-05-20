import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

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

// Handler for API route
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
