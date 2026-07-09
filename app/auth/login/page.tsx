"use client";

import React from "react";
import LoginForm from "../../../components/auth/LoginForm";
import Card from "../../../components/common/Card";
import { Activity } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-healthcare-bgSecondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center gap-2 items-center mb-6">
          <div className="bg-healthcare-primary text-white p-1.5 rounded-md">
            <Activity className="w-5 h-5" />
          </div>
          <span className="font-bold text-2xl text-healthcare-primary font-display tracking-tight">CareFlow</span>
        </div>
        <Card title="Sign In to CareFlow" subtitle="Enter your email and password to continue.">
          <LoginForm />
        </Card>
      </div>
    </div>
  );
}
