import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Add custom logic here if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
    pages: {
      signIn: '/auth/signin',
    }
  }
);

export const config = {
  matcher: [
    "/add",
    "/dashboard",
    "/api/user/:path*"
    // We'll handle authorization checks inside the route handlers for /api/problems
    // This allows public access to GET requests while protecting POST/PUT/DELETE in the route handlers
  ]
};