import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Brain, 
  Target, 
  Code, 
  ListChecks, 
  Shield, 
  Zap 
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: "AI Enhancement",
    description: "Transform rough ideas into polished, compelling descriptions",
    details: "Our AI analyzes your idea and enhances it for clarity, impact, and professional presentation."
  },
  {
    icon: Target,
    title: "Multi-Pillar Validation",
    description: "Comprehensive analysis across market, technical, and competitive factors",
    details: "Get scored assessments on market potential, problem-solution fit, technical feasibility, and more."
  },
  {
    icon: Code,
    title: "Tech Stack Recommendations",
    description: "Personalized technology suggestions for your project",
    details: "AI-curated tech stacks optimized for your timeline, budget, and team capabilities."
  },
  {
    icon: ListChecks,
    title: "Feature & Roadmap Planning",
    description: "Detailed feature specifications with development roadmaps",
    details: "Get user stories, acceptance criteria, and prioritized development plans for your MVP."
  },
  {
    icon: Shield,
    title: "Risk Assessment",
    description: "Identify potential risks and mitigation strategies",
    details: "Proactive risk analysis with actionable strategies to address potential challenges."
  },
  {
    icon: Zap,
    title: "Actionable Insights",
    description: "Phase-based action plans for immediate implementation",
    details: "Categorized tasks from planning through launch with priority levels and time estimates."
  }
];

export function FeatureHighlights() {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          Comprehensive Startup Analysis
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Our AI provides deep insights across every aspect of your startup, 
          from initial validation to technical implementation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feature.details}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
