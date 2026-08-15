import { ContentItem } from "./content";

export interface Creator {
  id: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  sourceProfiles: {
    platform: string;
    handle?: string;
    url: string;
    subscribersOrFollowers?: number;
  }[];
  primaryDomains: string[];
  primaryTopics: string[];
  contentItemIds: string[];
  topContentItems?: ContentItem[];
  audienceSignals: {
    totalViews?: number;
    avgEngagementRate?: number;
    estimatedAudienceSize?: string;
  };
  creatorAuthorityScore: number;
  avgBookPotentialScore: number;
  creatorOpportunityScore: number;
  potentialBookTopics: string[];
  suggestedBookAngles?: string[];
  creatorContactability: "high" | "medium" | "low" | "unknown";
  publicContactRoute?: string;
  firstSeenAt: string;
  updatedAt: string;
}
