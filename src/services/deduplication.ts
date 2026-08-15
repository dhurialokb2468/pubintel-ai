import { ContentItem } from "../types/content";

function cleanTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanAuthor(author?: string): string {
  if (!author) return "";
  return author
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function deduplicateContentItems(items: ContentItem[]): ContentItem[] {
  const seenIsbn = new Set<string>();
  const seenAsin = new Set<string>();
  const seenTitleAuthor = new Set<string>();
  const result: ContentItem[] = [];

  for (const item of items) {
    // 1. Check ISBN-13
    if (item.isbn13 && seenIsbn.has(item.isbn13)) {
      continue;
    }
    // 2. Check ISBN-10
    if (item.isbn10 && seenIsbn.has(item.isbn10)) {
      continue;
    }
    // 3. Check ASIN
    if (item.asin && seenAsin.has(item.asin)) {
      continue;
    }

    // 4. Normalized title + author match
    const titleKey = cleanTitle(item.title);
    const authorKey = cleanAuthor(item.creator);
    const compositeKey = `${titleKey}::${authorKey}`;

    if (titleKey && seenTitleAuthor.has(compositeKey)) {
      continue;
    }

    // Track identifiers
    if (item.isbn13) seenIsbn.add(item.isbn13);
    if (item.isbn10) seenIsbn.add(item.isbn10);
    if (item.asin) seenAsin.add(item.asin);
    if (titleKey) seenTitleAuthor.add(compositeKey);

    result.push(item);
  }

  return result;
}
