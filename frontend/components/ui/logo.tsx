import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animate?: boolean;
}

export function Logo({ size = 'md', className = '', animate = false }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const LogoSVG = () => (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClasses[size]} ${className}`}
    >
      {/* Gradient Definitions */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9333ea" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      
      {/* Main Monkey Head Circle */}
      <circle
        cx="50"
        cy="45"
        r="30"
        fill="url(#logoGradient)"
        className="drop-shadow-lg"
      />
      
      {/* Monkey Ears */}
      <circle cx="32" cy="30" r="12" fill="url(#logoGradient)" />
      <circle cx="68" cy="30" r="12" fill="url(#logoGradient)" />
      <circle cx="32" cy="30" r="7" fill="white" opacity="0.3" />
      <circle cx="68" cy="30" r="7" fill="white" opacity="0.3" />
      
      {/* Eyes */}
      <circle cx="42" cy="40" r="4" fill="white" />
      <circle cx="58" cy="40" r="4" fill="white" />
      <circle cx="43" cy="39" r="2" fill="#1f2937" />
      <circle cx="59" cy="39" r="2" fill="#1f2937" />
      
      {/* Eye Shine */}
      <circle cx="44" cy="38" r="0.5" fill="white" />
      <circle cx="60" cy="38" r="0.5" fill="white" />
      
      {/* Nose */}
      <ellipse cx="50" cy="50" rx="2" ry="1.5" fill="#1f2937" />
      
      {/* Mouth */}
      <path
        d="M 45 55 Q 50 60 55 55"
        stroke="#1f2937"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* AI Circuit Pattern */}
      <g stroke="url(#accentGradient)" strokeWidth="1.5" fill="none" opacity="0.8">
        {/* Circuit lines */}
        <path d="M 20 75 L 30 75 L 35 80 L 45 80" strokeLinecap="round" />
        <path d="M 55 80 L 65 80 L 70 75 L 80 75" strokeLinecap="round" />
        <path d="M 35 85 L 40 85 L 45 90 L 55 90 L 60 85 L 65 85" strokeLinecap="round" />
        
        {/* Circuit nodes */}
        <circle cx="30" cy="75" r="2" fill="url(#accentGradient)" />
        <circle cx="70" cy="75" r="2" fill="url(#accentGradient)" />
        <circle cx="40" cy="85" r="1.5" fill="url(#accentGradient)" />
        <circle cx="60" cy="85" r="1.5" fill="url(#accentGradient)" />
        <circle cx="50" cy="90" r="1.5" fill="url(#accentGradient)" />
      </g>
      
      {/* Neural Network Dots */}
      <g fill="url(#accentGradient)" opacity="0.6">
        <circle cx="25" cy="65" r="1" />
        <circle cx="75" cy="65" r="1" />
        <circle cx="20" cy="85" r="1" />
        <circle cx="80" cy="85" r="1" />
      </g>
    </svg>
  );

  if (animate) {
    return (
      <motion.div
        whileHover={{
          rotate: [0, -10, 10, -10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 0.6,
          ease: "easeInOut"
        }}
      >
        <LogoSVG />
      </motion.div>
    );
  }

  return <LogoSVG />;
}

interface LogoWithTextProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animate?: boolean;
  showText?: boolean;
}

export function LogoWithText({ 
  size = 'md', 
  className = '', 
  animate = false, 
  showText = true 
}: LogoWithTextProps) {
  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Logo size={size} animate={animate} />
      {showText && (
        <span className={`font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent ${textSizeClasses[size]}`}>
          Vibe Monkey AI
        </span>
      )}
    </div>
  );
}