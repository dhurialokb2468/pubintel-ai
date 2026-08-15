"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ContentCard } from "@/components/ContentCard";
import { ContentItem } from "@/types/content";
import { INITIAL_DOMAINS, AUDIENCE_TYPES } from "@/data/taxonomy";
import {
  BookOpen,
  Sparkles,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Bookmark,
  RefreshCw,
  Zap,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("q") || "";
  const domainParam = searchParams.get("domain") || "";
  const audienceParam = searchParams.get("audience") || "";
  const typeParam = searchParams.get("type") || "";
  const broadParam = searchParams.get("broad") === "1";

  const [activeTab, setActiveTab] = useState<"content_to_book" | "books">("content_to_book");

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<ContentItem[]>([]);
  const [sourceStatus, setSourceStatus] = useState<Record<string, any>>({});
  const [totalDiscovered, setTotalDiscovered] = useState(0);

  // Filters & Sorting state
  const [domainFilter, setDomainFilter] = useState(domainParam);
  const [audienceFilter, setAudienceFilter] = useState(audienceParam);
  const [contentTypeFilter, setContentTypeFilter] = useState(typeParam);
  const [minScore, setMinScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"opportunityScore" | "bookPotentialScore" | "demandScore" | "date" | "creatorAuthorityScore">("opportunityScore");

  const [savingSearch, setSavingSearch] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          filters: {
            domain: domainFilter,
            audience: audienceFilter,
            contentType: contentTypeFilter,
            minOpportunityScore: minScore,
            broadRadar: broadParam,
            sortBy,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResults(data.results || []);
        setSourceStatus(data.sourceStatus || {});
        setTotalDiscovered(data.totalDiscovered || 0);
      }
    } catch (err) {
      console.error("Search fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [query, domainFilter, audienceFilter, contentTypeFilter, minScore, sortBy]);

  const booksResults = results.filter((i) => i.contentType === "book");
  const contentToBookResults = results.filter((i) => i.contentType !== "book");

  const displayedList = activeTab === "books" ? booksResults : contentToBookResults;

  const handleSaveSearch = async () => {
    setSavingSearch(true);
    try {
      await fetch("/api/saved-searches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: query || domainFilter || "Custom Opportunity Radar Search",
          query,
          filters: { domain: domainFilter, audience: audienceFilter, contentType: contentTypeFilter },
          resultCount: results.length,
        }),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error("Save search failed:", e);
    } finally {
      setSavingSearch(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-radar-400 mb-1">
            <Search className="w-3.5 h-3.5" />
            <span>Editorial Intelligence Search</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <span>Query:</span>
            <span className="text-radar-300">"{query || "All Professional Topics"}"</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Discovered {totalDiscovered} total opportunities across 4 sources ({booksResults.length} books, {contentToBookResults.length} content leads)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveSearch}
            disabled={savingSearch}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span>{savedSuccess ? "Search Saved!" : "Save Search"}</span>
          </button>
          <a
            href="/api/export"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-radar-600 hover:bg-radar-500 text-white text-xs font-semibold shadow-md shadow-radar-600/30 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Source Connector Execution Status Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {Object.entries(sourceStatus).map(([sourceName, status]: [string, any]) => (
          <div
            key={sourceName}
            className={`p-3 rounded-xl border flex items-center justify-between ${
              status.success
                ? "bg-slate-900/60 border-slate-800 text-slate-300"
                : "bg-amber-950/20 border-amber-800/40 text-amber-300"
            }`}
          >
            <div className="flex items-center gap-2">
              {status.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400" />
              )}
              <span className="font-medium">{sourceName}</span>
            </div>
            <span className="font-mono font-bold">{status.count || 0}</span>
          </div>
        ))}
      </div>

      {/* Main Tabs (Books vs Content -> Book) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("content_to_book")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "content_to_book"
                ? "bg-radar-600 text-white shadow-md"
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
                ? "bg-radar-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-300" />
            <span>Existing Books ({booksResults.length})</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none font-medium"
            >
              <option value="" className="bg-slate-900">All Domains</option>
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

      {/* Grid of Results */}
      {loading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-radar-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-400">Running multi-factor scoring engine across enabled sources...</p>
        </div>
      ) : displayedList.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-200">No matching opportunities found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
            Try adjusting your query or expanding your filter parameters on the Discover page.
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
  );
}

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Suspense fallback={<div className="text-center py-20">Loading results...</div>}>
          <ResultsContent />
        </Suspense>
      </main>
    </div>
  );
}
