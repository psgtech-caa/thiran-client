import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';

interface IntroLoaderProps {
  onComplete: () => void;
}

const INTRO_STORAGE_KEY = 'thiran-intro-shown';

export default function IntroLoader({ onComplete }: IntroLoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const [showSkip, setShowSkip] = useState(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Check if intro was already shown in this session
  useEffect(() => {
    const introShown = sessionStorage.getItem(INTRO_STORAGE_KEY);
    if (introShown) {
      onComplete();
      return;
    }
    
    // Show skip button after a short delay
    const skipTimer = setTimeout(() => setShowSkip(true), 500);
    return () => clearTimeout(skipTimer);
  }, [onComplete]);

  const handleSkip = () => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    sessionStorage.setItem(INTRO_STORAGE_KEY, 'true');
    gsap.to(loaderRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => onComplete(),
    });
  };

  useEffect(() => {
    // Skip if already shown
    if (sessionStorage.getItem(INTRO_STORAGE_KEY)) return;

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem(INTRO_STORAGE_KEY, 'true');
        onComplete();
      },
    });
    
    timelineRef.current = tl;

    // Phase 1: Logo appears with glow
    tl.fromTo(
      glowRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1.5, opacity: 0.6, duration: 0.8, ease: 'power2.out' }
    )
    .fromTo(
      logoRef.current,
      { scale: 3, opacity: 0, rotateX: -45 },
      { scale: 1, opacity: 1, rotateX: 0, duration: 1.2, ease: 'expo.out' },
      '-=0.5'
    )
    .fromTo(
      yearRef.current,
      { opacity: 0, y: 30, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)' },
      '-=0.4'
    )
    .fromTo(
      subtitleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.2'
    )
    // Phase 2: Hold for a beat
    .to({}, { duration: 0.6 })
    // Phase 3: Logo zooms out and fades
    .to(logoRef.current, {
      scale: 0.6,
      y: -20,
      duration: 0.8,
      ease: 'power3.inOut',
    })
    .to(
      [yearRef.current, subtitleRef.current],
      { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in' },
      '-=0.6'
    )
    .to(
      glowRef.current,
      { scale: 3, opacity: 0, duration: 0.8, ease: 'power2.in' },
      '-=0.6'
    )
    // Phase 4: Loader fades out
    .to(loaderRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
    }, '-=0.3');

    // Particle animation
    if (particlesRef.current) {
      const particles = particlesRef.current.children;
      gsap.fromTo(
        particles,
        { 
          opacity: 0, 
          scale: 0,
          x: () => gsap.utils.random(-50, 50),
          y: () => gsap.utils.random(-50, 50),
        },
        {
          opacity: () => gsap.utils.random(0.3, 0.8),
          scale: () => gsap.utils.random(0.5, 1.5),
          x: () => gsap.utils.random(-200, 200),
          y: () => gsap.utils.random(-200, 200),
          duration: 2,
          stagger: 0.05,
          ease: 'power2.out',
        }
      );
    }
  }, [onComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{ background: 'hsl(var(--background))' }}
    >
      {/* Background glow */}
      <div
        ref={glowRef}
        className="absolute w-[500px] h-[500px] rounded-full opacity-0"
        style={{
          background: 'radial-gradient(circle, hsl(var(--cosmic-purple) / 0.3) 0%, hsl(var(--cosmic-pink) / 0.15) 40%, transparent 70%)',
        }}
      />

      {/* Particles */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 w-1 h-1 rounded-full"
            style={{
              background: i % 3 === 0
                ? 'hsl(var(--cosmic-purple))'
                : i % 3 === 1
                ? 'hsl(var(--cosmic-pink))'
                : 'hsl(var(--cosmic-cyan))',
            }}
          />
        ))}
      </div>

      {/* Logo content */}
      <div className="relative flex flex-col items-center" style={{ perspective: '1000px' }}>
        {/* VR Headset outline effect */}
        <motion.div
          className="absolute -top-16 w-48 h-28 border-2 border-cosmic-cyan/30 rounded-3xl"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1.1, 1.3] }}
          transition={{ delay: 0.3, duration: 1.5, ease: 'easeOut' }}
          style={{
            boxShadow: '0 0 40px hsl(187 94% 55% / 0.3), inset 0 0 40px hsl(187 94% 55% / 0.1)',
          }}
        />
        
        <div ref={logoRef} className="text-center" style={{ transformStyle: 'preserve-3d' }}>
          <img 
            src="/thiran-logo.png" 
            alt="Thiran 2026"
            className="h-32 md:h-48 lg:h-64 w-auto object-contain mx-auto"
            style={{
              filter: 'drop-shadow(0 0 60px hsl(270 91% 65% / 0.7)) drop-shadow(0 0 120px hsl(330 81% 60% / 0.4))',
            }}
          />
          <span
            ref={yearRef}
            className="block text-3xl md:text-5xl lg:text-6xl font-bold tracking-[0.3em] mt-2"
            style={{
              background: 'linear-gradient(90deg, hsl(187 94% 55%), hsl(330 81% 68%))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 30px hsl(187 94% 43% / 0.6))',
            }}
          >
            '26
          </span>
        </div>
        <div
          ref={subtitleRef}
          className="mt-4 text-sm md:text-base tracking-[0.5em] uppercase text-cosmic-cyan font-mono"
        >
          [ AR / VR Experience ]
        </div>
      </div>

      {/* Corner brackets - AR targeting style */}
      <div className="absolute top-8 left-8 w-12 h-12 border-l-2 border-t-2 border-cosmic-cyan/50" />
      <div className="absolute top-8 right-8 w-12 h-12 border-r-2 border-t-2 border-cosmic-cyan/50" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-l-2 border-b-2 border-cosmic-pink/50" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-r-2 border-b-2 border-cosmic-pink/50" />

      {/* Scanning line */}
      <div className="absolute inset-x-0 h-[2px] animate-scan-line" 
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(var(--cosmic-cyan) / 0.5), transparent)',
        }}
      />

      {/* Skip Button */}
      {showSkip && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleSkip}
          className="absolute bottom-8 right-20 px-4 py-2 glass rounded-full text-sm text-cosmic-cyan hover:text-foreground hover:bg-white/10 transition-all duration-300 border border-cosmic-cyan/30 font-mono"
          aria-label="Skip intro animation"
        >
          SKIP →
        </motion.button>
      )}
    </div>
  );
}
