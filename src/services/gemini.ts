import { GoogleGenerativeAI } from "@google/generative-ai";
import { ContentItem } from "../types/content";
import { classifyContentItem } from "./classification";
import { enrichItemWithScores } from "./scoring";

interface GeminiEnrichmentResponse {
  primaryDomain: string;
  primaryCategory: string;
  primaryTopic: string;
  secondaryTopics: string[];
  suggestedAudience: string;
  possibleBookAngle: string;
  opportunityReason: string;
  skillLevel: "beginner" | "intermediate" | "advanced" | "mixed";
  professionalRelevanceScore: number;
}

// Simple in-memory enrichment cache
const enrichmentCache = new Map<string, ContentItem>();

export async function enrichWithGemini(item: ContentItem): Promise<ContentItem> {
  // Check cache first
  if (enrichmentCache.has(item.id)) {
    return enrichmentCache.get(item.id)!;
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // Fallback if key missing
  if (!apiKey) {
    const classification = classifyContentItem(item.title, item.description || "");
    const baseEnriched = enrichItemWithScores({
      ...item,
      primaryDomain: item.primaryDomain || classification.primaryDomain,
      primaryCategory: item.primaryCategory || classification.primaryCategory,
      primaryTopic: item.primaryTopic || classification.primaryTopic,
      secondaryTopics: item.secondaryTopics || classification.secondaryTopics,
      audienceTypes: item.audienceTypes || classification.audienceTypes,
      skillLevel: item.skillLevel || classification.skillLevel,
      suggestedAudience: item.suggestedAudience || `${classification.audienceTypes.join(", ")} Professionals`,
      possibleBookAngle: item.possibleBookAngle || `Definitive handbook on ${classification.primaryTopic} for ${classification.audienceTypes[0] || "practitioners"}.`
    });

    enrichmentCache.set(item.id, baseEnriched);
    return baseEnriched;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze this educational content metadata for an editorial publishing research tool. Respond ONLY with valid JSON matching the specified structure.

Title: "${item.title}"
Subtitle: "${item.subtitle || ""}"
Description: "${(item.description || "").slice(0, 500)}"
Content Type: "${item.contentType}"
Creator: "${item.creator || ""}"

Respond with JSON:
{
  "primaryDomain": "e.g. Artificial Intelligence | Product Management | Finance | Creative Technology | Enterprise Products",
  "primaryCategory": "string",
  "primaryTopic": "string",
  "secondaryTopics": ["topic1", "topic2"],
  "suggestedAudience": "string describing target professional reader group",
  "possibleBookAngle": "compelling book title or angle idea for a publishing editor",
  "opportunityReason": "concise explanation of editorial opportunity",
  "skillLevel": "beginner" | "intermediate" | "advanced" | "mixed",
  "professionalRelevanceScore": number between 0 and 100
}`;

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const parsed: GeminiEnrichmentResponse = JSON.parse(jsonMatch[0]);

      const enriched: ContentItem = enrichItemWithScores({
        ...item,
        primaryDomain: parsed.primaryDomain || item.primaryDomain,
        primaryCategory: parsed.primaryCategory || item.primaryCategory,
        primaryTopic: parsed.primaryTopic || item.primaryTopic,
        secondaryTopics: parsed.secondaryTopics || item.secondaryTopics,
        suggestedAudience: parsed.suggestedAudience || item.suggestedAudience,
        possibleBookAngle: parsed.possibleBookAngle || item.possibleBookAngle,
        opportunityReason: parsed.opportunityReason || item.opportunityReason,
        skillLevel: parsed.skillLevel || item.skillLevel,
        professionalRelevanceScore: parsed.professionalRelevanceScore || item.professionalRelevanceScore
      });

      enrichmentCache.set(item.id, enriched);
      return enriched;
    }
  } catch (error) {
    console.warn("Gemini API enrichment failed or unconfigured, falling back to rule engine:", error);
  }

  // Rule-based fallback if API call fails
  const classification = classifyContentItem(item.title, item.description || "");
  const fallbackEnriched = enrichItemWithScores({
    ...item,
    primaryDomain: item.primaryDomain || classification.primaryDomain,
    primaryCategory: item.primaryCategory || classification.primaryCategory,
    primaryTopic: item.primaryTopic || classification.primaryTopic,
    secondaryTopics: item.secondaryTopics || classification.secondaryTopics,
    audienceTypes: item.audienceTypes || classification.audienceTypes,
    skillLevel: item.skillLevel || classification.skillLevel,
    suggestedAudience: item.suggestedAudience || `${classification.audienceTypes.join(", ")} Professionals`,
    possibleBookAngle: item.possibleBookAngle || `Definitive guide to ${classification.primaryTopic} for ${classification.audienceTypes[0] || "industry professionals"}.`
  });

  enrichmentCache.set(item.id, fallbackEnriched);
  return fallbackEnriched;
}
