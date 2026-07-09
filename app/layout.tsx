import React from "react";
import "../styles/globals.css";
import { AuthProvider } from "../hooks/useAuth";
import { ToastProvider } from "../hooks/useNotification";
import ToastContainer from "../components/common/Toast";

export const metadata = {
  title: "CareFlow HMS - Healthcare Management System",
  description: "A secure, production-ready, full-stack healthcare administration dashboard built using Next.js and Firebase Firestore.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏥</text></svg>" />
      </head>
      <body className="antialiased min-h-screen bg-healthcare-bgSecondary">
        <ToastProvider>
          <AuthProvider>
            {children}
            <ToastContainer />
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
