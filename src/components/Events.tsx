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

        {/* Events Grid - 2x2 + Featured */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {events.filter(e => e.category !== 'Flagship').map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              index={index}
              onClick={handleEventClick}
            />
          ))}
        </div>

        {/* Star of Thiran - Premium Flagship */}
        {events.filter(e => e.category === 'Flagship').map((event) => (
          <motion.div
            key={event.id}
            className="max-w-5xl mx-auto mt-12"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            {/* Premium Label */}


            <div
              className="relative overflow-hidden rounded-3xl group"
            >
              {/* Animated rotating gradient border */}
              <div className="absolute -inset-[2px] rounded-3xl overflow-hidden">
                <div
                  className="absolute inset-0 bg-[conic-gradient(from_0deg,#eab308,#f97316,#ef4444,#eab308,#f97316,#ef4444,#eab308)]"
                  style={{ animation: 'spin 4s linear infinite' }}
                />
              </div>

              {/* Outer glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-yellow-500/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative rounded-3xl overflow-hidden" style={{ background: 'rgba(10, 10, 15, 0.85)', backdropFilter: 'blur(24px)' }}>
                {/* Full-width background image */}
                <div className="absolute inset-0">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${event.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />
                </div>

                {/* Shimmer sweep */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 p-8 md:p-10 min-h-[320px] md:min-h-[380px] flex flex-col justify-end">
                  {/* Top badges */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-500 to-amber-500 text-black flex items-center gap-2 shadow-lg shadow-yellow-500/30">
                        ⭐ FLAGSHIP
                      </span>
                      <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500/20 border border-red-500/30 text-red-400">
                        Winners Only
                      </span>
                    </div>

                  </div>

                  {/* Title */}
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight">
                    <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 bg-clip-text text-transparent" style={{ filter: 'drop-shadow(0 0 20px rgba(234,179,8,0.4))' }}>
                      {event.name}
                    </span>
                  </h3>

                  <p className="text-gray-300 mb-6 text-lg max-w-2xl leading-relaxed">
                    {event.description}
                  </p>

                  {/* Info grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {[
                      { icon: '🏆', label: 'Prize Pool', value: event.prizePool, highlight: true },
                      { icon: '📅', label: 'Date', value: event.date },
                      { icon: '🕐', label: 'Time', value: event.time },
                      { icon: '📍', label: 'Venue', value: event.venue },
                    ].map((item) => (
                      <div key={item.label} className={`rounded-xl p-3 text-center border transition-colors duration-300 ${item.highlight
                        ? 'bg-yellow-500/5 border-yellow-500/20 group-hover:border-yellow-500/40'
                        : 'bg-white/[0.02] border-white/5 group-hover:border-white/10'
                        }`}>
                        <span className="text-lg">{item.icon}</span>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 mt-1">{item.label}</p>
                        <p className={`font-bold text-sm mt-0.5 ${item.highlight ? 'text-yellow-400' : 'text-white'}`}>{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Special note */}
                  {event.specialNote && (
                    <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-5 py-3">
                      <span className="text-xl">✨</span>
                      <p className="text-sm text-amber-300/90 font-medium">{event.specialNote}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
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
