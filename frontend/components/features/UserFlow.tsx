import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, MousePointerClick } from 'lucide-react';

interface UserFlowStep {
  screen: string;
  description: string;
  components: string[];
  purpose: string;
}

interface UserFlowProps {
  userFlow: UserFlowStep[];
}

export function UserFlow({ userFlow }: UserFlowProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Core User Flow</CardTitle>
        <CardDescription>
          A step-by-step journey of a typical user through your application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6">
          {/* Vertical line */}
          <div className="absolute left-[30px] top-0 h-full w-0.5 bg-border -translate-x-1/2" />

          {userFlow.map((step, index) => (
            <div key={index} className="relative mb-8">
              <div className="absolute left-0 top-1.5 flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full ring-4 ring-background">
                {index + 1}
              </div>
              <div className="ml-12">
                <h4 className="font-semibold text-foreground">{step.screen}</h4>
                <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                <div className="mt-3">
                  <h5 className="text-xs font-semibold mb-2">Key Components:</h5>
                  <div className="flex flex-wrap gap-2">
                    {step.components.map((comp, i) => (
                      <Badge key={i} variant="secondary">{comp}</Badge>
                    ))}
                  </div>
                </div>
                <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                  <h5 className="text-xs font-semibold mb-1 flex items-center gap-1.5">
                    <MousePointerClick className="w-3 h-3" />
                    Purpose
                  </h5>
                  <p className="text-xs text-muted-foreground">{step.purpose}</p>
                </div>
              </div>
              {index < userFlow.length - 1 && (
                <div className="absolute left-[30px] top-full mt-2 flex items-center justify-center w-8 h-8 -translate-x-1/2">
                  <ArrowDown className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
