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
    defaultValues: {
      role: "patient"
    }
  });

  const onSubmit = async (data: SignupFormInputs) => {
    setLoading(true);
    try {
      await signUp(data.email, data.password, data.name, data.phone, data.role);
      showToast("success", "Registration Successful", `Welcome to CareFlow, ${data.name}!`);
      router.push("/dashboard");
    } catch (e: any) {
      showToast("error", "Registration Failed", e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-sans text-healthcare-textDark">
      <div>
        <label className="block text-sm font-bold text-healthcare-textDark mb-1">
          Full Name
        </label>
        <input
          type="text"
          placeholder="John Doe"
          className={`w-full px-3 py-2 border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary ${
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
          className={`w-full px-3 py-2 border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary ${
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
          className={`w-full px-3 py-2 border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary ${
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
          Account Role
        </label>
        <select
          className="w-full px-3 py-2 border border-healthcare-border rounded-standard bg-white text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary"
          {...register("role")}
        >
          <option value="patient">Patient (View records, book checkups)</option>
          <option value="doctor">Doctor (Update patient history, list availability)</option>
          <option value="admin">System Administrator (Manage users, billing, settings)</option>
        </select>
        {errors.role && (
          <p className="text-xs text-healthcare-error mt-1 font-semibold">{errors.role.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-bold text-healthcare-textDark mb-1">
          Password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          className={`w-full px-3 py-2 border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary ${
            errors.password ? "border-healthcare-error" : "border-healthcare-border"
          }`}
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-healthcare-error mt-1 font-semibold">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" variant="primary" fullWidth loading={loading}>
        Create Account
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
