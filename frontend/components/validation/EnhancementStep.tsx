import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Sparkles, Loader2, CheckCircle } from "lucide-react";
import backend from "~backend/client";
import { ValidationData } from "../../pages/ValidationPage";
import { useToast } from "@/components/ui/use-toast";

interface EnhancementStepProps {
  data: ValidationData;
  onUpdate: (updates: Partial<ValidationData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function EnhancementStep({ data, onUpdate, onNext, onBack }: EnhancementStepProps) {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancement, setEnhancement] = useState<any>(null);
  const { toast } = useToast();

  const handleEnhance = async () => {
    setIsEnhancing(true);
    try {
      const result = await backend.validation.enhanceIdea({
        description: data.originalIdea,
        industry: data.industry,
        targetAudience: data.targetAudience,
      });
      
      setEnhancement(result);
      onUpdate({ enhancedIdea: result.enhancedDescription });
    } catch (error) {
      console.error("Enhancement error:", error);
      toast({
        title: "Enhancement Failed",
        description: "Unable to enhance your idea description at this time.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSkip = () => {
    onUpdate({ enhancedIdea: data.originalIdea });
    onNext();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI Enhancement
        </CardTitle>
        <CardDescription>
          Let our AI enhance your idea description for better clarity and impact. 
          This step is optional but recommended for better analysis results.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Original Idea */}
        <div className="space-y-2">
          <h4 className="font-medium">Original Idea</h4>
          <div className="p-4 bg-muted/50 rounded-lg text-sm">
            {data.originalIdea}
          </div>
        </div>

        {/* Enhancement Controls */}
        {!enhancement && (
          <div className="flex gap-3">
            <Button 
              onClick={handleEnhance}
              disabled={isEnhancing}
              className="flex-1"
            >
              {isEnhancing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enhancing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Enhance with AI
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleSkip}>
              Skip Enhancement
            </Button>
          </div>
        )}

        {/* Enhanced Result */}
        {enhancement && (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your idea has been enhanced! Review the improvements below.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <h4 className="font-medium">Enhanced Description</h4>
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm leading-relaxed">
                  {enhancement.enhancedDescription}
                </p>
              </div>
            </div>

            {enhancement.improvements?.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Improvements Made</h4>
                <div className="flex flex-wrap gap-2">
                  {enhancement.improvements.map((improvement: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {improvement}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={handleEnhance} variant="outline" disabled={isEnhancing}>
                <Sparkles className="mr-2 h-4 w-4" />
                Re-enhance
              </Button>
              <Button 
                onClick={() => onUpdate({ enhancedIdea: data.originalIdea })}
                variant="ghost"
              >
                Use Original Instead
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button 
            onClick={onNext}
            disabled={!enhancement && !data.enhancedIdea}
          >
            Continue to Analysis
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
