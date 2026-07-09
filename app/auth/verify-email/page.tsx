"use client";

import React, { useState } from "react";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import Link from "next/link";
import { Activity, MailCheck } from "lucide-react";
import { useToast } from "../../../hooks/useNotification";

export default function VerifyEmailPage() {
  const { showToast } = useToast();
  const [resending, setResending] = useState(false);

  const handleResend = () => {
    setResending(true);
    setTimeout(() => {
      setResending(false);
      showToast("success", "Email Dispatched", "A fresh verification link has been sent to your email inbox.");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-healthcare-bgSecondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center gap-2 items-center mb-6">
          <div className="bg-healthcare-primary text-white p-1.5 rounded-md">
            <Activity className="w-5 h-5" />
          </div>
          <span className="font-bold text-2xl text-healthcare-primary font-display tracking-tight">CareFlow</span>
        </div>
        <Card className="text-center py-6">
          <div className="bg-blue-50 text-healthcare-primary p-4 rounded-full w-fit mx-auto mb-4">
            <MailCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-healthcare-textDark font-display mb-2">Verify Your Email</h3>
          <p className="text-sm text-healthcare-textMedium leading-relaxed mb-6 max-w-xs mx-auto">
            A confirmation link was dispatched to your email address. Please open it to activate all dashboard privileges.
          </p>
          <div className="space-y-3">
            <Button variant="primary" fullWidth onClick={handleResend} loading={resending}>
              Resend Verification link
            </Button>
            <Link href="/dashboard" className="block">
              <Button variant="outline" fullWidth>
                Skip / Go to Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
