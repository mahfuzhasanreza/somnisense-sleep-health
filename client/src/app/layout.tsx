import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SomniSense - AI-Powered Sleep Health Predictor",
  description: "SomniSense is an AI-powered sleep health predictor that analyzes your lifestyle habits to provide personalized insights and recommendations for better sleep quality. Track your sleep patterns, identify potential issues, and receive actionable advice to improve your sleep health.",
};

import { AuthProvider } from "../context/AuthContext";
import MainLayout from "../components/MainLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-white`}
    >
      <body className="min-h-full bg-white text-slate-900">
        <AuthProvider>
          <MainLayout>{children}</MainLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
