import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Lightbulb, 
  Rocket, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export function FeaturesPage() {
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

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze your ideas against market data, competitor insights, and industry trends.",
      highlight: "99% Accuracy"
    },
    {
      icon: Target,
      title: "Market Validation",
      description: "Comprehensive market research and validation to ensure your ideas have real commercial potential.",
      highlight: "Real-time Data"
    },
    {
      icon: TrendingUp,
      title: "Growth Forecasting",
      description: "Predictive analytics to forecast potential growth trajectories and market opportunities.",
      highlight: "5-Year Projections"
    },
    {
      icon: Users,
      title: "User Persona Insights",
      description: "Deep dive into your target audience with detailed user personas and behavioral analytics.",
      highlight: "Detailed Profiles"
    },
    {
      icon: BarChart3,
      title: "Competitive Analysis",
      description: "Thorough analysis of your competitive landscape with strategic positioning recommendations.",
      highlight: "Live Monitoring"
    },
    {
      icon: Rocket,
      title: "Launch Strategy",
      description: "Customized go-to-market strategies tailored to your specific idea and target market.",
      highlight: "Step-by-step"
    }
  ];

  const benefits = [
    "Validate ideas 10x faster than traditional methods",
    "Reduce market research costs by up to 80%",
    "Access to 50M+ data points for analysis",
    "Real-time competitor intelligence",
    "Integration with 100+ business tools",
    "24/7 AI-powered insights"
  ];

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
      <motion.div
        className="absolute bottom-20 left-1/4 w-20 h-20 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 12,
          repeat: Infinity
        }}
      />
      
      {/* Use the reusable Navbar component */}
      <Navbar />

      {/* Hero Section */}
      <motion.div 
        className="relative z-10 px-6 py-20 text-center"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            variants={fadeInUp}
          >
            Powerful Features for
            <motion.span 
              className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
              variants={fadeInUp}
            >
              Idea Validation
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            variants={fadeInUp}
          >
            Everything you need to validate, analyze, and launch your next big idea with confidence.
          </motion.p>
        </div>
      </motion.div>

      {/* Main Features Grid */}
      <motion.div 
        className="relative z-10 px-6 py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="group p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-purple-100/50"
                variants={fadeInUp}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <motion.div 
                    className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <span className="text-sm font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                    {feature.highlight}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Benefits Section */}
      <motion.div 
        className="relative z-10 px-6 py-20 bg-white/60 backdrop-blur-sm"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose 
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Vibe Monkey</span>?
            </h2>
            <p className="text-xl text-gray-600">Join thousands of entrepreneurs who trust our platform</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Benefits List */}
            <motion.div className="space-y-6" variants={staggerContainer}>
              {benefits.map((benefit, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center space-x-4 group"
                  variants={fadeInUp}
                  whileHover={{ x: 10 }}
                >
                  <motion.div 
                    className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <CheckCircle className="w-5 h-5 text-white" />
                  </motion.div>
                  <span className="text-lg text-gray-700 group-hover:text-purple-600 transition-colors duration-300">
                    {benefit}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* Visual Element */}
            <motion.div className="relative" variants={fadeInUp}>
              <div className="w-80 h-80 mx-auto relative">
                {/* Animated rings */}
                <motion.div 
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 opacity-30"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity
                  }}
                />
                <motion.div 
                  className="absolute inset-8 rounded-full bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 opacity-50"
                  animate={{
                    scale: [1.1, 1, 1.1],
                    rotate: [360, 0]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity
                  }}
                />
                <motion.div 
                  className="absolute inset-16 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 opacity-70"
                  animate={{
                    scale: [0.9, 1.2, 0.9]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity
                  }}
                />
                
                {/* Center icon */}
                <motion.div 
                  className="absolute inset-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl"
                  whileHover={{ scale: 1.1 }}
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    rotate: {
                      duration: 10,
                      repeat: Infinity
                    }
                  }}
                >
                  <Lightbulb className="w-16 h-16 text-white" />
                </motion.div>

                {/* Floating icons */}
                {[Brain, Target, TrendingUp, Users, BarChart3, Rocket].map((Icon, index) => (
                  <motion.div
                    key={index}
                    className="absolute w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${index * 60}deg) translateY(-160px) translateX(-24px)`,
                    }}
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 360]
                    }}
                    transition={{
                      y: {
                        duration: 2 + index * 0.2,
                        repeat: Infinity
                      },
                      rotate: {
                        duration: 8,
                        repeat: Infinity
                      }
                    }}
                    whileHover={{ scale: 1.2 }}
                  >
                    <Icon className="w-6 h-6 text-purple-600" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        className="relative z-10 px-6 py-20 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-gray-900 mb-6"
            variants={fadeInUp}
          >
            Ready to validate your next big idea?
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 mb-10"
            variants={fadeInUp}
          >
            Join thousands of successful entrepreneurs who started their journey with Vibe Monkey.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={fadeInUp}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Get Started For Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >   
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Use the reusable Footer component */}
      <Footer />
    </div>
  );
}