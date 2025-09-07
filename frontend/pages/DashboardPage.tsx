import React from 'react';
import { useQuery } from '@tanstack/react-query';
import backend from '~backend/client';
import { IdeaList } from '../components/dashboard/IdeaList';
import { CreateIdeaDialog } from '../components/dashboard/CreateIdeaDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Navbar } from '@/components/Navbar';

export function DashboardPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['ideas'],
    queryFn: () => backend.idea.list(),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <Navbar showFeatures={false} showTryForFree={false} />
      <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Startup Ideas</h1>
          <p className="text-muted-foreground mt-2">
            All your validated ideas in one place.
          </p>
        </div>
        <CreateIdeaDialog onIdeaCreated={refetch} />
      </div>
      
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      )}
      
      {error && (
        <div className="text-center py-16 border-2 border-dashed rounded-lg border-destructive">
          <h2 className="text-xl font-semibold text-destructive">Error Loading Ideas</h2>
          <p className="text-muted-foreground mt-2">
            Could not fetch your startup ideas. Please try again later.
          </p>
        </div>
      )}
      
      {data && <IdeaList ideas={data.ideas} />}
      </div>
    </div>
  );
}
