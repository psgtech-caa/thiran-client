import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = cursorDotRef.current;
    if (!cursor || !dot) return;

    // Hide default cursor globally, but keep native cursor on inputs
    document.body.style.cursor = 'none';
    
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after { cursor: none !important; }
      input, textarea, select, [contenteditable] { cursor: text !important; }
      select { cursor: pointer !important; }
    `;
    document.head.appendChild(style);

    const handleMouseMove = (e: MouseEvent) => {
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'power2.out' });
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.4, ease: 'power3.out' });
    };

    const handleMouseDown = () => {
      gsap.to(cursor, { scale: 0.8, duration: 0.2 });
    };

    const handleMouseUp = () => {
      gsap.to(cursor, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.3)' });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.body.style.cursor = '';
      style.remove();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="hidden md:block">
      {/* Main cursor ring */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: '2px solid hsl(var(--cosmic-cyan) / 0.8)',
        }}
      />
      
      {/* Center dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, hsl(var(--cosmic-purple)), hsl(var(--cosmic-cyan)))',
        }}
      />
    </div>
  );
}
