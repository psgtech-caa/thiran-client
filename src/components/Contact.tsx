import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Mail,
  Phone,
  Sparkles,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { contactInfo, teamMembers, socialLinks } from '@/data/contact';

gsap.registerPlugin(ScrollTrigger);

// Floating particle component
const FloatingParticle = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-silver to-glossy-blue"
    initial={{ opacity: 0, y: 100 }}
    animate={{
      opacity: [0, 1, 0],
      y: [-20, -100],
      x: [0, Math.random() * 40 - 20],
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      ease: "easeOut"
    }}
  />
);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.to('.contact-aurora-1', {
      yPercent: -30,
      xPercent: 20,
      rotation: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    gsap.to('.contact-aurora-2', {
      yPercent: 40,
      xPercent: -25,
      rotation: -10,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="section-padding relative overflow-hidden">
      {/* Aurora background effects */}
      <div className="contact-aurora-1 absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(210 100% 50% / 0.35) 0%, hsl(220 12% 75% / 0.2) 40%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div className="contact-aurora-2 absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-25"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(220 12% 75% / 0.35) 0%, hsl(210 100% 50% / 0.2) 40%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Subtle mesh gradient overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            radial-gradient(at 20% 30%, hsl(210 100% 50% / 0.75) 0%, transparent 50%),
            radial-gradient(at 80% 70%, hsl(220 12% 75% / 0.55) 0%, transparent 50%),
            radial-gradient(at 50% 50%, hsl(210 100% 50% / 0.35) 0%, transparent 50%)
          `,
        }}
      />

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-6"
            style={{
              background: 'linear-gradient(135deg, hsl(220 12% 75% / 0.18) 0%, hsl(210 100% 50% / 0.2) 100%)',
              border: '1px solid hsl(210 100% 50% / 0.35)',
            }}
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4 text-glossy-blue" />
            <span className="text-sm text-silver font-medium">Let's Connect</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-silver via-glossy-blue to-silver bg-clip-text text-transparent">
              Get In Touch
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Have questions? Reach out to us through any of the channels below.
          </p>
        </motion.div>

        {/* Main Layout: Team Box + Info Cards */}
        <div className="max-w-5xl mx-auto space-y-8">

          {/* Team Members - direct row, no outer card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {teamMembers.map((member, index) => (
              <motion.a
                key={member.name}
                href={`tel:${member.phone.replace(/\s/g, '')}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="group block"
              >
                <div className="relative p-6 rounded-2xl border border-white/10 hover:border-glossy-blue/30 transition-all duration-300 overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, hsl(210 100% 50% / 0.06) 0%, hsl(220 12% 75% / 0.04) 100%)',
                  }}
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                    style={{
                      background: 'radial-gradient(circle at 50% 50%, hsl(210 100% 50% / 0.12) 0%, transparent 70%)',
                    }}
                  />

                  <div className="relative flex items-center gap-4">
                    {/* Avatar circle with initials */}
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-glossy-blue/30 to-silver/20 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:shadow-lg group-hover:shadow-glossy-blue/20 transition-all">
                      <span className="text-base font-bold text-glossy-blue">
                        {member.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white text-base truncate group-hover:text-glossy-blue transition-colors">
                        {member.name}
                      </p>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        {member.role}
                      </p>
                      <div className="flex items-center gap-1.5 text-silver/70 group-hover:text-silver transition-colors">
                        <Phone className="w-3.5 h-3.5" />
                        <span className="text-sm font-mono">{member.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Email + Address row */}
          <div className="grid md:grid-cols-2 gap-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.a
                  key={info.label}
                  href={info.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="block group"
                >
                  <div
                    className="relative p-6 rounded-2xl backdrop-blur-xl border border-white/10 overflow-hidden h-full hover:border-glossy-blue/30 transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, hsl(220 12% 75% / 0.08) 0%, hsl(210 100% 50% / 0.06) 100%)',
                    }}
                  >
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: 'radial-gradient(circle at 50% 50%, hsl(210 100% 50% / 0.15) 0%, transparent 70%)',
                      }}
                    />

                    <div className="relative flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-glossy-blue to-silver flex items-center justify-center shadow-lg flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{info.label}</p>
                        <p className="font-medium text-silver/80 group-hover:text-white transition-colors text-sm md:text-base">
                          {info.value}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
