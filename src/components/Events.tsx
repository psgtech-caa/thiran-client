import { useState } from 'react';
import { motion } from 'framer-motion';
import EventCard from './EventCard';
import EventModal from './EventModal';
import { events, Event } from '@/data/events';

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <section id="events" className="section-padding relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-cosmic-purple/20 rounded-full blur-[40px]" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-cosmic-pink/15 rounded-full blur-[40px]" />

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 glass rounded-full text-sm text-cosmic-cyan mb-4 font-mono border border-cosmic-cyan/30">
            [ FEATURED EVENTS ]
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="gradient-text">Explore Events</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            From intense hackathons to creative design challenges, discover events 
            that challenge your skills and push your boundaries.
          </p>
        </motion.div>

        {/* Events Grid - 2x2 */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {events.map((event, index) => (
            <EventCard 
              key={event.id} 
              event={event} 
              index={index}
              onClick={handleEventClick}
            />
          ))}
        </div>
      </div>

      {/* Event Modal */}
      <EventModal 
        event={selectedEvent} 
        isOpen={isModalOpen}
        showRegistration={true}
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
}
