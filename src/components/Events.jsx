import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Users, Clock, Trophy, ChevronRight, Filter } from 'lucide-react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/Card';
import { cn } from '../lib/utils';

// Event data
export const eventsData = [
  {
    id: 1,
    name: 'Code Sprint',
    category: 'Technical',
    icon: '💻',
    color: '#a855f7',
    gradient: 'from-purple-500 to-violet-600',
    position: 'left-top',
    participants: '2 per team',
    duration: '3 hours',
    rules: [
      'Duration: 3 hours',
      'Languages allowed: C, C++, Java, Python',
      'Internet access is not permitted',
      'Teams must bring their own laptops',
      'Plagiarism leads to disqualification',
    ],
    description:
      'Put your coding skills to the ultimate test! Solve algorithmic challenges and compete against the best coders of PSG Tech.',
    prize: '₹10,000',
  },
  {
    id: 2,
    name: 'RoboWars',
    category: 'Technical',
    icon: '🤖',
    color: '#ec4899',
    gradient: 'from-pink-500 to-rose-600',
    position: 'left-bottom',
    participants: '4 per team',
    duration: '2 hours',
    rules: [
      'Robot weight limit: 25kg',
      'Dimensions: 50cm x 50cm x 50cm max',
      'Remote controlled only',
      'No projectile weapons',
      'Safety gear mandatory',
    ],
    description:
      'Build, battle, and dominate! Design your ultimate fighting robot and enter the arena for an epic showdown.',
    prize: '₹25,000',
  },
  {
    id: 3,
    name: 'Hackathon',
    category: 'Technical',
    icon: '⚡',
    color: '#3b82f6',
    gradient: 'from-blue-500 to-cyan-600',
    position: 'right-bottom',
    participants: '4-6 per team',
    duration: '24 hours',
    rules: [
      '24-hour non-stop development',
      'Open innovation theme',
      'Prototype must be working',
      'Presentation time: 5 mins',
      'Evaluation on novelty and implementation',
    ],
    description:
      'Sleep is for the weak! Prototype innovative solutions to real-world problems in this intense 24-hour hackathon.',
    prize: '₹30,000',
  },
  {
    id: 4,
    name: 'Circuit Mania',
    category: 'Technical',
    icon: '⚡',
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-600',
    position: 'right-bottom',
    participants: '2 per team',
    duration: '2 hours',
    rules: [
      'Components will be provided',
      'Duration: 2 hours',
      'No pre-built circuits allowed',
      'Documentation must be submitted',
      'Both analog and digital challenges',
    ],
    description:
      'Master the art of electronics! Design and build circuits to solve real-world problems in this electrifying challenge.',
    prize: '₹8,000',
  },
  {
    id: 5,
    name: 'Tech Quiz',
    category: 'Non-Technical',
    icon: '🧠',
    color: '#10b981',
    gradient: 'from-emerald-500 to-green-600',
    position: 'bottom',
    participants: '2 per team',
    duration: '1.5 hours',
    rules: [
      'Prelims: Written round',
      'Finals: Buzzer round',
      'Topics: Tech, Science, Current Affairs',
      'No electronic devices allowed',
      'Decision of quizmaster is final',
    ],
    description:
      'Test your knowledge across technology, science, and current affairs. Only the sharpest minds will prevail!',
    prize: '₹5,000',
  },
];

const EventCard = ({ event, onClick, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
      onClick={() => onClick(event)}
    >
      <Card variant="solid" className="h-full overflow-hidden cursor-pointer group-hover:border-purple-500/30 transition-all duration-300 relative">
        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300", event.gradient)} />
        
        {/* Top badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className="px-2 py-1 rounded-md bg-white/10 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white border border-white/10">
            {event.category}
          </span>
        </div>

        <CardContent className="p-6 pt-8">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br mb-4 shadow-lg", 
            event.gradient
          )}>
            <span className="text-2xl">{event.icon}</span>
          </div>

          <h3 className="font-heading text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
            {event.name}
          </h3>

          <p className="text-sm text-gray-400 line-clamp-2 mb-4">
            {event.description}
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 border-t border-white/5 pt-4">
            <div className="flex items-center gap-1.5">
              <Users size={12} className="text-purple-400" />
              <span>{event.participants}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-pink-400" />
              <span>{event.duration}</span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2 mt-1">
              <Trophy size={12} className="text-amber-400" />
              <span className="font-semibold text-white">Prize: {event.prize}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-6 pb-6 pt-0 mt-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-xs justify-between bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
          >
            <span>View Details</span>
            <ArrowUpRight size={14} />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const Events = ({ onEventClick }) => {
  const [filter, setFilter] = useState('All');
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  
  const categories = ['All', 'Technical', 'Non-Technical'];
  
  const filteredEvents = filter === 'All' 
    ? eventsData 
    : eventsData.filter(event => event.category === filter);

  return (
    <section
      ref={sectionRef}
      id="events"
      className="section relative"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="gradient" className="mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
              Explore Events
            </Badge>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Featured </span>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Events</span>
            </h2>
            <p className="text-gray-400 max-w-lg">
              Participation is the first step to glory. Check out our wide range of technical and non-technical events.
            </p>
          </motion.div>

          {/* Filter tabs */}
          <motion.div 
            className="flex flex-wrap gap-2 p-1 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                  filter === category 
                    ? "bg-white/10 text-white shadow-sm" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event, index) => (
              <EventCard 
                key={event.id} 
                event={event} 
                index={index} 
                onClick={onEventClick} 
              />
            ))}
          </AnimatePresence>
        </div>

        {/* View all button */}
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" className="group border-white/10 hover:border-purple-500/50">
            <span>View All Events</span>
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Events;
