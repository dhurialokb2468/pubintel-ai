# PubIntel AI 🚀
### Publishing Intelligence & Content Acquisition Engine

**PubIntel AI** is an enterprise publishing intelligence platform designed for book acquisition editors, content strategists, and media executives. It continuously monitors and analyzes multi-source digital content platforms—including **Open Library**, **Google Books**, **YouTube**, and custom CSV catalogs—to identify emerging topics, self-published candidate titles, and high-authority creators with high print publishing potential.

---

## 🌟 Key Features

- **Multi-Source Data Crawling**: Parallel discovery engine querying Open Library REST APIs, Google Books API, YouTube Playlists & Courses, and local CSV catalog imports.
- **Multi-Factor Opportunity Scoring**:
  - **Opportunity Score**: Overall editorial commercial viability indicator.
  - **Book Potential Score**: Structure and depth evaluation for converting digital content into physical books.
  - **Competitive Gap Score**: Market scarcity analysis indicating low existing book competition.
  - **Creator Authority Score**: Creator reach, engagement rate, and audience loyalty metrics.
- **Direct External Source Access**: 1-click external source redirection to live YouTube playlists, Google Books preview pages, and Open Library records.
- **Comprehensive Taxonomy Support**: Pre-indexed across 50+ professional domains including *Agentic AI, Model Context Protocol, Algorithmic Trading with Python, DaVinci Resolve AI Editing, Salesforce Agentforce, n8n Automation, Copilot Excel*, and more.
- **Client-Side Static Engine**: Fully interactive search, domain filtering, and scoring operating directly in client JS for fast, reliable static hosting.
- **1-Click CSV Data Export**: Export discovered opportunities and creator profiles directly to CSV for editorial meetings.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS & Vanilla CSS Design System with Dark Glassmorphism Aesthetics
- **Icons**: Lucide React
- **Browser Automation & Testing**: Playwright Chromium Test Suite
- **Deployment**: Static Web Export (`output: 'export'`) with GitHub Pages

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation & Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/dhurialokb2468/pubintel-ai.git
   cd pubintel-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Launch local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your web browser.

4. **Build production static export**:
   ```bash
   npm run build
   ```

---

## 🧪 Testing & Verification

Comprehensive automated browser tests can be executed via Playwright:

```bash
node test-ui.js
```

---

## 📁 Repository Structure

```
pubintel-ai/
├── src/
│   ├── app/                # Next.js App Router pages (Dashboard, Discover, Results, Detail)
│   ├── components/         # Reusable UI components (Navbar, ContentCard, ScoreBadge, etc.)
│   ├── connectors/         # Multi-source data crawlers (Open Library, Google Books, YouTube)
│   ├── data/               # Taxonomy & enriched datasets
│   ├── services/           # Client-side search engine & CSV exporter
│   └── types/              # TypeScript interfaces for ContentItem, Creator, and Filters
├── public/                 # Static assets & icons
├── next.config.js          # Next.js static export & subpath configuration
└── tailwind.config.js      # Custom theme, fonts, and dark glassmorphic styling
```
