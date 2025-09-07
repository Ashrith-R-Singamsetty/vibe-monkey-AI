import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import backend from '~backend/client';
import { LoadingState } from '../components/LoadingState';
import { ValidationResults } from '../components/ValidationResults';
import { TechStackResults } from '../components/TechStackResults';
import { FeatureResults } from '../components/FeatureResults';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, ArrowRight, LayoutDashboard } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export function AnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('validation');

  const { data: ideaData, isLoading, error, refetch } = useQuery({
    queryKey: ['idea', id],
    queryFn: () => backend.idea.get({ id: id! }),
    enabled: !!id,
  });

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(ideaData, null, 2)], {
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

  const handleGoToKanban = () => {
    navigate(`/kanban/${id}`);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold text-foreground mb-4">Analysis Error</h2>
        <p className="text-muted-foreground mb-4">
          There was an issue generating your analysis. Please try again.
        </p>
        <Button onClick={() => refetch()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{ideaData.name}</h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive AI-powered validation for your startup idea
            </p>
            </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('Dashboard')}>
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-xl p-8 border border-border/50 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-4">Your Idea</h2>
          <p className="text-muted-foreground leading-relaxed text-base">
            {ideaData.enhancedIdea || ideaData.originalIdea}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 h-12">
            <TabsTrigger value="validation" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Validation Analysis</TabsTrigger>
            <TabsTrigger value="techstack" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Tech Stack</TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Features & Roadmap</TabsTrigger>
          </TabsList>

          <TabsContent value="validation" className="mt-8">
            {ideaData.validationResult ? (
              <ValidationResults data={ideaData.validationResult} />
            ) : <Skeleton className="h-96 rounded-xl" />}
          </TabsContent>

          <TabsContent value="techstack" className="mt-8">
            {ideaData.techStackResult ? (
              <TechStackResults data={ideaData.techStackResult} />
            ) : <Skeleton className="h-96 rounded-xl" />}
          </TabsContent>

          <TabsContent value="features" className="mt-8">
            {ideaData.featuresResult ? (
              <FeatureResults data={ideaData.featuresResult} />
            ) : <Skeleton className="h-96 rounded-xl" />}
          </TabsContent>
        </Tabs>
        <div className="mt-16 text-center pb-8">
          <Button 
            size="lg" 
            onClick={handleGoToKanban} 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-6 text-lg font-medium"
          >
            Visualize on Kanban Board
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
