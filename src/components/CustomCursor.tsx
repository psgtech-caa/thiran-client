import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const trailsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = cursorDotRef.current;
    if (!cursor || !dot) return;

    // Hide default cursor globally
    document.body.style.cursor = 'none';
    
    // Add CSS to hide cursor on all elements
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    const trails = trailsRef.current;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Instant dot follow
      gsap.to(dot, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: 'power2.out',
      });

      // Smooth ring follow
      gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.4,
        ease: 'power3.out',
      });

      // Trails follow with increasing delay
      trails.forEach((trail, i) => {
        gsap.to(trail, {
          x: mouseX,
          y: mouseY,
          duration: 0.6 + i * 0.15,
          ease: 'power3.out',
        });
      });
    };

    const handleMouseDown = () => {
      gsap.to(cursor, { scale: 0.8, duration: 0.2 });
      gsap.to(dot, { scale: 1.5, duration: 0.2 });
    };

    const handleMouseUp = () => {
      gsap.to(cursor, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.3)' });
      gsap.to(dot, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.3)' });
    };

    const handleMouseEnterLink = () => {
      gsap.to(cursor, { scale: 1.8, opacity: 0.5, duration: 0.3 });
      gsap.to(dot, { scale: 0.5, duration: 0.3 });
    };

    const handleMouseLeaveLink = () => {
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3 });
      gsap.to(dot, { scale: 1, duration: 0.3 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Track interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnterLink);
      el.addEventListener('mouseleave', handleMouseLeaveLink);
    });

    // Re-observe for dynamic elements
    const observer = new MutationObserver(() => {
      const newElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select');
      newElements.forEach((el) => {
        el.addEventListener('mouseenter', handleMouseEnterLink);
        el.addEventListener('mouseleave', handleMouseLeaveLink);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.body.style.cursor = '';
      style.remove();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      observer.disconnect();
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnterLink);
        el.removeEventListener('mouseleave', handleMouseLeaveLink);
      });
    };
  }, []);

  return (
    <div className="hidden md:block">
      {/* Trail particles */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          ref={(el) => { if (el) trailsRef.current[i] = el; }}
          className="fixed top-0 left-0 pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2"
          style={{
            width: `${8 - i * 2}px`,
            height: `${8 - i * 2}px`,
            borderRadius: '50%',
            background: i === 0
              ? 'hsl(var(--cosmic-purple) / 0.4)'
              : i === 1
              ? 'hsl(var(--cosmic-pink) / 0.3)'
              : 'hsl(var(--cosmic-cyan) / 0.2)',
            filter: `blur(${i}px)`,
          }}
        />
      ))}
      
      {/* Main cursor ring */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '2px solid hsl(var(--cosmic-cyan) / 0.8)',
          boxShadow: '0 0 15px hsl(var(--cosmic-purple) / 0.3), inset 0 0 15px hsl(var(--cosmic-pink) / 0.1)',
        }}
      />
      
      {/* Center dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, hsl(var(--cosmic-purple)), hsl(var(--cosmic-cyan)))',
          boxShadow: '0 0 10px hsl(var(--cosmic-purple) / 0.8)',
        }}
      />
    </div>
  );
}
