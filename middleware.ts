import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Admin emails
const adminEmails = ['sagarwaghmare1384@gmail.com', 'admin@vastsea.com'];

// Function to handle auth-protected routes
const authMiddleware = withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;
    
    // Admin route protection
    if (pathname.startsWith('/admin')) {
      if (!token?.email || !adminEmails.includes(token.email as string)) {
        const url = req.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
      }
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Admin routes require admin email
        if (pathname.startsWith('/admin')) {
          return !!token?.email && adminEmails.includes(token.email as string);
        }
        
        // Other protected routes just need a token
        return !!token;
      }
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
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api/user/') ||
    pathname.startsWith('/api/admin/')
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
    "/admin/:path*",
    "/api/user/:path*",
    "/api/admin/:path*",
    "/leadborad",
    "/leadborad/"
    // We'll handle authorization checks inside the route handlers for /api/problems
    // This allows public access to GET requests while protecting POST/PUT/DELETE in the route handlers
  ]
};