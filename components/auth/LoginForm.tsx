"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "../../lib/validators";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useNotification";
import Button from "../common/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";

type LoginFormInputs = z.infer<typeof LoginSchema>;

export default function LoginForm() {
  const { signIn } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    try {
      const user = await signIn(data.email, data.password);
      showToast("success", "Login Successful", `Welcome back, ${user.name}!`);
      router.push("/dashboard");
    } catch (e: any) {
      showToast("error", "Login Failed", e.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-sans text-healthcare-textDark">
      <div>
        <label className="block text-sm font-bold text-healthcare-textDark mb-1">
          Email Address
        </label>
        <input
          type="email"
          placeholder="admin@healthcare.com or doctor@healthcare.com"
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
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-bold text-healthcare-textDark">
            Password
          </label>
          <Link
            href="/auth/forgot-password"
            className="text-xs text-healthcare-accent hover:underline font-semibold"
          >
            Forgot Password?
          </Link>
        </div>
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
        Sign In
      </Button>

      <div className="text-center pt-2">
        <p className="text-sm text-healthcare-textMedium">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-healthcare-accent font-bold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </form>
  );
}
