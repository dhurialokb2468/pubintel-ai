import { FULL_TAXONOMY, INITIAL_DOMAINS } from "../data/taxonomy";
import { ContentItem } from "../types/content";

export interface ClassificationResult {
  primaryDomain: string;
  primaryCategory: string;
  primaryTopic: string;
  secondaryTopics: string[];
  audienceTypes: string[];
  skillLevel: "beginner" | "intermediate" | "advanced" | "mixed";
}

export function classifyContentItem(title: string, description: string = ""): ClassificationResult {
  const text = `${title} ${description}`.toLowerCase();

  let matchedDomain = "Artificial Intelligence";
  let matchedCategory = "AI Business & Productivity";
  let matchedTopic = "Agentic AI";
  const secondaryTopics = new Set<string>();
  const audienceTypes = new Set<string>();

  // Check full taxonomy
  for (const domain of FULL_TAXONOMY) {
    for (const cat of domain.categories) {
      for (const topic of cat.topics) {
        if (text.includes(topic.name.toLowerCase())) {
          matchedDomain = domain.name;
          matchedCategory = cat.name;
          matchedTopic = topic.name;
        }

        if (topic.subtopics) {
          for (const sub of topic.subtopics) {
            if (text.includes(sub.toLowerCase())) {
              secondaryTopics.add(sub);
            }
          }
        }
      }
    }
  }

  // Audience heuristics
  if (text.includes("product manager") || text.includes("pm") || text.includes("product leader")) {
    audienceTypes.add("Product Managers");
    audienceTypes.add("AI Product Managers");
  }
  if (text.includes("developer") || text.includes("engineer") || text.includes("coding") || text.includes("python")) {
    audienceTypes.add("Developers");
  }
  if (text.includes("trader") || text.includes("quant") || text.includes("algo")) {
    audienceTypes.add("Traders");
    audienceTypes.add("Finance Professionals");
  }
  if (text.includes("sound") || text.includes("audio") || text.includes("music")) {
    audienceTypes.add("Sound Designers");
    audienceTypes.add("Audio Engineers");
  }
  if (text.includes("video") || text.includes("editor") || text.includes("davinci") || text.includes("film")) {
    audienceTypes.add("Video Editors");
    audienceTypes.add("Creators");
  }

  if (audienceTypes.size === 0) {
    audienceTypes.add("Power Users");
    audienceTypes.add("Consultants");
  }

  // Skill level heuristics
  let skillLevel: "beginner" | "intermediate" | "advanced" | "mixed" = "intermediate";
  if (text.includes("beginner") || text.includes("introduction") || text.includes("101") || text.includes("getting started")) {
    skillLevel = "beginner";
  } else if (text.includes("advanced") || text.includes("architecture") || text.includes("quant") || text.includes("expert")) {
    skillLevel = "advanced";
  } else if (text.includes("masterclass") || text.includes("complete guide")) {
    skillLevel = "mixed";
  }

  return {
    primaryDomain: matchedDomain,
    primaryCategory: matchedCategory,
    primaryTopic: matchedTopic,
    secondaryTopics: Array.from(secondaryTopics),
    audienceTypes: Array.from(audienceTypes),
    skillLevel
  };
}
