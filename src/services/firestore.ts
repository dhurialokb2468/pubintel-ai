import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, doc, getDoc, setDoc, getDocs, query, where, limit } from "firebase/firestore";
import { ContentItem } from "../types/content";
import { Creator } from "../types/creator";
import { SavedSearch } from "../types/filters";
import { MOCK_CONTENT_ITEMS, MOCK_CREATORS } from "../data/mockData";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let db: any = null;

if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (err) {
    console.warn("Firestore initialization error, using local memory store:", err);
  }
}

// Memory fallback store
const memoryContentItems = new Map<string, ContentItem>(MOCK_CONTENT_ITEMS.map((item) => [item.id, item]));
const memoryCreators = new Map<string, Creator>(MOCK_CREATORS.map((c) => [c.id, c]));
const memorySavedSearches = new Map<string, SavedSearch>();

export async function saveContentItems(items: ContentItem[]): Promise<void> {
  for (const item of items) {
    memoryContentItems.set(item.id, item);

    if (db) {
      try {
        await setDoc(doc(db, "content_items", item.id), item, { merge: true });
      } catch (e) {
        console.warn("Firestore write failed:", e);
      }
    }
  }
}

export async function getAllContentItems(): Promise<ContentItem[]> {
  if (db) {
    try {
      const snap = await getDocs(collection(db, "content_items"));
      const items: ContentItem[] = [];
      snap.forEach((d) => items.push(d.data() as ContentItem));
      if (items.length > 0) return items;
    } catch (e) {
      console.warn("Firestore read failed, fallback to memory:", e);
    }
  }
  return Array.from(memoryContentItems.values());
}

export async function getContentItemById(id: string): Promise<ContentItem | null> {
  if (memoryContentItems.has(id)) {
    return memoryContentItems.get(id)!;
  }
  if (db) {
    try {
      const snap = await getDoc(doc(db, "content_items", id));
      if (snap.exists()) return snap.data() as ContentItem;
    } catch (e) {
      console.warn("Firestore getDoc failed:", e);
    }
  }
  return null;
}

export async function getAllCreators(): Promise<Creator[]> {
  if (db) {
    try {
      const snap = await getDocs(collection(db, "creators"));
      const creators: Creator[] = [];
      snap.forEach((d) => creators.push(d.data() as Creator));
      if (creators.length > 0) return creators;
    } catch (e) {
      console.warn("Firestore creators read failed:", e);
    }
  }
  return Array.from(memoryCreators.values());
}

export async function getCreatorById(id: string): Promise<Creator | null> {
  if (memoryCreators.has(id)) {
    return memoryCreators.get(id)!;
  }
  if (db) {
    try {
      const snap = await getDoc(doc(db, "creators", id));
      if (snap.exists()) return snap.data() as Creator;
    } catch (e) {
      console.warn("Firestore getCreator failed:", e);
    }
  }
  return null;
}

export async function saveSavedSearch(search: SavedSearch): Promise<void> {
  memorySavedSearches.set(search.id, search);
  if (db) {
    try {
      await setDoc(doc(db, "saved_searches", search.id), search);
    } catch (e) {
      console.warn("Firestore saved_search write failed:", e);
    }
  }
}

export async function getSavedSearches(): Promise<SavedSearch[]> {
  if (db) {
    try {
      const snap = await getDocs(collection(db, "saved_searches"));
      const list: SavedSearch[] = [];
      snap.forEach((d) => list.push(d.data() as SavedSearch));
      if (list.length > 0) return list;
    } catch (e) {
      console.warn("Firestore saved_searches read failed:", e);
    }
  }
  return Array.from(memorySavedSearches.values());
}
