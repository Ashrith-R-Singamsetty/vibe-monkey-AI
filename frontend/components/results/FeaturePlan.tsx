import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Clock, Zap, Users, CheckCircle } from "lucide-react";

interface Feature {
  name: string;
  description: string;
  userStory: string;
  acceptanceCriteria: string[];
  priority: "high" | "medium" | "low";
  complexity: "low" | "medium" | "high";
  estimatedHours: number;
  isMvp: boolean;
  dependencies: string[];
}

interface FeatureData {
  features: Feature[];
  mvpFeatures: Feature[];
  developmentPhases: {
    phase: string;
    features: string[];
    estimatedWeeks: number;
  }[];
  totalEstimatedHours: number;
}

interface FeaturePlanProps {
  features: FeatureData;
}

const priorityColors = {
  high: "destructive",
  medium: "secondary", 
  low: "outline"
} as const;

const complexityColors = {
  low: "text-green-600",
  medium: "text-yellow-600",
  high: "text-red-600"
};

export default function FeaturePlan({ features }: FeaturePlanProps) {
  const [expandedFeatures, setExpandedFeatures] = useState<string[]>([]);

  const toggleFeature = (featureName: string) => {
    setExpandedFeatures(prev =>
      prev.includes(featureName)
        ? prev.filter(name => name !== featureName)
        : [...prev, featureName]
    );
  };

  const mvpHours = features.mvpFeatures.reduce((sum, feature) => sum + feature.estimatedHours, 0);
  const mvpWeeks = Math.ceil(mvpHours / 40);

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Total Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{features.features.length}</div>
            <p className="text-sm text-muted-foreground">
              {features.mvpFeatures.length} essential for MVP
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Development Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{features.totalEstimatedHours}h</div>
            <p className="text-sm text-muted-foreground">
              {mvpHours}h for MVP ({mvpWeeks} weeks)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Development Phases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{features.developmentPhases.length}</div>
            <p className="text-sm text-muted-foreground">
              Organized development phases
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Feature Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Features</TabsTrigger>
          <TabsTrigger value="mvp">MVP Essential</TabsTrigger>
          <TabsTrigger value="phases">Development Phases</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {features.features.map((feature, index) => (
            <Card key={index}>
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ChevronDown className="h-4 w-4" />
                        <div>
                          <CardTitle className="text-lg">{feature.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {feature.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {feature.isMvp && (
                          <Badge variant="default" className="text-xs">MVP</Badge>
                        )}
                        <Badge variant={priorityColors[feature.priority]} className="text-xs">
                          {feature.priority}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${complexityColors[feature.complexity]}`}>
                          {feature.complexity}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {feature.estimatedHours}h
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium mb-1">User Story</h5>
                        <p className="text-sm text-muted-foreground italic">
                          {feature.userStory}
                        </p>
                      </div>

                      <div>
                        <h5 className="font-medium mb-2">Acceptance Criteria</h5>
                        <ul className="space-y-1">
                          {feature.acceptanceCriteria.map((criteria, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              {criteria}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {feature.dependencies.length > 0 && (
                        <div>
                          <h5 className="font-medium mb-2">Dependencies</h5>
                          <div className="flex flex-wrap gap-1">
                            {feature.dependencies.map((dep, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {dep}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="mvp" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>MVP Feature Summary</CardTitle>
              <CardDescription>
                Essential features needed for your minimum viable product
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 mb-4">
                <div className="flex items-center justify-between">
                  <span>Total MVP Hours</span>
                  <span className="font-medium">{mvpHours} hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Estimated Timeline</span>
                  <span className="font-medium">{mvpWeeks} weeks (40h/week)</span>
                </div>
                <Progress value={(mvpHours / features.totalEstimatedHours) * 100} />
              </div>
              
              <div className="space-y-2">
                {features.mvpFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h5 className="font-medium">{feature.name}</h5>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={priorityColors[feature.priority]} className="text-xs">
                        {feature.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {feature.estimatedHours}h
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phases" className="space-y-4">
          {features.developmentPhases.map((phase, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {phase.phase}
                  <Badge variant="outline">
                    {phase.estimatedWeeks} week{phase.estimatedWeeks !== 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {phase.features.length} feature{phase.features.length !== 1 ? 's' : ''} in this phase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {phase.features.map((featureName, i) => {
                    const feature = features.features.find(f => f.name === featureName);
                    return feature ? (
                      <div key={i} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm font-medium">{feature.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant={priorityColors[feature.priority]} className="text-xs">
                            {feature.priority}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {feature.estimatedHours}h
                          </span>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
