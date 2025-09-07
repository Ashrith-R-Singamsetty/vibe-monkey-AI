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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <Skeleton className="h-12 w-1/2 rounded-xl" />
          <div className="flex gap-6">
            <Skeleton className="h-[500px] w-[350px] rounded-xl" />
            <Skeleton className="h-[500px] w-[350px] rounded-xl" />
            <Skeleton className="h-[500px] w-[350px] rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !ideaData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-32">
            <h1 className="text-2xl font-bold text-foreground mb-4">Roadmap Not Found</h1>
            <p className="text-muted-foreground mb-6">
              Could not load the development roadmap for this idea.
            </p>
            <Button onClick={() => navigate('/')} size="lg" variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
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
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col h-screen">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/analysis/${id}`)}
              className="shadow-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Analysis
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Development Roadmap</h1>
              <p className="text-muted-foreground mt-1">
                Visualize and manage features for "{ideaData.name}".
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate('/')} className="shadow-sm">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
        </div>
        <div className="flex-1 min-h-0">
          <div className="h-full overflow-auto">
            <KanbanBoard 
              phases={developmentPhases} 
              allFeatures={allFeatures} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
