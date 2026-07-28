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
import { UserCheck } from "lucide-react";

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-sans text-slate-900">
      {/* Patient auto-role badge */}
      <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-xl p-3.5 flex items-center gap-3">
        <UserCheck className="w-5 h-5 text-indigo-600 flex-shrink-0" />
        <div className="text-xs">
          <p className="font-bold text-indigo-700 font-poppins">Patient Self-Registration</p>
          <p className="text-slate-600">
            All public accounts are created securely as <span className="font-semibold text-indigo-700">Patient</span> profiles.
          </p>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-poppins">
          Full Name
        </label>
        <input
          type="text"
          placeholder="John Doe"
          className={`w-full ${errors.name ? "!border-red-500" : ""}`}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-red-500 mt-1 font-semibold">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-poppins">
          Email Address
        </label>
        <input
          type="email"
          placeholder="johndoe@example.com"
          className={`w-full ${errors.email ? "!border-red-500" : ""}`}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1 font-semibold">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-poppins">
          Phone Number
        </label>
        <input
          type="tel"
          placeholder="9876543210"
          className={`w-full ${errors.phone ? "!border-red-500" : ""}`}
          {...register("phone")}
        />
        {errors.phone && (
          <p className="text-xs text-red-500 mt-1 font-semibold">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-poppins">
          Password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          className={`w-full ${errors.password ? "!border-red-500" : ""}`}
          {...register("password")}
        />
        {errors.password ? (
          <p className="text-xs text-red-500 mt-1 font-semibold">{errors.password.message}</p>
        ) : (
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            At least 8 chars (1 uppercase, 1 number, 1 special char).
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-poppins">
          Confirm Password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          className={`w-full ${errors.confirmPassword ? "!border-red-500" : ""}`}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-500 mt-1 font-semibold">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="flex items-start gap-2 pt-1">
        <input
          type="checkbox"
          id="terms"
          required
          className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="terms" className="text-xs text-slate-600 leading-snug">
          I agree to the <span className="font-bold text-slate-900">CareFlow Terms of Service</span> and <span className="font-bold text-slate-900">HIPAA Patient Privacy Notice</span>.
        </label>
      </div>

      <Button type="submit" variant="primary" fullWidth loading={loading} className="mt-2">
        Register as Patient
      </Button>

      <div className="text-center pt-2">
        <p className="text-xs text-slate-600">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-indigo-600 font-bold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </form>
  );
}
