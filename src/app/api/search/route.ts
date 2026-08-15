import { NextRequest, NextResponse } from "next/server";
import { CONNECTORS } from "@/connectors/base";
import { expandQuery } from "@/services/queryExpansion";
import { deduplicateContentItems } from "@/services/deduplication";
import { enrichWithGemini } from "@/services/gemini";
import { saveContentItems, getAllContentItems } from "@/services/firestore";
import { SearchFilters } from "@/types/filters";
import { ContentItem } from "@/types/content";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const queryStr = (body.query || "").trim();
    const filters: SearchFilters = body.filters || {};

    let queriesToSearch = [queryStr];
    if (queryStr) {
      queriesToSearch = expandQuery(queryStr);
    }

    const enabledSources = filters.sources && filters.sources.length > 0
      ? filters.sources
      : ["google_books", "open_library", "youtube", "imported_books", "imported_content"];

    const rawResults: ContentItem[] = [];
    const sourceStatus: Record<string, { success: boolean; count: number; error?: string }> = {};

    // Parallel connector execution across all enabled sources
    await Promise.all(
      enabledSources.map(async (srcKey) => {
        const connector = CONNECTORS[srcKey];
        if (!connector) return;

        let srcCount = 0;
        try {
          for (const q of queriesToSearch) {
            const items = await connector.search(q, filters);
            rawResults.push(...items);
            srcCount += items.length;
          }
          sourceStatus[connector.sourceName] = { success: true, count: srcCount };
        } catch (err: any) {
          console.warn(`Source ${srcKey} failed:`, err);
          sourceStatus[connector.sourceName] = {
            success: false,
            count: 0,
            error: err.message || "Source unavailable",
          };
        }
      })
    );

    // Combine with stored repository items to maximize yield
    const stored = await getAllContentItems();
    rawResults.push(...stored);

    // Deduplicate across all fetched items
    const unique = deduplicateContentItems(rawResults);

    // Multi-factor scoring & AI Enrichment
    const enrichedItems = await Promise.all(unique.map((item) => enrichWithGemini(item)));

    // Save to Firestore / local memory store
    await saveContentItems(enrichedItems);

    // Apply User Filters
    let filtered = enrichedItems;

    if (filters.domain) {
      filtered = filtered.filter((i) => (i.primaryDomain || "").toLowerCase() === filters.domain?.toLowerCase());
    }
    if (filters.contentType) {
      filtered = filtered.filter((i) => i.contentType === filters.contentType);
    }
    if (filters.minOpportunityScore) {
      filtered = filtered.filter((i) => (i.opportunityScore || 0) >= (filters.minOpportunityScore || 0));
    }

    // Sort by Opportunity Score or selected criteria
    const sortBy = filters.sortBy || "opportunityScore";
    filtered.sort((a, b) => {
      const valA = (a as any)[sortBy] || 0;
      const valB = (b as any)[sortBy] || 0;
      return valB - valA;
    });

    return NextResponse.json({
      success: true,
      totalDiscovered: enrichedItems.length,
      filteredCount: filtered.length,
      queriesExecuted: queriesToSearch,
      sourceStatus,
      results: filtered,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Search failed" },
      { status: 500 }
    );
  }
}
