import { ContentItem } from "@/types/content";

export function exportItemsToCSV(items: ContentItem[], filename = "opportunity-radar-export.csv") {
  if (!items || items.length === 0) return;

  const headers = [
    "ID",
    "Title",
    "Source",
    "Content Type",
    "Creator",
    "Primary Domain",
    "Primary Topic",
    "Opportunity Score",
    "Book Potential Score",
    "Demand Score",
    "Competitive Gap Score",
    "Creator Authority Score",
    "Publishing Type",
    "URL"
  ];

  const rows = items.map((item) => [
    `"${item.id}"`,
    `"${(item.title || "").replace(/"/g, '""')}"`,
    `"${item.source}"`,
    `"${item.contentType}"`,
    `"${(item.creator || "").replace(/"/g, '""')}"`,
    `"${item.primaryDomain || ""}"`,
    `"${item.primaryTopic || ""}"`,
    item.opportunityScore || 0,
    item.bookPotentialScore || 0,
    item.demandScore || 0,
    item.competitiveGapScore || 0,
    item.creatorAuthorityScore || 0,
    `"${item.publishingType || ""}"`,
    `"${item.url || ""}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
