import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Header from "../components/Header";
import IdeaStep from "../components/validation/IdeaStep";
import DetailsStep from "../components/validation/DetailsStep";
import EnhancementStep from "../components/validation/EnhancementStep";
import AnalysisStep from "../components/validation/AnalysisStep";

export interface ValidationData {
  originalIdea: string;
  enhancedIdea?: string;
  industry: string;
  targetAudience: string;
  timeline: string;
  budget: string;
  teamSize: number;
  complexity: "simple" | "medium" | "complex";
  preferences: string[];
}

const steps = [
  { id: "idea", title: "Describe Your Idea", description: "Tell us about your startup concept" },
  { id: "details", title: "Project Details", description: "Provide context about your project" },
  { id: "enhance", title: "AI Enhancement", description: "Let AI polish your idea description" },
  { id: "analyze", title: "AI Analysis", description: "Comprehensive validation analysis" },
];

export default function ValidationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<ValidationData>({
    originalIdea: location.state?.initialIdea || "",
    industry: "",
    targetAudience: "",
    timeline: "",
    budget: "",
    teamSize: 1,
    complexity: "medium",
    preferences: [],
  });

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = (results: any) => {
    navigate("/results", { state: { data, results } });
  };

  const updateData = (updates: Partial<ValidationData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <IdeaStep
            data={data}
            onUpdate={updateData}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <DetailsStep
            data={data}
            onUpdate={updateData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <EnhancementStep
            data={data}
            onUpdate={updateData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <AnalysisStep
            data={data}
            onComplete={handleComplete}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <CardTitle>{steps[currentStep].title}</CardTitle>
                  <CardDescription>{steps[currentStep].description}</CardDescription>
                </div>
                <div className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>
              <Progress value={progress} className="w-full" />
            </CardHeader>
          </Card>

          {/* Step Content */}
          {renderStep()}
        </div>
      </main>
    </div>
  );
}
