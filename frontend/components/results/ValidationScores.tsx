import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Zap, Layers, DollarSign } from "lucide-react";

interface ValidationScore {
  score: number;
  confidence: number;
  reasoning: string;
}

interface ValidationPillar {
  marketPotential: ValidationScore;
  problemSolutionFit: ValidationScore;
  technicalFeasibility: ValidationScore;
  competition: ValidationScore;
  businessModel: ValidationScore;
}

interface ValidationData {
  overallScore: number;
  pillars: ValidationPillar;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

interface ValidationScoresProps {
  validation: ValidationData;
}

const pillarInfo = {
  marketPotential: {
    icon: <Users className="h-5 w-5" />,
    title: "Market Potential",
    description: "Target audience and market opportunity"
  },
  problemSolutionFit: {
    icon: <TrendingUp className="h-5 w-5" />,
    title: "Problem-Solution Fit",
    description: "How well the solution addresses real pain points"
  },
  technicalFeasibility: {
    icon: <Zap className="h-5 w-5" />,
    title: "Technical Feasibility",
    description: "Development complexity and resource requirements"
  },
  competition: {
    icon: <Layers className="h-5 w-5" />,
    title: "Competition & Differentiation",
    description: "Competitive landscape and unique positioning"
  },
  businessModel: {
    icon: <DollarSign className="h-5 w-5" />,
    title: "Business Model",
    description: "Revenue potential and business sustainability"
  }
};

export default function ValidationScores({ validation }: ValidationScoresProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceVariant = (confidence: number) => {
    if (confidence >= 80) return "default";
    if (confidence >= 60) return "secondary";
    return "outline";
  };

  return (
    <div className="space-y-6">
      {/* Pillar Scores */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(validation.pillars).map(([key, pillar]) => {
          const info = pillarInfo[key as keyof typeof pillarInfo];
          return (
            <Card key={key}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  {info.icon}
                  {info.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {info.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-2xl font-bold ${getScoreColor(pillar.score)}`}>
                      {pillar.score}
                    </span>
                    <Badge variant={getConfidenceVariant(pillar.confidence)}>
                      {pillar.confidence}% confidence
                    </Badge>
                  </div>
                  <Progress value={pillar.score} className="h-2" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {pillar.reasoning}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Strengths</CardTitle>
            <CardDescription>
              Key advantages of your startup idea
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {validation.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="h-1.5 w-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                  {strength}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-amber-600">Areas for Improvement</CardTitle>
            <CardDescription>
              Potential challenges to address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {validation.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="h-1.5 w-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0" />
                  {weakness}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Strategic Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Strategic Recommendations</CardTitle>
          <CardDescription>
            AI-generated strategic advice for your startup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {validation.recommendations.map((recommendation, index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm leading-relaxed">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
