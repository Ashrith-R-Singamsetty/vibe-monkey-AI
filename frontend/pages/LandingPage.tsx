import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Star, Users, Lightbulb, ArrowRight, Sparkles } from 'lucide-react';

export function LandingPage() {
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

  const floatingAnimation = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-pink-100/20 to-slate-100/20" />
      
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity
        }}
      />
      <motion.div
        className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity
        }}
      />

      {/* Navbar */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Navbar />
      </motion.div>

      {/* Hero Section */}
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center px-6 py-20 text-center"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeInUp}
            className="mb-6"
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-purple-100/80 backdrop-blur-sm rounded-full text-purple-700 text-sm font-medium mb-8"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Idea Validation Platform
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Validate your ideas with our
              <motion.span 
                className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                AI-powered platform
              </motion.span>
            </h1>
          </motion.div>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Pioneering research in Idea Validation, AI Analysis, and more. 
            Turn your concepts into validated business opportunities.
          </motion.p>
          
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started For Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
            
            <motion.button
              className="text-purple-600 hover:text-purple-700 font-medium flex items-center"
              whileHover={{ x: 5 }}
              onClick={() => navigate('/features')}
            >
              Learn more about features
              <ArrowRight className="w-4 h-4 ml-1" />
            </motion.button>
          </motion.div>
        </div>

        {/* Central Animated Element */}
        <motion.div 
          className="mt-16 relative"
          variants={fadeInUp}
        >
          <motion.div 
            className="w-64 h-64 mx-auto relative"
            {...floatingAnimation}
          >
            {/* Outer ring with gradient */}
            <motion.div 
              className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 opacity-30"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 8,
                repeat: Infinity
              }}
            />
            
            {/* Middle ring */}
            <motion.div 
              className="absolute inset-8 rounded-full bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 opacity-50"
              animate={{ 
                scale: [1.1, 1, 1.1],
                rotate: [360, 180, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity
              }}
            />
            
            {/* Inner circle with icon */}
            <motion.div 
              className="absolute inset-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{
                  duration: 10,
                  repeat: Infinity
                }}
              >
                <Lightbulb className="w-12 h-12 text-white" />
              </motion.div>
            </motion.div>
            
            {/* Animated dots around the circle */}
            <motion.div 
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{
                duration: 20,
                repeat: Infinity
              }}
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i * 45}deg) translateY(-130px) translateX(-6px)`,
                  }}
                  animate={{
                    scale: [0.8, 1.2, 0.8],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <motion.div 
        className="relative z-10 px-6 py-20 bg-white/60 backdrop-blur-sm"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why choose 
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Vibe Monkey
              </span>?
            </h2>
            <p className="text-xl text-gray-600">Experience the future of idea validation</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Star,
                title: "Fast and easy-to-use Analysis",
                description: "Get instant validation insights for your business ideas with our AI-powered platform"
              },
              {
                icon: Users,
                title: "Build Ideas that resonate",
                description: "Create validated concepts that connect with your target market and drive success"
              },
              {
                icon: Lightbulb,
                title: "AI-Powered Insights",
                description: "Leverage advanced AI to analyze market potential and validate your business concepts"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group text-center p-6 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <motion.div 
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Use the reusable Footer component */}
      <Footer />
    </div>
  );
}