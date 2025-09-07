import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

interface NavbarProps {
  className?: string;
}

export function Navbar({ className = "" }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine which nav item should be highlighted
  const isHome = location.pathname === '/';
  const isFeatures = location.pathname === '/features';

  return (
    <motion.nav 
      className={`relative z-10 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-purple-100/50 ${className}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Logo Section */}
      <motion.div 
        className="flex items-center space-x-2 cursor-pointer" 
        onClick={() => navigate('/')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div 
          className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          <Zap className="w-6 h-6 text-white" />
        </motion.div>
        <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Vibe Monkey AI
        </span>
      </motion.div>
      
      {/* Navigation Links */}
      <div className="flex items-center space-x-6">
        <motion.button 
          onClick={() => navigate('/')} 
          className={`transition-colors ${
            isHome 
              ? 'text-purple-600 font-medium' 
              : 'text-gray-600 hover:text-purple-600'
          }`}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Home
        </motion.button>
        
        <motion.button 
          onClick={() => navigate('/features')} 
          className={`transition-colors ${
            isFeatures 
              ? 'text-purple-600 font-medium' 
              : 'text-gray-600 hover:text-purple-600'
          }`}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Features
        </motion.button>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            Try For Free
          </Button>
        </motion.div>
      </div>
    </motion.nav>
  );
}