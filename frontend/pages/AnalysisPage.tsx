import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import backend from '~backend/client';
import { LoadingState } from '../components/LoadingState';
import { ValidationResults } from '../components/ValidationResults';
import { TechStackResults } from '../components/TechStackResults';
import { FeatureResults } from '../components/FeatureResults';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface IdeaData {
  idea: string;
  enhancedIdea?: string;
  industry?: string;
  timeline?: string;
  budget?: string;
  teamSize?: number;
  projectType?: string;
  experience?: string;
  targetAudience?: string;
}

export function AnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [ideaData, setIdeaData] = useState<IdeaData | null>(null);
  const [activeTab, setActiveTab] = useState('validation');

  useEffect(() => {
    if (id) {
      const stored = localStorage.getItem(`analysis_${id}`);
      if (stored) {
        setIdeaData(JSON.parse(stored));
      }
    }
  }, [id]);

  const validationQuery = useQuery({
    queryKey: ['validation', ideaData?.enhancedIdea || ideaData?.idea],
    queryFn: () => backend.validation.validateIdea({
      idea: ideaData?.enhancedIdea || ideaData?.idea || '',
      industry: ideaData?.industry,
      timeline: ideaData?.timeline,
      budget: ideaData?.budget,
      teamSize: ideaData?.teamSize,
    }),
    enabled: !!ideaData,
  });

  const techStackQuery = useQuery({
    queryKey: ['techStack', ideaData?.enhancedIdea || ideaData?.idea],
    queryFn: () => backend.validation.getTechStack({
      idea: ideaData?.enhancedIdea || ideaData?.idea || '',
      projectType: ideaData?.projectType,
      experience: ideaData?.experience,
      timeline: ideaData?.timeline,
      teamSize: ideaData?.teamSize,
    }),
    enabled: !!ideaData,
  });

  const featuresQuery = useQuery({
    queryKey: ['features', ideaData?.enhancedIdea || ideaData?.idea],
    queryFn: () => backend.validation.generateFeatures({
      idea: ideaData?.enhancedIdea || ideaData?.idea || '',
      targetAudience: ideaData?.targetAudience,
      projectType: ideaData?.projectType,
    }),
    enabled: !!ideaData,
  });

  const handleRefresh = () => {
    validationQuery.refetch();
    techStackQuery.refetch();
    featuresQuery.refetch();
    toast({
      title: "Analysis Refreshed",
      description: "Running fresh analysis with latest AI models.",
    });
  };

  const handleExport = () => {
    const analysisData = {
      idea: ideaData,
      validation: validationQuery.data,
      techStack: techStackQuery.data,
      features: featuresQuery.data,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(analysisData, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vibe-monkey-analysis-${id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Analysis Exported",
      description: "Your complete analysis has been downloaded.",
    });
  };

  if (!ideaData) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-foreground mb-4">Analysis Not Found</h1>
        <p className="text-muted-foreground">
          The analysis you're looking for doesn't exist or has expired.
        </p>
      </div>
    );
  }

  const isLoading = validationQuery.isLoading || techStackQuery.isLoading || featuresQuery.isLoading;
  const hasError = validationQuery.error || techStackQuery.error || featuresQuery.error;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analysis Results</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive AI-powered validation for your startup idea
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={isLoading}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border">
        <h2 className="text-lg font-semibold text-foreground mb-2">Your Idea</h2>
        <p className="text-muted-foreground">
          {ideaData.enhancedIdea || ideaData.idea}
        </p>
        {ideaData.industry && (
          <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
            <span>Industry: {ideaData.industry}</span>
            {ideaData.timeline && <span>Timeline: {ideaData.timeline}</span>}
            {ideaData.teamSize && <span>Team: {ideaData.teamSize} person(s)</span>}
          </div>
        )}
      </div>

      {isLoading ? (
        <LoadingState />
      ) : hasError ? (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold text-foreground mb-4">Analysis Error</h2>
          <p className="text-muted-foreground mb-4">
            There was an issue generating your analysis. Please try refreshing.
          </p>
          <Button onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="validation">Validation Analysis</TabsTrigger>
            <TabsTrigger value="techstack">Tech Stack</TabsTrigger>
            <TabsTrigger value="features">Features & Roadmap</TabsTrigger>
          </TabsList>

          <TabsContent value="validation" className="space-y-6">
            {validationQuery.data && <ValidationResults data={validationQuery.data} />}
          </TabsContent>

          <TabsContent value="techstack" className="space-y-6">
            {techStackQuery.data && <TechStackResults data={techStackQuery.data} />}
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            {featuresQuery.data && <FeatureResults data={featuresQuery.data} />}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
