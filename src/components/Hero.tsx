import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { ChevronDown, Calendar, MapPin, Sparkles, Scan } from 'lucide-react';
import { useEffect, useRef, useMemo, useState } from 'react';
import gsap from 'gsap';
import MagneticButton from './MagneticButton';
import { useCountdown } from '@/hooks/useCountdown';
import { GradientText } from './reactbits';

// Animated number counter
function AnimatedCounter({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const animation = animate(count, value, { duration: 0.5 });
    const unsubscribe = rounded.on("change", (v) => setDisplayValue(v));
    return () => {
      animation.stop();
      unsubscribe();
    };
  }, [value, count, rounded]);

  return <span>{displayValue.toString().padStart(2, '0')}</span>;
}

function CountdownBox({ value, label, index }: { value: number; label: string; index: number }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current !== value && boxRef.current) {
      gsap.fromTo(
        boxRef.current.querySelector('.countdown-value'),
        { scale: 1.2, opacity: 0.5 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
      );
    }
    prevValue.current = value;
  }, [value]);

  return (
    <motion.div 
      ref={boxRef}
      className="flex flex-col items-center group"
      initial={{ opacity: 0, y: 30, rotateX: -30 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: 0.8 + index * 0.1, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.05, y: -5 }}
    >
      <div className="relative glass rounded-xl p-3 sm:p-4 md:p-6 min-w-[60px] sm:min-w-[70px] md:min-w-[90px] overflow-hidden transition-all duration-300 group-hover:bg-white/10">
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-[-2px] rounded-xl bg-gradient-to-r from-silver via-glossy-blue to-silver animate-spin-slow" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-0 rounded-xl bg-background" />
        </div>
        
        <span className="countdown-value relative z-10 text-2xl sm:text-3xl md:text-5xl font-bold gradient-text">
          <AnimatedCounter value={value} />
        </span>
      </div>
      <span className="mt-2 text-[10px] sm:text-xs md:text-sm text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors">
        {label}
      </span>
    </motion.div>
  );
}

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const eventDate = useMemo(() => new Date('2026-02-23T10:00:00'), []);
  const timeLeft = useCountdown(eventDate);

  useEffect(() => {
    if (!heroRef.current || !contentRef.current) return;

    const tl = gsap.timeline({ delay: 0.2 });
    
    tl.fromTo(
      '.hero-tagline',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.3'
    )
    .fromTo(
      '.hero-description',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.3'
    )
    .fromTo(
      '.hero-info-badge',
      { opacity: 0, y: 20, x: -20 },
      { opacity: 1, y: 0, x: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
      '-=0.2'
    )
    .fromTo(
      '.hero-cta',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
      '-=0.2'
    );

  }, []);

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-12 bg-gradient-to-b from-background via-background to-cosmic-surface/50"
    >
      {/* Blue-silver moving ambient lights */}
      <motion.div
        className="absolute -top-32 left-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'hsl(210 100% 50% / 0.18)' }}
        animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-16 right-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'hsl(220 12% 75% / 0.16)' }}
        animate={{ x: [0, -35, 20, 0], y: [0, 25, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating animated orbs */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-40 h-40 rounded-full blur-2xl pointer-events-none"
        style={{ background: 'hsl(210 100% 50% / 0.08)' }}
        animate={{ 
          y: [0, 30, -30, 0],
          x: [0, -20, 20, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full blur-2xl pointer-events-none"
        style={{ background: 'hsl(220 12% 75% / 0.06)' }}
        animate={{ 
          y: [0, -40, 40, 0],
          x: [0, 25, -25, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      
      {/* Perspective grid - CSS only */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.08]"
          style={{
            background: `
              linear-gradient(to bottom, transparent 0%, hsl(var(--background)) 100%),
              linear-gradient(90deg, hsl(var(--glossy-blue) / 0.18) 1px, transparent 1px),
              linear-gradient(0deg, hsl(var(--silver) / 0.16) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 40px 40px, 40px 40px',
            transform: 'perspective(500px) rotateX(60deg)',
            transformOrigin: 'center top',
            height: '200%',
            top: '50%',
          }}
        />
      </div>
      
      {/* Animated accent lines */}
      <motion.div 
        className="absolute left-[10%] top-0 bottom-0 w-[1px] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, hsl(210 100% 50% / 0.1) 25%, hsl(210 100% 50% / 0.2) 50%, hsl(210 100% 50% / 0.1) 75%, transparent 100%)',
        }}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div 
        className="absolute right-[10%] top-0 bottom-0 w-[1px] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, hsl(220 12% 75% / 0.1) 25%, hsl(220 12% 75% / 0.2) 50%, hsl(220 12% 75% / 0.1) 75%, transparent 100%)',
        }}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
      />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_70%)] pointer-events-none" />

      {/* Content */}
      <div ref={contentRef} className="container mx-auto px-4 md:px-8 relative z-10 mt-8">
        <div className="text-center max-w-5xl mx-auto">

          {/* Main Logo - Larger and more prominent */}
          <div className="mb-8">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.img 
                src="/new-logo.png" 
                alt="Thiran 2026"
                className="h-32 md:h-44 lg:h-56 w-auto object-contain mx-auto"
                style={{
                  filter: 'drop-shadow(0 0 40px hsl(210 100% 50% / 0.7)) drop-shadow(0 0 80px hsl(220 12% 75% / 0.4))',
                }}
                initial={{ opacity: 0, scale: 0.7, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                whileHover={{ scale: 1.05, filter: 'drop-shadow(0 0 60px hsl(210 100% 50% / 0.9)) drop-shadow(0 0 100px hsl(220 12% 75% / 0.6))' }}
              />
            </motion.div>
          </div>

          {/* Tagline */}
          <motion.div 
            className="hero-tagline text-xl md:text-2xl lg:text-3xl mb-4 opacity-0 font-semibold tracking-wide text-foreground/80 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {/* Animated underline decoration */}
            <motion.div
              className="absolute -bottom-3 left-1/2 h-0.5 bg-gradient-to-r from-transparent via-glossy-blue to-transparent"
              initial={{ width: 0, x: '-50%' }}
              animate={{ width: '80%' }}
              transition={{ duration: 1, delay: 1.2 }}
            />
            
            <motion.span 
              className="text-glossy-blue inline-block"
              animate={{ y: [0, -4, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 0.6, delay: 0.5, repeat: Infinity, repeatDelay: 2.5 }}
            >
              T
            </motion.span>
            <motion.span 
              className="text-glossy-blue inline-block"
              animate={{ y: [0, -4, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 0.6, delay: 0.6, repeat: Infinity, repeatDelay: 2.5 }}
            >
              H
            </motion.span>
            e{' '}
            <motion.span 
              className="text-glossy-blue inline-block"
              animate={{ y: [0, -4, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 0.6, delay: 0.7, repeat: Infinity, repeatDelay: 2.5 }}
            >
              I
            </motion.span>
            nt
            <motion.span 
              className="text-glossy-blue inline-block"
              animate={{ y: [0, -4, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 0.6, delay: 0.8, repeat: Infinity, repeatDelay: 2.5 }}
            >
              R
            </motion.span>
            a collegiate{' '}
            <motion.span 
              className="text-glossy-blue inline-block"
              animate={{ y: [0, -4, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 0.6, delay: 0.9, repeat: Infinity, repeatDelay: 2.5 }}
            >
              A
            </motion.span>
            re
            <motion.span 
              className="text-glossy-blue inline-block"
              animate={{ y: [0, -4, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 0.6, delay: 1.0, repeat: Infinity, repeatDelay: 2.5 }}
            >
              N
            </motion.span>
            a
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className="hero-description text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-5 opacity-0"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            Unleash your potential at the ultimate intra-collegiate fest. Compete in exciting events, showcase your skills, and claim your glory!
          </motion.p>

          {/* Event Info Cards */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-5">
            {[
              { icon: Calendar, text: "February 23, 2026" },
              { icon: MapPin, text: "K Block, 4th Floor" },
            ].map((item, i) => (
              <motion.div 
                key={i}
                className="hero-info-badge flex items-center gap-2 glass rounded-full px-4 py-2 cursor-pointer transition-all duration-300 opacity-0 border border-glossy-blue/25 group relative overflow-hidden"
                whileHover={{ 
                  scale: 1.08, 
                  y: -3,
                  boxShadow: '0 10px 30px hsl(var(--glossy-blue) / 0.2)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-glossy-blue/0 via-glossy-blue/20 to-glossy-blue/0 opacity-0 group-hover:opacity-100"
                  animate={{ x: [-100, 100] }}
                  transition={{ duration: 0.7, repeat: Infinity, repeatDelay: 1.5 }}
                />
                <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <item.icon className="w-4 h-4 text-silver relative z-10" />
                </motion.div>
                <span className="text-sm relative z-10">{item.text}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <motion.div 
              className="hero-cta opacity-0"
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <MagneticButton className="btn-cosmic btn-hero-primary text-white text-lg group relative overflow-hidden">
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-glossy-blue/0 via-glossy-blue/30 to-glossy-blue/0 opacity-0 group-hover:opacity-100"
                  animate={{ x: [-200, 200] }}
                  transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1 }}
                />
                <a href="#events" className="flex items-center gap-2 relative z-10">
                  <motion.span animate={{ rotate: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
                    <Scan className="w-5 h-5" />
                  </motion.span>
                  Explore Events
                </a>
              </MagneticButton>
            </motion.div>
            <motion.div 
              className="hero-cta opacity-0"
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <MagneticButton className="btn-cosmic-outline btn-hero-secondary text-white text-lg group relative overflow-hidden">
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-silver/0 via-silver/30 to-silver/0 opacity-0 group-hover:opacity-100"
                  animate={{ x: [-200, 200] }}
                  transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.2 }}
                />
                <a href="#contact" className="flex items-center gap-2 relative z-10">
                  <motion.span animate={{ y: [0, -2, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
                    <Sparkles className="w-5 h-5" />
                  </motion.span>
                  Register Now
                </a>
              </MagneticButton>
            </motion.div>
          </div>

          {/* Countdown Timer */}
          <div>
            <motion.p 
              className="text-sm mb-4 uppercase tracking-widest font-mono"
              animate={{ 
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <GradientText 
                text="[ LAUNCHING IN ]" 
                colors={["#B8C0D0", "#0080FF", "#B8C0D0", "#0080FF"]}
                animationSpeed={3}
              />
            </motion.p>
            <div className="flex justify-center gap-2 sm:gap-3 md:gap-6" role="timer" aria-label="Countdown to event">
              <CountdownBox value={timeLeft.days} label="Days" index={0} />
              <CountdownBox value={timeLeft.hours} label="Hours" index={1} />
              <CountdownBox value={timeLeft.minutes} label="Minutes" index={2} />
              <CountdownBox value={timeLeft.seconds} label="Seconds" index={3} />
            </div>

            <motion.a
              href="#events"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="mt-8 inline-flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
              whileHover={{ y: 4 }}
              aria-label="Scroll to events section"
            >
              <motion.span
                className="text-xs uppercase tracking-widest group-hover:text-glossy-blue transition-colors"
                animate={{ opacity: [0.55, 1, 0.55] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              >
                Scroll
              </motion.span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
              >
                <motion.div
                  className="absolute inset-0 blur-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: 'linear-gradient(to bottom, hsl(210 100% 50% / 0.5), transparent)',
                  }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <ChevronDown className="w-6 h-6 relative z-10" aria-hidden="true" />
              </motion.div>
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}
