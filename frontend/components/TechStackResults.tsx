import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Code, Database, Cloud, Wrench } from 'lucide-react';

interface TechRecommendation {
  name: string;
  category: "frontend" | "backend" | "database" | "deployment" | "tools";
  reasoning: string;
  pros: string[];
  cons: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  documentation: string;
}

interface TechStackData {
  recommendations: TechRecommendation[];
  overallApproach: string;
  estimatedComplexity: "low" | "medium" | "high";
  timeToMVP: string;
  learningResources: string[];
}

interface TechStackResultsProps {
  data: TechStackData;
}

export function TechStackResults({ data }: TechStackResultsProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'frontend': return <Code className="w-5 h-5 text-blue-500" />;
      case 'backend': return <Code className="w-5 h-5 text-green-500" />;
      case 'database': return <Database className="w-5 h-5 text-purple-500" />;
      case 'deployment': return <Cloud className="w-5 h-5 text-orange-500" />;
      case 'tools': return <Wrench className="w-5 h-5 text-gray-500" />;
      default: return <Code className="w-5 h-5" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const categorizedRecommendations = data.recommendations.reduce((acc, rec) => {
    if (!acc[rec.category]) acc[rec.category] = [];
    acc[rec.category].push(rec);
    return acc;
  }, {} as Record<string, TechRecommendation[]>);

  return (
    <div className="space-y-8">
      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Technology Stack Overview</CardTitle>
          <CardDescription>
            Personalized recommendations based on your project requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{data.overallApproach}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h5 className="font-medium">Development Complexity</h5>
              <Badge className={getComplexityColor(data.estimatedComplexity)}>
                {data.estimatedComplexity.charAt(0).toUpperCase() + data.estimatedComplexity.slice(1)}
              </Badge>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium">Estimated Time to MVP</h5>
              <Badge variant="outline">{data.timeToMVP}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technology Recommendations */}
      <div className="space-y-6">
        {Object.entries(categorizedRecommendations).map(([category, recommendations]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 capitalize">
                {getCategoryIcon(category)}
                <span>{category}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="font-semibold text-lg">{rec.name}</h5>
                        <Badge className={getDifficultyColor(rec.difficulty)}>
                          {rec.difficulty}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a href={rec.documentation} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Docs
                        </a>
                      </Button>
                    </div>

                    <p className="text-sm text-muted-foreground">{rec.reasoning}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h6 className="text-sm font-medium text-green-600 mb-2">Pros</h6>
                        <ul className="space-y-1">
                          {rec.pros.map((pro, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground">
                              ✓ {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h6 className="text-sm font-medium text-red-600 mb-2">Cons</h6>
                        <ul className="space-y-1">
                          {rec.cons.map((con, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground">
                              ✗ {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Learning Resources */}
      {data.learningResources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Learning Resources</CardTitle>
            <CardDescription>
              Recommended resources to get started with your tech stack
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.learningResources.map((resource, index) => (
                <li key={index} className="flex items-center text-sm">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
                  {resource}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
