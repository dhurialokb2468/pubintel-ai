import { NextRequest, NextResponse } from "next/server";
import { saveContentItems } from "@/services/firestore";
import { enrichWithGemini } from "@/services/gemini";
import { ContentItem } from "@/types/content";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { importType, records } = body;

    if (!records || !Array.isArray(records)) {
      return NextResponse.json({ success: false, error: "Invalid record data" }, { status: 400 });
    }

    let importedCount = 0;
    let duplicatesSkipped = 0;
    let errorCount = 0;
    const importedItems: ContentItem[] = [];

    for (const record of records) {
      try {
        if (!record.title) {
          errorCount++;
          continue;
        }

        const isBook = importType.includes("book") || importType.includes("amazon") || importType.includes("leanpub");
        
        const item: ContentItem = {
          id: `import-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          source: `Imported (${importType})`,
          sourceId: record.isbn || record.asin || record.url || record.title,
          contentType: record.contentType || (isBook ? "book" : "course"),
          title: record.title,
          subtitle: record.subtitle,
          description: record.description || record.summary,
          creator: record.author || record.creator,
          url: record.url || "https://example.com/imported",
          publisher: record.publisher,
          isbn13: record.isbn13 || record.isbn,
          asin: record.asin,
          price: parseFloat(record.price) || undefined,
          rating: parseFloat(record.rating) || 4.5,
          reviewCount: parseInt(record.reviews || record.reviewCount) || 10,
          views: parseInt(record.views) || (isBook ? undefined : 25000),
          publicationDate: record.publicationDate || record.publishedDate || new Date().toISOString().split("T")[0],
          firstDiscoveredAt: new Date().toISOString(),
          lastSeenAt: new Date().toISOString(),
        };

        const enriched = await enrichWithGemini(item);
        importedItems.push(enriched);
        importedCount++;
      } catch (err) {
        errorCount++;
      }
    }

    await saveContentItems(importedItems);

    return NextResponse.json({
      success: true,
      recordsFound: records.length,
      recordsImported: importedCount,
      duplicatesSkipped,
      recordsWithErrors: errorCount,
      items: importedItems
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
