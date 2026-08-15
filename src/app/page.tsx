"use client";

import { DashboardOverview } from "@/components/DashboardOverview";
import { Navbar } from "@/components/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <DashboardOverview />
      </main>
    </div>
  );
}
