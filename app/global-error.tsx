"use client";

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-6">
            <h1 className="text-4xl font-bold text-red-500">Something went wrong!</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              We apologize for the inconvenience. An unexpected error has occurred.
            </p>
            
            <div className="bg-muted/50 rounded-lg p-4 overflow-auto max-h-32 text-sm text-left">
              <p className="font-mono">Error: {error.message || 'Unknown error'}</p>
              {error.digest && <p className="font-mono text-xs mt-2">Digest: {error.digest}</p>}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={reset} variant="outline" className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Try again
              </Button>
              <Button asChild>
                <Link href="/">Return to home page</Link>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
