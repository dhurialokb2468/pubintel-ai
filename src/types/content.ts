export type ContentType =
  | "book"
  | "video"
  | "playlist"
  | "course"
  | "tutorial"
  | "blog"
  | "workshop"
  | "repository"
  | "podcast"
  | "other";

export type PublishingType =
  | "self_published"
  | "independent_press"
  | "traditional"
  | "unknown";

export interface ContentItem {
  id: string;

  source: string;
  sourceId: string;

  contentType: ContentType;

  title: string;
  subtitle?: string;
  description?: string;

  creator?: string;
  creatorId?: string;

  url: string;
  imageUrl?: string;

  publicationDate?: string;

  publisher?: string;
  isbn10?: string;
  isbn13?: string;
  asin?: string;

  price?: number;
  currency?: string;

  rating?: number;
  reviewCount?: number;

  views?: number;
  likes?: number;
  comments?: number;

  durationMinutes?: number;
  videoCount?: number;

  primaryDomain?: string;
  secondaryDomains?: string[];

  primaryCategory?: string;
  primaryTopic?: string;
  secondaryTopics?: string[];

  audienceTypes?: string[];
  useCases?: string[];

  skillLevel?: "beginner" | "intermediate" | "advanced" | "mixed";

  professionalRelevanceScore?: number;

  publishingType?: PublishingType;
  independentPublishingConfidence?: number;
  publishingClassificationReason?: string;

  bookPotentialScore?: number;
  bookPotentialReason?: string;

  demandScore?: number;
  creatorAuthorityScore?: number;
  competitiveGapScore?: number;

  opportunityScore?: number;
  opportunityReason?: string;

  suggestedAudience?: string;
  possibleBookAngle?: string;

  creatorContactability?: "high" | "medium" | "low" | "unknown";

  rightsStatus?:
    | "unknown"
    | "creator_owned"
    | "permission_required"
    | "licensed";

  firstDiscoveredAt: string;
  lastSeenAt: string;
}
