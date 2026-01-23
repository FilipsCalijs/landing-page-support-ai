'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <Typography variant="h2" weight="bold">
          Something went wrong!
        </Typography>
        <Typography variant="body1" color="muted">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </Typography>
        <Button onClick={reset} variant="primary" size="lg">
          Try again
        </Button>
      </div>
    </div>
  );
}
