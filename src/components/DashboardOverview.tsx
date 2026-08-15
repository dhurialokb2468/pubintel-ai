"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MOCK_CONTENT_ITEMS, MOCK_CREATORS } from "@/data/mockData";
import { INITIAL_DOMAINS } from "@/data/taxonomy";
import { ContentCard } from "./ContentCard";
import { ScoreBadge } from "./ScoreBadge";
import { executeClientSideSearch } from "@/services/clientSearch";
import { exportItemsToCSV } from "@/services/csvExporter";
import {
  Search,
  Sparkles,
  BookOpen,
  User,
  Flame,
  TrendingUp,
  ArrowRight,
  Zap,
  Filter,
  ArrowUpDown,
  Download,
  CheckCircle2,
  ListVideo
} from "lucide-react";

export function DashboardOverview() {
  const router = useRouter();
  const [heroQuery, setHeroQuery] = useState("");
  const [items, setItems] = useState(MOCK_CONTENT_ITEMS);
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<"all" | "content_to_book" | "books">("all");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [sortBy, setSortBy] = useState<"opportunityScore" | "bookPotentialScore" | "demandScore" | "creatorAuthorityScore">("opportunityScore");

  const loadAllOpportunities = async (q = "") => {
    setLoading(true);
    try {
      const data = await executeClientSideSearch(q, {
        domain: selectedDomain,
        sortBy
      });
      if (data.results && data.results.length > 0) {
        setItems(data.results);
      }
    } catch (e) {
      console.warn("Error loading opportunities:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllOpportunities(heroQuery);
  }, [heroQuery, selectedDomain, sortBy]);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroQuery.trim()) return;
    loadAllOpportunities(heroQuery.trim());
  };

  const booksResults = items.filter((i) => i.contentType === "book");
  const contentToBookResults = items.filter((i) => i.contentType !== "book");

  let displayedList = items;
  if (activeTab === "books") displayedList = booksResults;
  if (activeTab === "content_to_book") displayedList = contentToBookResults;

  const topicChips = [
    { title: "Agentic AI for PMs", query: "Agentic AI for Product Managers" },
    { title: "Model Context Protocol", query: "Model Context Protocol" },
    { title: "Algorithmic Trading", query: "Algorithmic Trading with Python" },
    { title: "AI Sound Design", query: "AI Sound Design" },
    { title: "DaVinci Resolve", query: "DaVinci Resolve AI Video Editing" },
    { title: "Salesforce Agentforce", query: "Salesforce Agentforce" },
    { title: "n8n Automation", query: "AI Automation with n8n" },
    { title: "Copilot Excel", query: "Copilot Excel Financial Modeling" },
  ];

  return (
    <div className="space-y-10">
      {/* Hero Banner with Integrated Search */}
      <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden glass-panel border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Publishing Intelligence Engine</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Discover Untapped <span className="gradient-text">Book & Content</span> Opportunities
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Scan Open Library, Google Books, YouTube, and imported catalogs across 50+ professional domains to uncover non-fiction book candidate topics and expert creators.
          </p>

          {/* Hero Search Box */}
          <form onSubmit={handleHeroSearch} className="pt-2">
            <div className="relative max-w-2xl">
              <input
                type="text"
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                placeholder="Search any professional topic (e.g. Agentic AI, Algorithmic Trading)..."
                className="w-full pl-12 pr-36 py-4 rounded-2xl glass-input text-sm sm:text-base text-white placeholder-slate-400 font-medium shadow-inner"
              />
              <Search className="w-5 h-5 text-sky-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-sky-500/20 transition-all flex items-center gap-1.5"
              >
                <span>Investigate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* 1-Click Topic Chips */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Popular Research Chips:</span>
            <div className="flex flex-wrap gap-2">
              {topicChips.map((chip) => (
                <button
                  key={chip.title}
                  onClick={() => {
                    setHeroQuery(chip.query);
                    loadAllOpportunities(chip.query);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-800 hover:border-sky-500/50 hover:text-sky-300 transition-all flex items-center gap-1.5"
                >
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span>{chip.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-slate-800 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Discovered Items</span>
          <span className="font-heading text-2xl font-black text-emerald-400 font-mono">{items.length}</span>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-slate-800 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Domains Tracked</span>
          <span className="font-heading text-2xl font-black text-sky-300 font-mono">50+</span>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-slate-800 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Connectors</span>
          <span className="font-heading text-2xl font-black text-purple-400 font-mono">5 Sources</span>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-slate-800 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Top Creators</span>
          <span className="font-heading text-2xl font-black text-amber-400 font-mono">{MOCK_CREATORS.length}</span>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-slate-800 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Avg Potential</span>
          <span className="font-heading text-2xl font-black text-blue-400 font-mono">88/100</span>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-slate-800 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Content Leads</span>
          <span className="font-heading text-2xl font-black text-indigo-400 font-mono">{contentToBookResults.length}</span>
        </div>
      </div>

      {/* Main Opportunities Grid Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Sourced Discovered Opportunities ({items.length})</span>
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-white mt-1">
              All Discovered Publishing Opportunities
            </h2>
            <p className="text-xs text-slate-400">Click any opportunity card to open its direct external source URL.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => exportItemsToCSV(items, "all-opportunities.csv")}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-600/30 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Tab Selection Bar & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "all"
                  ? "bg-sky-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>All Opportunities ({items.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("content_to_book")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "content_to_book"
                  ? "bg-sky-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Content → Book ({contentToBookResults.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("books")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "books"
                  ? "bg-sky-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <BookOpen className="w-4 h-4 text-blue-300" />
              <span>Existing Books ({booksResults.length})</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="bg-transparent text-slate-200 focus:outline-none font-medium"
              >
                <option value="" className="bg-slate-900">All 50+ Domains</option>
                {INITIAL_DOMAINS.map((d) => (
                  <option key={d} value={d} className="bg-slate-900">{d}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent text-slate-200 focus:outline-none font-medium"
              >
                <option value="opportunityScore" className="bg-slate-900">Sort by Opportunity Score</option>
                <option value="bookPotentialScore" className="bg-slate-900">Sort by Book Potential</option>
                <option value="demandScore" className="bg-slate-900">Sort by Demand</option>
                <option value="creatorAuthorityScore" className="bg-slate-900">Sort by Creator Authority</option>
              </select>
            </div>
          </div>
        </div>

        {/* Opportunity Card Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-400">Sourcing opportunities across all 5 connectors...</p>
          </div>
        ) : displayedList.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-200">No matching opportunities found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Try adjusting your query or resetting the domain filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedList.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Top Discovered Creators */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-purple-400" />
            <h2 className="font-heading text-lg sm:text-xl font-extrabold text-white">
              Discovered Creators with High Book Potential
            </h2>
          </div>
          <Link href="/discover" className="text-xs font-semibold text-sky-400 hover:underline">
            Search Creators →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {MOCK_CREATORS.map((creator) => (
            <Link
              key={creator.id}
              href={`/creator/${creator.id}`}
              className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-purple-500/50 transition-all group space-y-3 block"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-lg">
                  {creator.name.charAt(0)}
                </div>
                <ScoreBadge score={creator.creatorOpportunityScore} label="Opportunity" size="sm" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-white group-hover:text-purple-300 transition-colors">
                  {creator.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{creator.bio}</p>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Authority: <strong className="text-slate-200">{creator.creatorAuthorityScore}</strong></span>
                <span>Reach: <strong className="text-slate-200">{creator.audienceSignals?.estimatedAudienceSize || "100k+"}</strong></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
