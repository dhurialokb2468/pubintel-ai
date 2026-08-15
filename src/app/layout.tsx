import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Opportunity Radar | Editorial Publishing Intelligence",
  description: "Discover self-published books, tutorial playlists, creators, and emerging topics with high publishing potential.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased font-sans selection:bg-radar-500 selection:text-white min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
