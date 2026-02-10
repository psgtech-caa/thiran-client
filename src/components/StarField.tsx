import { useRef } from 'react';

export default function StarField() {
  return (
    <div className="fixed inset-0 -z-10">
      {/* CSS-only starfield background — no WebGL */}
      <div className="absolute inset-0">
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cosmic-purple/15 rounded-full blur-[60px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cosmic-pink/10 rounded-full blur-[60px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cosmic-cyan/8 rounded-full blur-[60px] pointer-events-none" />
      </div>
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(hsl(270 91% 65% / 0.3) 1px, transparent 1px),
                            linear-gradient(90deg, hsl(270 91% 65% / 0.3) 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
        }}
      />
    </div>
  );
}
