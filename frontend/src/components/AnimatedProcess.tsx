'use client';

import { motion, useInView } from 'framer-motion';
import { useInView as useIntersectionObserver } from 'react-intersection-observer';
import { Upload, Brain, FileText, Download, ArrowRight, Play } from 'lucide-react';
import { useState, useEffect } from 'react';

const steps = [
  {
    icon: Upload,
    title: 'Upload Contract',
    description: 'Drag and drop your PDF, DOCX, or TXT contract file',
    color: 'from-blue-500 to-cyan-500',
    delay: 0.1,
  },
  {
    icon: Brain,
    title: 'AI Analysis',
    description: 'Our AI scans for risks, unfair terms, and problematic clauses',
    color: 'from-purple-500 to-pink-500',
    delay: 0.2,
  },
  {
    icon: FileText,
    title: 'Review Results',
    description: 'Get clear explanations and risk assessments in plain English',
    color: 'from-green-500 to-emerald-500',
    delay: 0.3,
  },
  {
    icon: Download,
    title: 'Export Report',
    description: 'Download professional PDF reports to share with clients',
    color: 'from-orange-500 to-red-500',
    delay: 0.4,
  },
];

export default function AnimatedProcess() {
  const [ref, inView] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const stepVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const connectorVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: 0.8,
        ease: 'easeInOut',
        delay: 0.5,
      },
    },
  };

  return (
    <section className="py-20 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ y: 50, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            initial={{ scale: 0.9 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            How It Works
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {' '}Simple & Fast
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Get professional contract analysis in minutes, not hours. Our streamlined process makes it easy.
          </motion.p>
        </motion.div>

        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Desktop Layout */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-4 gap-8 relative">
              {/* Connector Lines */}
              <div className="absolute top-20 left-0 right-0 h-0.5">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 origin-left"
                  variants={connectorVariants}
                />
              </div>

              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    className="relative"
                    variants={stepVariants}
                  >
                    {/* Step Card */}
                    <motion.div
                      className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
                      whileHover={{ 
                        scale: 1.05,
                        y: -10,
                        transition: { duration: 0.3 }
                      }}
                    >
                      {/* Step Number */}
                      <div className="absolute -top-4 left-8">
                        <motion.div
                          className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          initial={{ scale: 0 }}
                          animate={inView ? { scale: 1 } : {}}
                          transition={{ duration: 0.5, delay: step.delay + 0.3 }}
                        >
                          {index + 1}
                        </motion.div>
                      </div>

                      {/* Icon */}
                      <motion.div
                        className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${step.color} text-white mb-6 mt-4`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className="w-8 h-8" />
                      </motion.div>

                      {/* Content */}
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>

                      {/* Hover Effect */}
                      <motion.div
                        className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                      />
                    </motion.div>

                    {/* Arrow */}
                    {index < steps.length - 1 && (
                      <motion.div
                        className="absolute top-20 -right-4 z-10"
                        initial={{ opacity: 0, x: -20 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: step.delay + 0.8 }}
                      >
                        <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  className="relative"
                  variants={stepVariants}
                >
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-8 top-20 w-0.5 h-16 bg-gradient-to-b from-gray-200 to-transparent" />
                  )}

                  <motion.div
                    className="flex items-start space-x-6"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Step Number & Icon */}
                    <div className="relative flex-shrink-0">
                      <motion.div
                        className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-gray-100"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className="w-6 h-6 text-gray-600" />
                      </motion.div>
                      <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {index + 1}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-2">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-16"
          initial={{ y: 50, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.button
            className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-2">Try It Now</span>
            <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            
            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: [-100, 300],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut",
              }}
            />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}