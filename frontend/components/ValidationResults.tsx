import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface ValidationPillar {
  name: string;
  score: number;
  confidence: number;
  reasoning: string;
  strengths: string[];
  weaknesses: string[];
}

interface ActionItem {
  phase: string;
  task: string;
  priority: "high" | "medium" | "low";
  estimatedTime: string;
  description: string;
}

interface Risk {
  type: string;
  description: string;
  impact: number;
  likelihood: number;
  mitigation: string;
}

interface ValidationData {
  overallScore: number;
  pillars: ValidationPillar[];
  actionPlan: ActionItem[];
  risks: Risk[];
  keyInsights: string[];
}

interface ValidationResultsProps {
  data: ValidationData;
}

export function ValidationResults({ data }: ValidationResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100 dark:bg-green-900/20";
    if (score >= 60) return "bg-yellow-100 dark:bg-yellow-900/20";
    return "bg-red-100 dark:bg-red-900/20";
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium': return <TrendingUp className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return null;
    }
  };

  const getRiskLevel = (impact: number, likelihood: number) => {
    const riskScore = (impact + likelihood) / 2;
    if (riskScore >= 7) return { label: "High", color: "destructive" };
    if (riskScore >= 4) return { label: "Medium", color: "default" };
    return { label: "Low", color: "secondary" };
  };

  const groupedActions = data.actionPlan.reduce((acc, action) => {
    if (!acc[action.phase]) acc[action.phase] = [];
    acc[action.phase].push(action);
    return acc;
  }, {} as Record<string, ActionItem[]>);

  return (
    <div className="space-y-8">
      {/* Overall Score */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-between text-2xl">
            Overall Viability Score
            <span className={`text-3xl font-bold ${data.overallScore >= 80 ? 'text-green-100' : data.overallScore >= 60 ? 'text-yellow-100' : 'text-red-100'}`}>
              {data.overallScore}/100
            </span>
          </CardTitle>
          <CardDescription className="text-purple-100">
            Comprehensive assessment across all validation pillars
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-white/80 backdrop-blur-sm">
          <Progress value={data.overallScore} className="h-4 bg-purple-100" />
          {data.keyInsights.length > 0 && (
            <div className="mt-4 space-y-2 p-4 bg-white/60 rounded-lg border border-purple-100/50">
              <h4 className="font-medium text-gray-800">Key Insights</h4>
              <ul className="space-y-1">
                {data.keyInsights.map((insight, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validation Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data.pillars.map((pillar, index) => (
          <Card key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200/50 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center justify-between text-xl">
                {pillar.name}
                <div className="flex items-center space-x-2">
                  <span className={`text-xl font-bold ${pillar.score >= 80 ? 'text-green-100' : pillar.score >= 60 ? 'text-yellow-100' : 'text-red-100'}`}>
                    {pillar.score}
                  </span>
                  <Badge variant="outline" className="text-xs border-white/30 text-white">
                    {pillar.confidence}% confidence
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-white/80 backdrop-blur-sm">
              <Progress value={pillar.score} className="h-3 bg-purple-100" />
              
              <p className="text-sm text-muted-foreground">
                {pillar.reasoning}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium text-green-600 mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Strengths
                  </h5>
                  <ul className="space-y-1">
                    {pillar.strengths.map((strength, idx) => (
                      <li key={idx} className="text-xs text-muted-foreground">
                        • {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-red-600 mb-2 flex items-center">
                    <XCircle className="w-4 h-4 mr-1" />
                    Weaknesses
                  </h5>
                  <ul className="space-y-1">
                    {pillar.weaknesses.map((weakness, idx) => (
                      <li key={idx} className="text-xs text-muted-foreground">
                        • {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Plan */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl">Strategic Action Plan</CardTitle>
          <CardDescription className="text-purple-100">
            Phase-based roadmap for implementing your startup idea
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-white/80 backdrop-blur-sm">
          <div className="space-y-6">
            {Object.entries(groupedActions).map(([phase, actions]) => (
              <div key={phase}>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-2" />
                  {phase} Phase
                </h4>
                <div className="space-y-3 ml-5">
                  {actions.map((action, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border border-purple-100/50 bg-white/60 hover:bg-white/80 transition-colors">
                      {getPriorityIcon(action.priority)}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium text-sm text-gray-800">{action.task}</h5>
                          <Badge variant="outline" className="text-xs border-purple-200 text-purple-700">
                            {action.estimatedTime}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      {data.risks.length > 0 && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200/50 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl">Risk Assessment</CardTitle>
            <CardDescription className="text-purple-100">
              Potential challenges and mitigation strategies
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-white/80 backdrop-blur-sm">
            <div className="space-y-4">
              {data.risks.map((risk, index) => {
                const riskLevel = getRiskLevel(risk.impact, risk.likelihood);
                return (
                  <div key={index} className="p-4 rounded-lg border border-purple-100/50 bg-white/60 hover:bg-white/80 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-gray-800">{risk.type}</h5>
                      <Badge variant={riskLevel.color as any}>
                        {riskLevel.label} Risk
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {risk.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <span className="text-xs font-medium text-gray-700">Impact: {risk.impact}/10</span>
                        <Progress value={risk.impact * 10} className="h-2 mt-1 bg-purple-100" />
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-700">Likelihood: {risk.likelihood}/10</span>
                        <Progress value={risk.likelihood * 10} className="h-2 mt-1 bg-purple-100" />
                      </div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded border border-purple-100/50">
                      <h6 className="text-xs font-medium mb-1 text-gray-800">Mitigation Strategy</h6>
                      <p className="text-xs text-gray-600">{risk.mitigation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
