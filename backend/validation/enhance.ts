import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";

const openRouterKey = secret("OpenRouterKey");

interface EnhanceIdeaRequest {
  originalIdea: string;
}

interface EnhanceIdeaResponse {
  enhancedDescription: string;
  improvements: string[];
}

// Enhances a raw startup idea description using AI.
export const enhanceIdea = api<EnhanceIdeaRequest, EnhanceIdeaResponse>(
  { expose: true, method: "POST", path: "/enhance" },
  async (req) => {
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
            content: `You are an expert startup advisor and copywriter. Your task is to take rough, unpolished startup ideas and transform them into clear, compelling, and professional descriptions.

Guidelines:
- Keep the enhanced description to 3-4 sentences maximum
- Focus on the problem being solved and the target audience
- Highlight the unique value proposition
- Use clear, jargon-free language
- Make it sound professional but approachable
- Don't add features or capabilities not mentioned in the original idea

Return your response as JSON with this structure:
{
  "enhancedDescription": "The polished 3-4 sentence description",
  "improvements": ["List of 3-5 specific improvements made", "Another improvement", "etc."]
}`
          },
          {
            role: "user",
            content: `Please enhance this startup idea: "${req.originalIdea}"`
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      const parsed = JSON.parse(content);
      return {
        enhancedDescription: parsed.enhancedDescription,
        improvements: parsed.improvements
      };
    } catch (e) {
      // Fallback if JSON parsing fails
      return {
        enhancedDescription: content,
        improvements: ["AI enhancement applied"]
      };
    }
  }
);
