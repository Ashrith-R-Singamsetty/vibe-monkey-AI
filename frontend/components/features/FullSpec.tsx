import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

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

interface FullSpecProps {
  categories: FeatureCategory[];
}

export function FullSpec({ categories }: FullSpecProps) {
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

  return (
    <div className="space-y-6">
      {categories.map((category, categoryIndex) => (
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
                            "{feature.userStory}"
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
    </div>
  );
}
