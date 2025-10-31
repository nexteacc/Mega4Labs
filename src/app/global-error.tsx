"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 记录严重错误
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
          <div className="max-w-md text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Something went wrong!
            </h2>
            <p className="mb-6 text-gray-600">
              A critical error occurred. Please refresh the page.
            </p>
            <button
              onClick={reset}
              className="rounded-full bg-blue-600 px-6 py-3 font-medium text-white shadow-md transition-all hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
