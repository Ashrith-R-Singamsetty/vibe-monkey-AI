import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection';
import { IdeaForm } from '../components/IdeaForm';
import { FeatureHighlights } from '../components/FeatureHighlights';

export function HomePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const handleIdeaSubmit = async (ideaData: any) => {
    setIsAnalyzing(true);
    
    try {
      const analysisId = Date.now().toString();
      // Store the idea data and a reference to it
      localStorage.setItem(`analysis_${analysisId}`, JSON.stringify(ideaData));
      localStorage.setItem('latestAnalysisId', analysisId);
      navigate(`/analysis/${analysisId}`);
    } catch (error) {
      console.error('Error starting analysis:', error);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-16">
      <HeroSection />
      <IdeaForm onSubmit={handleIdeaSubmit} isLoading={isAnalyzing} />
      <FeatureHighlights />
    </div>
  );
}
