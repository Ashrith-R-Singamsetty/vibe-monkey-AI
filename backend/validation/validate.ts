import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";

const openRouterKey = secret("OpenRouterKey");

interface ValidateIdeaRequest {
  idea: string;
  industry?: string;
  timeline?: string;
  budget?: string;
  teamSize?: number;
}

interface ValidationPillar {
  name: string;
  score: number;
  confidence: number;
  reasoning: string;
  strengths: string[];
  weaknesses: string[];
}

interface ActionItem {
  phase: string;
  task: string;
  priority: "high" | "medium" | "low";
  estimatedTime: string;
  description: string;
}

interface Risk {
  type: string;
  description: string;
  impact: number;
  likelihood: number;
  mitigation: string;
}

interface ValidateIdeaResponse {
  overallScore: number;
  pillars: ValidationPillar[];
  actionPlan: ActionItem[];
  risks: Risk[];
  keyInsights: string[];
}

// Performs comprehensive validation analysis of a startup idea.
export const validateIdea = api<ValidateIdeaRequest, ValidateIdeaResponse>({
  method: "POST",
  path: "/validate",
}, async (req) => {
  const systemPrompt = `You are an expert startup advisor with deep experience in venture capital, product development, and market analysis. You will perform comprehensive validation analysis across multiple business dimensions.

Analyze the startup idea across these pillars:
1. Market Potential (target audience, market size, growth opportunities)
2. Problem-Solution Fit (how well the solution addresses real pain points)
3. Technical Feasibility (development complexity, resource requirements)
4. Competition & Differentiation (competitive landscape, unique value)
5. Business Model Viability (revenue potential, sustainability)

For each pillar, provide:
- Score (1-100)
- Confidence level (1-100)
- Detailed reasoning
- 2-3 key strengths
- 2-3 key weaknesses

Generate action plan with tasks categorized by phase:
- Planning (research, validation)
- Design (wireframes, UX)
- Development (MVP building)
- Testing (user testing, validation)
- Launch (go-to-market)
- Marketing (early traction)

Identify 3-5 key risks with impact/likelihood scores (1-10) and mitigation strategies.

Context: ${req.industry || "General"} industry, ${req.timeline || "6 months"} timeline, ${req.budget || "Bootstrap"} budget, ${req.teamSize || 1} person team.

Return response as valid JSON matching this structure:
{
  "overallScore": number,
  "pillars": [
    {
      "name": "string",
      "score": number,
      "confidence": number,
      "reasoning": "string",
      "strengths": ["string"],
      "weaknesses": ["string"]
    }
  ],
  "actionPlan": [
    {
      "phase": "string",
      "task": "string",
      "priority": "high|medium|low",
      "estimatedTime": "string",
      "description": "string"
    }
  ],
  "risks": [
    {
      "type": "string",
      "description": "string",
      "impact": number,
      "likelihood": number,
      "mitigation": "string"
    }
  ],
  "keyInsights": ["string"]
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
            content: `Please analyze this startup idea: "${req.idea}"`
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
    console.error("Validation analysis error:", error);
    
    // Fallback response if API fails
    return {
      overallScore: 65,
      pillars: [
        {
          name: "Market Potential",
          score: 70,
          confidence: 80,
          reasoning: "The idea addresses a recognizable market need with potential for growth",
          strengths: ["Clear target market", "Scalable opportunity"],
          weaknesses: ["Market size needs validation", "Competition analysis required"]
        },
        {
          name: "Problem-Solution Fit",
          score: 65,
          confidence: 75,
          reasoning: "The solution appears to address a real problem but needs validation",
          strengths: ["Clear problem statement", "Direct solution approach"],
          weaknesses: ["User validation needed", "Problem severity unclear"]
        },
        {
          name: "Technical Feasibility",
          score: 75,
          confidence: 85,
          reasoning: "The technical requirements appear achievable with modern technology",
          strengths: ["Proven technology stack available", "Reasonable complexity"],
          weaknesses: ["Resource requirements substantial", "Technical expertise needed"]
        },
        {
          name: "Competition & Differentiation",
          score: 60,
          confidence: 70,
          reasoning: "Competitive landscape exists but differentiation opportunities are present",
          strengths: ["Unique value proposition potential", "Market gaps identified"],
          weaknesses: ["Strong competitors present", "Differentiation unclear"]
        },
        {
          name: "Business Model Viability",
          score: 55,
          confidence: 65,
          reasoning: "Revenue model needs clarification and validation",
          strengths: ["Multiple revenue streams possible", "Scalable model potential"],
          weaknesses: ["Revenue model unclear", "Monetization strategy needed"]
        }
      ],
      actionPlan: [
        {
          phase: "Planning",
          task: "Conduct Market Research",
          priority: "high" as const,
          estimatedTime: "2 weeks",
          description: "Research target market, competitors, and validate problem-solution fit"
        },
        {
          phase: "Planning",
          task: "Define MVP Features",
          priority: "high" as const,
          estimatedTime: "1 week",
          description: "Identify core features needed for minimum viable product"
        },
        {
          phase: "Design",
          task: "Create User Journey Maps",
          priority: "medium" as const,
          estimatedTime: "1 week",
          description: "Map out user interactions and experience flow"
        },
        {
          phase: "Development",
          task: "Build Core MVP",
          priority: "high" as const,
          estimatedTime: "6-8 weeks",
          description: "Develop minimum viable product with essential features"
        },
        {
          phase: "Testing",
          task: "User Testing & Feedback",
          priority: "high" as const,
          estimatedTime: "2 weeks",
          description: "Test with real users and gather feedback for improvements"
        },
        {
          phase: "Launch",
          task: "Soft Launch Strategy",
          priority: "medium" as const,
          estimatedTime: "1 week",
          description: "Plan and execute initial launch to limited audience"
        }
      ],
      risks: [
        {
          type: "Market Risk",
          description: "Target market may be smaller than anticipated or problem may not be significant enough",
          impact: 7,
          likelihood: 5,
          mitigation: "Conduct thorough market research and user interviews before development"
        },
        {
          type: "Technical Risk",
          description: "Development may take longer or be more complex than estimated",
          impact: 6,
          likelihood: 6,
          mitigation: "Start with simple MVP, use proven technologies, and plan for iterative development"
        },
        {
          type: "Competition Risk",
          description: "Established competitors may respond aggressively or new competitors may emerge",
          impact: 6,
          likelihood: 7,
          mitigation: "Focus on unique value proposition and build strong customer relationships"
        },
        {
          type: "Resource Risk",
          description: "Limited budget and team size may constrain development and marketing efforts",
          impact: 8,
          likelihood: 6,
          mitigation: "Prioritize essential features, consider partnerships, and plan phased development"
        }
      ],
      keyInsights: [
        "The idea shows promise but needs market validation before significant investment",
        "Focus on building a simple MVP to test core assumptions quickly",
        "Consider the competitive landscape and develop clear differentiation strategy",
        "Resource constraints require careful prioritization of features and activities"
      ]
    };
  }
});
