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

interface GenerateFeaturesResponse {
  categories: FeatureCategory[];
  mvpFeatures: string[];
  developmentOrder: string[];
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
   - Total time estimates

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
  "totalMVPHours": number,
  "totalFullHours": number
}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openRouterKey()}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://vibes.dev",
        "X-Title": "Vibe Monkey"
      },
      body: JSON.stringify({
        model: "mistralai/mixtral-8x7b-instruct:free",
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
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      const parsed = JSON.parse(content);
      return parsed;
    } catch (e) {
      // Fallback response
      return {
        categories: [
          {
            category: "Core Features",
            features: [
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
              }
            ]
          }
        ],
        mvpFeatures: ["User Registration"],
        developmentOrder: ["User Registration"],
        totalMVPHours: 8,
        totalFullHours: 8
      };
    }
  }
);
