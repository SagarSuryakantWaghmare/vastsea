/**
 * Admin utility functions for checking admin privileges
 */

/**
 * Get the list of admin emails from environment variables
 * Falls back to default admin emails if environment variable is not set
 */
export function getAdminEmails(): string[] {
  // For client-side components
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || ['sagarwaghmare1384@gmail.com', 'admin@vastsea.com'];
  }
  
  // For server-side components and API routes
  return process.env.ADMIN_EMAILS?.split(',') || 
         process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || 
         ['sagarwaghmare1384@gmail.com', 'admin@vastsea.com'];
}

/**
 * Check if an email is an admin email
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email);
}

/**
 * Middleware to check if user session has admin privileges
 */
export function isAdmin(userEmail: string | null | undefined): boolean {
  return isAdminEmail(userEmail);
}
