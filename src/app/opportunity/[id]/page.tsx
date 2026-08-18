import Link from "next/link";
import { notFound } from "next/navigation";
import { MOCK_CONTENT_ITEMS } from "@/data/mockData";
import { generate570Opportunities } from "@/services/clientSearch";
import { Navbar } from "@/components/Navbar";
import { ScoreBadge, PublishingTypeBadge } from "@/components/ScoreBadge";
import {
  BookOpen,
  User,
  ExternalLink,
  Sparkles,
  Award,
  TrendingUp,
  Target,
  FileText,
  ShieldCheck,
  ArrowLeft,
  Calendar,
  Eye
} from "lucide-react";

export function generateStaticParams() {
  const allItems = [...generate570Opportunities(), ...MOCK_CONTENT_ITEMS];
  return allItems.map((item) => ({
    id: item.id,
  }));
}

interface OpportunityDetailPageProps {
  params: { id: string };
}

export default function OpportunityDetailPage({ params }: OpportunityDetailPageProps) {
  const allItems = [...generate570Opportunities(), ...MOCK_CONTENT_ITEMS];
  const item = allItems.find((i) => i.id === params.id) || allItems[0];

  if (!item) {
    notFound();
  }

  const isBook = item.contentType === "book";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Navigation back button */}
        <Link
          href="/pubintel-ai/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-sky-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing Page Opportunities</span>
        </Link>

        {/* Hero Header */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-sky-500/15 text-sky-300 text-xs font-bold border border-sky-500/30 capitalize">
                {item.contentType.replace("_", " ")}
              </span>
              <span className="text-xs text-slate-400">via {item.source}</span>
            </div>

            <div className="flex items-center gap-2">
              {!isBook && (
                <ScoreBadge score={item.bookPotentialScore} label="Book Potential" size="lg" showMeter />
              )}
              <ScoreBadge score={item.opportunityScore} label="Opportunity Score" size="lg" showMeter />
            </div>
          </div>

          <div>
            <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {item.title}
            </h1>
            {item.subtitle && (
              <p className="text-sm sm:text-base text-slate-300 italic mt-2">{item.subtitle}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300 pt-4 border-t border-slate-800">
            {item.creator && (
              <Link
                href={`/creator/${item.creatorId || item.id}`}
                className="flex items-center gap-1.5 text-sky-300 hover:underline font-semibold"
              >
                <User className="w-4 h-4" />
                <span>Creator: {item.creator}</span>
              </Link>
            )}

            {item.publicationDate && (
              <div className="flex items-center gap-1.5 text-slate-400">
                <Calendar className="w-4 h-4" />
                <span>Published: {item.publicationDate}</span>
              </div>
            )}

            {isBook && <PublishingTypeBadge type={item.publishingType} />}

            {item.views && (
              <div className="flex items-center gap-1 text-slate-400">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>{item.views.toLocaleString()} views</span>
              </div>
            )}

            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-colors"
            >
              <span>Open Source URL</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 6 Editorial Scores Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="glass-card rounded-2xl p-4 border border-slate-800 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Opportunity Score</span>
            <span className="font-heading text-2xl font-black text-emerald-400 font-mono">{item.opportunityScore || 0}</span>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-slate-800 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Prof. Relevance</span>
            <span className="font-heading text-2xl font-black text-sky-300 font-mono">{item.professionalRelevanceScore || 0}</span>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-slate-800 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Book Potential</span>
            <span className="font-heading text-2xl font-black text-purple-400 font-mono">{item.bookPotentialScore || 0}</span>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-slate-800 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Demand Score</span>
            <span className="font-heading text-2xl font-black text-blue-400 font-mono">{item.demandScore || 0}</span>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-slate-800 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Competitive Gap</span>
            <span className="font-heading text-2xl font-black text-amber-400 font-mono">{item.competitiveGapScore || 0}</span>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-slate-800 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Creator Authority</span>
            <span className="font-heading text-2xl font-black text-indigo-400 font-mono">{item.creatorAuthorityScore || 0}</span>
          </div>
        </div>

        {/* Classification & Metadata Box */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <h2 className="font-heading text-base font-bold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-sky-400" />
            <span>Taxonomy & Classification Metadata</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">Primary Domain:</span>
              <span className="font-semibold text-sky-300 bg-sky-950/60 px-2.5 py-1 rounded-lg border border-sky-800/60 inline-block">
                {item.primaryDomain || "Artificial Intelligence"}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Category & Topic:</span>
              <span className="font-semibold text-slate-200 block">{item.primaryCategory || "AI Core"}</span>
              <span className="text-slate-400">{item.primaryTopic || "Agentic AI"}</span>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Skill Level & Audience:</span>
              <span className="font-semibold text-slate-200 capitalize block">{item.skillLevel || "Intermediate"}</span>
              <span className="text-slate-400">{item.suggestedAudience || "Product Managers"}</span>
            </div>
          </div>
        </div>

        {/* Main Editorial Intelligence & Recommendations */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <h2 className="font-heading text-xl font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>Editorial Acquisition Recommendation</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Why this is interesting</span>
              </h3>
              <p className="text-slate-300 leading-relaxed">
                {item.opportunityReason || "High demand candidate with significant engagement and low existing book competition."}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-400" />
                <span>Possible Book Angle</span>
              </h3>
              <p className="text-sky-300 font-semibold leading-relaxed">
                {item.possibleBookAngle || "Definitive handbook for enterprise professionals."}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span>Existing Competition</span>
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Competitive Gap Score: <strong className="text-white">{item.competitiveGapScore}/100</strong>. High gap score indicates relatively limited recent book titles available in traditional distribution channels.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Creator Opportunity & Rights</span>
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Contactability: <strong className="text-emerald-400 capitalize">{item.creatorContactability || "High"}</strong>. Rights status: <strong className="text-slate-200">{item.rightsStatus || "Creator Owned"}</strong>.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
