"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "../types";
import { 
  subscribeToAuth, 
  signIn as apiSignIn, 
  signUp as apiSignUp, 
  registerPatient as apiRegisterPatient,
  signOut as apiSignOut, 
  resetPassword as apiResetPassword,
  signInWithGoogle as apiSignInWithGoogle,
  sendPhoneOtp as apiSendPhoneOtp,
  verifyPhoneOtpProfile as apiVerifyPhoneOtpProfile
} from "../lib/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string, name: string, phone: string, role?: UserRole) => Promise<User>;
  registerPatient: (email: string, password: string, name: string, phone: string) => Promise<User>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<User>;
  signInWithPhoneStart: (phoneNumber: string, verifier: any) => Promise<any>;
  signInWithPhoneConfirm: (confirmationResult: any, otpCode: string, phoneNumber: string) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userResult = await apiSignIn(email, password);
      setUser(userResult);
      return userResult;
    } catch (e) {
      setUser(null);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, phone: string, role: UserRole = "patient") => {
    setLoading(true);
    try {
      const userResult = await apiSignUp(email, password, name, phone, role);
      setUser(userResult);
      return userResult;
    } catch (e) {
      setUser(null);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const registerPatient = async (email: string, password: string, name: string, phone: string) => {
    return signUp(email, password, name, phone, "patient");
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await apiSignOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    await apiResetPassword(email);
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const userResult = await apiSignInWithGoogle();
      setUser(userResult);
      return userResult;
    } catch (e) {
      setUser(null);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const signInWithPhoneStart = async (phoneNumber: string, verifier: any) => {
    return await apiSendPhoneOtp(phoneNumber, verifier);
  };

  const signInWithPhoneConfirm = async (confirmationResult: any, otpCode: string, phoneNumber: string) => {
    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otpCode);
      const userResult = await apiVerifyPhoneOtpProfile(result.user.uid, phoneNumber);
      setUser(userResult);
      return userResult;
    } catch (e) {
      setUser(null);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signUp, 
      registerPatient,
      signOut, 
      resetPassword, 
      signInWithGoogle, 
      signInWithPhoneStart, 
      signInWithPhoneConfirm 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
