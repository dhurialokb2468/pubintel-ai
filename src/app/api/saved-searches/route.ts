import { NextRequest, NextResponse } from "next/server";
import { getSavedSearches, saveSavedSearch } from "@/services/firestore";
import { SavedSearch } from "@/types/filters";

export async function GET() {
  try {
    const list = await getSavedSearches();
    return NextResponse.json({ success: true, savedSearches: list });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newSearch: SavedSearch = {
      id: `search-${Date.now()}`,
      name: body.name || body.query || "Saved Search",
      query: body.query || "",
      filters: body.filters || {},
      createdAt: new Date().toISOString(),
      resultCount: body.resultCount || 0
    };

    await saveSavedSearch(newSearch);
    return NextResponse.json({ success: true, savedSearch: newSearch });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
