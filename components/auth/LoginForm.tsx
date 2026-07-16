"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "../../lib/validators";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useNotification";
import { auth } from "../../lib/firebase";
import { RecaptchaVerifier } from "firebase/auth";
import Button from "../common/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";

type LoginFormInputs = z.infer<typeof LoginSchema>;

export default function LoginForm() {
  const { signIn, signInWithGoogle, signInWithPhoneStart, signInWithPhoneConfirm } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  // Login Mode State
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");

  // Loading States
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Phone Login Specific States
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  // Form for Email/Password
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(LoginSchema),
  });

  // Handle standard Email Sign-In
  const onSubmitEmail = async (data: LoginFormInputs) => {
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

  // Handle Google Sign-In
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

  // Setup reCAPTCHA verifier for Phone Auth
  const initRecaptcha = () => {
    if (typeof window !== "undefined" && auth) {
      try {
        if (!(window as any).recaptchaVerifier) {
          (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "invisible",
            callback: () => {
              // reCAPTCHA solved
            },
          });
        }
      } catch (err) {
        console.warn("reCAPTCHA failed to load:", err);
      }
    }
  };

  // Send SMS Verification Code
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.trim() === "") {
      showToast("warning", "Phone Required", "Please enter a valid phone number starting with +.");
      return;
    }

    setLoading(true);
    try {
      initRecaptcha();
      const verifier = (window as any).recaptchaVerifier || null;
      const confirmResult = await signInWithPhoneStart(phoneNumber, verifier);
      setConfirmationResult(confirmResult);
      setOtpSent(true);
      showToast("success", "OTP Dispatched", `A 6-digit verification code was sent to ${phoneNumber}`);
    } catch (e: any) {
      showToast("error", "OTP Failed", e.message || "Failed to deliver SMS verification code.");
    } finally {
      setLoading(false);
    }
  };

  // Verify SMS OTP and Login
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      showToast("warning", "Invalid Code", "Please enter the 6-digit OTP code.");
      return;
    }

    setLoading(true);
    try {
      const user = await signInWithPhoneConfirm(confirmationResult, otpCode, phoneNumber);
      showToast("success", "Login Successful", `Welcome to CareFlow, ${user.name}!`);
      router.push("/dashboard");
    } catch (e: any) {
      showToast("error", "Verification Failed", e.message || "Invalid OTP code entered.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 font-sans text-healthcare-textDark">
      {/* Hidden reCAPTCHA anchor */}
      <div id="recaptcha-container"></div>

      {/* Email Login Method */}
      {loginMethod === "email" && (
        <form onSubmit={handleSubmit(onSubmitEmail)} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-healthcare-textDark mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@healthcare.com or doctor@healthcare.com"
              className={`w-full px-3 py-2 border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white transition-all ${
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
              className={`w-full px-3 py-2 border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white transition-all ${
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
        </form>
      )}

      {/* Phone OTP Login Method */}
      {loginMethod === "phone" && (
        <div className="space-y-4">
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-healthcare-textDark mb-1">
                  Mobile Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+919876543210 (Must include country code)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-healthcare-border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white transition-all"
                />
                <p className="text-[10px] text-healthcare-textLight mt-1 font-medium">
                  Enter your mobile phone starting with your country code (e.g., +91 for India, +1 for US).
                </p>
              </div>
              <Button type="submit" variant="primary" fullWidth loading={loading}>
                Send Verification Code
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-healthcare-textDark mb-1">
                  Enter OTP Code
                </label>
                <input
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full px-3 py-2 border border-healthcare-border rounded-standard text-sm text-center font-mono font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white"
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-[10px] text-healthcare-textMedium font-medium">
                    Code sent to {phoneNumber} (Mock code is <span className="font-bold">123456</span>)
                  </p>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-[10px] text-healthcare-accent hover:underline font-bold"
                  >
                    Change Phone Number
                  </button>
                </div>
              </div>
              <Button type="submit" variant="success" fullWidth loading={loading}>
                Verify OTP & Sign In
              </Button>
            </form>
          )}
        </div>
      )}

      {/* Social login divider */}
      <div className="relative flex items-center justify-center my-4">
        <div className="flex-grow border-t border-healthcare-border"></div>
        <span className="flex-shrink mx-4 text-xs font-bold text-healthcare-textMedium uppercase">Or connect with</span>
        <div className="flex-grow border-t border-healthcare-border"></div>
      </div>

      <div className="space-y-2">
        {/* Google Login Button */}
        <Button
          type="button"
          onClick={handleGoogleSignIn}
          variant="outline"
          fullWidth
          loading={googleLoading}
          className="gap-2 font-semibold"
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Continue with Google
        </Button>

        {/* Dynamic Alternative Sign-in Methods */}
        {loginMethod === "email" ? (
          <Button
            type="button"
            onClick={() => { setLoginMethod("phone"); setOtpSent(false); }}
            variant="outline"
            fullWidth
            className="font-semibold"
          >
            Continue with Phone
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => { setLoginMethod("email"); setOtpSent(false); }}
            variant="outline"
            fullWidth
            className="font-semibold"
          >
            Continue with Email & Password
          </Button>
        )}
      </div>

      <div className="text-center pt-2">
        <p className="text-sm text-healthcare-textMedium">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-healthcare-accent font-bold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
