"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ContentItem } from "@/types/content";
import { Creator } from "@/types/creator";
import { ScoreBadge, PublishingTypeBadge } from "./ScoreBadge";
import {
  Radar,
  BookOpen,
  BookMarked,
  Sparkles,
  Users,
  Search,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  ChevronRight,
  Plus
} from "lucide-react";

interface DashboardOverviewProps {
  items: ContentItem[];
  creators: Creator[];
}

export function DashboardOverview({ items, creators }: DashboardOverviewProps) {
  const router = useRouter();
  const [heroQuery, setHeroQuery] = useState("");

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroQuery.trim()) return;
    router.push(`/results?q=${encodeURIComponent(heroQuery.trim())}`);
  };

  const quickTopics = [
    "Agentic AI for Product Managers",
    "Model Context Protocol",
    "Algorithmic Trading with Python",
    "AI Sound Design",
    "DaVinci Resolve AI Video Editing",
    "Salesforce Agentforce",
    "AI Automation with n8n",
    "AI Financial Analysis"
  ];

  // Stat calculations
  const totalOpportunities = items.length;
  const booksDiscovered = items.filter((i) => i.contentType === "book").length;
  const independentBooks = items.filter(
    (i) => i.contentType === "book" && (i.publishingType === "self_published" || i.publishingType === "independent_press")
  ).length;
  const contentToBookOpportunities = items.filter((i) => i.contentType !== "book").length;
  const promisingCreators = creators.length;
  const topicsInvestigated = new Set(items.map((i) => i.primaryTopic).filter(Boolean)).size;

  // Tables
  const top10Opportunities = [...items]
    .sort((a, b) => (b.opportunityScore || 0) - (a.opportunityScore || 0))
    .slice(0, 10);

  const topContentToBook = items
    .filter((i) => i.contentType !== "book")
    .sort((a, b) => (b.bookPotentialScore || 0) - (a.bookPotentialScore || 0))
    .slice(0, 5);

  const topCreatorsList = [...creators]
    .sort((a, b) => (b.creatorOpportunityScore || 0) - (a.creatorOpportunityScore || 0))
    .slice(0, 5);

  // Emerging Topics calculations
  const topicMap = new Map<string, { count: number; maxScore: number; booksCount: number }>();
  for (const item of items) {
    const topic = item.primaryTopic || "General AI";
    const current = topicMap.get(topic) || { count: 0, maxScore: 0, booksCount: 0 };
    current.count++;
    if (item.contentType === "book") current.booksCount++;
    if ((item.opportunityScore || 0) > current.maxScore) current.maxScore = item.opportunityScore || 0;
    topicMap.set(topic, current);
  }

  const emergingTopicsList = Array.from(topicMap.entries())
    .map(([topic, data]) => ({
      topic,
      contentCount: data.count,
      booksCount: data.booksCount,
      maxScore: data.maxScore,
      gapScore: Math.round(100 - data.booksCount * 20 + data.maxScore * 0.2)
    }))
    .sort((a, b) => b.gapScore - a.gapScore)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Sleek Hero Banner & Instant Search */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 rounded-full bg-gradient-to-br from-sky-500/20 to-purple-600/10 blur-3xl pointer-events-none" />

        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 text-xs font-semibold">
            <Radar className="w-3.5 h-3.5 text-sky-400 animate-radar-pulse" />
            <span>Publishing Acquisition Radar</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Discover Emerging Professional Topics Before They Become Books
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Spot independent books, high-potential video series, structured courses, emerging authors, and commercial publishing opportunities across 50+ professional domains.
          </p>

          {/* Hero Search Box */}
          <form onSubmit={handleHeroSearch} className="pt-2">
            <div className="relative max-w-2xl">
              <Search className="w-5 h-5 text-sky-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                placeholder="What topic do you want to investigate? (e.g. Agentic AI, Quant Trading)..."
                className="w-full pl-12 pr-36 py-4 rounded-2xl glass-input text-sm sm:text-base font-medium placeholder-slate-400 shadow-xl"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Find Radar Leads</span>
              </button>
            </div>
          </form>

          {/* Quick Topic Chips */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Quick Topics:</span>
            {quickTopics.slice(0, 5).map((topic) => (
              <button
                key={topic}
                onClick={() => router.push(`/results?q=${encodeURIComponent(topic)}`)}
                className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors text-[11px] font-medium"
              >
                + {topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 6 Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-sky-400 mb-2">
            <span className="text-xs font-semibold text-slate-400">Discovered</span>
            <Radar className="w-4 h-4" />
          </div>
          <p className="font-heading text-2xl sm:text-3xl font-extrabold text-white">{totalOpportunities}</p>
          <p className="text-[11px] text-slate-400 mt-1">Tracked opportunities</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-blue-400 mb-2">
            <span className="text-xs font-semibold text-slate-400">Books</span>
            <BookOpen className="w-4 h-4" />
          </div>
          <p className="font-heading text-2xl sm:text-3xl font-extrabold text-white">{booksDiscovered}</p>
          <p className="text-[11px] text-slate-400 mt-1">Print & Digital</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-purple-400 mb-2">
            <span className="text-xs font-semibold text-slate-400">Indie / Self-Pub</span>
            <BookMarked className="w-4 h-4" />
          </div>
          <p className="font-heading text-2xl sm:text-3xl font-extrabold text-purple-300">{independentBooks}</p>
          <p className="text-[11px] text-slate-400 mt-1">Acquisition leads</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-semibold text-slate-400">Content → Book</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="font-heading text-2xl sm:text-3xl font-extrabold text-emerald-300">{contentToBookOpportunities}</p>
          <p className="text-[11px] text-slate-400 mt-1">Courses & Playlists</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-semibold text-slate-400">Creators</span>
            <Users className="w-4 h-4" />
          </div>
          <p className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-300">{promisingCreators}</p>
          <p className="text-[11px] text-slate-400 mt-1">Potential Authors</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-xs font-semibold text-slate-400">Topics</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="font-heading text-2xl sm:text-3xl font-extrabold text-white">{topicsInvestigated}</p>
          <p className="text-[11px] text-slate-400 mt-1">Across 5 domains</p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top 10 Opportunities Table */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-sky-400" />
                <span>Top Discovered Opportunities</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Ranked by Opportunity Score across all sources</p>
            </div>
            <Link
              href="/results"
              className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Opportunity</th>
                  <th className="py-3.5 px-4">Title & Creator</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Domain / Topic</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {top10Opportunities.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-3.5 px-4">
                      <ScoreBadge score={item.opportunityScore} label="Score" size="sm" showMeter />
                    </td>
                    <td className="py-3.5 px-4">
                      <Link href={`/opportunity/${item.id}`} className="font-semibold text-slate-200 group-hover:text-sky-300 transition-colors line-clamp-1">
                        {item.title}
                      </Link>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span>by {item.creator || "Unknown"}</span>
                        <span>•</span>
                        <span className="text-slate-400">{item.source}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="capitalize px-2.5 py-1 rounded-lg bg-slate-900 text-[11px] font-medium text-slate-300 border border-slate-800">
                        {item.contentType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-200 font-medium">{item.primaryTopic}</div>
                      <div className="text-[10px] text-slate-400">{item.primaryDomain}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/opportunity/${item.id}`}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-sky-600 text-slate-300 hover:text-white inline-flex items-center transition-colors border border-slate-800"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar: Top Content -> Book + Top Creators + Emerging Topics */}
        <div className="space-y-6">
          {/* Top Content -> Book */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-emerald-400" />
                <span>Top Content → Book</span>
              </h3>
              <span className="text-[11px] text-emerald-400 font-semibold">Courses & Series</span>
            </div>

            <div className="space-y-3">
              {topContentToBook.map((item) => (
                <Link
                  key={item.id}
                  href={`/opportunity/${item.id}`}
                  className="block p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-sky-300 line-clamp-1">
                      {item.title}
                    </span>
                    <ScoreBadge score={item.bookPotentialScore} label="Book Pot." size="sm" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">by {item.creator}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Top Creators */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4.5 h-4.5 text-amber-400" />
                <span>Top Authors / Creators</span>
              </h3>
              <span className="text-[11px] text-amber-400 font-semibold">High Authority</span>
            </div>

            <div className="space-y-3">
              {topCreatorsList.map((creator) => (
                <Link
                  key={creator.id}
                  href={`/creator/${creator.id}`}
                  className="block p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-sky-300">
                      {creator.name}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      Auth: {creator.creatorAuthorityScore}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {creator.primaryTopics.join(", ")}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Emerging Topics */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4.5 h-4.5 text-rose-400" />
                <span>Emerging Topics</span>
              </h3>
              <span className="text-[11px] text-rose-400 font-semibold">Low Book Density</span>
            </div>

            <div className="space-y-2.5">
              {emergingTopicsList.map((et) => (
                <div
                  key={et.topic}
                  className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">{et.topic}</span>
                    <span className="text-[10px] text-slate-400">
                      {et.contentCount} items • {et.booksCount} books
                    </span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-500/15 text-rose-300 border border-rose-500/30">
                    Gap: {et.gapScore}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
