import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Admin emails
const adminEmails = ['sagarwaghmare1384@gmail.com', 'admin@vastsea.com'];

export const useAdminRedirect = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      const isAdmin = adminEmails.includes(session.user.email);
      
      // If user is admin and not already on admin page, redirect to admin
      if (isAdmin && !window.location.pathname.startsWith('/admin')) {
        router.push('/admin');
      }
    }
  }, [session, status, router]);

  return {
    isAdmin: session?.user?.email ? adminEmails.includes(session.user.email) : false,
    session,
    status
  };
};

export const AdminRedirectHandler = () => {
  useAdminRedirect();
  return null;
};
