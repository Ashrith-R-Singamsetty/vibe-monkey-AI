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
export const getTechStack = api<TechStackRequest, TechStackResponse>({
  method: "POST",
  path: "/tech-stack",
}, async (req) => {
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
            content: `Recommend a tech stack for this startup idea: "${req.idea}"`
          }
        ],
        temperature: 0.2,
        max_tokens: 3000
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
    console.error("Tech stack generation error:", error);
    
    // Fallback response with comprehensive tech stack recommendations
    return {
      recommendations: [
        {
          name: "React + TypeScript",
          category: "frontend" as const,
          reasoning: "Modern, well-supported framework with excellent TypeScript integration for type safety and developer productivity",
          pros: ["Large ecosystem", "Great documentation", "Strong typing", "Component reusability"],
          cons: ["Steeper learning curve", "More complex setup", "Frequent updates"],
          difficulty: "intermediate" as const,
          documentation: "https://react.dev"
        },
        {
          name: "Node.js + Express",
          category: "backend" as const,
          reasoning: "JavaScript everywhere approach enables full-stack development with a single language, reducing context switching",
          pros: ["Same language as frontend", "Fast prototyping", "Large community", "NPM ecosystem"],
          cons: ["Single-threaded limitations", "Callback complexity", "Memory usage"],
          difficulty: "beginner" as const,
          documentation: "https://nodejs.org"
        },
        {
          name: "PostgreSQL",
          category: "database" as const,
          reasoning: "Robust, feature-rich relational database with excellent JSON support and ACID compliance for data integrity",
          pros: ["ACID compliant", "JSON support", "Great performance", "Mature ecosystem"],
          cons: ["More complex than NoSQL", "Requires database design knowledge", "Setup overhead"],
          difficulty: "intermediate" as const,
          documentation: "https://postgresql.org/docs"
        },
        {
          name: "Vercel",
          category: "deployment" as const,
          reasoning: "Seamless deployment platform optimized for modern web applications with excellent developer experience",
          pros: ["Easy deployment", "Great performance", "Built-in CDN", "Automatic scaling"],
          cons: ["Can get expensive", "Vendor lock-in", "Limited backend capabilities"],
          difficulty: "beginner" as const,
          documentation: "https://vercel.com/docs"
        },
        {
          name: "Git + GitHub",
          category: "tools" as const,
          reasoning: "Essential version control and collaboration platform for any software project",
          pros: ["Industry standard", "Great collaboration features", "Free for public repos", "CI/CD integration"],
          cons: ["Learning curve for beginners", "Can be complex for large teams"],
          difficulty: "beginner" as const,
          documentation: "https://docs.github.com"
        }
      ],
      overallApproach: "Modern JavaScript stack optimized for rapid development and ease of deployment. This combination provides a solid foundation for building scalable web applications with good developer experience.",
      estimatedComplexity: "medium" as const,
      timeToMVP: "6-8 weeks",
      learningResources: [
        "React Official Tutorial",
        "Node.js Best Practices Guide",
        "TypeScript Handbook",
        "PostgreSQL Tutorial",
        "Vercel Deployment Guide"
      ]
    };
  }
});
