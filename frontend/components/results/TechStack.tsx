import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Code, Database, Globe, Cloud, Plus } from "lucide-react";

interface TechRecommendation {
  name: string;
  reasoning: string;
  pros: string[];
  cons: string[];
  learningCurve: "easy" | "medium" | "hard";
  documentation: string;
}

interface TechStackData {
  frontend: TechRecommendation;
  backend: TechRecommendation;
  database: TechRecommendation;
  deployment: TechRecommendation;
  additional: TechRecommendation[];
  overallReasoning: string;
}

interface TechStackProps {
  techStack: TechStackData;
}

const categoryIcons = {
  frontend: <Globe className="h-5 w-5" />,
  backend: <Code className="h-5 w-5" />,
  database: <Database className="h-5 w-5" />,
  deployment: <Cloud className="h-5 w-5" />,
  additional: <Plus className="h-5 w-5" />
};

const learningCurveColors = {
  easy: "text-green-600",
  medium: "text-yellow-600",
  hard: "text-red-600"
};

export default function TechStack({ techStack }: TechStackProps) {
  const mainCategories = [
    { key: "frontend", title: "Frontend Framework", tech: techStack.frontend },
    { key: "backend", title: "Backend Technology", tech: techStack.backend },
    { key: "database", title: "Database Solution", tech: techStack.database },
    { key: "deployment", title: "Deployment Platform", tech: techStack.deployment }
  ];

  return (
    <div className="space-y-6">
      {/* Overall Reasoning */}
      <Card>
        <CardHeader>
          <CardTitle>Technology Stack Overview</CardTitle>
          <CardDescription>
            AI-selected technologies optimized for your project requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {techStack.overallReasoning}
          </p>
        </CardContent>
      </Card>

      {/* Main Stack */}
      <div className="grid md:grid-cols-2 gap-4">
        {mainCategories.map(({ key, title, tech }) => (
          <Card key={key}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                {categoryIcons[key as keyof typeof categoryIcons]}
                {title}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm font-medium">
                  {tech.name}
                </Badge>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${learningCurveColors[tech.learningCurve]}`}
                >
                  {tech.learningCurve} to learn
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tech.reasoning}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="text-xs font-medium text-green-600 mb-1">Pros</h5>
                  <ul className="space-y-1">
                    {tech.pros.slice(0, 3).map((pro, index) => (
                      <li key={index} className="text-xs text-muted-foreground">
                        • {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-xs font-medium text-red-600 mb-1">Cons</h5>
                  <ul className="space-y-1">
                    {tech.cons.slice(0, 3).map((con, index) => (
                      <li key={index} className="text-xs text-muted-foreground">
                        • {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Button variant="outline" size="sm" asChild className="w-full">
                <a href={tech.documentation} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-3 w-3" />
                  Documentation
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Tools */}
      {techStack.additional?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Additional Tools & Services
            </CardTitle>
            <CardDescription>
              Recommended supplementary technologies for your stack
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {techStack.additional.map((tech, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{tech.name}</h4>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${learningCurveColors[tech.learningCurve]}`}
                    >
                      {tech.learningCurve}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                    {tech.reasoning}
                  </p>
                  <Button variant="ghost" size="sm" asChild className="h-8 px-2">
                    <a href={tech.documentation} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-1 h-3 w-3" />
                      Docs
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stack Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Stack Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {mainCategories.map(({ tech }) => (
              <Badge key={tech.name} variant="secondary">
                {tech.name}
              </Badge>
            ))}
            {techStack.additional?.map((tech) => (
              <Badge key={tech.name} variant="outline">
                {tech.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
