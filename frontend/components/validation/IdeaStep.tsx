import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Lightbulb } from "lucide-react";
import IdeaInput from "../IdeaInput";
import { ValidationData } from "../../pages/ValidationPage";

interface IdeaStepProps {
  data: ValidationData;
  onUpdate: (updates: Partial<ValidationData>) => void;
  onNext: () => void;
}

export default function IdeaStep({ data, onUpdate, onNext }: IdeaStepProps) {
  const canProceed = data.originalIdea.trim().length >= 20;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          What's Your Startup Idea?
        </CardTitle>
        <CardDescription>
          Describe your startup concept in detail. The more information you provide, 
          the better our AI can analyze and enhance your idea.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <IdeaInput
          value={data.originalIdea}
          onChange={(value) => onUpdate({ originalIdea: value })}
          placeholder="Example: A mobile app that helps people find local hiking trails with difficulty ratings, weather conditions, and user reviews. Users can save favorite trails, track their hiking progress, and share photos with the community."
        />

        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium mb-2">💡 Tips for better results:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Include the problem you're solving</li>
            <li>• Mention your target audience</li>
            <li>• Describe key features or functionality</li>
            <li>• Explain what makes your idea unique</li>
          </ul>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={onNext}
            disabled={!canProceed}
            className="px-8"
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
