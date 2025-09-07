import React from 'react';
import { Link } from 'react-router-dom';
import { LogoWithText } from '@/components/ui/logo';

export function Navigation() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="transition-transform hover:scale-105">
            <LogoWithText size="md" animate={true} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
