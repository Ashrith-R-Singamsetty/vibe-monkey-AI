import React from 'react';
import { Zap, Brain, Target, Rocket } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="text-center space-y-8 py-16">
      <div className="space-y-4">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 px-4 py-2 rounded-full text-sm font-medium">
          <Zap className="w-4 h-4 text-purple-600" />
          <span className="text-purple-700 dark:text-purple-300">AI-Powered Startup Validation</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
          Transform Ideas into
          <br />
          Validated Startups
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get comprehensive AI analysis of your startup idea in minutes. From market validation 
          to tech stack recommendations and feature roadmaps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-12 h-12 rounded-lg flex items-center justify-center mx-auto">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">AI Enhancement</h3>
          <p className="text-sm text-muted-foreground">
            Transform rough ideas into polished, compelling descriptions
          </p>
        </div>

        <div className="space-y-3">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-12 h-12 rounded-lg flex items-center justify-center mx-auto">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Smart Validation</h3>
          <p className="text-sm text-muted-foreground">
            Multi-pillar analysis covering market, technical, and competitive factors
          </p>
        </div>

        <div className="space-y-3">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-lg flex items-center justify-center mx-auto">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Action Roadmap</h3>
          <p className="text-sm text-muted-foreground">
            Detailed implementation plans and technology recommendations
          </p>
        </div>
      </div>
    </section>
  );
}
