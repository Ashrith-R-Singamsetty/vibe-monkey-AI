import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { KanbanBoard } from '../components/kanban/KanbanBoard';

export default function KanbanPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState(location.state?.results);
  const [data, setData] = useState(location.state?.data);

  useEffect(() => {
    if (!results || !data || !results.features) {
      const storedId = localStorage.getItem('latestAnalysisId');
      if (storedId) {
        const storedData = localStorage.getItem(`analysis_${storedId}`);
        if (storedData) {
          // This is a simplified recovery, ideally you'd refetch
          setData(JSON.parse(storedData));
        } else {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    }
  }, [results, data, navigate]);

  if (!results || !data || !results.features) {
    // You might want a loading state here if you implement refetching
    return null;
  }

  const allFeatures = results.features.categories.flatMap((category: any) => category.features);
  const developmentPhases = results.features.developmentOrder.map((phaseName: string) => ({
    phase: phaseName,
    features: allFeatures.filter((f: any) => data.developmentOrder.includes(f.name)).map((f: any) => f.name)
  }));

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Development Roadmap</h1>
            <p className="text-muted-foreground">
              Visualize and manage your features on the Kanban board.
            </p>
          </div>
        </div>
      </div>
      <div className="flex-grow overflow-x-auto">
        <KanbanBoard 
          phases={results.features.developmentPhases || []} 
          allFeatures={allFeatures} 
        />
      </div>
    </div>
  );
}
