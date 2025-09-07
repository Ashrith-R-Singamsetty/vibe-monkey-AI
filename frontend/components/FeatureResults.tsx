import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, Target, Users } from 'lucide-react';
import { FeaturePrioritization } from './features/FeaturePrioritization';
import { UserFlow } from './features/UserFlow';
import { FullSpec } from './features/FullSpec';

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

interface FeatureData {
  categories: FeatureCategory[];
  mustHave: Feature[];
  couldHave: Feature[];
  later: Feature[];
  userFlow: UserFlowStep[];
  developmentPhases: DevelopmentPhase[];
  totalMVPHours: number;
  totalFullHours: number;
}

interface FeatureResultsProps {
  data: FeatureData;
}

export function FeatureResults({ data }: FeatureResultsProps) {
  const mvpProgress = data.totalFullHours > 0 ? (data.totalMVPHours / data.totalFullHours) * 100 : 0;

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
              <p className="text-2xl font-bold text-foreground">{data.mustHave?.length || 0}</p>
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

      <FeaturePrioritization 
        mustHave={data.mustHave || []}
        couldHave={data.couldHave || []}
        later={data.later || []}
      />
      
      <UserFlow userFlow={data.userFlow || []} />

      <FullSpec categories={data.categories || []} />
    </div>
  );
}
