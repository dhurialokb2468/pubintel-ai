import { ContentItem, PublishingType } from "../types/content";

export function calculateProfessionalRelevance(item: ContentItem): number {
  const text = `${item.title} ${item.subtitle || ""} ${item.description || ""}`.toLowerCase();
  
  let score = 70; // Base score

  // Professional usefulness keywords
  const highValueKeywords = [
    "practical", "guide", "handbook", "architecture", "strategy",
    "workflow", "implementation", "masterclass", "enterprise", "framework",
    "blueprint", "tutorial", "professional", "step-by-step", "case study"
  ];

  for (const kw of highValueKeywords) {
    if (text.includes(kw)) score += 3;
  }

  // Length/Depth signals
  if (item.durationMinutes && item.durationMinutes > 180) score += 5;
  if (item.videoCount && item.videoCount >= 10) score += 5;

  return Math.min(100, Math.max(30, score));
}

export function calculateBookPotential(item: ContentItem): { score: number; reason: string } {
  if (item.contentType === "book") {
    return { score: 0, reason: "Already published as a standalone book." };
  }

  const relevance = item.professionalRelevanceScore || calculateProfessionalRelevance(item);
  const videoCount = item.videoCount || 1;
  const duration = item.durationMinutes || 30;

  // Formula:
  // 25% relevance + 20% depth + 15% structure + 15% demand + 10% recency + 10% authority + 5% contactability
  const depthScore = Math.min(100, (duration / 300) * 100);
  const structureScore = Math.min(100, (videoCount / 12) * 100);
  const demand = item.demandScore || 75;
  const authority = item.creatorAuthorityScore || 80;

  const score = Math.round(
    0.25 * relevance +
    0.20 * depthScore +
    0.15 * structureScore +
    0.15 * demand +
    0.10 * 85 + // recency proxy
    0.10 * authority +
    0.05 * 80
  );

  const reason = `Strong candidate with ${videoCount} structured modules/lessons, substantial professional depth (${duration} total mins), and solid demand from ${item.creator || "the creator"}'s audience.`;

  return { score: Math.min(100, Math.max(10, score)), reason };
}

export function calculateDemandScore(item: ContentItem): number {
  if (item.contentType === "book") {
    const reviews = item.reviewCount || 10;
    const rating = item.rating || 4.0;
    return Math.min(100, Math.round(Math.log10(reviews + 1) * 25 + (rating / 5) * 20));
  } else {
    const views = item.views || 5000;
    const likes = item.likes || 100;
    return Math.min(100, Math.round(Math.log10(views + 1) * 15 + Math.log10(likes + 1) * 10));
  }
}

export function calculateCompetitiveGapScore(item: ContentItem, allItems: ContentItem[]): number {
  // Find books on similar topic
  const itemTopic = (item.primaryTopic || "").toLowerCase();
  const competingBooks = allItems.filter(
    (i) => i.contentType === "book" && (i.primaryTopic || "").toLowerCase() === itemTopic
  );

  const density = competingBooks.length;
  const demand = item.demandScore || 75;

  // Higher score = strong content demand + low book saturation
  const gap = Math.round(100 - density * 12 + demand * 0.3);
  return Math.min(100, Math.max(20, gap));
}

export function calculateOpportunityScore(item: ContentItem): { score: number; reason: string } {
  const demand = item.demandScore || 75;
  const gap = item.competitiveGapScore || 80;
  const bookPotential = item.bookPotentialScore || (item.contentType === "book" ? 50 : 85);
  const authority = item.creatorAuthorityScore || 80;

  // Formula: 30% demand, 25% competitive gap, 15% recency, 15% book potential, 10% authority, 5% differentiation
  const score = Math.round(
    0.30 * demand +
    0.25 * gap +
    0.15 * 85 +
    0.15 * bookPotential +
    0.10 * authority +
    0.05 * 80
  );

  const finalScore = Math.min(100, Math.max(10, score));
  const reason = `High opportunity (${finalScore}/100) driven by strong content demand, an open competitive gap in current publishing titles, and high creator authority.`;

  return { score: finalScore, reason };
}

export function classifyPublishingType(item: ContentItem): {
  type: PublishingType;
  confidence: number;
  reason: string;
} {
  if (item.contentType !== "book") {
    return { type: "unknown", confidence: 0, reason: "Content is not a printed/digital book." };
  }

  const publisher = (item.publisher || "").toLowerCase();

  if (
    publisher.includes("independently published") ||
    publisher.includes("kdp") ||
    publisher.includes("self") ||
    publisher.includes("leanpub") ||
    publisher.includes("lulu") ||
    publisher.includes("ingramspark")
  ) {
    return {
      type: "self_published",
      confidence: 95,
      reason: `Publisher explicitly listed as '${item.publisher}', indicating self-publishing/indie distribution.`
    };
  }

  const majorPublishers = ["wiley", "pearson", "oreilly", "o'reilly", "mcgraw-hill", "springer", "hapercollins", "simon & schuster", "routledge", "cambridge", "mit press"];
  for (const pub of majorPublishers) {
    if (publisher.includes(pub)) {
      return {
        type: "traditional",
        confidence: 95,
        reason: `Published by traditional trade/academic house (${item.publisher}).`
      };
    }
  }

  if (publisher.length > 0) {
    return {
      type: "independent_press",
      confidence: 80,
      reason: `Published by boutique or independent press (${item.publisher}).`
    };
  }

  return {
    type: "unknown",
    confidence: 30,
    reason: "Publisher information not specified."
  };
}

export function enrichItemWithScores(item: ContentItem, allItems: ContentItem[] = []): ContentItem {
  const relevance = calculateProfessionalRelevance(item);
  const demand = calculateDemandScore(item);
  const authority = item.creatorAuthorityScore || 85;

  const itemWithBase = {
    ...item,
    professionalRelevanceScore: relevance,
    demandScore: demand,
    creatorAuthorityScore: authority,
  };

  const gap = calculateCompetitiveGapScore(itemWithBase, allItems);
  itemWithBase.competitiveGapScore = gap;

  const bookPot = calculateBookPotential(itemWithBase);
  itemWithBase.bookPotentialScore = bookPot.score;
  itemWithBase.bookPotentialReason = bookPot.reason;

  const opp = calculateOpportunityScore(itemWithBase);
  itemWithBase.opportunityScore = opp.score;
  itemWithBase.opportunityReason = opp.reason;

  const pubClass = classifyPublishingType(itemWithBase);
  itemWithBase.publishingType = pubClass.type;
  itemWithBase.independentPublishingConfidence = pubClass.confidence;
  itemWithBase.publishingClassificationReason = pubClass.reason;

  return itemWithBase;
}
