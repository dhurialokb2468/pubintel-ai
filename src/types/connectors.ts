import { ContentItem } from "./content";
import { SearchFilters } from "./filters";

export interface SourceConnector {
  sourceName: string;

  search(
    query: string,
    filters?: SearchFilters
  ): Promise<ContentItem[]>;
}
