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
export const generateFeatures = api<GenerateFeaturesRequest, GenerateFeaturesResponse>({
  method: "POST",
  path: "/features",
}, async (req) => {
  const systemPrompt = `You are a senior product manager and technical architect. Your task is to generate a comprehensive product plan for a startup idea.

Based on the startup idea, generate:

1.  **Feature Prioritization**:
    *   'mustHave': Core features for the MVP (6-10 features)
    *   'couldHave': Important features for a V1 release (4-6 features)
    *   'later': Features for future versions (3-5 features)
    For each feature, provide full details (name, description, userStory, acceptanceCriteria, priority, complexity, estimatedHours, isMVP, dependencies).

2.  **User Flow**:
    *   A comprehensive step-by-step user flow for the main journey (6-10 steps)
    *   For each step, define the 'screen', 'description', key 'components', and 'purpose'.

3.  **Development Plan**:
    *   'categories': Group all features into logical categories (4-6 categories)
    *   'developmentPhases': A phased plan (e.g., Phase 1: MVP, Phase 2: Enhanced, Phase 3: Advanced) with features and time estimates.

Guidelines:
- Generate REALISTIC and SPECIFIC features based on the idea
- Ensure 'mustHave' features have 'isMVP: true'
- Make features detailed and actionable
- Include proper business logic features, not just basic auth
- The 'developmentPhases' should align with the feature prioritization
- Be realistic in estimations
- Focus on the core value proposition of the startup idea

Target audience: ${req.targetAudience || "General users"}
Project type: ${req.projectType || "Web application"}

Return valid JSON matching this structure:
{
  "mustHave": [ { "name": "string", "description": "string", "userStory": "string", "acceptanceCriteria": ["string"], "priority": "high", "complexity": "simple", "estimatedHours": 0, "isMVP": true, "dependencies": [] } ],
  "couldHave": [ { "name": "string", "description": "string", "userStory": "string", "acceptanceCriteria": ["string"], "priority": "medium", "complexity": "moderate", "estimatedHours": 0, "isMVP": false, "dependencies": [] } ],
  "later": [ { "name": "string", "description": "string", "userStory": "string", "acceptanceCriteria": ["string"], "priority": "low", "complexity": "complex", "estimatedHours": 0, "isMVP": false, "dependencies": [] } ],
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
      "features": [ { "name": "string", "description": "string", "userStory": "string", "acceptanceCriteria": ["string"], "priority": "high", "complexity": "simple", "estimatedHours": 0, "isMVP": true, "dependencies": [] } ]
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
    
    // Enhanced fallback response with comprehensive features
    const mustHave = [
      {
        name: "User Registration & Authentication",
        description: "Secure user registration and login system with email verification.",
        userStory: "As a new user, I want to create an account securely so that I can access the platform.",
        acceptanceCriteria: ["User can register with email and password", "Email verification required", "Password strength validation"],
        priority: "high" as const,
        complexity: "simple" as const,
        estimatedHours: 12,
        isMVP: true,
        dependencies: []
      },
      {
        name: "Core Dashboard",
        description: "Central hub displaying key metrics, recent activity, and quick actions.",
        userStory: "As a user, I want to see an overview of my account and quick access to main features.",
        acceptanceCriteria: ["Shows key metrics", "Recent activity feed", "Quick action buttons", "Responsive design"],
        priority: "high" as const,
        complexity: "moderate" as const,
        estimatedHours: 16,
        isMVP: true,
        dependencies: ["User Registration & Authentication"]
      },
      {
        name: "Data Input & Management",
        description: "Interface for users to input, edit, and organize their primary data.",
        userStory: "As a user, I want to easily add and manage my data so that I can track my progress.",
        acceptanceCriteria: ["Add new entries", "Edit existing data", "Delete functionality", "Search and filter"],
        priority: "high" as const,
        complexity: "moderate" as const,
        estimatedHours: 20,
        isMVP: true,
        dependencies: ["Core Dashboard"]
      },
      {
        name: "Analytics & Reporting",
        description: "Visual charts and reports showing user data trends and insights.",
        userStory: "As a user, I want to see visual representations of my data to understand patterns.",
        acceptanceCriteria: ["Interactive charts", "Date range filtering", "Export functionality", "Key metrics display"],
        priority: "high" as const,
        complexity: "moderate" as const,
        estimatedHours: 24,
        isMVP: true,
        dependencies: ["Data Input & Management"]
      },
      {
        name: "Search & Discovery",
        description: "Powerful search functionality with filters and recommendations.",
        userStory: "As a user, I want to quickly find specific information or discover relevant content.",
        acceptanceCriteria: ["Full-text search", "Advanced filters", "Search suggestions", "Recent searches"],
        priority: "high" as const,
        complexity: "moderate" as const,
        estimatedHours: 18,
        isMVP: true,
        dependencies: ["Data Input & Management"]
      },
      {
        name: "User Profile & Settings",
        description: "Comprehensive profile management and application preferences.",
        userStory: "As a user, I want to manage my profile and customize my experience.",
        acceptanceCriteria: ["Edit profile information", "Upload profile picture", "Privacy settings", "Notification preferences"],
        priority: "high" as const,
        complexity: "simple" as const,
        estimatedHours: 14,
        isMVP: true,
        dependencies: ["User Registration & Authentication"]
      },
      {
        name: "Notifications System",
        description: "In-app and email notifications for important events and updates.",
        userStory: "As a user, I want to be notified about important updates and activities.",
        acceptanceCriteria: ["In-app notifications", "Email notifications", "Notification preferences", "Mark as read/unread"],
        priority: "high" as const,
        complexity: "moderate" as const,
        estimatedHours: 16,
        isMVP: true,
        dependencies: ["User Profile & Settings"]
      },
      {
        name: "Export & Sharing",
        description: "Ability to export data and share insights with others.",
        userStory: "As a user, I want to export my data and share results with colleagues or friends.",
        acceptanceCriteria: ["Export to CSV/PDF", "Generate shareable links", "Social media sharing", "Email sharing"],
        priority: "medium" as const,
        complexity: "simple" as const,
        estimatedHours: 12,
        isMVP: true,
        dependencies: ["Analytics & Reporting"]
      }
    ];

    const couldHave = [
      {
        name: "Advanced Analytics",
        description: "AI-powered insights and predictive analytics for user data.",
        userStory: "As a user, I want intelligent insights about my data to make better decisions.",
        acceptanceCriteria: ["Trend predictions", "Anomaly detection", "Personalized recommendations", "Comparison features"],
        priority: "medium" as const,
        complexity: "complex" as const,
        estimatedHours: 32,
        isMVP: false,
        dependencies: ["Analytics & Reporting"]
      },
      {
        name: "Collaboration Features",
        description: "Team collaboration tools including sharing, comments, and permissions.",
        userStory: "As a user, I want to collaborate with team members on shared projects.",
        acceptanceCriteria: ["Invite team members", "Permission management", "Comments system", "Shared workspaces"],
        priority: "medium" as const,
        complexity: "complex" as const,
        estimatedHours: 28,
        isMVP: false,
        dependencies: ["User Profile & Settings"]
      },
      {
        name: "Mobile App",
        description: "Native mobile application for iOS and Android platforms.",
        userStory: "As a user, I want to access the platform on my mobile device for convenience.",
        acceptanceCriteria: ["iOS app", "Android app", "Offline functionality", "Push notifications"],
        priority: "medium" as const,
        complexity: "complex" as const,
        estimatedHours: 80,
        isMVP: false,
        dependencies: ["Core Dashboard"]
      },
      {
        name: "API Integration",
        description: "Integration with popular third-party services and APIs.",
        userStory: "As a user, I want to connect my existing tools and services to streamline my workflow.",
        acceptanceCriteria: ["OAuth integration", "Data synchronization", "Webhook support", "API documentation"],
        priority: "medium" as const,
        complexity: "moderate" as const,
        estimatedHours: 24,
        isMVP: false,
        dependencies: ["Data Input & Management"]
      },
      {
        name: "Custom Branding",
        description: "White-label solution allowing custom branding for enterprise clients.",
        userStory: "As an enterprise client, I want to customize the platform's appearance to match my brand.",
        acceptanceCriteria: ["Custom logo upload", "Color scheme customization", "Custom domain", "Branded emails"],
        priority: "low" as const,
        complexity: "moderate" as const,
        estimatedHours: 20,
        isMVP: false,
        dependencies: ["User Profile & Settings"]
      }
    ];

    const later = [
      {
        name: "AI Chat Assistant",
        description: "Intelligent chatbot to help users navigate the platform and answer questions.",
        userStory: "As a user, I want an AI assistant to help me use the platform more effectively.",
        acceptanceCriteria: ["Natural language processing", "Context awareness", "Integration with help docs", "Learning from interactions"],
        priority: "low" as const,
        complexity: "complex" as const,
        estimatedHours: 40,
        isMVP: false,
        dependencies: ["Advanced Analytics"]
      },
      {
        name: "Marketplace",
        description: "Platform for users to buy/sell templates, integrations, or services.",
        userStory: "As a user, I want to access additional templates and services from the community.",
        acceptanceCriteria: ["Template marketplace", "Payment processing", "Rating system", "Revenue sharing"],
        priority: "low" as const,
        complexity: "complex" as const,
        estimatedHours: 60,
        isMVP: false,
        dependencies: ["Collaboration Features"]
      },
      {
        name: "Advanced Automation",
        description: "Workflow automation with triggers, conditions, and actions.",
        userStory: "As a power user, I want to automate repetitive tasks to save time.",
        acceptanceCriteria: ["Workflow builder", "Trigger conditions", "Action sequences", "Automation monitoring"],
        priority: "low" as const,
        complexity: "complex" as const,
        estimatedHours: 48,
        isMVP: false,
        dependencies: ["API Integration"]
      },
      {
        name: "Enterprise Features",
        description: "Advanced security, compliance, and administrative features for enterprise clients.",
        userStory: "As an enterprise admin, I want advanced security and compliance features.",
        acceptanceCriteria: ["SSO integration", "Audit logs", "GDPR compliance", "Advanced user management"],
        priority: "low" as const,
        complexity: "complex" as const,
        estimatedHours: 56,
        isMVP: false,
        dependencies: ["Custom Branding"]
      }
    ];

    const allFeatures = [...mustHave, ...couldHave, ...later];

    return {
      mustHave,
      couldHave,
      later,
      userFlow: [
        { 
          screen: "Landing Page", 
          description: "Welcome page showcasing the value proposition and key features.", 
          components: ["Hero Section", "Feature Highlights", "CTA Button", "Login Link"], 
          purpose: "Attract and convert visitors to sign up" 
        },
        { 
          screen: "Registration Page", 
          description: "User registration form with email verification.", 
          components: ["Registration Form", "Email Verification", "Terms Agreement"], 
          purpose: "Capture new user information and create accounts" 
        },
        { 
          screen: "Onboarding Flow", 
          description: "Multi-step introduction to key features and initial setup.", 
          components: ["Welcome Message", "Feature Tour", "Initial Setup", "Skip Option"], 
          purpose: "Educate users and improve activation rates" 
        },
        { 
          screen: "Main Dashboard", 
          description: "Central hub showing overview metrics and quick actions.", 
          components: ["Metric Cards", "Recent Activity", "Quick Actions", "Navigation Menu"], 
          purpose: "Provide overview and easy access to main features" 
        },
        { 
          screen: "Data Input Interface", 
          description: "Primary interface for adding and managing user data.", 
          components: ["Input Forms", "Data Grid", "Search Bar", "Action Buttons"], 
          purpose: "Enable core data management functionality" 
        },
        { 
          screen: "Analytics Dashboard", 
          description: "Visual representation of data trends and insights.", 
          components: ["Charts & Graphs", "Filter Controls", "Export Options", "Date Picker"], 
          purpose: "Help users understand their data patterns" 
        },
        { 
          screen: "Search Results", 
          description: "Display of search results with filtering options.", 
          components: ["Search Results List", "Filter Sidebar", "Sort Options", "Pagination"], 
          purpose: "Help users find specific information quickly" 
        },
        { 
          screen: "Profile Settings", 
          description: "User profile management and application preferences.", 
          components: ["Profile Form", "Avatar Upload", "Notification Settings", "Privacy Controls"], 
          purpose: "Allow users to customize their experience" 
        },
        { 
          screen: "Notifications Center", 
          description: "Central location for all user notifications and updates.", 
          components: ["Notification List", "Mark Read Button", "Filter Options", "Settings Link"], 
          purpose: "Keep users informed of important updates" 
        },
        { 
          screen: "Export & Share", 
          description: "Interface for exporting data and sharing insights.", 
          components: ["Export Options", "Share Buttons", "Link Generator", "Download Progress"], 
          purpose: "Enable data portability and collaboration" 
        }
      ],
      categories: [
        { 
          category: "Authentication & Security", 
          features: [mustHave[0], mustHave[5], later[3]] 
        },
        { 
          category: "Core Functionality", 
          features: [mustHave[1], mustHave[2], mustHave[4]] 
        },
        { 
          category: "Analytics & Insights", 
          features: [mustHave[3], couldHave[0], later[0]] 
        },
        { 
          category: "Communication & Sharing", 
          features: [mustHave[6], mustHave[7], couldHave[1]] 
        },
        { 
          category: "Platform & Integration", 
          features: [couldHave[2], couldHave[3], later[2]] 
        },
        { 
          category: "Enterprise & Advanced", 
          features: [couldHave[4], later[1], later[3]] 
        }
      ],
      developmentPhases: [
        { 
          phase: "Phase 1: MVP Core", 
          features: mustHave.map(f => f.name), 
          estimatedWeeks: 12 
        },
        { 
          phase: "Phase 2: Enhanced Features", 
          features: couldHave.map(f => f.name), 
          estimatedWeeks: 16 
        },
        { 
          phase: "Phase 3: Advanced & Enterprise", 
          features: later.map(f => f.name), 
          estimatedWeeks: 20 
        }
      ],
      totalMVPHours: mustHave.reduce((sum, f) => sum + f.estimatedHours, 0),
      totalFullHours: allFeatures.reduce((sum, f) => sum + f.estimatedHours, 0)
    };
  }
});
