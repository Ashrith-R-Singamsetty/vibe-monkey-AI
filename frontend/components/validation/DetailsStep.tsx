import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Settings, X } from "lucide-react";
import { ValidationData } from "../../pages/ValidationPage";
import { useState } from "react";

interface DetailsStepProps {
  data: ValidationData;
  onUpdate: (updates: Partial<ValidationData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const industries = [
  "Technology", "Healthcare", "Finance", "Education", "E-commerce",
  "Entertainment", "Travel", "Food & Beverage", "Fitness", "Social Media",
  "Productivity", "Gaming", "Real Estate", "Transportation", "Other"
];

const timelines = [
  "1-3 months", "3-6 months", "6-12 months", "1-2 years", "2+ years"
];

const budgets = [
  "Under $1,000", "$1,000 - $5,000", "$5,000 - $15,000", 
  "$15,000 - $50,000", "$50,000 - $100,000", "$100,000+"
];

const techPreferences = [
  "React", "Vue.js", "Angular", "Next.js", "Node.js", "Python", 
  "Django", "Flask", "Ruby on Rails", "PHP", "Laravel", "PostgreSQL", 
  "MySQL", "MongoDB", "Firebase", "AWS", "Vercel", "Netlify"
];

export default function DetailsStep({ data, onUpdate, onNext, onBack }: DetailsStepProps) {
  const [newPreference, setNewPreference] = useState("");

  const addPreference = () => {
    if (newPreference.trim() && !data.preferences.includes(newPreference.trim())) {
      onUpdate({ 
        preferences: [...data.preferences, newPreference.trim()] 
      });
      setNewPreference("");
    }
  };

  const removePreference = (pref: string) => {
    onUpdate({ 
      preferences: data.preferences.filter(p => p !== pref) 
    });
  };

  const canProceed = data.industry && data.timeline && data.budget && data.targetAudience.trim();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Project Details
        </CardTitle>
        <CardDescription>
          Help us understand your project context for more accurate AI analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select value={data.industry} onValueChange={(value) => onUpdate({ industry: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map(industry => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeline">Development Timeline</Label>
            <Select value={data.timeline} onValueChange={(value) => onUpdate({ timeline: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select timeline" />
              </SelectTrigger>
              <SelectContent>
                {timelines.map(timeline => (
                  <SelectItem key={timeline} value={timeline}>
                    {timeline}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Budget Range</Label>
            <Select value={data.budget} onValueChange={(value) => onUpdate({ budget: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select budget" />
              </SelectTrigger>
              <SelectContent>
                {budgets.map(budget => (
                  <SelectItem key={budget} value={budget}>
                    {budget}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="teamSize">Team Size</Label>
            <Input
              type="number"
              min="1"
              max="50"
              value={data.teamSize}
              onChange={(e) => onUpdate({ teamSize: parseInt(e.target.value) || 1 })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="complexity">Project Complexity</Label>
          <Select 
            value={data.complexity} 
            onValueChange={(value: "simple" | "medium" | "complex") => onUpdate({ complexity: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simple">Simple - Basic CRUD, few integrations</SelectItem>
              <SelectItem value="medium">Medium - Multiple features, some complexity</SelectItem>
              <SelectItem value="complex">Complex - Advanced features, many integrations</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetAudience">Target Audience</Label>
          <Textarea
            value={data.targetAudience}
            onChange={(e) => onUpdate({ targetAudience: e.target.value })}
            placeholder="Describe your target users (e.g., 'Busy professionals aged 25-45 who enjoy outdoor activities but struggle to find time to plan hiking trips')"
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-3">
          <Label>Technology Preferences (Optional)</Label>
          <div className="flex gap-2">
            <Input
              value={newPreference}
              onChange={(e) => setNewPreference(e.target.value)}
              placeholder="Add technology preference"
              onKeyPress={(e) => e.key === "Enter" && addPreference()}
            />
            <Button onClick={addPreference} variant="outline">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {techPreferences.map(tech => (
              <Badge
                key={tech}
                variant="outline"
                className="cursor-pointer"
                onClick={() => !data.preferences.includes(tech) && onUpdate({ 
                  preferences: [...data.preferences, tech] 
                })}
              >
                {tech}
              </Badge>
            ))}
          </div>
          {data.preferences.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm">Selected:</Label>
              <div className="flex flex-wrap gap-2">
                {data.preferences.map(pref => (
                  <Badge key={pref} className="flex items-center gap-1">
                    {pref}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removePreference(pref)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button 
            onClick={onNext}
            disabled={!canProceed}
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
