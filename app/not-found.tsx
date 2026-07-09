import React from "react";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import { HelpCircle } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-healthcare-bgSecondary flex items-center justify-center p-4 font-sans text-healthcare-textDark">
      <Card className="text-center max-w-md w-full py-6">
        <div className="bg-blue-50 text-healthcare-primary p-3 rounded-full w-fit mx-auto mb-4 border border-blue-200 animate-bounce">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-healthcare-textDark font-display mb-2">404 - Page Not Found</h2>
        <p className="text-sm text-healthcare-textMedium leading-relaxed mb-6">
          The clinic resource or page URL you are attempting to load does not exist or has been relocated.
        </p>
        <Link href="/dashboard" className="block w-full">
          <Button variant="primary" fullWidth>
            Return to Dashboard Portal
          </Button>
        </Link>
      </Card>
    </div>
  );
}
