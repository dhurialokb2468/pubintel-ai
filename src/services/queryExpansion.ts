export function expandQuery(query: string): string[] {
  const normalized = query.trim();
  if (!normalized) return [];

  const expanded = new Set<string>([normalized]);

  const lower = normalized.toLowerCase();

  // Agentic AI expansions
  if (lower.includes("agentic") || lower.includes("agent")) {
    expanded.add("Agentic AI");
    expanded.add("AI Agents");
    expanded.add("Model Context Protocol");
    expanded.add("Multi-Agent Systems");
    if (lower.includes("product") || lower.includes("pm")) {
      expanded.add("AI Product Management");
      expanded.add("AI Agent Product Strategy");
    }
  }

  // AI Product Management expansions
  if (lower.includes("product management") || lower.includes("pm")) {
    expanded.add("AI Product Management");
    expanded.add("Product Strategy");
    expanded.add("Data Product Management");
  }

  // Finance / Trading expansions
  if (lower.includes("trading") || lower.includes("quant")) {
    expanded.add("Algorithmic Trading");
    expanded.add("Quantitative Finance");
    expanded.add("Python for Trading");
    expanded.add("AI for Trading");
  }

  if (lower.includes("finance") || lower.includes("fp&a") || lower.includes("financial")) {
    expanded.add("AI Finance");
    expanded.add("Financial Modeling");
    expanded.add("Financial Analysis");
  }

  // Creative Audio & Video expansions
  if (lower.includes("sound") || lower.includes("audio") || lower.includes("music")) {
    expanded.add("Sound Design");
    expanded.add("Audio Engineering");
    expanded.add("AI Audio");
    expanded.add("Music Production");
  }

  if (lower.includes("video") || lower.includes("editing") || lower.includes("davinci")) {
    expanded.add("Video Editing");
    expanded.add("DaVinci Resolve");
    expanded.add("Generative Video");
    expanded.add("Color Grading");
  }

  // Enterprise & Automation expansions
  if (lower.includes("salesforce") || lower.includes("agentforce")) {
    expanded.add("Salesforce Agentforce");
    expanded.add("Salesforce AI");
  }

  if (lower.includes("n8n") || lower.includes("automation") || lower.includes("no-code")) {
    expanded.add("AI Automation");
    expanded.add("n8n Workflows");
    expanded.add("No-Code Automation");
  }

  return Array.from(expanded);
}
