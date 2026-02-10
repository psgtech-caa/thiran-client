import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Mail,
  Phone,
  Sparkles,
  Heart
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { contactInfo, socialLinks } from '@/data/contact';

gsap.registerPlugin(ScrollTrigger);

// Floating particle component
const FloatingParticle = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400"
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
          background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.4) 0%, rgba(236, 72, 153, 0.2) 40%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div className="contact-aurora-2 absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-25"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(34, 211, 238, 0.4) 0%, rgba(139, 92, 246, 0.2) 40%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      
      {/* Subtle mesh gradient overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            radial-gradient(at 20% 30%, rgba(139, 92, 246, 0.8) 0%, transparent 50%),
            radial-gradient(at 80% 70%, rgba(236, 72, 153, 0.6) 0%, transparent 50%),
            radial-gradient(at 50% 50%, rgba(34, 211, 238, 0.4) 0%, transparent 50%)
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
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
            }}
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-violet-300 font-medium">Let's Connect</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Get In Touch
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Have questions? Reach out to us through any of the channels below.
          </p>
        </motion.div>

        {/* Contact Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Info Cards */}
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            const gradients = [
              'from-violet-500/20 to-fuchsia-500/20',
              'from-fuchsia-500/20 to-pink-500/20',
              'from-cyan-500/20 to-violet-500/20',
            ];
            const iconBgs = [
              'from-violet-500 to-fuchsia-500',
              'from-fuchsia-500 to-pink-500',
              'from-cyan-500 to-violet-500',
            ];
            
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
                  className={`relative p-6 rounded-2xl bg-gradient-to-br ${gradients[index]} backdrop-blur-xl border border-white/10 overflow-hidden h-full`}
                >
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
                    }}
                  />
                  
                  <div className="relative flex flex-col items-center text-center gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${iconBgs[index]} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{info.label}</p>
                      <p className="font-medium text-white group-hover:text-violet-300 transition-colors">{info.value}</p>
                    </div>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Social Links & Location Row */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-8">
          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 backdrop-blur-xl border border-white/10"
          >
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-4 h-4 text-fuchsia-400" />
              <h3 className="text-lg font-semibold text-white">Follow Us</h3>
            </div>
            <div className="flex gap-3 justify-center">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                const colors = ['hover:bg-violet-500', 'hover:bg-cyan-500', 'hover:bg-fuchsia-500', 'hover:bg-pink-500'];
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${colors[index % colors.length]} hover:border-transparent hover:text-white text-gray-400 transition-all duration-300`}
                    aria-label={social.label}
                    whileHover={{ scale: 1.15, y: -3, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Location Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-violet-500/10 backdrop-blur-xl border border-white/10 relative overflow-hidden"
          >
            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <FloatingParticle key={i} delay={i * 0.6} />
              ))}
            </div>
            
            <div className="relative flex items-center gap-4">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <MapPin className="w-8 h-8 text-fuchsia-400" />
              </motion.div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Location</p>
                <p className="text-white font-medium">PSG College of Technology, Coimbatore</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
