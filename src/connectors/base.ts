import { SourceConnector } from "../types/connectors";
import { GoogleBooksConnector } from "./google-books";
import { OpenLibraryConnector } from "./open-library";
import { YouTubeConnector } from "./youtube";
import { ImportedBooksConnector } from "./imported-books";
import { ImportedContentConnector } from "./imported-content";

export const CONNECTORS: Record<string, SourceConnector> = {
  google_books: new GoogleBooksConnector(),
  open_library: new OpenLibraryConnector(),
  youtube: new YouTubeConnector(),
  imported_books: new ImportedBooksConnector(),
  imported_content: new ImportedContentConnector(),
};
