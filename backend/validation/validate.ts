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
export const validateIdea = api<ValidateIdeaRequest, ValidateIdeaResponse>(
  { expose: true, method: "POST", path: "/validate" },
  async (req) => {
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
            content: `Please analyze this startup idea: "${req.idea}"`
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
      // Fallback response if JSON parsing fails
      return {
        overallScore: 65,
        pillars: [
          {
            name: "Market Potential",
            score: 70,
            confidence: 80,
            reasoning: "Analysis in progress - please try again",
            strengths: ["Market opportunity identified"],
            weaknesses: ["Further analysis needed"]
          }
        ],
        actionPlan: [
          {
            phase: "Planning",
            task: "Market Research",
            priority: "high" as const,
            estimatedTime: "1 week",
            description: "Conduct detailed market analysis"
          }
        ],
        risks: [
          {
            type: "Market Risk",
            description: "Analysis incomplete",
            impact: 5,
            likelihood: 5,
            mitigation: "Retry analysis"
          }
        ],
        keyInsights: ["Comprehensive analysis in progress"]
      };
    }
  }
);
