import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Clock, Zap } from "lucide-react";

interface ActionItem {
  task: string;
  priority: "high" | "medium" | "low";
  effort: "low" | "medium" | "high";
  category: "planning" | "design" | "development" | "testing" | "launch" | "marketing";
}

interface ActionPlanProps {
  actionItems: ActionItem[];
  recommendations: string[];
}

const priorityColors = {
  high: "destructive",
  medium: "secondary",
  low: "outline"
} as const;

const effortIcons = {
  low: <CheckSquare className="h-4 w-4" />,
  medium: <Clock className="h-4 w-4" />,
  high: <Zap className="h-4 w-4" />
};

const categoryColors = {
  planning: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  design: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  development: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  testing: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  launch: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  marketing: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
};

export default function ActionPlan({ actionItems, recommendations }: ActionPlanProps) {
  const groupedItems = actionItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ActionItem[]>);

  return (
    <div className="space-y-6">
      {/* Action Items by Category */}
      {Object.entries(groupedItems).map(([category, items]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 capitalize">
              <Badge className={categoryColors[category as keyof typeof categoryColors]}>
                {category}
              </Badge>
              {category} Phase
            </CardTitle>
            <CardDescription>
              {items.length} action item{items.length !== 1 ? 's' : ''} in this phase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mt-0.5">
                    {effortIcons[item.effort]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-relaxed">
                      {item.task}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={priorityColors[item.priority]} className="text-xs">
                        {item.priority} priority
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.effort} effort
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Quick Wins */}
      {actionItems.filter(item => item.priority === "high" && item.effort === "low").length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Quick Wins</CardTitle>
            <CardDescription>
              High-impact, low-effort tasks to start with
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {actionItems
                .filter(item => item.priority === "high" && item.effort === "low")
                .map((item, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950/20 rounded">
                    <CheckSquare className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{item.task}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Strategic Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Strategic Recommendations</CardTitle>
            <CardDescription>
              High-level strategic guidance for your startup journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
                  <p className="text-sm leading-relaxed">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
