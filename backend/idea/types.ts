// Defines the shape of a single feature
export interface Feature {
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

// Defines a category containing multiple features
export interface FeatureCategory {
  category: string;
  features: Feature[];
}

// Defines a single phase in the development roadmap
export interface DevelopmentPhase {
  phase: string;
  features: string[];
  estimatedWeeks: number;
}

// Defines a single step in the user flow
export interface UserFlowStep {
  screen: string;
  description: string;
  components: string[];
  purpose: string;
}

// Defines the complete response for the features analysis
export interface FeaturesResult {
  categories: FeatureCategory[];
  mustHave: Feature[];
  couldHave: Feature[];
  later: Feature[];
  userFlow: UserFlowStep[];
  developmentPhases: DevelopmentPhase[];
  totalMVPHours: number;
  totalFullHours: number;
}

// Defines a pillar of the validation analysis
export interface ValidationPillar {
  name: string;
  score: number;
  confidence: number;
  reasoning: string;
  strengths: string[];
  weaknesses: string[];
}

// Defines an item in the action plan
export interface ActionItem {
  phase: string;
  task: string;
  priority: "high" | "medium" | "low";
  estimatedTime: string;
  description: string;
}

// Defines a single risk
export interface Risk {
  type: string;
  description: string;
  impact: number;
  likelihood: number;
  mitigation: string;
}

// Defines the complete response for the validation analysis
export interface ValidationResult {
  overallScore: number;
  pillars: ValidationPillar[];
  actionPlan: ActionItem[];
  risks: Risk[];
  keyInsights: string[];
}

// Defines a single technology recommendation
export interface TechRecommendation {
  name: string;
  category: "frontend" | "backend" | "database" | "deployment" | "tools";
  reasoning: string;
  pros: string[];
  cons: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  documentation: string;
}

// Defines the complete response for the tech stack analysis
export interface TechStackResult {
  recommendations: TechRecommendation[];
  overallApproach: string;
  estimatedComplexity: "low" | "medium" | "high";
  timeToMVP: string;
  learningResources: string[];
}

// Defines the full Idea object, including all analysis results
export interface Idea {
  id: string;
  name: string;
  originalIdea: string;
  enhancedIdea?: string;
  context: any;
  validationResult?: ValidationResult;
  techStackResult?: TechStackResult;
  featuresResult?: FeaturesResult;
  createdAt: Date;
  updatedAt: Date;
}

// Defines a summary of an idea for list views
export interface IdeaSummary {
  id: string;
  name: string;
  createdAt: Date;
}
