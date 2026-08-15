import { SourceConnector } from "../types/connectors";
import { ContentItem } from "../types/content";
import { SearchFilters } from "../types/filters";
import { getAllContentItems } from "../services/firestore";

export class ImportedContentConnector implements SourceConnector {
  sourceName = "Imported Content";

  async search(query: string, filters?: SearchFilters): Promise<ContentItem[]> {
    const all = await getAllContentItems();
    const qLower = query.toLowerCase();

    return all.filter(
      (item) => item.contentType !== "book" && (
        item.source.includes("Imported") ||
        item.title.toLowerCase().includes(qLower) ||
        (item.primaryTopic || "").toLowerCase().includes(qLower) ||
        (item.primaryDomain || "").toLowerCase().includes(qLower)
      )
    );
  }
}
