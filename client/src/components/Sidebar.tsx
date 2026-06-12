"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, History, LogOut, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null; // Don't show sidebar if not logged in

  const navLinks = [
    { name: "Predict", href: "/", icon: Home },
    { name: "History", href: "/history", icon: History },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-full flex flex-col fixed left-0 top-0 pt-6 shadow-sm">
      <div className="px-6 mb-8 flex items-center space-x-3">
        <div className="p-2 bg-orange-100 rounded-xl text-orange-600">
          <Moon className="w-6 h-6" />
        </div>
        <span className="font-bold text-xl text-slate-800 tracking-tight">Sleep AI</span>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive
                  ? "bg-orange-50 text-orange-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="mb-4 px-4">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Logged in as</p>
          <p className="text-sm font-bold text-slate-700 truncate">{user.username}</p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
