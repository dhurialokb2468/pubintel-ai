"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { SavedSearch } from "@/types/filters";
import { Bookmark, Search, Play, Calendar, Trash2, Radar } from "lucide-react";

export default function SavedSearchesPage() {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/saved-searches")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSearches(data.savedSearches || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-radar-400 mb-1">
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span>Editorial Bookmarking</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Saved Editorial Searches</h1>
            <p className="text-xs text-slate-400 mt-1">Re-run stored search parameters to monitor evolving publishing opportunities.</p>
          </div>

          <Link
            href="/discover"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-radar-600 hover:bg-radar-500 text-white font-semibold text-xs transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Create New Search</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400">Loading saved searches...</div>
        ) : searches.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800 space-y-3">
            <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-200">No saved searches yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Run any query on the Discover or Results pages and click "Save Search" to bookmark it here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {searches.map((s) => {
              const queryParams = new URLSearchParams();
              if (s.query) queryParams.set("q", s.query);
              if (s.filters?.domain) queryParams.set("domain", s.filters.domain);
              if (s.filters?.audience) queryParams.set("audience", s.filters.audience);

              return (
                <div key={s.id} className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="font-bold text-base text-slate-100 line-clamp-1">{s.name}</h3>
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-radar-500/20 text-radar-300 border border-radar-500/30 rounded-md">
                        {s.resultCount || 0} results
                      </span>
                    </div>

                    <p className="text-xs font-mono text-radar-400">Query: "{s.query || "All Topics"}"</p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {s.filters?.domain && (
                        <span className="px-2 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded border border-slate-700">
                          Domain: {s.filters.domain}
                        </span>
                      )}
                      {s.filters?.audience && (
                        <span className="px-2 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded border border-slate-700">
                          Audience: {s.filters.audience}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(s.createdAt).toLocaleDateString()}</span>
                    </span>

                    <Link
                      href={`/results?${queryParams.toString()}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-radar-600 hover:bg-radar-500 text-white font-semibold transition-colors"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Re-Run Radar</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
