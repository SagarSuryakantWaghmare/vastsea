import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="container py-10 flex items-center justify-center min-h-[70vh]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <h2 className="text-xl font-medium">Loading Problem...</h2>
        <p className="text-muted-foreground">Please wait while we fetch the problem details.</p>
      </div>
    </div>
  );
}
