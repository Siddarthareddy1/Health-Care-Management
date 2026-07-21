"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema } from "../../lib/validators";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useNotification";
import Button from "../common/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { ShieldCheck, UserCheck } from "lucide-react";

type SignupFormInputs = z.infer<typeof SignupSchema>;

export default function SignupForm() {
  const { signUp } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInputs>({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = async (data: SignupFormInputs) => {
    setLoading(true);
    try {
      // Always registers user as role "patient"
      await signUp(data.email, data.password, data.name, data.phone);
      showToast(
        "success",
        "Patient Registration Successful!",
        `Welcome to CareFlow, ${data.name}. You may now log in to your patient portal.`
      );
      router.push("/auth/login");
    } catch (e: any) {
      showToast("error", "Registration Failed", e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-sans text-healthcare-textDark">
      {/* Patient auto-role badge */}
      <div className="bg-blue-50 border border-blue-200 rounded-standard p-3 flex items-center gap-3">
        <UserCheck className="w-5 h-5 text-healthcare-primary flex-shrink-0" />
        <div className="text-xs">
          <p className="font-bold text-healthcare-primary">Patient Self-Registration</p>
          <p className="text-healthcare-textMedium">
            All public accounts are created securely as <span className="font-semibold text-healthcare-primary">Patient</span> profiles.
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-healthcare-textDark mb-1">
          Full Name
        </label>
        <input
          type="text"
          placeholder="John Doe"
          className={`w-full px-3 py-2 border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white ${
            errors.name ? "border-healthcare-error" : "border-healthcare-border"
          }`}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-healthcare-error mt-1 font-semibold">{errors.name.message}</p>
        )}
      </div>

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

      <div>
        <label className="block text-sm font-bold text-healthcare-textDark mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          placeholder="9876543210"
          className={`w-full px-3 py-2 border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white ${
            errors.phone ? "border-healthcare-error" : "border-healthcare-border"
          }`}
          {...register("phone")}
        />
        {errors.phone && (
          <p className="text-xs text-healthcare-error mt-1 font-semibold">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-bold text-healthcare-textDark mb-1">
          Password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          className={`w-full px-3 py-2 border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white ${
            errors.password ? "border-healthcare-error" : "border-healthcare-border"
          }`}
          {...register("password")}
        />
        {errors.password ? (
          <p className="text-xs text-healthcare-error mt-1 font-semibold">{errors.password.message}</p>
        ) : (
          <p className="text-[10px] text-healthcare-textLight mt-1">
            Must be at least 8 characters with 1 uppercase letter, 1 number, and 1 special character.
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-bold text-healthcare-textDark mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          className={`w-full px-3 py-2 border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white ${
            errors.confirmPassword ? "border-healthcare-error" : "border-healthcare-border"
          }`}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-healthcare-error mt-1 font-semibold">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="flex items-start gap-2 pt-1">
        <input
          type="checkbox"
          id="terms"
          required
          className="mt-1 rounded border-healthcare-border text-healthcare-primary focus:ring-healthcare-primary"
        />
        <label htmlFor="terms" className="text-xs text-healthcare-textMedium leading-snug">
          I agree to the <span className="font-bold text-healthcare-textDark">CareFlow Terms of Service</span> and <span className="font-bold text-healthcare-textDark">HIPAA Patient Privacy Notice</span>.
        </label>
      </div>

      <Button type="submit" variant="primary" fullWidth loading={loading}>
        Register as Patient
      </Button>

      <div className="text-center pt-2">
        <p className="text-sm text-healthcare-textMedium">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-healthcare-accent font-bold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </form>
  );
}
