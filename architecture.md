# Opportunity Radar - Technical Architecture & Pipeline Specification

## 1. System Overview

Opportunity Radar is built as a lightweight, high-performance Next.js application using server-side API routes to execute connector searches, multi-factor scoring algorithms, deduplication, and AI enrichment.

```text
User Search / CSV Ingestion
            │
            ▼
 ┌──────────────────────┐
 │   Query Expansion    │  (Generates parallel sub-topic search queries)
 └──────────┬───────────┘
            │
            ▼
 ┌──────────────────────┐
 │   Source Connectors  │  (Google Books, YouTube API v3, CSV Imports, Mock Engine)
 └──────────┬───────────┘
            │
            ▼
 ┌──────────────────────┐
 │ ContentItem Model    │  (Normalizes raw metadata into unified standard)
 └──────────┬───────────┘
            │
            ▼
 ┌──────────────────────┐
 │ Deduplication Engine │  (Matches ISBN-13, ISBN-10, ASIN, normalized Title + Author)
 └──────────┬───────────┘
            │
            ▼
 ┌──────────────────────┐
 │ Taxonomy Classifier  │  (Hierarchical mapping: Domain -> Category -> Topic -> Tools)
 └──────────┬───────────┘
            │
            ▼
 ┌──────────────────────┐
 │ Multi-Factor Scoring │  (Relevance, Book Potential, Demand, Gap, Opportunity)
 └──────────┬───────────┘
            │
            ▼
 ┌──────────────────────┐
 │ Gemini AI Enrichment │  (Book angles, rationale, target audience, publishing status)
 └──────────┬───────────┘
            │
            ▼
 ┌──────────────────────┐
 │ Firestore / Memory   │  (Caches enriched items & creator entities)
 └──────────────────────┘
```

---

## 2. Common Data Model (`ContentItem`)

```typescript
type ContentType =
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

type PublishingType =
  | "self_published"
  | "independent_press"
  | "traditional"
  | "unknown";

interface ContentItem {
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
  rightsStatus?: "unknown" | "creator_owned" | "permission_required" | "licensed";
  firstDiscoveredAt: string;
  lastSeenAt: string;
}
```

---

## 3. Scoring Mathematics

### 3.1 Professional Relevance Score (0–100)
Calculates practical applicability for professional book readers:
$$\text{Relevance} = 0.35 \times \text{Depth} + 0.30 \times \text{Practicality} + 0.20 \times \text{AudienceClarity} + 0.15 \times \text{TopicCoherence}$$

### 3.2 Book Potential Score (0–100) [for Content $\rightarrow$ Book]
$$\text{BookPotential} = 0.25 \times \text{Relevance} + 0.20 \times \text{Depth} + 0.15 \times \text{Structure} + 0.15 \times \text{Demand} + 0.10 \times \text{Recency} + 0.10 \times \text{Authority} + 0.05 \times \text{Contactability}$$

### 3.3 Competitive Gap Score (0–100)
$$\text{CompetitiveGap} = \min\left(100, \max\left(0, 100 - (\text{CompetingBookDensity} \times 15) + (\text{ContentDemandScore} \times 0.4)\right)\right)$$

### 3.4 Composite Opportunity Score (0–100)
$$\text{OpportunityScore} = 0.30 \times \text{Demand} + 0.25 \times \text{CompetitiveGap} + 0.15 \times \text{Momentum} + 0.15 \times \text{BookPotential} + 0.10 \times \text{Authority} + 0.05 \times \text{Differentiation}$$

---

## 4. Source Connector Architecture

All data connectors implement the standard interface:

```typescript
interface SearchFilters {
  domain?: string;
  audience?: string;
  contentType?: string;
  dateRange?: string;
  minOpportunityScore?: number;
  broadRadar?: boolean;
}

interface SourceConnector {
  sourceName: string;
  search(query: string, filters?: SearchFilters): Promise<ContentItem[]>;
}
```
