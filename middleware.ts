import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Function to handle auth-protected routes
const authMiddleware = withAuth(
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

// Main middleware function to handle all cases
// @ts-ignore
export default function middleware(req) {
  const { pathname } = req.nextUrl;
  
  // Handle misspelled leaderboard route
  if (pathname === '/leadborad' || pathname === '/leadborad/') {
    const url = req.nextUrl.clone();
    url.pathname = '/leaderboard';
    return NextResponse.redirect(url);
  }
  
  // For auth protected routes, pass to the auth middleware
  if (
    pathname.startsWith('/add') || 
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/api/user/')
  ) {
    // @ts-ignore
    return authMiddleware(req);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/add",
    "/dashboard",
    "/api/user/:path*",
    "/leadborad",
    "/leadborad/"
    // We'll handle authorization checks inside the route handlers for /api/problems
    // This allows public access to GET requests while protecting POST/PUT/DELETE in the route handlers
  ]
};