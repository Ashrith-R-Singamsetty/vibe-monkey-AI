import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Shield, TrendingDown } from "lucide-react";

interface Risk {
  description: string;
  impact: number;
  likelihood: number;
  mitigation: string;
}

interface RiskAssessmentProps {
  risks: Risk[];
}

export default function RiskAssessment({ risks }: RiskAssessmentProps) {
  const getRiskLevel = (impact: number, likelihood: number) => {
    const score = (impact * likelihood) / 100;
    if (score >= 6) return { level: "high", color: "destructive" };
    if (score >= 3) return { level: "medium", color: "secondary" };
    return { level: "low", color: "outline" };
  };

  const sortedRisks = [...risks].sort((a, b) => {
    const scoreA = (a.impact * a.likelihood) / 100;
    const scoreB = (b.impact * b.likelihood) / 100;
    return scoreB - scoreA;
  });

  const highRisks = sortedRisks.filter(risk => getRiskLevel(risk.impact, risk.likelihood).level === "high");
  const mediumRisks = sortedRisks.filter(risk => getRiskLevel(risk.impact, risk.likelihood).level === "medium");
  const lowRisks = sortedRisks.filter(risk => getRiskLevel(risk.impact, risk.likelihood).level === "low");

  if (risks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No significant risks identified for your startup idea.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Risk Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-red-600">High Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{highRisks.length}</div>
            <p className="text-sm text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-yellow-600">Medium Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{mediumRisks.length}</div>
            <p className="text-sm text-muted-foreground">
              Monitor and plan for
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-green-600">Low Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{lowRisks.length}</div>
            <p className="text-sm text-muted-foreground">
              Keep an eye on
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Risks */}
      <div className="space-y-4">
        {sortedRisks.map((risk, index) => {
          const riskLevel = getRiskLevel(risk.impact, risk.likelihood);
          const riskScore = (risk.impact * risk.likelihood) / 100;
          
          return (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 mt-0.5 text-amber-600" />
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight">
                        {risk.description}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant={riskLevel.color as any}>
                          {riskLevel.level} risk
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Risk Score: {riskScore.toFixed(1)}/10
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Impact Level</h5>
                    <div className="flex items-center gap-2">
                      <Progress value={risk.impact * 10} className="flex-1 h-2" />
                      <span className="text-sm font-medium w-8">{risk.impact}/10</span>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Likelihood</h5>
                    <div className="flex items-center gap-2">
                      <Progress value={risk.likelihood * 10} className="flex-1 h-2" />
                      <span className="text-sm font-medium w-8">{risk.likelihood}/10</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-blue-500">
                  <h5 className="font-medium mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Mitigation Strategy
                  </h5>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {risk.mitigation}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Risk Management Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Risk Management Best Practices
          </CardTitle>
          <CardDescription>
            General guidelines for managing startup risks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-muted/50 rounded-lg">
              <h5 className="font-medium text-sm">Prioritize High-Impact Risks</h5>
              <p className="text-xs text-muted-foreground mt-1">
                Focus your limited resources on risks that could significantly impact your startup's success.
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <h5 className="font-medium text-sm">Validate Early and Often</h5>
              <p className="text-xs text-muted-foreground mt-1">
                Many risks can be mitigated through early customer validation and iterative development.
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <h5 className="font-medium text-sm">Build Contingency Plans</h5>
              <p className="text-xs text-muted-foreground mt-1">
                Have backup plans for your highest-impact risks to ensure business continuity.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
