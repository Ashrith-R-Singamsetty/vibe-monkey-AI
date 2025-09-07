import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface FooterProps {
  className?: string;
}

export function Footer({ className = "" }: FooterProps) {
  const navigate = useNavigate();

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8 }
    }
  };
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  return (
    <motion.footer 
      className={`relative z-10 bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white overflow-hidden ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(168,85,247,0.4)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(236,72,153,0.4)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,_rgba(59,130,246,0.3)_0%,_transparent_50%)]" />
      </div>

      <div className="relative px-6 py-24">
        <div className="max-w-7xl mx-auto">
          {/* Giant Text */}
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
          >
            <motion.h2 
              className="text-8xl md:text-9xl lg:text-[12rem] font-black leading-none tracking-tighter"
              style={{
                background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 25%, #d1d5db 50%, #9ca3af 75%, #6b7280 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            >
              VIBE
            </motion.h2>
            <motion.h2 
              className="text-8xl md:text-9xl lg:text-[12rem] font-black leading-none tracking-tighter -mt-8"
              style={{
                background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            >
              MONKEY
            </motion.h2>
            <motion.div
              className="text-4xl md:text-6xl font-bold mt-4 text-gray-300"
              variants={fadeInUp}
            >
              AI
            </motion.div>
          </motion.div>

          {/* Footer Content */}
          <motion.div 
            className="grid md:grid-cols-4 gap-8 text-center md:text-left"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="md:col-span-4 flex flex-col items-center">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Ready to validate your next big idea?
              </h3>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed text-center max-w-2xl">
                Join thousands of entrepreneurs who've turned their ideas into successful businesses with our AI-powered validation platform.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-8 py-4 rounded-full"
                >
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </motion.div>

          </motion.div>

          {/* Bottom Bar */}
          <motion.div 
            className="mt-16 pt-8 border-t border-gray-800 text-center"
            variants={fadeInUp}
          >
            <p className="text-gray-500">
              © 2025 Vibe Monkey AI. All rights reserved. Built with ❤️ for entrepreneurs.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
}