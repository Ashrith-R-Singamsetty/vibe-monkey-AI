import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Brain, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import backend from "~backend/client";
import { ValidationData } from "../../pages/ValidationPage";
import { useToast } from "@/components/ui/use-toast";

interface AnalysisStepProps {
  data: ValidationData;
  onComplete: (results: any) => void;
  onBack: () => void;
}

const analysisSteps = [
  { id: "validation", label: "Validating idea across 5 key pillars", progress: 20 },
  { id: "techstack", label: "Generating technology recommendations", progress: 40 },
  { id: "features", label: "Creating comprehensive feature specifications", progress: 60 },
  { id: "compile", label: "Compiling comprehensive analysis report", progress: 80 },
  { id: "complete", label: "Analysis complete!", progress: 100 },
];

export default function AnalysisStep({ data, onComplete, onBack }: AnalysisStepProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState<any>({});
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    runAnalysis();
  }, []);

  const runAnalysis = async () => {
    try {
      setError(null);
      
      // Step 1: Validation
      setCurrentStep(0);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Visual delay
      
      const validation = await backend.validation.validateIdea({
        description: data.enhancedIdea || data.originalIdea,
        industry: data.industry,
        timeline: data.timeline,
        budget: data.budget,
        teamSize: data.teamSize,
        targetAudience: data.targetAudience,
      });
      
      setResults(prev => ({ ...prev, validation }));
      setCurrentStep(1);

      // Step 2: Tech Stack
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const techStack = await backend.validation.recommendTechStack({
        description: data.enhancedIdea || data.originalIdea,
        complexity: data.complexity,
        timeline: data.timeline,
        teamSize: data.teamSize,
        budget: data.budget,
        preferences: data.preferences,
      });
      
      setResults(prev => ({ ...prev, techStack }));
      setCurrentStep(2);

      // Step 3: Features
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const features = await backend.validation.generateFeatures({
        description: data.enhancedIdea || data.originalIdea,
        targetAudience: data.targetAudience,
        timeline: data.timeline,
        complexity: data.complexity,
      });
      
      setResults(prev => ({ ...prev, features }));
      setCurrentStep(3);

      // Step 4: Compile
      await new Promise(resolve => setTimeout(resolve, 500));
      setCurrentStep(4);

      // Complete
      const finalResults = { validation, techStack, features };
      setResults(finalResults);
      
      setTimeout(() => {
        onComplete(finalResults);
      }, 1000);

    } catch (error: any) {
      console.error("Analysis error:", error);
      setError(error.message || "Analysis failed. Please try again.");
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your startup idea. Please try again.",
        variant: "destructive",
      });
    }
  };

  const currentStepData = analysisSteps[currentStep];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Analysis in Progress
        </CardTitle>
        <CardDescription>
          Our AI is performing comprehensive analysis of your startup idea. 
          This may take a few moments.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {currentStepData.label}
                </span>
                <span className="text-sm text-muted-foreground">
                  {currentStepData.progress}%
                </span>
              </div>
              <Progress value={currentStepData.progress} className="h-2" />
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {analysisSteps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    index < currentStep 
                      ? "bg-green-50 dark:bg-green-950/20" 
                      : index === currentStep 
                      ? "bg-blue-50 dark:bg-blue-950/20" 
                      : "bg-muted/30"
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : index === currentStep ? (
                    <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                  )}
                  <span className={`text-sm ${
                    index <= currentStep ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Results Preview */}
            {Object.keys(results).length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Analysis Progress</h4>
                <div className="grid gap-2 text-sm">
                  {results.validation && (
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span>Validation Score</span>
                      <span className="font-medium">{results.validation.overallScore}/100</span>
                    </div>
                  )}
                  {results.techStack && (
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span>Tech Stack</span>
                      <span className="font-medium">Generated</span>
                    </div>
                  )}
                  {results.features && (
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span>Features</span>
                      <span className="font-medium">{results.features.features?.length || 0} identified</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack} disabled={!error}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          {error && (
            <Button onClick={runAnalysis}>
              Retry Analysis
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
