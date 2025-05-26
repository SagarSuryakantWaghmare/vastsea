"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Authentication error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="text-destructive mb-4">
        <AlertCircle size={50} />
      </div>
      <h2 className="text-2xl font-bold mb-2">Authentication Error</h2>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        {error?.message || "An error occurred during sign in. Please try again."}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => reset()} variant="outline">
          Try Again
        </Button>
        <Button asChild>
          <Link href="/auth/signin">Return to Sign In</Link>
        </Button>
      </div>
    </div>
  );
}
