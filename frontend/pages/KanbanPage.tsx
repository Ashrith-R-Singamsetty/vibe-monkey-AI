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
    if (!location.state?.results || !location.state?.data) {
      const latestAnalysisId = localStorage.getItem('latestAnalysisId');
      if (latestAnalysisId) {
        // In a real app, you'd refetch data here based on the ID
        // For now, we'll just navigate back as we don't have the data
        console.warn("Kanban page loaded without state, navigating home.");
        navigate('/');
      } else {
        navigate('/');
      }
    } else {
      setResults(location.state.results);
      setData(location.state.data);
    }
  }, [location.state, navigate]);

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

  const allFeatures = [
    ...(results.features.mustHave || []),
    ...(results.features.couldHave || []),
    ...(results.features.later || []),
  ];
  
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
