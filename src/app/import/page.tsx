"use client";

import { useState } from "react";
import Papa from "papaparse";
import { Navbar } from "@/components/Navbar";
import { Upload, FileText, CheckCircle2, AlertCircle, Sparkles, BookOpen, Layers, ArrowRight } from "lucide-react";

export default function CSVImportPage() {
  const [importType, setImportType] = useState<"amazon" | "leanpub" | "generic_books" | "generic_content">("amazon");
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);

  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<any | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setParsedData(results.data);
        if (results.meta.fields) {
          setColumns(results.meta.fields);
        }
      },
    });
  };

  const handleImportSubmit = async () => {
    if (parsedData.length === 0) return;

    setImporting(true);
    try {
      const res = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          importType,
          records: parsedData,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setImportResult(data);
      }
    } catch (err) {
      console.error("CSV import failed:", err);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-radar-400 mb-1">
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Editorial Dataset Ingestion</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Import Book & Content CSV</h1>
          <p className="text-xs text-slate-400 mt-1">
            Ingest external publishing lists, Amazon catalog exports, Leanpub drafts, or custom course data into the Opportunity Radar pipeline.
          </p>
        </div>

        {/* 1. Import Source Type Selector */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-slate-200">1. Select Catalog Source Format</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "amazon", label: "Amazon Books CSV", desc: "ASIN, BSR, Reviews" },
              { id: "leanpub", label: "Leanpub Books CSV", desc: "Indie / Self-pub" },
              { id: "generic_books", label: "Generic Book CSV", desc: "ISBN, Publisher" },
              { id: "generic_content", label: "Generic Content CSV", desc: "Courses & Tutorials" },
            ].map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setImportType(type.id as any)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  importType === type.id
                    ? "bg-radar-600/30 border-radar-500 text-radar-100 shadow-md"
                    : "bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="font-bold text-xs block">{type.label}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{type.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. File Upload Box */}
        <div className="glass-panel rounded-2xl p-8 border border-slate-800 border-dashed text-center space-y-4">
          <Upload className="w-10 h-10 text-radar-400 mx-auto animate-bounce" />
          <div>
            <h3 className="font-bold text-base text-slate-100">Upload CSV File</h3>
            <p className="text-xs text-slate-400 mt-1">Select a CSV file containing titles, authors, URLs, or metadata.</p>
          </div>

          <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-radar-600 hover:bg-radar-500 text-white font-bold text-xs shadow-lg shadow-radar-600/30 cursor-pointer transition-all">
            <span>Browse Computer</span>
            <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
          </label>

          {file && (
            <p className="text-xs text-emerald-400 font-mono">Selected: {file.name} ({parsedData.length} records parsed)</p>
          )}
        </div>

        {/* 3. CSV Column Mapping & Preview Table */}
        {parsedData.length > 0 && (
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-100">2. Inspect & Preview Records</h3>
                <p className="text-xs text-slate-400">Detected columns: {columns.join(", ")}</p>
              </div>

              <button
                onClick={handleImportSubmit}
                disabled={importing}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
              >
                {importing ? (
                  <span>Processing & Scoring Pipeline...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run Ingestion Pipeline ({parsedData.length} Rows)</span>
                  </>
                )}
              </button>
            </div>

            <div className="overflow-x-auto max-h-64 rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 font-semibold uppercase text-[10px] sticky top-0">
                  <tr>
                    {columns.slice(0, 6).map((c) => (
                      <th key={c} className="py-2.5 px-3 border-b border-slate-800">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {parsedData.slice(0, 5).map((row, i) => (
                    <tr key={i} className="hover:bg-slate-800/40">
                      {columns.slice(0, 6).map((c) => (
                        <td key={c} className="py-2 px-3 line-clamp-1">{row[c]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. Import Results Summary */}
        {importResult && (
          <div className="glass-panel rounded-2xl p-6 border border-emerald-500/40 bg-emerald-950/20 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
              <CheckCircle2 className="w-5 h-5" />
              <span>Import & Editorial Scoring Completed Successfully!</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Records Found</span>
                <span className="text-xl font-black text-slate-100 font-mono">{importResult.recordsFound}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Imported & Scored</span>
                <span className="text-xl font-black text-emerald-400 font-mono">{importResult.recordsImported}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Duplicates Skipped</span>
                <span className="text-xl font-black text-amber-400 font-mono">{importResult.duplicatesSkipped}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Errors</span>
                <span className="text-xl font-black text-rose-400 font-mono">{importResult.recordsWithErrors}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <a
                href="/results"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-radar-600 hover:bg-radar-500 text-white font-bold text-xs transition-colors"
              >
                <span>View Imported Results</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
