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
  const { signIn, signInWithGoogle } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const user = await signInWithGoogle();
      showToast("success", "Login Successful", `Welcome back, ${user.name}!`);
      router.push("/dashboard");
    } catch (e: any) {
      showToast("error", "Google Sign-In Failed", e.message || "Failed to log in with Google.");
    } finally {
      setGoogleLoading(false);
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

      <div className="relative flex items-center justify-center my-4">
        <div className="flex-grow border-t border-healthcare-border"></div>
        <span className="flex-shrink mx-4 text-xs font-bold text-healthcare-textMedium uppercase">Or connect with</span>
        <div className="flex-grow border-t border-healthcare-border"></div>
      </div>

      <Button 
        type="button" 
        onClick={handleGoogleSignIn} 
        variant="outline" 
        fullWidth 
        loading={googleLoading}
        className="gap-2"
      >
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        Sign In with Google
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
