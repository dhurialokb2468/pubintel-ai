import React from "react";
import { PublishingType } from "@/types/content";

interface ScoreBadgeProps {
  score?: number;
  label: string;
  size?: "sm" | "md" | "lg";
  showMeter?: boolean;
}

export function ScoreBadge({ score = 0, label, size = "md", showMeter = false }: ScoreBadgeProps) {
  let colorTheme = {
    badge: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    bar: "bg-sky-500",
    text: "text-sky-400"
  };

  if (score >= 88) {
    colorTheme = {
      badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-emerald-500/10",
      bar: "bg-gradient-to-r from-emerald-500 to-teal-400",
      text: "text-emerald-400"
    };
  } else if (score >= 75) {
    colorTheme = {
      badge: "bg-sky-500/15 text-sky-300 border-sky-500/30 shadow-sky-500/10",
      bar: "bg-gradient-to-r from-sky-500 to-indigo-400",
      text: "text-sky-400"
    };
  } else if (score >= 60) {
    colorTheme = {
      badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
      bar: "bg-gradient-to-r from-amber-500 to-orange-400",
      text: "text-amber-400"
    };
  } else {
    colorTheme = {
      badge: "bg-slate-800 text-slate-400 border-slate-700",
      bar: "bg-slate-600",
      text: "text-slate-400"
    };
  }

  const paddingStyle =
    size === "lg"
      ? "px-3.5 py-1.5 text-sm"
      : size === "sm"
      ? "px-2 py-0.5 text-[11px]"
      : "px-2.5 py-1 text-xs";

  return (
    <div className="inline-flex flex-col gap-1">
      <div className={`inline-flex items-center gap-1.5 rounded-lg border font-semibold font-mono ${colorTheme.badge} ${paddingStyle}`}>
        <span className="text-[10px] uppercase font-sans font-medium tracking-wider text-slate-400">{label}</span>
        <span className="font-bold">{score}</span>
      </div>
      {showMeter && (
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className={`h-full ${colorTheme.bar} rounded-full transition-all duration-500`} style={{ width: `${score}%` }} />
        </div>
      )}
    </div>
  );
}

export function PublishingTypeBadge({ type }: { type?: PublishingType }) {
  if (type === "self_published") {
    return (
      <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30">
        Self-Published
      </span>
    );
  }
  if (type === "independent_press") {
    return (
      <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
        Independent Press
      </span>
    );
  }
  if (type === "traditional") {
    return (
      <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
        Traditional Press
      </span>
    );
  }
  return (
    <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800/60 text-slate-400 border border-slate-800">
      Unknown Press
    </span>
  );
}
