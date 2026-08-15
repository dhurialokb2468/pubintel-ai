"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { INITIAL_DOMAINS, AUDIENCE_TYPES } from "@/data/taxonomy";
import { Search, SlidersHorizontal, Sparkles, Radar, ChevronDown, Check, Zap, ArrowRight, Flame } from "lucide-react";

export default function DiscoverPage() {
  const router = useRouter();

  const [query, setQuery] = useState("Agentic AI for Product Managers");
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [broadRadar, setBroadRadar] = useState(true);

  const [domain, setDomain] = useState("");
  const [audience, setAudience] = useState("");
  const [contentType, setContentType] = useState("");
  const [dateRange, setDateRange] = useState("24_months");
  const [sources, setSources] = useState<string[]>([
    "google_books",
    "open_library",
    "youtube",
    "imported_books",
    "imported_content"
  ]);

  const [isSearching, setIsSearching] = useState(false);

  const popularTopics = [
    { title: "Agentic AI for Product Managers", domain: "Artificial Intelligence" },
    { title: "Model Context Protocol", domain: "Artificial Intelligence" },
    { title: "Algorithmic Trading with Python", domain: "Trading & Markets" },
    { title: "AI Sound Design", domain: "Creative Technology" },
    { title: "DaVinci Resolve AI Video Editing", domain: "Creative Technology" },
    { title: "Salesforce Agentforce", domain: "Enterprise Products" },
    { title: "AI Automation with n8n", domain: "Automation" },
    { title: "AI Financial Modeling in Excel", domain: "Finance" },
  ];

  const handleSourceToggle = (srcKey: string) => {
    if (sources.includes(srcKey)) {
      if (sources.length > 1) {
        setSources(sources.filter((s) => s !== srcKey));
      }
    } else {
      setSources([...sources, srcKey]);
    }
  };

  const handleSearch = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const finalQuery = customQuery || query;
    if (!finalQuery.trim()) return;

    setIsSearching(true);

    const searchParams = new URLSearchParams();
    searchParams.set("q", finalQuery.trim());
    if (domain) searchParams.set("domain", domain);
    if (audience) searchParams.set("audience", audience);
    if (contentType) searchParams.set("type", contentType);
    if (dateRange) searchParams.set("date", dateRange);
    if (sources.length > 0) searchParams.set("sources", sources.join(","));
    if (broadRadar) searchParams.set("broad", "1");

    router.push(`/results?${searchParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 text-xs font-bold uppercase tracking-wider">
            <Radar className="w-4 h-4 text-sky-400 animate-radar-pulse" />
            <span>Publishing Intelligence Engine</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            What topic do you want to investigate?
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Search Google Books, Open Library, YouTube & imported datasets to discover self-published books, tutorial playlists, high-potential creators, and editorial gaps.
          </p>
        </div>

        {/* Search Input Box */}
        <form onSubmit={(e) => handleSearch(e)} className="space-y-6">
          <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-slate-800 shadow-2xl space-y-4">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Agentic AI for Product Managers, Algorithmic Trading with Python..."
                className="w-full pl-12 pr-36 py-4.5 rounded-2xl glass-input text-base sm:text-lg font-medium text-white placeholder-slate-400 shadow-inner"
              />
              <Search className="w-6 h-6 text-sky-400 absolute left-4 top-1/2 -translate-y-1/2" />

              <button
                type="submit"
                disabled={isSearching}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition-all flex items-center gap-2"
              >
                {isSearching ? (
                  <span>Searching...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Find Opportunities</span>
                  </>
                )}
              </button>
            </div>

            {/* Discovery Mode Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-slate-200">Maximized Opportunity Discovery Mode</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={broadRadar}
                  onChange={(e) => setBroadRadar(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-sky-500"
                />
                <span className="text-slate-300 font-medium">Broad Radar (Include Long-Tail Content)</span>
              </label>
            </div>
          </div>

          {/* 1-Click Popular Editorial Topics */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Popular Editorial Research Topics</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {popularTopics.map((topic) => (
                <button
                  key={topic.title}
                  type="button"
                  onClick={() => {
                    setQuery(topic.title);
                    handleSearch(undefined, topic.title);
                  }}
                  className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-left transition-all group flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-sky-300 block">
                      {topic.title}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{topic.domain}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Search Options */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-6">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full text-left font-bold text-sm text-slate-200"
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-sky-400" />
                <span>Advanced Search & Connector Parameters</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
            </button>

            {showAdvanced && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3 border-t border-slate-800/80">
                {/* Domain Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Professional Domain
                  </label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl glass-input text-xs font-medium text-slate-200"
                  >
                    <option value="" className="bg-slate-900">Any Domain (All 50+ Subjects)</option>
                    {INITIAL_DOMAINS.map((d) => (
                      <option key={d} value={d} className="bg-slate-900">{d}</option>
                    ))}
                  </select>
                </div>

                {/* Audience Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Target Audience
                  </label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl glass-input text-xs font-medium text-slate-200"
                  >
                    <option value="" className="bg-slate-900">Any Target Audience</option>
                    {AUDIENCE_TYPES.map((a) => (
                      <option key={a} value={a} className="bg-slate-900">{a}</option>
                    ))}
                  </select>
                </div>

                {/* Content Format Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Content Format
                  </label>
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl glass-input text-xs font-medium text-slate-200"
                  >
                    <option value="" className="bg-slate-900">All Formats</option>
                    <option value="book" className="bg-slate-900">Book (Printed / Digital)</option>
                    <option value="playlist" className="bg-slate-900">YouTube Playlist</option>
                    <option value="video" className="bg-slate-900">Video</option>
                    <option value="course" className="bg-slate-900">Course</option>
                    <option value="tutorial" className="bg-slate-900">Tutorial</option>
                    <option value="blog" className="bg-slate-900">Blog / Newsletter</option>
                    <option value="workshop" className="bg-slate-900">Workshop</option>
                  </select>
                </div>

                {/* Date Range Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Publication Date Range
                  </label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl glass-input text-xs font-medium text-slate-200"
                  >
                    <option value="6_months" className="bg-slate-900">Last 6 months</option>
                    <option value="12_months" className="bg-slate-900">Last 12 months</option>
                    <option value="24_months" className="bg-slate-900">Last 24 months</option>
                    <option value="36_months" className="bg-slate-900">Last 36 months</option>
                    <option value="5_years" className="bg-slate-900">Last 5 years</option>
                    <option value="any" className="bg-slate-900">Any Date</option>
                  </select>
                </div>

                {/* Enabled Sources Checkboxes */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Discovery Connectors Enabled (5 Sources)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {[
                      { key: "google_books", label: "Google Books" },
                      { key: "open_library", label: "Open Library" },
                      { key: "youtube", label: "YouTube" },
                      { key: "imported_books", label: "Imported Books" },
                      { key: "imported_content", label: "Imported Content" },
                    ].map((src) => {
                      const isChecked = sources.includes(src.key);
                      return (
                        <button
                          type="button"
                          key={src.key}
                          onClick={() => handleSourceToggle(src.key)}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                            isChecked
                              ? "bg-sky-500/20 border-sky-500 text-sky-200"
                              : "bg-slate-900/50 border-slate-800 text-slate-400"
                          }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${isChecked ? "bg-sky-500 border-sky-400 text-white" : "border-slate-700"}`}>
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                          <span className="truncate">{src.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
