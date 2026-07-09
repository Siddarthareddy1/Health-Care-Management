"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../../hooks/useAuth";
import { useToast } from "../../../hooks/useNotification";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import Link from "next/link";
import { Activity } from "lucide-react";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordInputs = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInputs) => {
    setLoading(true);
    try {
      await resetPassword(data.email);
      showToast(
        "success",
        "Reset Email Sent",
        "A password reset link has been dispatched to your email address."
      );
    } catch (e: any) {
      showToast("error", "Request Failed", e.message || "Failed to initiate password reset.");
    } finally {
      setLoading(false);
    }
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
        <Card title="Reset Password" subtitle="Enter your email to receive a secure password recovery link.">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-sans text-healthcare-textDark">
            <div>
              <label className="block text-sm font-bold text-healthcare-textDark mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="johndoe@example.com"
                className={`w-full px-3 py-2 border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white ${
                  errors.email ? "border-healthcare-error" : "border-healthcare-border"
                }`}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-healthcare-error mt-1 font-semibold">{errors.email.message}</p>
              )}
            </div>

            <Button type="submit" variant="primary" fullWidth loading={loading}>
              Send Recovery Email
            </Button>

            <div className="text-center pt-2">
              <Link href="/auth/login" className="text-sm text-healthcare-accent font-bold hover:underline">
                Return to Login
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
