import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp,
  Target,
  Calendar,
  Users
} from 'lucide-react';

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

interface FeatureData {
  categories: FeatureCategory[];
  mvpFeatures: string[];
  developmentOrder: string[];
  totalMVPHours: number;
  totalFullHours: number;
}

interface FeatureResultsProps {
  data: FeatureData;
}

export function FeatureResults({ data }: FeatureResultsProps) {
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set());

  const toggleFeature = (featureName: string) => {
    const newExpanded = new Set(expandedFeatures);
    if (newExpanded.has(featureName)) {
      newExpanded.delete(featureName);
    } else {
      newExpanded.add(featureName);
    }
    setExpandedFeatures(newExpanded);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'complex': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return null;
    }
  };

  const mvpProgress = (data.totalMVPHours / data.totalFullHours) * 100;

  return (
    <div className="space-y-8">
      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Feature & Development Overview</CardTitle>
          <CardDescription>
            Comprehensive feature specification and development roadmap
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-12 h-12 rounded-lg flex items-center justify-center mx-auto">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h5 className="font-medium">MVP Features</h5>
              <p className="text-2xl font-bold text-foreground">{data.mvpFeatures.length}</p>
            </div>
            <div className="text-center space-y-2">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-12 h-12 rounded-lg flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h5 className="font-medium">MVP Hours</h5>
              <p className="text-2xl font-bold text-foreground">{data.totalMVPHours}</p>
            </div>
            <div className="text-center space-y-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-lg flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h5 className="font-medium">Total Hours</h5>
              <p className="text-2xl font-bold text-foreground">{data.totalFullHours}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>MVP Progress</span>
              <span>{Math.round(mvpProgress)}% of total scope</span>
            </div>
            <Progress value={mvpProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="features" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="features">Feature Specifications</TabsTrigger>
          <TabsTrigger value="roadmap">Development Roadmap</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-6">
          {data.categories.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                  <span>{category.category}</span>
                  <Badge variant="outline">{category.features.length} features</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.features.map((feature, featureIndex) => {
                    const isExpanded = expandedFeatures.has(feature.name);
                    
                    return (
                      <div key={featureIndex} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center space-x-2">
                              {getPriorityIcon(feature.priority)}
                              <h5 className="font-semibold">{feature.name}</h5>
                              {feature.isMVP && (
                                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                  MVP
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {feature.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <Badge className={getPriorityColor(feature.priority)}>
                                {feature.priority} priority
                              </Badge>
                              <Badge className={getComplexityColor(feature.complexity)}>
                                {feature.complexity}
                              </Badge>
                              <Badge variant="outline">
                                {feature.estimatedHours}h
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFeature(feature.name)}
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        </div>

                        {isExpanded && (
                          <div className="space-y-4 pt-4 border-t">
                            <div>
                              <h6 className="font-medium mb-2">User Story</h6>
                              <p className="text-sm text-muted-foreground italic">
                                {feature.userStory}
                              </p>
                            </div>

                            <div>
                              <h6 className="font-medium mb-2">Acceptance Criteria</h6>
                              <ul className="space-y-1">
                                {feature.acceptanceCriteria.map((criteria, idx) => (
                                  <li key={idx} className="text-sm text-muted-foreground flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    {criteria}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {feature.dependencies.length > 0 && (
                              <div>
                                <h6 className="font-medium mb-2">Dependencies</h6>
                                <div className="flex flex-wrap gap-2">
                                  {feature.dependencies.map((dep, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {dep}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Development Roadmap</span>
              </CardTitle>
              <CardDescription>
                Recommended order of feature development based on dependencies and priorities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center space-y-2">
                        <h5 className="font-medium">MVP Features</h5>
                        <div className="space-y-1">
                          {data.mvpFeatures.map((feature, index) => (
                            <Badge key={index} variant="outline" className="block">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center space-y-2">
                        <h5 className="font-medium">Development Sequence</h5>
                        <div className="space-y-2">
                          {data.developmentOrder.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                                {index + 1}
                              </span>
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 p-4 rounded-lg">
                  <h6 className="font-medium mb-2">💡 Development Tips</h6>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Start with MVP features to validate core assumptions</li>
                    <li>• Follow the dependency order to avoid development blocks</li>
                    <li>• Consider user feedback before building non-MVP features</li>
                    <li>• Plan for iterative development and continuous deployment</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
