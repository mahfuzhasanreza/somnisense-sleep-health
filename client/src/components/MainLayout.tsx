"use client";

import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {user && <Sidebar />}
      <div className={`flex-1 flex flex-col ${user ? 'ml-64' : ''}`}>
        <main className="flex-1">
          {children}
        </main>
        {user && <Footer />}
      </div>
    </div>
  );
}
