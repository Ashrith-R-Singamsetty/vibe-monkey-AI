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
      <div className="space-y-8 bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 min-h-screen p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-purple-100/50">
          <Skeleton className="h-12 w-1/2 bg-purple-100" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-[500px] w-[350px] bg-purple-100 rounded-lg" />
          <Skeleton className="h-[500px] w-[350px] bg-purple-100 rounded-lg" />
          <Skeleton className="h-[500px] w-[350px] bg-purple-100 rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !ideaData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
        <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-purple-100/50 max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Roadmap Not Found</h1>
          <p className="text-gray-600 mb-4">
            Could not load the development roadmap for this idea.
          </p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
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
    <div className="flex flex-col h-[calc(100vh-120px)] bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-pink-100/20 to-slate-100/20" />
      
      <div className="relative z-10 flex items-center justify-between mb-8 px-6 py-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-purple-100/50">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/analysis/${id}`)}
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Analysis
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Development Roadmap</h1>
            <p className="text-gray-600">
              Visualize and manage features for "{ideaData.name}".
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="border-purple-200 text-purple-700 hover:bg-purple-50"
        >
          <LayoutDashboard className="w-4 h-4 mr-2" />
          Dashboard
        </Button>
      </div>
      <div className="relative z-10 flex-grow overflow-x-auto pb-4 px-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-purple-100/50 min-h-full">
          <KanbanBoard 
            phases={developmentPhases} 
            allFeatures={allFeatures} 
          />
        </div>
      </div>
    </div>
  );
}
