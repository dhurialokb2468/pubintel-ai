"use client";

import Link from "next/link";
import { ContentItem } from "@/types/content";
import { ScoreBadge, PublishingTypeBadge } from "./ScoreBadge";
import {
  BookOpen,
  Video,
  ListVideo,
  GraduationCap,
  ExternalLink,
  User,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Eye,
  Star
} from "lucide-react";

interface ContentCardProps {
  item: ContentItem;
}

export function ContentCard({ item }: ContentCardProps) {
  const isBook = item.contentType === "book";

  const getContentTypeIcon = () => {
    switch (item.contentType) {
      case "book":
        return <BookOpen className="w-3.5 h-3.5 text-sky-400" />;
      case "playlist":
        return <ListVideo className="w-3.5 h-3.5 text-purple-400" />;
      case "video":
        return <Video className="w-3.5 h-3.5 text-rose-400" />;
      case "course":
      case "tutorial":
        return <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // If user clicked internal analysis link or creator link, don't trigger external redirect
    const target = e.target as HTMLElement;
    if (target.closest("a") || target.closest("button")) return;

    if (item.url) {
      window.open(item.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="glass-card rounded-2xl p-5 flex flex-col justify-between group relative overflow-hidden cursor-pointer hover:border-sky-500/50 transition-all"
      title={`Click to open external source: ${item.source}`}
    >
      {/* Decorative top accent glow line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Header Badges & Source */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 text-xs font-semibold text-slate-300 border border-slate-700/60">
              {getContentTypeIcon()}
              <span className="capitalize">{item.contentType.replace("_", " ")}</span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium">via {item.source}</span>
          </div>

          <div className="flex items-center gap-2">
            {!isBook && (
              <ScoreBadge score={item.bookPotentialScore} label="Book Pot." size="sm" />
            )}
            <ScoreBadge score={item.opportunityScore} label="Opportunity" size="sm" />
          </div>
        </div>

        {/* Thumbnail Preview & Title */}
        <div className="flex gap-4">
          {item.imageUrl && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-16 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 relative group-hover:scale-105 transition-transform block"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </a>
          )}

          <div className="flex-1 min-w-0">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group-hover:text-sky-300 transition-colors inline-flex items-start gap-1"
            >
              <h3 className="font-heading font-bold text-base text-slate-100 line-clamp-2 leading-snug">
                {item.title}
              </h3>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
            </a>

            {item.subtitle && (
              <p className="text-xs text-slate-400 mt-1 line-clamp-1 italic">{item.subtitle}</p>
            )}

            {/* Creator & Publishing Metadata */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs">
              {item.creator && (
                <Link
                  href={`/creator/${item.creatorId || item.id}`}
                  className="flex items-center gap-1 text-sky-400 hover:underline font-semibold"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="truncate">{item.creator}</span>
                </Link>
              )}

              {isBook && <PublishingTypeBadge type={item.publishingType} />}
            </div>
          </div>
        </div>

        {/* Description snippet */}
        {item.description && (
          <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}

        {/* Performance Signals (Views / Likes / Ratings) */}
        <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px] text-slate-400 font-medium">
          {item.views && (
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>{item.views.toLocaleString()} views</span>
            </span>
          )}
          {item.rating && (
            <span className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{item.rating} ({item.reviewCount || 0})</span>
            </span>
          )}
          {item.durationMinutes && (
            <span className="text-slate-500">• {item.durationMinutes} mins total</span>
          )}
        </div>

        {/* Domain & Topic Chips */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3.5">
          {item.primaryDomain && (
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-sky-950/70 text-sky-300 border border-sky-800/60 rounded-md">
              {item.primaryDomain}
            </span>
          )}
          {item.primaryTopic && (
            <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-slate-900 text-slate-300 border border-slate-700/60 rounded-md">
              {item.primaryTopic}
            </span>
          )}
        </div>
      </div>

      {/* Footer Editorial Rationale */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-300 truncate max-w-[70%]">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span className="truncate font-medium">{item.opportunityReason || "High publishing candidate"}</span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 px-2 py-1 rounded-lg border border-slate-700 transition-colors"
          >
            <span>Open Source</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          <Link
            href={`/opportunity/${item.id}`}
            className="flex items-center gap-1 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors flex-shrink-0"
          >
            <span>Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
