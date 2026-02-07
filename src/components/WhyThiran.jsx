
import { useRef, useState } from 'react';
import { useInView, AnimatePresence, motion } from 'framer-motion';
import { Rocket, Trophy, Users, Lightbulb, Zap, Target } from 'lucide-react';
import { Badge } from './ui/Badge';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Rocket, Trophy, Users, Lightbulb, Zap, Target, ArrowUpRight } from 'lucide-react';
import { Badge } from './ui/Badge';
import { cn } from '../lib/utils';
import { Card, CardHeader, CardTitle, CardDescription } from './ui/Card';


const features = [
  {
    icon: Rocket,
    title: 'Innovation Hub',
    description:
      'Experience cutting-edge technology and innovative solutions crafted by brilliant minds of PSG Tech.',
    gradient: 'from-purple-500 to-pink-500',
    delay: 0,
  },
  {
    icon: Trophy,
    title: 'Compete & Win',
    description:
      'Battle it out with the best in various technical and non-technical events. Exciting prizes await!',
    gradient: 'from-pink-500 to-rose-500',
    delay: 0.1,
  },
  {
    icon: Users,
    title: 'Network & Connect',
    description:
      'Build lasting connections with fellow students, industry experts, and tech enthusiasts.',
    gradient: 'from-cyan-500 to-blue-500',
    delay: 0.2,
  },
  {
    icon: Lightbulb,
    title: 'Learn & Grow',
    description:
      'Workshops, seminars, and hands-on sessions to sharpen your skills and expand your knowledge.',
    gradient: 'from-amber-500 to-orange-500',
    delay: 0.3,
  },
];

const stats = [

  { value: '5+', label: 'Events', icon: Target },
  { value: '100+', label: 'Participants', icon: Users },
  { value: '₹1L+', label: 'Prize Pool', icon: Trophy },
  { value: '3', label: 'Days', icon: Zap },

  { value: '20+', label: 'Events', icon: Target, color: 'text-purple-400' },
  { value: '1000+', label: 'Participants', icon: Users, color: 'text-pink-400' },
  { value: '₹1L+', label: 'Prize Pool', icon: Trophy, color: 'text-amber-400' },
  { value: '3', label: 'Days', icon: Zap, color: 'text-green-400' },
];

const WhyThiran = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [selected, setSelected] = useState(null);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-10 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="flex justify-center mb-6 sm:mb-8 lg:mb-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            <Badge variant="gradient">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              About Thiran
            </Badge>
          </motion.div>


          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 lg:mb-10">

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">

            <span className="text-white">Why </span>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">THIRAN</span>
            <span className="text-white">?</span>
          </h2>


          <div className="flex flex-col items-center w-full mt-8 sm:mt-10 lg:mt-12">
            <span className="text-base sm:text-lg lg:text-xl text-gray-400 font-normal max-w-3xl w-full text-center leading-relaxed px-4">
              Thiran is more than just a tech fest.
            </span>
            <span className="text-base sm:text-lg lg:text-xl text-gray-400 font-normal max-w-3xl w-full text-center leading-relaxed px-4">
              Its a platform for innovation, creativity and excellence.
            </span>
            <span className="text-base sm:text-lg lg:text-xl text-gray-400 font-normal max-w-3xl w-full text-center leading-relaxed px-4">
              Join us to witness the future of technology unfold.
            </span>
          </div>
        </motion.div>

        {/* Feature cards - Accordion */}
        <div className="relative mb-40 sm:mb-48 lg:mb-56 px-4 sm:px-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 sm:gap-16 lg:gap-20 place-items-center">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              const expanded = selected === idx;
              return (
                <motion.div
                  key={feature.title}
                  className="group relative cursor-pointer w-full max-w-[260px]"
                  layout
                  onClick={() => setSelected(expanded ? null : idx)}
                  initial={false}
                  animate={
                    expanded
                      ? { scale: 1.04, y: 0, boxShadow: '0 0 0 0 rgba(236, 72, 153, 0)' }
                      : {
                        y: [0, -6, 0, 6, 0],
                        scale: [1, 1.015, 1, 0.985, 1],
                        boxShadow: [
                          '0 4px 24px 0 rgba(236, 72, 153, 0.10)',
                          '0 8px 32px 0 rgba(168, 85, 247, 0.13)',
                          '0 4px 24px 0 rgba(236, 72, 153, 0.10)',
                          '0 0px 16px 0 rgba(168, 85, 247, 0.10)',
                          '0 4px 24px 0 rgba(236, 72, 153, 0.10)'
                        ]
                      }
                  }
                  transition={
                    expanded
                      ? { type: 'spring', stiffness: 300, damping: 30 }
                      : {
                        duration: 6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        times: [0, 0.25, 0.5, 0.75, 1]
                      }
                  }
                  whileHover={
                    expanded
                      ? {}
                      : { scale: 1.045, boxShadow: '0 8px 32px 0 rgba(236, 72, 153, 0.18)' }
                  }
                  whileTap={expanded ? {} : { scale: 0.98 }}
                >
                  <div className="bg-black/30 backdrop-blur-lg relative border-2 border-transparent group-hover:border-pink-400 group-hover:border-purple-400 group-hover:shadow-pink-400/30 group-hover:shadow-lg rounded-2xl sm:rounded-3xl p-2 sm:p-5 min-h-[120px] sm:min-h-[200px] h-full overflow-hidden transition-all duration-300 flex flex-col items-center justify-center">
                    <div className={`flex flex-col items-center w-full h-full transition-all duration-300 ${expanded ? 'justify-start' : 'justify-center flex-1'}`}>
                      <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-1 sm:mb-2 shadow-lg transition-all duration-300 ${expanded ? '' : 'mx-auto'}`}>
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <h3 className="font-heading text-sm sm:text-lg font-bold text-white mb-1 sm:mb-2 text-center select-none flex items-center justify-center min-h-[2rem] sm:min-h-[2.5rem]">
                        {feature.title}
                      </h3>
                      <AnimatePresence initial={false}>
                        {expanded && (
                          <motion.div
                            key="desc"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="w-full flex flex-col items-center"
                          >
                            <p className="text-white/80 text-xs sm:text-sm leading-relaxed text-center mb-2">
                              {feature.description}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="absolute inset-0 pointer-events-none rounded-2xl sm:rounded-3xl border border-gradient-to-br from-pink-400 to-purple-400 opacity-40" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Stats section */}
        <motion.div
          className="mt-16 bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-white/[0.08] backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12"

          <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
            Thiran is more than just a tech fest. It's a platform for innovation, creativity, and excellence. 
            Join us to witness the future of technology unfold.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 sm:mb-24"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants} className="group h-full">
              <Card 
                variant="neon" 
                className="h-full relative overflow-hidden group-hover:-translate-y-2 transition-transform duration-300"
              >
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300", feature.gradient)} />
                
                <CardHeader className="h-full relative z-10">
                  <div className="mb-6 flex justify-between items-start">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg", 
                      feature.gradient
                    )}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300" />
                  </div>
                  
                  <CardTitle className="mb-3 text-lg group-hover:text-white transition-colors">
                    {feature.title}
                  </CardTitle>
                  
                  <CardDescription className="text-gray-400 group-hover:text-gray-300 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 bg-white/[0.02] backdrop-blur-sm rounded-3xl p-6 sm:p-10 border border-white/[0.05]"

          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center group cursor-default">
              <div className="mb-3 p-3 rounded-full bg-white/[0.03] group-hover:bg-white/[0.08] transition-colors duration-300">
                <stat.icon className={cn("w-6 h-6 sm:w-8 sm:h-8", stat.color)} />
              </div>
              <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Quote/Tagline */}
        <motion.div
          className="mt-10 sm:mt-16 lg:mt-20 text-center px-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <blockquote className="text-lg sm:text-2xl lg:text-3xl font-heading font-medium text-gray-300 italic">
            "Where{' '}
            <span className="text-purple-400 not-italic">innovation</span> meets{' '}
            <span className="text-pink-400 not-italic">competition</span>"
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyThiran;