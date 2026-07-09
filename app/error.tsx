"use client";

import React, { useEffect } from "react";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import { AlertCircle } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 font-sans text-healthcare-textDark">
      <Card className="text-center max-w-md w-full py-6">
        <div className="bg-red-50 text-healthcare-error p-3 rounded-full w-fit mx-auto mb-4 border border-red-200">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-healthcare-textDark font-display mb-2">Something went wrong!</h2>
        <p className="text-sm text-healthcare-textMedium leading-relaxed mb-6">
          An unexpected error occurred during database sync or routing. Our diagnostic logs have recorded this event.
        </p>
        <div className="flex gap-3">
          <Button onClick={() => reset()} variant="primary" fullWidth>
            Reset System Session
          </Button>
          <a href="/dashboard" className="w-full">
            <Button variant="outline" fullWidth>
              Return to Safety
            </Button>
          </a>
        </div>
      </Card>
    </div>
  );
}
