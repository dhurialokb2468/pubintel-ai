"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { exportItemsToCSV } from "@/services/csvExporter";
import { MOCK_CONTENT_ITEMS } from "@/data/mockData";
import {
  Radar,
  Search,
  BookOpen,
  Bookmark,
  Upload,
  Download,
  Sparkles,
  LayoutDashboard,
  Zap
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [quickQuery, setQuickQuery] = useState("");

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    router.push(`/results?q=${encodeURIComponent(quickQuery.trim())}`);
  };

  const navLinks = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/discover", label: "Discover", icon: Search },
    { href: "/results", label: "Results", icon: BookOpen },
    { href: "/saved-searches", label: "Saved Searches", icon: Bookmark },
    { href: "/import", label: "CSV Import", icon: Upload },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 bg-slate-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Radar className="w-5 h-5 text-sky-400 animate-radar-pulse" />
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-lg text-white tracking-tight">PubIntel AI</span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30 rounded-full uppercase tracking-wider">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Publishing Intelligence & Acquisition Engine</p>
          </div>
        </Link>

        {/* Global Quick Search Input */}
        <form onSubmit={handleQuickSearch} className="hidden lg:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
              placeholder="Quick search any topic (e.g. Agentic AI, Quant Trading, Sound Design)..."
              className="w-full pl-10 pr-24 py-1.5 rounded-xl glass-input text-xs font-medium focus:ring-2 focus:ring-sky-500/40"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-[11px] transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Nav Links */}
        <nav className="flex items-center gap-1 sm:gap-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-sky-500/15 text-sky-300 border border-sky-500/30 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-sky-400" : "text-slate-400"}`} />
                <span className="hidden md:inline">{link.label}</span>
              </Link>
            );
          })}

          {/* Quick Export Button */}
          <button
            onClick={() => exportItemsToCSV(MOCK_CONTENT_ITEMS, "pubintel-ai-report.csv")}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors ml-1"
            title="Export Discovered Opportunities to CSV"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Export</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
