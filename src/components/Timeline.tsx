import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Trophy } from 'lucide-react';

const schedule = [
  {
    day: 'Day 1',
    date: 'Feb 23',
    events: [
      {
        time: '09:00 AM',
        title: 'Inauguration',
        description: 'Kickstarting Thiran 2026 with an inspiring opening ceremony.',
        location: 'Main Auditorium',
        icon: Calendar,
        color: 'purple',
      },
      {
        time: '04:00 PM',
        title: 'Witty Mindz',
        description: 'Non-Technical | A fast-paced battle of brains.',
        location: 'MCA Block, Seminar Hall',
        icon: Clock,
        color: 'cyan',
      },
    ]
  },
  {
    day: 'Day 2',
    date: 'Feb 24',
    events: [
      {
        time: '04:00 PM',
        title: 'Hack-The-Box',
        description: 'Technical | Solving complex problems with innovative algorithms.',
        location: 'MCA Lab',
        icon: Clock,
        color: 'pink',
      },
    ]
  },
  {
    day: 'Day 3',
    date: 'Feb 25',
    events: [
      {
        time: '04:00 PM',
        title: 'Brand Sprint',
        description: 'Non-Technical | Transform a surprise product into a brand.',
        location: 'MCA Block, Seminar Hall',
        icon: Calendar,
        color: 'purple',
      },
    ]
  },
  {
    day: 'Day 4',
    date: 'Feb 26',
    events: [
      {
        time: '04:00 PM',
        title: 'Blind Coding',
        description: 'Technical | Test your coding intuition without visual feedback.',
        location: 'MCA Block, Lab 2',
        icon: Clock,
        color: 'cyan',
      },
    ]
  },
  {
    day: 'Day 5',
    date: 'Mar 06',
    events: [
      {
        time: '02:00 PM',
        title: 'Star of Thiran',
        description: 'Flagship | The ultimate stage test for winners.',
        location: 'MCA Block, Main Auditorium',
        icon: Trophy,
        color: 'yellow',
        highlight: true,
      },
      {
        time: '05:30 PM',
        title: 'Valedictory Function',
        description: 'Prize distribution and closing ceremony.',
        location: 'Main Auditorium',
        icon: Calendar,
        color: 'purple',
      },
    ]
  },
];

export default function Timeline() {
  return (
    <section id="schedule" className="section-padding relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-cosmic-purple/10 rounded-full blur-[60px]" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-cosmic-cyan/10 rounded-full blur-[60px]" />

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 glass rounded-full text-sm text-cosmic-pink mb-4 font-mono border border-cosmic-pink/30">
            [ EVENT SCHEDULE ]
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="gradient-text">Timeline</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Follow the flow of events and make sure you don't miss out on any action.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-cosmic-purple/50 to-transparent md:-translate-x-1/2 shadow-[0_0_15px_rgba(168,85,247,0.4)]" />

          <div className="space-y-16">
            {schedule.map((dayGroup, groupIndex) => (
              <div key={dayGroup.day} className="relative">
                {/* Day Header - Sticky or just prominent */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="flex justify-center mb-8 relative z-20"
                >
                  <div className="glass-strong px-6 py-2 rounded-full border border-cosmic-purple/50 text-cosmic-purple font-bold shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                    {dayGroup.day} <span className="text-muted-foreground mx-2">|</span> <span className="text-white">{dayGroup.date}</span>
                  </div>
                </motion.div>

                <div className="space-y-12">
                  {dayGroup.events.map((item: any, index) => {
                    const side = item.side || (groupIndex % 2 === 0 ? 'left' : 'right');
                    const isContentRight = side === 'right';
                    const isEven = isContentRight; // Legacy variable name for "Right" alignment
                    const isHighlight = item.highlight;

                    return (
                      <motion.div
                        key={`${dayGroup.day}-${index}`}
                        initial={{ opacity: 0, x: isContentRight ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`relative flex flex-col md:flex-row gap-8 md:gap-0 ${isContentRight ? 'md:flex-row-reverse' : ''}`}
                      >
                        {/* Timeline Point */}
                        <div className={`absolute left-0 md:left-1/2 w-10 h-10 rounded-full border-4 border-background z-20 md:-translate-x-1/2 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.5)] ${isHighlight ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-[0_0_30px_rgba(234,179,8,0.5)]' : 'bg-gradient-to-br from-cosmic-purple to-cosmic-blue'}`}>
                          <div className="w-3 h-3 bg-white rounded-full" />
                        </div>

                        {/* Content Card */}
                        <div className={`ml-8 md:ml-0 md:w-1/2 ${isContentRight ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                          <div className={`glass-strong p-5 md:p-6 rounded-2xl transition-all group hover:-translate-y-1 duration-300 border ${isHighlight ? 'border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.3)] bg-gradient-to-br from-yellow-500/10 to-orange-500/10 hover:bg-yellow-500/20' : 'border-white/10 hover:border-white/30 hover:bg-white/[0.12]'}`}>
                            <div className={`flex flex-col gap-2 ${isContentRight ? 'md:items-end' : ''}`}>
                              <span className={`inline-block px-3 py-1 rounded-full text-[10px] md:text-xs font-bold ${isHighlight ? 'bg-yellow-500/20 text-yellow-300' : `bg-${item.color}-500/20 text-${item.color}-300`} mb-2 w-fit`}>
                                {item.time}
                              </span>
                              <h3 className={`text-lg md:text-xl font-bold ${isHighlight ? 'text-yellow-100' : 'text-white'} group-hover:text-glossy-blue transition-colors`}>
                                {item.title}
                              </h3>
                              <p className="text-muted-foreground text-sm">
                                {item.description}
                              </p>
                              <div className={`flex items-center gap-2 text-xs text-gray-400 mt-2 ${isContentRight ? 'md:justify-end' : ''}`}>
                                <MapPin className="w-3 h-3" />
                                {item.location}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Empty Space for alternate side */}
                        <div className="hidden md:block md:w-1/2" />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section >
  );
}
