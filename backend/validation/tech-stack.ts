import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";

const openRouterKey = secret("OpenRouterKey");

interface TechStackRequest {
  idea: string;
  projectType?: string;
  experience?: string;
  timeline?: string;
  teamSize?: number;
}

interface TechRecommendation {
  name: string;
  category: "frontend" | "backend" | "database" | "deployment" | "tools";
  reasoning: string;
  pros: string[];
  cons: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  documentation: string;
}

interface TechStackResponse {
  recommendations: TechRecommendation[];
  overallApproach: string;
  estimatedComplexity: "low" | "medium" | "high";
  timeToMVP: string;
  learningResources: string[];
}

// Generates personalized technology stack recommendations.
export const getTechStack = api<TechStackRequest, TechStackResponse>(
  { expose: true, method: "POST", path: "/tech-stack" },
  async (req) => {
    const systemPrompt = `You are a senior technical advisor specializing in modern web development and startup technology decisions. Your expertise spans full-stack development, DevOps, and pragmatic technology selection for early-stage companies.

Based on the startup idea and context, recommend an optimal technology stack that balances:
- Development speed and productivity
- Learning curve and team capabilities
- Cost-effectiveness for startups
- Scalability potential
- Community support and ecosystem

Consider these categories:
- Frontend (React, Vue, Svelte, etc.)
- Backend (Node.js, Python, Go, etc.)
- Database (PostgreSQL, MongoDB, etc.)
- Deployment (Vercel, Railway, AWS, etc.)
- Essential Tools (version control, CI/CD, etc.)

For each recommendation, provide:
- Clear reasoning based on project needs
- Specific pros and cons
- Difficulty level assessment
- Link to official documentation

Context: ${req.experience || "Intermediate"} experience level, ${req.timeline || "3 months"} timeline, ${req.teamSize || 1} person team, ${req.projectType || "Web App"} project type.

Return valid JSON with this structure:
{
  "recommendations": [
    {
      "name": "string",
      "category": "frontend|backend|database|deployment|tools",
      "reasoning": "string",
      "pros": ["string"],
      "cons": ["string"],
      "difficulty": "beginner|intermediate|advanced",
      "documentation": "https://..."
    }
  ],
  "overallApproach": "string",
  "estimatedComplexity": "low|medium|high",
  "timeToMVP": "string",
  "learningResources": ["string"]
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
            content: `Recommend a tech stack for this startup idea: "${req.idea}"`
          }
        ],
        temperature: 0.2,
        max_tokens: 3000
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
        recommendations: [
          {
            name: "React + TypeScript",
            category: "frontend" as const,
            reasoning: "Modern, well-supported framework with excellent TypeScript integration",
            pros: ["Large ecosystem", "Great documentation", "Strong typing"],
            cons: ["Steeper learning curve", "More complex setup"],
            difficulty: "intermediate" as const,
            documentation: "https://react.dev"
          },
          {
            name: "Node.js + Express",
            category: "backend" as const,
            reasoning: "JavaScript everywhere, fast development, good for MVPs",
            pros: ["Same language as frontend", "Fast prototyping", "Large community"],
            cons: ["Single-threaded limitations", "Callback complexity"],
            difficulty: "beginner" as const,
            documentation: "https://nodejs.org"
          }
        ],
        overallApproach: "Modern JavaScript stack optimized for rapid development",
        estimatedComplexity: "medium" as const,
        timeToMVP: "6-8 weeks",
        learningResources: [
          "React Official Tutorial",
          "Node.js Best Practices",
          "TypeScript Handbook"
        ]
      };
    }
  }
);
