"use client";

import { useAuth } from "../context/AuthContext";

export default function Footer() {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Sleep Health AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
