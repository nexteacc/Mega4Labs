"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 记录错误到错误报告服务
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Something went wrong!
        </h2>
        <p className="mb-6 text-gray-600">
          We apologize for the inconvenience. Please try again.
        </p>
        <button
          onClick={reset}
          className="rounded-full bg-cta px-6 py-3 font-medium text-cta-foreground shadow-md transition-all hover:translate-y-[-1px] hover:shadow-lg"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
