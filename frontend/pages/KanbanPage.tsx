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
      // Attempt to recover from localStorage if state is lost (e.g., on page refresh)
      const latestAnalysisId = localStorage.getItem('latestAnalysisId');
      if (latestAnalysisId) {
        const storedData = localStorage.getItem(`analysis_${latestAnalysisId}`);
        if (storedData) {
          // This is a simplified recovery. A more robust solution would refetch the data.
          const parsedData = JSON.parse(storedData);
          setData(parsedData);
          // We can't recover the results, so we'll have to navigate away or show an error.
          // For now, let's just navigate home.
        }
      }
      // If we can't recover, navigate home.
      if (!location.state?.results) {
        navigate('/');
      }
    }
  }, [results, data, navigate, location.state]);

  if (!results || !data || !results.features) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-foreground mb-4">Roadmap Data Not Found</h1>
        <p className="text-muted-foreground mb-4">
          Please generate an analysis first to view the Kanban board.
        </p>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }

  const allFeatures = results.features.categories.flatMap((category: any) => category.features);
  const developmentPhases = results.features.developmentPhases || [];

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
            Back to Analysis
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
          phases={developmentPhases} 
          allFeatures={allFeatures} 
        />
      </div>
    </div>
  );
}
