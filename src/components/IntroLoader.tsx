import { useEffect, useRef } from 'react';
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
  const audioRef = useRef<HTMLAudioElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // NOTE: removed sessionStorage gating and the skip button so the intro runs every refresh

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      },
    });

    timelineRef.current = tl;

    // Play sound
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(() => { }); // Autoplay might be blocked, ignore
    }

    // Phase 1: Logo appears with glow
    tl.fromTo(
      glowRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1.5, opacity: 0.6, duration: 0.8, ease: 'power2.out' }
    )
      .fromTo(
        logoRef.current,
        { scale: 3, opacity: 0, rotateX: -45 },
        { scale: 1, opacity: 1, rotateX: 0, duration: 1.0, ease: 'expo.out' },
        '-=0.6'
      )
      .fromTo(
        yearRef.current,
        { opacity: 0, y: 30, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)' },
        '-=0.8'
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
        '-=0.3'
      )
      // Phase 2: Short hold
      .to({}, { duration: 0.3 })
      // Phase 3: Logo zooms out and fades
      .to(logoRef.current, {
        scale: 0.6,
        y: -20,
        duration: 0.6,
        ease: 'power3.inOut',
      })
      .to(
        [yearRef.current, subtitleRef.current],
        { opacity: 0, y: -20, duration: 0.3, ease: 'power2.in' },
        '-=0.5'
      )
      .to(
        glowRef.current,
        { scale: 3, opacity: 0, duration: 0.6, ease: 'power2.in' },
        '-=0.5'
      )
      // Phase 4: Loader fades out
      .to(loaderRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
      }, '-=0.2');

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

    return () => {
      // clean up timeline
      if (timelineRef.current) timelineRef.current.kill();
      // clean up audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current.load();
      }
    };
  }, [onComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{ background: 'hsl(var(--background))' }}
    >
      {/* Audio Element */}
      <audio ref={audioRef} src="/intro-sound.mp3" preload="auto" />
      {/* Background glow */}
      <div
        ref={glowRef}
        className="absolute w-[500px] h-[500px] rounded-full opacity-0"
        style={{
          background: 'radial-gradient(circle, hsl(var(--glossy-blue) / 0.3) 0%, hsl(var(--silver) / 0.15) 40%, transparent 70%)',
        }}
      />

      {/* Particles */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 w-1 h-1 rounded-full"
            style={{
              background: i % 2 === 0
                ? 'hsl(var(--glossy-blue))'
                : 'hsl(var(--silver))',
            }}
          />
        ))}
      </div>

      {/* Logo content */}
      <div className="relative flex flex-col items-center" style={{ perspective: '1000px' }}>
        {/* VR Headset outline effect */}
        <motion.div
          className="absolute -top-16 w-48 h-28 border-2 border-glossy-blue/30 rounded-3xl"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1.1, 1.3] }}
          transition={{ delay: 0.3, duration: 1.5, ease: 'easeOut' }}
          style={{
            boxShadow: '0 0 40px hsl(210 100% 50% / 0.3), inset 0 0 40px hsl(210 100% 50% / 0.1)',
          }}
        />

        <div ref={logoRef} className="text-center" style={{ transformStyle: 'preserve-3d' }}>
          <img
            src="/final-logo.png"
            alt="Thiran 2026"
            className="h-32 md:h-48 lg:h-64 w-auto object-contain mx-auto will-change-transform"
            style={{
              filter: 'drop-shadow(0 0 20px hsl(210 100% 50% / 0.5)) md:drop-shadow(0 0 60px hsl(210 100% 50% / 0.7))',
            }}
          />
          <span
            ref={yearRef}
            className="block text-3xl md:text-5xl lg:text-6xl font-bold tracking-[0.3em] mt-2"
            style={{
              background: 'linear-gradient(90deg, hsl(220 12% 75%), hsl(210 100% 50%))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 30px hsl(210 100% 50% / 0.6))',
            }}
          >
            '26
          </span>
        </div>
        <div
          ref={subtitleRef}
          className="mt-4 text-sm md:text-base tracking-[0.5em] uppercase text-glossy-blue font-mono"
        >
          Welcome to Thiran2k26
        </div>
      </div>

      {/* Corner brackets - AR targeting style */}
      <div className="absolute top-8 left-8 w-12 h-12 border-l-2 border-t-2 border-glossy-blue/50" />
      <div className="absolute top-8 right-8 w-12 h-12 border-r-2 border-t-2 border-glossy-blue/50" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-l-2 border-b-2 border-silver/50" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-r-2 border-b-2 border-silver/50" />

      {/* Scanning line */}
      <div className="absolute inset-x-0 h-[2px] animate-scan-line"
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(var(--glossy-blue) / 0.5), transparent)',
        }}
      />
    </div>
  );
}
