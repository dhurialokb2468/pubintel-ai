export interface TaxonomyTopic {
  id: string;
  name: string;
  subtopics?: string[];
  tools?: string[];
}

export interface TaxonomyCategory {
  id: string;
  name: string;
  topics: TaxonomyTopic[];
}

export interface TaxonomyDomain {
  id: string;
  name: string;
  categories: TaxonomyCategory[];
}

export const INITIAL_DOMAINS: string[] = [
  "Artificial Intelligence",
  "Product Management",
  "Creative Technology",
  "Software Development",
  "Data",
  "Cloud & Infrastructure",
  "Cybersecurity",
  "Enterprise Products",
  "Professional Tools",
  "Business & Management",
  "Finance",
  "Trading & Markets",
  "Sales",
  "Marketing",
  "Consulting",
  "Operations",
  "Entrepreneurship",
  "Productivity",
  "Automation"
];

export const AUDIENCE_TYPES: string[] = [
  "Developers",
  "Product Managers",
  "AI Product Managers",
  "Business Users",
  "Power Users",
  "Executives",
  "Analysts",
  "Finance Professionals",
  "Traders",
  "Sound Designers",
  "Audio Engineers",
  "Video Editors",
  "Creators",
  "Consultants"
];

export const FULL_TAXONOMY: TaxonomyDomain[] = [
  {
    id: "ai",
    name: "Artificial Intelligence",
    categories: [
      {
        id: "ai_core",
        name: "AI Core & Engineering",
        topics: [
          { id: "gen_ai", name: "Generative AI", subtopics: ["LLMs", "Multimodal AI", "Diffusion Models"] },
          { id: "agentic_ai", name: "Agentic AI", subtopics: ["AI Agents", "Autonomous Workflows", "Multi-Agent Systems", "MCP (Model Context Protocol)"] },
          { id: "ai_eng", name: "AI Engineering", subtopics: ["RAG", "Prompt Engineering", "Fine-Tuning", "Vector Databases"], tools: ["LangChain", "LlamaIndex", "CrewAI", "AutoGen"] },
          { id: "ai_builders", name: "AI Builders & Coding", subtopics: ["AI Coding", "Copilot Extensions", "Code Generation"], tools: ["GitHub Copilot", "Cursor", "Claude Code", "v0"] }
        ]
      },
      {
        id: "ai_business",
        name: "AI Business & Productivity",
        topics: [
          { id: "ai_pm", name: "AI Product Management", subtopics: ["AI Product Strategy", "AI Product UX", "AI Agent Product Management", "AI Product Evaluation"] },
          { id: "ai_automation", name: "AI Automation & Workflows", subtopics: ["AI Agents for Business", "Workflow Automation"], tools: ["n8n", "Make", "Zapier"] },
          { id: "ai_productivity", name: "AI Productivity & Power Users", subtopics: ["AI for Business Users", "Prompting for Executives", "Document AI"] }
        ]
      },
      {
        id: "ai_creative",
        name: "Creative AI",
        topics: [
          { id: "ai_audio", name: "AI Sound & Audio", subtopics: ["AI Music Generation", "AI Voice Synthesis", "AI Sound Design"], tools: ["Suno", "Udio", "ElevenLabs"] },
          { id: "ai_video", name: "Generative Video & Editing", subtopics: ["AI Video Production", "Generative Video", "AI Color Grading"], tools: ["Runway", "Pika", "Sora", "HeyGen"] },
          { id: "ai_design", name: "AI Design & Visual Tools", subtopics: ["AI Image Generation", "Creative AI Workflows"], tools: ["Midjourney", "DALL-E", "Flux"] }
        ]
      }
    ]
  },
  {
    id: "product_management",
    name: "Product Management",
    categories: [
      {
        id: "pm_strategy",
        name: "Product Strategy & Operations",
        topics: [
          { id: "core_pm", name: "Product Management", subtopics: ["Product Strategy", "Product Discovery", "Product-Led Growth", "Product-Market Fit"] },
          { id: "tech_pm", name: "Technical & Data PM", subtopics: ["Technical Product Management", "Data Product Management", "Platform Product Management"] },
          { id: "pm_ops", name: "Product Operations & Leadership", subtopics: ["Product Analytics", "Product Operations", "SaaS Product Management", "Product Leadership"] }
        ]
      }
    ]
  },
  {
    id: "creative_technology",
    name: "Creative Technology",
    categories: [
      {
        id: "audio_engineering",
        name: "Audio & Sound Engineering",
        topics: [
          { id: "sound_design", name: "Sound Design", subtopics: ["Foley", "Synth Programming", "Game Audio", "Spatial Audio"] },
          { id: "audio_prod", name: "Audio Engineering & Music Production", subtopics: ["Recording", "Mixing", "Mastering", "Music Editing", "Podcast Production"] }
        ]
      },
      {
        id: "video_production",
        name: "Video & Post Production",
        topics: [
          { id: "video_edit", name: "Video Editing & Production", subtopics: ["Film Editing", "Post Production", "Motion Graphics", "Color Grading", "VFX", "Cinematography"], tools: ["DaVinci Resolve", "Premiere Pro", "After Effects"] }
        ]
      }
    ]
  },
  {
    id: "enterprise_tools",
    name: "Enterprise Products & Tools",
    categories: [
      {
        id: "enterprise_platforms",
        name: "Enterprise Platforms",
        topics: [
          { id: "salesforce", name: "Salesforce", subtopics: ["Agentforce", "Sales Cloud", "Service Cloud"] },
          { id: "sap", name: "SAP", subtopics: ["SAP S/4HANA", "SAP Analytics Cloud"] },
          { id: "servicenow", name: "ServiceNow", subtopics: ["ITSM", "Now Platform", "ServiceNow AI"] },
          { id: "ms_power", name: "Microsoft Power Platform & Copilot", subtopics: ["Power BI", "Power Automate", "Power Apps", "Microsoft Copilot", "Microsoft 365", "Excel"] }
        ]
      },
      {
        id: "nocode_tools",
        name: "No-Code & Professional Tools",
        topics: [
          { id: "nocode_automation", name: "No-Code & Automation", subtopics: ["Low-Code Development", "Workflow Automation"], tools: ["n8n", "Zapier", "Make", "Airtable", "Notion", "Jira", "Confluence"] }
        ]
      }
    ]
  },
  {
    id: "finance_trading",
    name: "Finance & Trading",
    categories: [
      {
        id: "corp_finance",
        name: "Finance & Analytics",
        topics: [
          { id: "fin_analysis", name: "Financial Analysis & Modeling", subtopics: ["Corporate Finance", "Financial Modeling", "FP&A", "Accounting", "FinTech"] },
          { id: "ai_finance", name: "AI for Finance", subtopics: ["AI Financial Analysis", "AI Financial Modeling", "Finance Agents", "Financial LLMs", "AI Investment Research"] }
        ]
      },
      {
        id: "trading_markets",
        name: "Trading & Quantitative Markets",
        topics: [
          { id: "algo_trading", name: "Algorithmic & Quantitative Trading", subtopics: ["Quant Finance", "Systematic Trading", "Python for Trading", "Machine Learning for Trading", "Backtesting", "Risk Management"] },
          { id: "ai_trading", name: "AI for Trading", subtopics: ["Trading Agents", "Sentiment Analysis for Markets", "Options & Futures Quant Strategy"] }
        ]
      }
    ]
  }
];
