import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rocket, Sparkles, Telescope } from 'lucide-react';

interface Feature {
  name: string;
  description: string;
  priority: "high" | "medium" | "low";
  estimatedHours: number;
}

interface FeaturePrioritizationProps {
  mustHave: Feature[];
  couldHave: Feature[];
  later: Feature[];
}

const FeatureCard = ({ feature }: { feature: Feature }) => (
  <div className="p-3 border rounded-lg bg-background">
    <h4 className="font-semibold text-sm">{feature.name}</h4>
    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{feature.description}</p>
    <div className="flex items-center justify-between mt-2">
      <Badge variant={feature.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
        {feature.priority} priority
      </Badge>
      <span className="text-xs text-muted-foreground">{feature.estimatedHours}h</span>
    </div>
  </div>
);

export function FeaturePrioritization({ mustHave, couldHave, later }: FeaturePrioritizationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Prioritization</CardTitle>
        <CardDescription>
          Features categorized by priority to guide your development focus.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2 text-red-600">
            <Rocket className="w-5 h-5" />
            Must-Haves (MVP)
          </h3>
          <div className="space-y-3">
            {mustHave.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2 text-yellow-600">
            <Sparkles className="w-5 h-5" />
            Could-Haves (V1)
          </h3>
          <div className="space-y-3">
            {couldHave.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2 text-blue-600">
            <Telescope className="w-5 h-5" />
            Later (Future)
          </h3>
          <div className="space-y-3">
            {later.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
