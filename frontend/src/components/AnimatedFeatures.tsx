'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Shield, Zap, Lock, CheckCircle, FileText, Users, BarChart3, Clock } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Instant Analysis',
    description: 'Get contract analysis results in under 10 seconds with our AI-powered engine',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    icon: Lock,
    title: 'Risk Detection',
    description: 'Automatically identify payment terms, IP clauses, and liability risks',
    color: 'from-red-400 to-pink-500',
  },
  {
    icon: CheckCircle,
    title: 'Plain English',
    description: 'Complex legal language translated into easy-to-understand explanations',
    color: 'from-green-400 to-blue-500',
  },
  {
    icon: FileText,
    title: 'PDF Export',
    description: 'Professional reports ready to share with clients or legal advisors',
    color: 'from-purple-400 to-indigo-500',
  },
  {
    icon: Users,
    title: 'Collaborate',
    description: 'Share analysis results with team members and stakeholders',
    color: 'from-blue-400 to-cyan-500',
  },
  {
    icon: BarChart3,
    title: 'Risk Scoring',
    description: 'Get comprehensive risk scores and detailed breakdowns',
    color: 'from-indigo-400 to-purple-500',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const cardHoverVariants = {
  hover: {
    scale: 1.05,
    rotateY: 5,
    rotateX: 5,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

export default function AnimatedFeatures() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50" ref={ref}>
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
            Powerful Features for
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {' '}Modern Freelancers
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Everything you need to protect your freelance business, powered by cutting-edge AI technology
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="relative group"
                variants={itemVariants}
                whileHover="hover"
              >
                <motion.div
                  className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  variants={cardHoverVariants}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  {/* Icon */}
                  <motion.div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-6`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover Effect Border */}
                  <motion.div
                    className={`absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20`}
                    style={{
                      background: `linear-gradient(white, white) padding-box, linear-gradient(45deg, transparent, transparent) border-box`,
                      mask: `linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)`,
                      maskComposite: 'exclude',
                    }}
                  />
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ y: 50, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {[
            { value: '10s', label: 'Average Analysis Time' },
            { value: '99%', label: 'Accuracy Rate' },
            { value: '50K+', label: 'Contracts Analyzed' },
            { value: '24/7', label: 'AI Availability' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
            >
              <motion.div
                className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2"
                whileHover={{ scale: 1.1 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}