import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";

const openRouterKey = secret("OpenRouterKey");

interface GenerateFeaturesRequest {
  idea: string;
  targetAudience?: string;
  projectType?: string;
}

interface Feature {
  name: string;
  description: string;
  userStory: string;
  acceptanceCriteria: string[];
  priority: "high" | "medium" | "low";
  complexity: "simple" | "moderate" | "complex";
  estimatedHours: number;
  isMVP: boolean;
  dependencies: string[];
}

interface FeatureCategory {
  category: string;
  features: Feature[];
}

interface DevelopmentPhase {
  phase: string;
  features: string[];
  estimatedWeeks: number;
}

interface UserFlowStep {
  screen: string;
  description: string;
  components: string[];
  purpose: string;
}

interface GenerateFeaturesResponse {
  categories: FeatureCategory[];
  mustHave: Feature[];
  couldHave: Feature[];
  later: Feature[];
  userFlow: UserFlowStep[];
  developmentPhases: DevelopmentPhase[];
  totalMVPHours: number;
  totalFullHours: number;
}

// Generates comprehensive feature specifications and development roadmap.
export const generateFeatures = api<GenerateFeaturesRequest, GenerateFeaturesResponse>(
  { expose: true, method: "POST", path: "/features" },
  async (req) => {
    const systemPrompt = `You are a senior product manager and technical architect. Your task is to generate a comprehensive product plan for a startup idea.

Based on the startup idea, generate:

1.  **Feature Prioritization**:
    *   'mustHave': Core features for the MVP.
    *   'couldHave': Important features for a V1 release.
    *   'later': Features for future versions.
    For each feature, provide full details (name, description, userStory, acceptanceCriteria, priority, complexity, estimatedHours, isMVP, dependencies).

2.  **User Flow**:
    *   A step-by-step user flow for the main journey.
    *   For each step, define the 'screen', 'description', key 'components', and 'purpose'.

3.  **Development Plan**:
    *   'categories': Group all features into logical categories.
    *   'developmentPhases': A phased plan (e.g., Phase 1: MVP) with features and time estimates.

Guidelines:
- Ensure 'mustHave' features have 'isMVP: true'.
- The 'developmentPhases' should align with the feature prioritization.
- Be realistic in estimations.

Target audience: ${req.targetAudience || "General users"}
Project type: ${req.projectType || "Web application"}

Return valid JSON matching this structure:
{
  "mustHave": [ { "name": "string", "description": "string", "userStory": "string", "acceptanceCriteria": ["string"], "priority": "high|medium|low", "complexity": "simple|moderate|complex", "estimatedHours": 0, "isMVP": true, "dependencies": [] } ],
  "couldHave": [ { "name": "string", "description": "string", "userStory": "string", "acceptanceCriteria": ["string"], "priority": "high|medium|low", "complexity": "simple|moderate|complex", "estimatedHours": 0, "isMVP": false, "dependencies": [] } ],
  "later": [ { "name": "string", "description": "string", "userStory": "string", "acceptanceCriteria": ["string"], "priority": "high|medium|low", "complexity": "simple|moderate|complex", "estimatedHours": 0, "isMVP": false, "dependencies": [] } ],
  "userFlow": [
    {
      "screen": "string",
      "description": "string",
      "components": ["string"],
      "purpose": "string"
    }
  ],
  "categories": [
    {
      "category": "string",
      "features": [ { "name": "string", "description": "string", "userStory": "string", "acceptanceCriteria": ["string"], "priority": "high|medium|low", "complexity": "simple|moderate|complex", "estimatedHours": 0, "isMVP": true, "dependencies": [] } ]
    }
  ],
  "developmentPhases": [
    {
      "phase": "string",
      "features": ["feature names"],
      "estimatedWeeks": 0
    }
  ],
  "totalMVPHours": 0,
  "totalFullHours": 0
}`;

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openRouterKey()}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://vibes.dev",
          "X-Title": "Vibe Monkey"
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct:free",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: `Generate comprehensive feature specifications for this startup idea: "${req.idea}"`
            }
          ],
          temperature: 0.3,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenRouter API error: ${response.status} - ${errorText}`);
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error("Invalid OpenRouter response format:", data);
        throw new Error("Invalid response format from OpenRouter API");
      }

      const content = data.choices[0].message.content;
      
      try {
        const parsed = JSON.parse(content);
        return parsed;
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        console.error("Content that failed to parse:", content);
        throw new Error("Failed to parse AI response");
      }
    } catch (error) {
      console.error("Feature generation error:", error);
      
      const mustHave = [
        {
          name: "User Registration",
          description: "Allow users to create accounts.",
          userStory: "As a new user, I want to create an account so that I can access the platform.",
          acceptanceCriteria: ["User can register with email and password."],
          priority: "high" as const,
          complexity: "simple" as const,
          estimatedHours: 8,
          isMVP: true,
          dependencies: []
        },
        {
          name: "User Login",
          description: "Allow users to log in.",
          userStory: "As a user, I want to log in to access my account.",
          acceptanceCriteria: ["User can log in with valid credentials."],
          priority: "high" as const,
          complexity: "simple" as const,
          estimatedHours: 6,
          isMVP: true,
          dependencies: ["User Registration"]
        }
      ];
      const couldHave = [
        {
          name: "User Profile",
          description: "Allow users to manage their profile.",
          userStory: "As a user, I want to manage my profile.",
          acceptanceCriteria: ["User can update their profile information."],
          priority: "medium" as const,
          complexity: "simple" as const,
          estimatedHours: 4,
          isMVP: false,
          dependencies: ["User Login"]
        }
      ];

      return {
        mustHave,
        couldHave,
        later: [],
        userFlow: [
          { screen: "Landing Page", description: "Shows the value proposition.", components: ["Hero Section", "CTA Button"], purpose: "Attract users" },
          { screen: "Sign Up Page", description: "Allows new users to register.", components: ["Registration Form"], purpose: "User acquisition" },
          { screen: "Dashboard", description: "Main view after login.", components: ["Feature List", "Navigation"], purpose: "Core application experience" }
        ],
        categories: [
          { category: "User Management", features: [...mustHave, ...couldHave] }
        ],
        developmentPhases: [
          { phase: "Phase 1: MVP", features: mustHave.map(f => f.name), estimatedWeeks: 2 },
          { phase: "Phase 2: V1", features: couldHave.map(f => f.name), estimatedWeeks: 1 }
        ],
        totalMVPHours: 14,
        totalFullHours: 18
      };
    }
  }
);
