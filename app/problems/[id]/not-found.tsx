import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container py-10 flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center">
      <h1 className="text-4xl font-bold">Problem Not Found</h1>
      <p className="text-muted-foreground text-lg max-w-md">
        Sorry, we couldn&apos;t find the problem you&apos;re looking for. It may have been removed or you might have followed a broken link.
      </p>
      <Button asChild>
        <Link href="/problems">Back to Problems</Link>
      </Button>
    </div>
  );
}
