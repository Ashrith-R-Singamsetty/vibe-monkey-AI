import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, Target, Code, ListChecks } from 'lucide-react';

const analysisSteps = [
  { icon: Brain, label: "Enhancing idea description", progress: 25 },
  { icon: Target, label: "Analyzing market potential", progress: 50 },
  { icon: Code, label: "Recommending tech stack", progress: 75 },
  { icon: ListChecks, label: "Generating feature roadmap", progress: 100 },
];

export function LoadingState() {
  const [currentStep, setCurrentStep] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % analysisSteps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            🐒 Vibe Monkey is analyzing your idea...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {analysisSteps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div
                  key={index}
                  className={`flex items-center space-x-4 p-4 rounded-lg border transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800' 
                      : isCompleted
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : 'bg-muted border-muted'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                      : isCompleted
                      ? 'bg-green-500'
                      : 'bg-muted-foreground/20'
                  }`}>
                    <IconComponent className={`w-5 h-5 ${
                      isActive || isCompleted ? 'text-white' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${
                      isActive ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.label}
                    </p>
                    {isActive && (
                      <Progress 
                        value={75} 
                        className="mt-2 h-2"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>This usually takes 30-60 seconds...</p>
            <p className="mt-1">Our AI is analyzing multiple dimensions of your startup idea.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
