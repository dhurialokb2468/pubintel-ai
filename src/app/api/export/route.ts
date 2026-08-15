import { NextRequest, NextResponse } from "next/server";
import { getAllContentItems } from "@/services/firestore";

export async function GET(req: NextRequest) {
  try {
    const items = await getAllContentItems();

    const headers = [
      "Title",
      "Creator",
      "Source",
      "Type",
      "URL",
      "Published Date",
      "Publisher",
      "ISBN",
      "ASIN",
      "Domain",
      "Topic",
      "Audience",
      "Skill Level",
      "Professional Relevance",
      "Demand",
      "Book Potential",
      "Competitive Gap",
      "Creator Authority",
      "Opportunity Score",
      "Publishing Type",
      "Independent Publishing Confidence",
      "Book Potential Reason",
      "Opportunity Reason",
      "Possible Book Angle",
      "Creator Contactability",
      "Rights Status"
    ];

    const csvRows = [headers.join(",")];

    for (const item of items) {
      const row = [
        `"${(item.title || "").replace(/"/g, '""')}"`,
        `"${(item.creator || "").replace(/"/g, '""')}"`,
        `"${item.source || ""}"`,
        `"${item.contentType || ""}"`,
        `"${item.url || ""}"`,
        `"${item.publicationDate || ""}"`,
        `"${(item.publisher || "").replace(/"/g, '""')}"`,
        `"${item.isbn13 || item.isbn10 || ""}"`,
        `"${item.asin || ""}"`,
        `"${item.primaryDomain || ""}"`,
        `"${item.primaryTopic || ""}"`,
        `"${(item.suggestedAudience || (item.audienceTypes || []).join("; ")).replace(/"/g, '""')}"`,
        `"${item.skillLevel || ""}"`,
        item.professionalRelevanceScore || 0,
        item.demandScore || 0,
        item.bookPotentialScore || 0,
        item.competitiveGapScore || 0,
        item.creatorAuthorityScore || 0,
        item.opportunityScore || 0,
        `"${item.publishingType || "unknown"}"`,
        item.independentPublishingConfidence || 0,
        `"${(item.bookPotentialReason || "").replace(/"/g, '""')}"`,
        `"${(item.opportunityReason || "").replace(/"/g, '""')}"`,
        `"${(item.possibleBookAngle || "").replace(/"/g, '""')}"`,
        `"${item.creatorContactability || "unknown"}"`,
        `"${item.rightsStatus || "unknown"}"`
      ];

      csvRows.push(row.join(","));
    }

    const csvString = csvRows.join("\n");

    return new NextResponse(csvString, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="opportunity_radar_export.csv"'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
