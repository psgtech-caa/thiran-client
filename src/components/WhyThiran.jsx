import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Rocket, Trophy, Users, Lightbulb, Zap, Target } from 'lucide-react';
import { Badge } from './ui/Badge';

const features = [
  {
    icon: Rocket,
    title: 'Innovation Hub',
    description:
      'Experience cutting-edge technology and innovative solutions crafted by brilliant minds of PSG Tech.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Trophy,
    title: 'Compete & Win',
    description:
      'Battle it out with the best in various technical and non-technical events. Exciting prizes await!',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: Users,
    title: 'Network & Connect',
    description:
      'Build lasting connections with fellow students, industry experts, and tech enthusiasts.',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Lightbulb,
    title: 'Learn & Grow',
    description:
      'Workshops, seminars, and hands-on sessions to sharpen your skills and expand your knowledge.',
    gradient: 'from-amber-500 to-orange-500',
  },
];

const stats = [
  { value: '20+', label: 'Events', icon: Target },
  { value: '1000+', label: 'Participants', icon: Users },
  { value: '₹1L+', label: 'Prize Pool', icon: Trophy },
  { value: '3', label: 'Days', icon: Zap },
];

const WhyThiran = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [selected, setSelected] = useState(null);

  // Animation variants for cards (premium, smooth)
  const gridCardVariants = {
    initial: { opacity: 0, scale: 0.96 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1], // softer cubic-bezier
      },
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      transition: {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      },
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
            <span className="text-white">Why </span>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">THIRAN</span>
            <span className="text-white">?</span>
          </h2>

          <div className="flex flex-col items-center w-full mt-8 sm:mt-10 lg:mt-12">
            <span className="text-base sm:text-lg lg:text-xl text-gray-400 font-normal max-w-3xl w-full text-center leading-relaxed px-4">
              Thiran, meaning{' '}
              <span className="text-purple-400 font-medium">"ability"</span> or{' '}
              <span className="text-pink-400 font-medium">"skill"</span> in Tamil,
            </span>
            <span className="text-base sm:text-lg lg:text-xl text-gray-400 font-normal max-w-3xl w-full text-center leading-relaxed px-4">
              is PSG Tech's premier intra-college technical festival.
            </span>
            <span className="text-base sm:text-lg lg:text-xl text-gray-400 font-normal max-w-3xl w-full text-center leading-relaxed px-4">
              Where passion meets opportunity.
            </span>
          </div>
        </motion.div>

        {/* Feature cards - Grid & Expand on Click (no hover logic) */}
        <div className="relative mb-12 sm:mb-16 lg:mb-20 min-h-[340px]">
          <AnimatePresence initial={false}>
            {selected === null ? (
              <motion.div
                key="grid"
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 place-items-center"
                layout
                variants={gridCardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {features.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.title}
                      className="group relative cursor-pointer w-full max-w-[280px]"
                      layoutId={`feature-card-${idx}`}
                      layout
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelected(idx)}
                      variants={gridCardVariants}
                    >
                      <div className="bg-black/30 backdrop-blur-lg relative border-2 border-transparent group-hover:border-pink-400 group-hover:border-purple-400 group-hover:shadow-pink-400/30 group-hover:shadow-lg rounded-2xl sm:rounded-3xl p-4 sm:p-5 h-full overflow-hidden transition-all duration-300">
                        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-br from-white/20 to-transparent rounded-t-2xl pointer-events-none" />
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-heading text-base sm:text-lg font-bold text-white mb-2 text-center">
                          {feature.title}
                        </h3>
                        <p className="text-white/80 text-xs sm:text-sm leading-relaxed text-center">
                          {feature.description}
                        </p>
                        <div className="absolute inset-0 pointer-events-none rounded-2xl sm:rounded-3xl border border-gradient-to-br from-pink-400 to-purple-400 opacity-40" />
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="expanded"
                className="flex justify-center items-center min-h-[340px]"
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1.08, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
              >
                <motion.div
                  className="bg-black/30 backdrop-blur-xl relative border-2 border-transparent rounded-3xl p-10 sm:p-12 h-full overflow-hidden transition-all duration-300"
                  layoutId={`feature-card-${selected}`}
                  layout
                  onClick={() => setSelected(null)}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1.08, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
                  exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
                >
                  <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-br from-white/20 to-transparent rounded-t-3xl pointer-events-none" />
                  {(() => { const Icon = features[selected].icon; return (
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${features[selected].gradient} flex items-center justify-center mb-8 shadow-lg mx-auto`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  ); })()}
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-4 text-center">
                    {features[selected].title}
                  </h3>
                  <p className="text-white/80 text-base sm:text-lg leading-relaxed text-center">
                    {features[selected].description}
                  </p>
                  <div className="absolute inset-0 pointer-events-none rounded-3xl border border-gradient-to-br from-pink-400 to-purple-400 opacity-50" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stats section */}
        <motion.div
          className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-white/[0.08] backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/[0.08] mx-auto mb-3 sm:mb-4 flex items-center justify-center group-hover:bg-purple-500/10 transition-colors">
                  <stat.icon size={18} className="text-purple-400 sm:w-5 sm:h-5" />
                </div>
                <div className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-500 uppercase tracking-wider text-xs sm:text-sm font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
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