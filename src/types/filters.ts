import { ContentItem } from "./content";

export interface SearchFilters {
  domain?: string;
  audience?: string;
  contentType?: string;
  dateRange?: string; // "6_months" | "12_months" | "24_months" | "36_months" | "5_years" | "any"
  sources?: string[]; // "google_books", "youtube", "imported_books", "imported_content"
  minOpportunityScore?: number;
  broadRadar?: boolean;
  sortBy?: "opportunityScore" | "bookPotentialScore" | "demandScore" | "date" | "creatorAuthorityScore";
  sortOrder?: "asc" | "desc";
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: SearchFilters;
  createdAt: string;
  lastRunAt?: string;
  resultCount?: number;
}
