import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import backend from '~backend/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface IdeaFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export function IdeaForm({ onSubmit, isLoading }: IdeaFormProps) {
  const [idea, setIdea] = useState('');
  const [enhancedIdea, setEnhancedIdea] = useState('');
  const [industry, setIndustry] = useState('');
  const [timeline, setTimeline] = useState('');
  const [budget, setBudget] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [projectType, setProjectType] = useState('');
  const [experience, setExperience] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const { toast } = useToast();

  const handleEnhance = async () => {
    if (!idea.trim()) {
      toast({
        title: "Missing Idea",
        description: "Please enter your startup idea first.",
        variant: "destructive",
      });
      return;
    }

    setIsEnhancing(true);
    try {
      const result = await backend.validation.enhanceIdea({ originalIdea: idea });
      setEnhancedIdea(result.enhancedDescription);
      toast({
        title: "Idea Enhanced!",
        description: "Your idea has been refined and improved.",
      });
    } catch (error) {
      console.error('Enhancement error:', error);
      toast({
        title: "Enhancement Failed",
        description: "There was an issue enhancing your idea. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!idea.trim()) {
      toast({
        title: "Missing Idea",
        description: "Please enter your startup idea.",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      idea: idea.trim(),
      enhancedIdea: enhancedIdea || undefined,
      industry: industry || undefined,
      timeline: timeline || undefined,
      budget: budget || undefined,
      teamSize: teamSize ? parseInt(teamSize) : undefined,
      projectType: projectType || undefined,
      experience: experience || undefined,
      targetAudience: targetAudience || undefined,
    });
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Validate Your Startup Idea</CardTitle>
        <CardDescription>
          Share your idea and get comprehensive AI-powered analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="idea">Your Startup Idea *</Label>
            <Textarea
              id="idea"
              placeholder="Describe your startup idea... (e.g., A mobile app that helps people find local hiking trails with real-time weather updates)"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              className="min-h-[100px]"
              required
            />
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleEnhance}
                disabled={!idea.trim() || isEnhancing}
              >
                {isEnhancing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                Enhance with AI
              </Button>
            </div>
          </div>

          {enhancedIdea && (
            <div className="space-y-2">
              <Label>AI-Enhanced Description</Label>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-lg border">
                <p className="text-foreground">{enhancedIdea}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="fintech">FinTech</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="productivity">Productivity</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline">Development Timeline</Label>
              <Select value={timeline} onValueChange={setTimeline}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-3 months">1-3 months</SelectItem>
                  <SelectItem value="3-6 months">3-6 months</SelectItem>
                  <SelectItem value="6-12 months">6-12 months</SelectItem>
                  <SelectItem value="1+ years">1+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget Range</Label>
              <Select value={budget} onValueChange={setBudget}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bootstrap">Bootstrap ($0-1k)</SelectItem>
                  <SelectItem value="small">Small ($1k-10k)</SelectItem>
                  <SelectItem value="medium">Medium ($10k-50k)</SelectItem>
                  <SelectItem value="large">Large ($50k+)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamSize">Team Size</Label>
              <Select value={teamSize} onValueChange={setTeamSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Solo (1 person)</SelectItem>
                  <SelectItem value="2">2 people</SelectItem>
                  <SelectItem value="3">3-5 people</SelectItem>
                  <SelectItem value="6">6+ people</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectType">Project Type</Label>
              <Select value={projectType} onValueChange={setProjectType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web-app">Web Application</SelectItem>
                  <SelectItem value="mobile-app">Mobile App</SelectItem>
                  <SelectItem value="saas">SaaS Platform</SelectItem>
                  <SelectItem value="marketplace">Marketplace</SelectItem>
                  <SelectItem value="api">API/Service</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Technical Experience</Label>
              <Select value={experience} onValueChange={setExperience}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAudience">Target Audience (Optional)</Label>
            <Textarea
              id="targetAudience"
              placeholder="Who is your target audience? (e.g., Young professionals aged 25-35 who enjoy outdoor activities)"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            disabled={isLoading || !idea.trim()}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <ArrowRight className="w-5 h-5 mr-2" />
            )}
            {isLoading ? 'Analyzing...' : 'Start Analysis'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
