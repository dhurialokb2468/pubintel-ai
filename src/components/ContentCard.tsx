"use client";

import Link from "next/link";
import Image from "next/image";
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

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col justify-between group relative overflow-hidden">
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
            <span className="text-[11px] text-slate-400 font-medium">{item.source}</span>
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
            <div className="w-16 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 relative group-hover:scale-105 transition-transform">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <Link href={`/opportunity/${item.id}`} className="group-hover:text-sky-300 transition-colors">
              <h3 className="font-heading font-bold text-base text-slate-100 line-clamp-2 leading-snug">
                {item.title}
              </h3>
            </Link>
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
        <div className="flex items-center gap-1.5 text-slate-300 truncate max-w-[75%]">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span className="truncate font-medium">{item.opportunityReason || "High publishing candidate"}</span>
        </div>

        <Link
          href={`/opportunity/${item.id}`}
          className="flex items-center gap-1 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors flex-shrink-0"
        >
          <span>Analysis</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
