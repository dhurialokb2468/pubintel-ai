import Link from "next/link";
import { notFound } from "next/navigation";
import { MOCK_CREATORS, MOCK_CONTENT_ITEMS } from "@/data/mockData";
import { Navbar } from "@/components/Navbar";
import { ContentCard } from "@/components/ContentCard";
import { ScoreBadge } from "@/components/ScoreBadge";
import { User, Award, ExternalLink, Mail, Sparkles, BookOpen, ArrowLeft, ShieldCheck } from "lucide-react";

export function generateStaticParams() {
  return MOCK_CREATORS.map((c) => ({
    id: c.id,
  }));
}

interface CreatorDetailPageProps {
  params: { id: string };
}

export default function CreatorDetailPage({ params }: CreatorDetailPageProps) {
  let creator = MOCK_CREATORS.find((c) => c.id === params.id) || MOCK_CREATORS[0];
  const creatorItems = MOCK_CONTENT_ITEMS.filter(
    (i) => i.creatorId === creator.id || (creator.name && i.creator === creator.name)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        <Link
          href="/pubintel-ai/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-sky-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing Page Opportunities</span>
        </Link>

        {/* Hero Creator Header */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-2xl font-black text-white shadow-lg">
                {creator.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">{creator.name}</h1>
                  <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Authority: {creator.creatorAuthorityScore}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">{creator.bio}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ScoreBadge score={creator.creatorOpportunityScore} label="Creator Opportunity" size="lg" showMeter />
            </div>
          </div>

          {/* Social / Platform Profiles */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800 text-xs">
            <span className="text-slate-400 font-semibold">Public Profiles:</span>
            {creator.sourceProfiles.map((prof, idx) => (
              <a
                key={idx}
                href={prof.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors"
              >
                <span>{prof.platform}</span>
                {prof.subscribersOrFollowers && (
                  <span className="text-slate-400">({prof.subscribersOrFollowers.toLocaleString()})</span>
                )}
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            ))}
          </div>
        </div>

        {/* Editorial Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Average Book Potential</span>
            </h3>
            <p className="font-heading text-3xl font-extrabold text-purple-300 font-mono">
              {creator.avgBookPotentialScore}/100
            </p>
            <p className="text-xs text-slate-400">Curriculum structure & depth evaluation</p>
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Audience Reach</span>
            </h3>
            <p className="font-heading text-3xl font-extrabold text-emerald-300 font-mono">
              {creator.audienceSignals?.estimatedAudienceSize || "150,000+"}
            </p>
            <p className="text-xs text-slate-400">Active professional learners</p>
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-sky-400" />
              <span>Public Contact Route</span>
            </h3>
            <p className="text-sm font-semibold text-sky-300 line-clamp-2">
              {creator.publicContactRoute || "Contact via LinkedIn / Public Email"}
            </p>
            <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Public metadata only</span>
            </p>
          </div>
        </div>

        {/* Potential Book Topics */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-3">
          <h2 className="font-heading text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-400" />
            <span>Potential Book Commissioning Topics</span>
          </h2>

          <div className="flex flex-wrap gap-2">
            {creator.potentialBookTopics.map((topic, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-sky-950/50 text-sky-300 text-xs font-semibold border border-sky-800/60"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Discovered Creator Content */}
        <div className="space-y-4">
          <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>Discovered Educational Content ({creatorItems.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {creatorItems.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
