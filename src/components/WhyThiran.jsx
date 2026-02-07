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
  { value: '20+', label: 'Events', icon: Target, color: 'text-purple-400' },
  { value: '1000+', label: 'Participants', icon: Users, color: 'text-pink-400' },
  { value: '₹1L+', label: 'Prize Pool', icon: Trophy, color: 'text-amber-400' },
  { value: '3', label: 'Days', icon: Zap, color: 'text-green-400' },
];

const WhyThiran = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

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
            className="flex justify-center mb-4 sm:mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            <Badge variant="gradient">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              About Thiran
            </Badge>
          </motion.div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="text-white">Why </span>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">THIRAN</span>
            <span className="text-white">?</span>
          </h2>

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
