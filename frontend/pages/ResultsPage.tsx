import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, Share, TrendingUp, AlertTriangle, Code, List } from "lucide-react";
import Header from "../components/Header";
import ValidationScores from "../components/results/ValidationScores";
import ActionPlan from "../components/results/ActionPlan";
import TechStack from "../components/results/TechStack";
import FeaturePlan from "../components/results/FeaturePlan";
import RiskAssessment from "../components/results/RiskAssessment";

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState(location.state?.results);
  const [data, setData] = useState(location.state?.data);

  useEffect(() => {
    if (!results || !data) {
      navigate("/");
    }
  }, [results, data, navigate]);

  if (!results || !data) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Validation Results</h1>
                <p className="text-muted-foreground">
                  Comprehensive AI analysis of your startup idea
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Enhanced Idea */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Enhanced Idea Description</CardTitle>
              <CardDescription>AI-refined version of your startup concept</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">
                {data.enhancedIdea || data.originalIdea}
              </p>
            </CardContent>
          </Card>

          {/* Overall Score */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Overall Viability Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold">
                  <span className={getScoreColor(results.validation?.overallScore || 0)}>
                    {results.validation?.overallScore || 0}
                  </span>
                  <span className="text-2xl text-muted-foreground">/100</span>
                </div>
                <div className="flex-1">
                  <Progress 
                    value={results.validation?.overallScore || 0} 
                    className="h-3"
                  />
                </div>
                <Badge 
                  variant={
                    (results.validation?.overallScore || 0) >= 80 ? "default" :
                    (results.validation?.overallScore || 0) >= 60 ? "secondary" : "destructive"
                  }
                >
                  {(results.validation?.overallScore || 0) >= 80 ? "Strong" :
                   (results.validation?.overallScore || 0) >= 60 ? "Moderate" : "Needs Work"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="validation" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="validation" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Validation
              </TabsTrigger>
              <TabsTrigger value="actions" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                Action Plan
              </TabsTrigger>
              <TabsTrigger value="tech" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Tech Stack
              </TabsTrigger>
              <TabsTrigger value="features" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                Features
              </TabsTrigger>
              <TabsTrigger value="risks" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Risks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="validation">
              <ValidationScores validation={results.validation} />
            </TabsContent>

            <TabsContent value="actions">
              <ActionPlan 
                actionItems={results.validation?.actionItems || []}
                recommendations={results.validation?.recommendations || []}
              />
            </TabsContent>

            <TabsContent value="tech">
              <TechStack techStack={results.techStack} />
            </TabsContent>

            <TabsContent value="features">
              <FeaturePlan features={results.features} />
            </TabsContent>

            <TabsContent value="risks">
              <RiskAssessment risks={results.validation?.risks || []} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
