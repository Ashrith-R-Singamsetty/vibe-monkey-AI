import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { LandingPage } from './pages/LandingPage';
import { FeaturesPage } from './pages/FeaturesPage'; 
import { Navigation } from './components/Navigation';
import { DashboardPage } from './pages/DashboardPage';
import { AnalysisPage } from './pages/AnalysisPage';
import KanbanPage from './pages/KanbanPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: false,
    },
  },
});

function AppInner() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isFeaturesPage = location.pathname === '/features'; // Add this

  return (
    <div className="min-h-screen bg-background">
      {/* Hide Navigation on landing and features pages */}
      {!isLandingPage && !isFeaturesPage && <Navigation />}
      
      {/* Conditionally apply container/padding */}
      <main className={(isLandingPage || isFeaturesPage) ? '' : 'container mx-auto px-4 py-8'}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<FeaturesPage />} /> {/* Add this route */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/analysis/:id" element={<AnalysisPage />} />
          <Route path="/kanban/:id" element={<KanbanPage />} />
        </Routes>
      </main>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppInner />
      </Router>
    </QueryClientProvider>
  );
}
