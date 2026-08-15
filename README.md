# Opportunity Radar

**Opportunity Radar** is an internal editorial research application built for professional publishing teams to discover self-published books, small-press titles, educational video playlists, courses, tutorials, creators, and emerging topics with high publishing potential.

---

## 🌟 Key Features

1. **Multi-Source Discovery Pipeline**: Connects to Google Books API, YouTube Data API v3, Amazon & Leanpub CSV imports, and custom content feeds.
2. **Automated Query Expansion**: Expands search queries into parallel subtopic terms for maximum opportunity yield.
3. **Comprehensive Professional Taxonomy**: 50+ curated professional domains spanning Artificial Intelligence, Product Management, Finance & Trading, Sound & Audio Engineering, Video Production & Editing, Salesforce, SAP, ServiceNow, Power Platform, and No-Code Automation.
4. **Multi-Factor Editorial Scoring**:
   - **Professional Relevance Score (0–100)**: Practical applicability and depth for professional readers.
   - **Book Potential Score (0–100)**: Structure, lesson count, and coherence of non-book content (playlists/courses).
   - **Demand Score (0–100)**: Source-normalized audience engagement.
   - **Competitive Gap Score (0–100)**: High content demand with low book saturation.
   - **Opportunity Score (0–100)**: Weighted composite editorial ranking.
5. **AI Enrichment & Gemini Insights**: Automatic topic classification, suggested book angles, target audience identification, and independent publishing confidence.
6. **Creator Profiles**: Tracks educational creators, authority metrics, portfolio breakdown, and publishing contactability.
7. **CSV Import & Export**: Import external book/course lists with column mapping and export filtered opportunity reports.

---

## 🚀 Quick Start

### 1. Installation

```bash
cd opportunity-radar
npm install
```

### 2. Environment Variables Configuration

Create `.env.local` in the root folder:

```env
# Gemini API Key for Classification & Editorial Insights
GEMINI_API_KEY=your_gemini_api_key_here

# YouTube Data API v3 Key
YOUTUBE_API_KEY=your_youtube_api_key_here

# Google Books API Key (Optional; public endpoint works without key, but key avoids rate limits)
GOOGLE_BOOKS_API_KEY=your_google_books_api_key_here

# Firebase Configuration (Optional; falls back to local memory store if missing)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Lucide Icons
- **Database**: Firebase Firestore (with local memory fallback)
- **AI Classification**: Gemini API (@google/genai)
- **APIs**: Google Books API, YouTube Data API v3
