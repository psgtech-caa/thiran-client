import { motion } from 'framer-motion';
import {
  Lightbulb,
  Users,
  Trophy
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Lightbulb,
    title: 'Innovation Hub',
    description: 'A platform to ideate, innovate, and transform your ideas into reality with cutting-edge challenges.',
    backContent: 'Compete in technical and non-technical events, showcase your skills, and win exciting prizes worth ₹15,000.',
    color: 'purple' as const,
  },
  {
    icon: Users,
    title: 'Networking',
    description: 'Connect with talented peers, build lasting relationships, and expand your professional network.',
    backContent: 'Meet students from various departments, collaborate on challenges, and join our growing community.',
    color: 'pink' as const,
  },
  {
    icon: Trophy,
    title: 'Prizes & Recognition',
    description: 'Win exciting prizes, certificates, and get recognized for your exceptional talents.',
    backContent: 'Cash prizes worth ₹15,000, participation certificates for all, winner certificates, and special recognition.',
    color: 'cyan' as const,
  },
];

const stats = [
  { value: 200, suffix: '+', label: 'Participants' },
  { value: 5, suffix: '', label: 'Events' },
  { value: 15000, prefix: '₹', suffix: '', label: 'Prize Pool' },
  { value: 5, suffix: '', label: 'Days' },
];

function AnimatedCounter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  const formatNumber = (num: number) => {
    if (num >= 100000) {
      return (num / 100000).toFixed(0) + 'L';
    }
    return num.toLocaleString();
  };

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold gradient-text">
      {prefix}{formatNumber(count)}{suffix}
    </div>
  );
}

function FlipCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const Icon = feature.icon;

  const colorMap = {
    purple: {
      bg: 'bg-cosmic-purple/20',
      text: 'text-cosmic-purple',
      border: 'border-cosmic-purple/30',
      glow: 'hsl(var(--cosmic-purple) / 0.4)',
      gradient: 'from-cosmic-purple/20 to-cosmic-purple/5',
    },
    pink: {
      bg: 'bg-cosmic-pink/20',
      text: 'text-cosmic-pink',
      border: 'border-cosmic-pink/30',
      glow: 'hsl(var(--cosmic-pink) / 0.4)',
      gradient: 'from-cosmic-pink/20 to-cosmic-pink/5',
    },
    cyan: {
      bg: 'bg-cosmic-cyan/20',
      text: 'text-cosmic-cyan',
      border: 'border-cosmic-cyan/30',
      glow: 'hsl(var(--cosmic-cyan) / 0.4)',
      gradient: 'from-cosmic-cyan/20 to-cosmic-cyan/5',
    },
  };

  const colors = colorMap[feature.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateY: -10 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group h-[280px] [perspective:1000px]"
    >
      <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* Front Face */}
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl overflow-hidden">
          <div className={`h-full glass border ${colors.border} rounded-2xl p-6 flex flex-col transition-shadow duration-500`}
            style={{ boxShadow: `0 0 0px ${colors.glow}` }}
          >
            <div className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center mb-6 transition-transform duration-500`}>
              <Icon className={`w-7 h-7 ${colors.text}`} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">
              {feature.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm flex-1">
              {feature.description}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <span className={`inline-block w-2 h-2 rounded-full ${colors.bg}`} />
              Hover to learn more
            </div>
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl overflow-hidden">
          <div className={`h-full rounded-2xl p-6 flex flex-col justify-center items-center text-center border ${colors.border}`}
            style={{
              background: `linear-gradient(135deg, hsl(var(--cosmic-surface)), hsl(var(--background)))`,
              boxShadow: `0 0 30px ${colors.glow}`,
            }}
          >
            <div className={`w-16 h-16 rounded-full ${colors.bg} flex items-center justify-center mb-5`}>
              <Icon className={`w-8 h-8 ${colors.text}`} />
            </div>
            <h3 className={`text-lg font-bold mb-3 ${colors.text}`}>
              {feature.title}
            </h3>
            <p className="text-foreground/80 leading-relaxed text-sm">
              {feature.backContent}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateX: -30 }}
      whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, type: 'spring' }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="text-center group cursor-pointer"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-radial from-cosmic-purple/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <AnimatedCounter
          value={stat.value}
          prefix={stat.prefix}
          suffix={stat.suffix}
        />
      </div>
      <p className="text-muted-foreground mt-2 group-hover:text-foreground transition-colors">{stat.label}</p>
    </motion.div>
  );
}

// Auto-scrolling gallery for last-year images
function AutoScrollGallery({ images, height = 140, speed = 80 }: { images: string[]; height?: number; speed?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const widthRef = useRef(0);
  const posRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const computeWidth = () => {
      if (!wrapperRef.current) return;
      // wrapper contains two sets of images for seamless loop
      widthRef.current = wrapperRef.current.scrollWidth / 2 || 0;
    };
    computeWidth();
    window.addEventListener('resize', computeWidth);
    return () => window.removeEventListener('resize', computeWidth);
  }, [images]);

  useEffect(() => {
    let last = performance.now();
    const step = (now: number) => {
      if (!wrapperRef.current) return;
      const dt = now - last;
      last = now;
      if (widthRef.current > 0) {
        // speed px per second
        const delta = (speed * dt) / 1000;
        posRef.current -= delta;
        if (Math.abs(posRef.current) >= widthRef.current) {
          posRef.current += widthRef.current;
        }
        wrapperRef.current.style.transform = `translateX(${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [speed]);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden"
      aria-hidden
    >
      <div
        ref={wrapperRef}
        className="flex items-center gap-4"
        style={{
          willChange: 'transform',
          transform: 'translateX(0px)',
        }}
      >
        {([...(images || []), ...(images || [])]).map((src, i) => (
          <div key={`${src}-${i}`} className="flex-shrink-0" style={{ height }}>
            <img
              src={src}
              alt="thiran gallery"
              loading="lazy"
              decoding="async"
              className="h-full w-auto rounded-lg object-cover shadow-lg"
              style={{ display: 'block' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WhyThiran() {
  const sectionRef = useRef<HTMLElement>(null);

  // Thiran 2k26 Gallery - All available images from public/gallery
  const lastYearImages = [
    '/gallery/IMG_2679.JPG',
    '/gallery/IMG_2815.JPG',
    '/gallery/IMG_2836.JPG',
    '/gallery/IMG_2851.JPG',
    '/gallery/IMG_2863.JPG',
    '/gallery/IMG_2872.JPG',
    '/gallery/gallery-2.jpeg',
    '/gallery/gallery-4.jpeg',
    '/gallery/gallery-5.jpeg',
    '/gallery/img1.jpg',
    '/gallery/img2.jpg',
    '/gallery/img3.jpg',
    '/gallery/img4.jpg',
    '/gallery/img5.jpg',
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to('.why-orb-1', {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to('.why-orb-2', {
        yPercent: 40,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="why-thiran" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-cosmic-surface to-background" />
      <div className="why-orb-1 absolute top-0 left-1/3 w-96 h-96 bg-cosmic-purple/10 rounded-full blur-[50px]" />
      <div className="why-orb-2 absolute bottom-0 right-1/3 w-96 h-96 bg-cosmic-pink/10 rounded-full blur-[50px]" />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at center, hsl(var(--cosmic-purple) / 0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 relative z-10"
      >

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          Why <span className="gradient-text-animated">Thiran</span>?
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Discover what makes Thiran special. Hover over each card to explore what awaits you.
        </p>
      </motion.div>

      {/* Auto-scrolling gallery showing last year's pictures */}
      <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mb-10 relative z-10">
        <div className="glass rounded-2xl p-4">
          <h4 className="text-sm font-mono text-glossy-blue mb-3">[ THIRAN 2025 MOMENTS ]</h4>
          <AutoScrollGallery images={lastYearImages} height={140} speed={60} />
        </div>
      </motion.div>

      {/* Flip Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-20 relative z-10">
        {features.map((feature, index) => (
          <FlipCard key={feature.title} feature={feature} index={index} />
        ))}
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-cosmic-purple via-cosmic-pink to-cosmic-cyan opacity-50 animate-pulse-glow" />

        <div className="relative glass-strong rounded-3xl p-8 md:p-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
            {stats.map((stat, index) => (
              <StatCard key={stat.label} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
