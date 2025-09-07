import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import backend from '~backend/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { Skeleton } from '@/components/ui/skeleton';

export default function KanbanPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: ideaData, isLoading, error } = useQuery({
    queryKey: ['idea', id],
    queryFn: () => backend.idea.get({ id: id! }),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-12 w-1/2" />
        <div className="flex gap-4">
          <Skeleton className="h-[500px] w-[350px]" />
          <Skeleton className="h-[500px] w-[350px]" />
          <Skeleton className="h-[500px] w-[350px]" />
        </div>
      </div>
    );
  }

  if (error || !ideaData) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-foreground mb-4">Roadmap Not Found</h1>
        <p className="text-muted-foreground mb-4">
          Could not load the development roadmap for this idea.
        </p>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const allFeatures = [
    ...(ideaData.featuresResult?.mustHave || []),
    ...(ideaData.featuresResult?.couldHave || []),
    ...(ideaData.featuresResult?.later || []),
  ];
  
  const developmentPhases = ideaData.featuresResult?.developmentPhases || [];

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/analysis/${id}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Analysis
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Development Roadmap</h1>
            <p className="text-muted-foreground">
              Visualize and manage features for "{ideaData.name}".
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={() => navigate('/')}>
          <LayoutDashboard className="w-4 h-4 mr-2" />
          Dashboard
        </Button>
      </div>
      <div className="flex-grow overflow-x-auto">
        <KanbanBoard 
          phases={developmentPhases} 
          allFeatures={allFeatures} 
        />
      </div>
    </div>
  );
}
