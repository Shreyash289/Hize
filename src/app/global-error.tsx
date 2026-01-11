"use client";

import { useEffect } from "react";
import ErrorReporter from "@/components/ErrorReporter";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error details for debugging iOS issues
    console.error('Global error caught:', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      timestamp: new Date().toISOString()
    });
  }, [error]);

  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ErrorReporter error={error} reset={reset} />
      </body>
    </html>
  );
}
