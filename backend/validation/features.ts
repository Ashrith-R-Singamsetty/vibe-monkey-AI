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

interface GenerateFeaturesResponse {
  categories: FeatureCategory[];
  mvpFeatures: string[];
  developmentOrder: string[];
  developmentPhases: DevelopmentPhase[];
  totalMVPHours: number;
  totalFullHours: number;
}

// Generates comprehensive feature specifications and development roadmap.
export const generateFeatures = api<GenerateFeaturesRequest, GenerateFeaturesResponse>(
  { expose: true, method: "POST", path: "/features" },
  async (req) => {
    const systemPrompt = `You are a senior product manager and technical architect with expertise in feature specification, user story creation, and development planning. You excel at breaking down complex product ideas into well-defined, implementable features.

Based on the startup idea, generate a comprehensive feature specification including:

1. Feature Categories (Core, User Management, Analytics, etc.)
2. Detailed Features with:
   - Clear descriptions and user stories
   - Acceptance criteria (3-5 specific, testable requirements)
   - Priority levels (high/medium/low)
   - Complexity assessment (simple/moderate/complex)
   - Realistic hour estimates
   - MVP classification (essential vs. nice-to-have)
   - Dependencies on other features

3. Development roadmap with:
   - MVP feature list
   - Recommended development order
   - Development phases (e.g., Phase 1: MVP, Phase 2: V1, Phase 3: Future) with features and time estimates.

Guidelines:
- Focus on user value and business impact
- Be realistic about complexity and time estimates
- Consider technical dependencies
- Prioritize MVP features that validate core assumptions
- Write acceptance criteria that are specific and testable

Target audience: ${req.targetAudience || "General users"}
Project type: ${req.projectType || "Web application"}

Return valid JSON matching this structure:
{
  "categories": [
    {
      "category": "string",
      "features": [
        {
          "name": "string",
          "description": "string",
          "userStory": "As a [user], I want [goal] so that [benefit]",
          "acceptanceCriteria": ["Given..., When..., Then..."],
          "priority": "high|medium|low",
          "complexity": "simple|moderate|complex",
          "estimatedHours": number,
          "isMVP": boolean,
          "dependencies": ["feature names"]
        }
      ]
    }
  ],
  "mvpFeatures": ["feature names"],
  "developmentOrder": ["feature names in order"],
  "developmentPhases": [
    {
      "phase": "string",
      "features": ["feature names"],
      "estimatedWeeks": number
    }
  ],
  "totalMVPHours": number,
  "totalFullHours": number
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
        console.error(`OpenRouter API error: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error("Invalid response structure:", data);
        throw new Error("Invalid response from OpenRouter API");
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
      
      const fallbackFeatures = [
        {
          name: "User Registration",
          description: "Allow users to create accounts and access the platform",
          userStory: "As a new user, I want to create an account so that I can access the platform features",
          acceptanceCriteria: [
            "Given I'm on the registration page, when I enter valid details, then my account is created",
            "Given I'm registering, when I enter an existing email, then I see an error message",
            "Given I've registered, when I check my email, then I receive a confirmation email"
          ],
          priority: "high" as const,
          complexity: "simple" as const,
          estimatedHours: 8,
          isMVP: true,
          dependencies: []
        },
        {
          name: "User Authentication",
          description: "Secure login and session management for users",
          userStory: "As a registered user, I want to log in securely so that I can access my account",
          acceptanceCriteria: [
            "Given I have an account, when I enter correct credentials, then I'm logged in",
            "Given I enter wrong credentials, when I try to log in, then I see an error",
            "Given I'm logged in, when I close the browser, then I remain logged in on return"
          ],
          priority: "high" as const,
          complexity: "simple" as const,
          estimatedHours: 6,
          isMVP: true,
          dependencies: ["User Registration"]
        },
        {
          name: "Core Feature Implementation",
          description: "Implementation of the main feature that solves the primary user problem",
          userStory: "As a user, I want to use the core functionality so that I can solve my primary problem",
          acceptanceCriteria: [
            "Given I'm logged in, when I access the main feature, then it works as expected",
            "Given I use the core functionality, when I complete an action, then I see the results",
            "Given the feature processes my request, when it's complete, then I'm notified"
          ],
          priority: "high" as const,
          complexity: "complex" as const,
          estimatedHours: 40,
          isMVP: true,
          dependencies: ["User Authentication"]
        },
      ];

      return {
        categories: [
          {
            category: "Core Features",
            features: fallbackFeatures
          }
        ],
        mvpFeatures: fallbackFeatures.filter(f => f.isMVP).map(f => f.name),
        developmentOrder: fallbackFeatures.map(f => f.name),
        developmentPhases: [
          {
            phase: "Phase 1: MVP",
            features: fallbackFeatures.filter(f => f.isMVP).map(f => f.name),
            estimatedWeeks: 4
          },
          {
            phase: "Phase 2: V1",
            features: [],
            estimatedWeeks: 2
          }
        ],
        totalMVPHours: fallbackFeatures.filter(f => f.isMVP).reduce((sum, f) => sum + f.estimatedHours, 0),
        totalFullHours: fallbackFeatures.reduce((sum, f) => sum + f.estimatedHours, 0)
      };
    }
  }
);
