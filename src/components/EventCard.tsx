import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Trophy, ArrowRight, ExternalLink } from 'lucide-react';
import HoverCard3D from './HoverCard3D';
import { Event, categoryColors } from '@/data/events';

interface EventCardProps {
  event: Event;
  index: number;
  onClick: (event: Event) => void;
}

export default function EventCard({ event, index, onClick }: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      style={{ perspective: 1000 }}
      onClick={() => onClick(event)}
      className="cursor-pointer"
    >
      <HoverCard3D className="h-full">
        {/* Image */}
        <div className="relative h-48 overflow-hidden group">
          <motion.div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${event.image})`,
              backgroundColor: 'hsl(var(--cosmic-surface))',
            }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
          {/* Shimmer effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          
          {/* Category Badge */}
          <motion.div 
            className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${categoryColors[event.category]} text-white`}
            whileHover={{ scale: 1.05 }}
          >
            {event.category}
          </motion.div>

          {/* Click Indicator Icon */}
          <motion.div 
            className="absolute top-4 right-4 glass-strong p-2 rounded-full"
            whileHover={{ scale: 1.15, rotate: 15 }}
            transition={{ duration: 0.2 }}
          >
            <ExternalLink className="w-4 h-4" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-6">
          <motion.h3 
            className="text-xl font-bold mb-2 gradient-text"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            {event.name}
          </motion.h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {event.description}
          </p>

          {/* Event Details */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <motion.div 
              className="flex items-center gap-2 text-xs text-muted-foreground"
              whileHover={{ x: 3 }}
            >
              <Calendar className="w-3 h-3 text-cosmic-purple" />
              <span>{event.date}</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 text-xs text-muted-foreground"
              whileHover={{ x: 3 }}
            >
              <Clock className="w-3 h-3 text-cosmic-pink" />
              <span>{event.time}</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 text-xs text-muted-foreground"
              whileHover={{ x: 3 }}
            >
              <MapPin className="w-3 h-3 text-cosmic-cyan" />
              <span>{event.venue}</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 text-xs text-muted-foreground"
              whileHover={{ x: 3 }}
            >
              <Users className="w-3 h-3 text-yellow-400" />
              <span>Team: {event.teamSize}</span>
            </motion.div>
          </div>

          {/* Prize Pool & Action Hint */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-yellow-400">
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-semibold">{event.prizePool}</span>
            </div>

            {/* Hover Action Hint */}
            <motion.div 
              className="pt-3 border-t border-white/10 flex items-center justify-between text-sm text-muted-foreground group-hover:text-foreground transition-colors"
              initial={{ opacity: 0.7 }}
              whileHover={{ opacity: 1 }}
            >
              <span>View details & register</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.div>
          </div>
        </div>
      </HoverCard3D>
    </motion.div>
  );
}
