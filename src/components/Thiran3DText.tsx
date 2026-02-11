import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Text, Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Mouse position context for VR tracking
const mousePosition = { x: 0, y: 0 };

// VR Headset with a wide front display screen
function VRHeadset({ screenRef }: { screenRef?: React.RefObject<THREE.Mesh> }) {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  const leftStrapCurve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(-0.12, 0.04, -0.2),
    new THREE.Vector3(-0.18, 0.06, -0.4),
    new THREE.Vector3(-0.15, 0.05, -0.6),
    new THREE.Vector3(-0.08, 0.03, -0.75),
    new THREE.Vector3(0, 0, -0.85),
  ]), []);

  const rightStrapCurve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.12, 0.04, -0.2),
    new THREE.Vector3(0.18, 0.06, -0.4),
    new THREE.Vector3(0.15, 0.05, -0.6),
    new THREE.Vector3(0.08, 0.03, -0.75),
    new THREE.Vector3(0, 0, -0.85),
  ]), []);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      targetRotation.current.y = mousePosition.x * 0.15;
      targetRotation.current.x = mousePosition.y * 0.08;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y, targetRotation.current.y, 0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x, 0.05 + targetRotation.current.x, 0.05
      );
      groupRef.current.position.y = Math.sin(time * 0.4) * 0.03;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.05} floatIntensity={0.1}>
      <group ref={groupRef} position={[0, 0, 0]} rotation={[0.05, 0.2, 0]} scale={0.85}>

        {/* === MAIN BODY === */}
        <RoundedBox args={[2.6, 1.15, 0.9]} radius={0.4} smoothness={32} position={[0, 0, 0]}>
          <meshStandardMaterial color="#1a1a1a" metalness={0.1} roughness={0.6} />
        </RoundedBox>

        {/* Silver trim */}
        <mesh position={[0, 0, 0.35]}>
          <boxGeometry args={[2.55, 0.025, 0.2]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.15} />
        </mesh>

        {/* === FRONT VISOR === */}
        <RoundedBox args={[2.35, 0.95, 0.15]} radius={0.25} smoothness={16} position={[0, 0, 0.45]}>
          <meshStandardMaterial color="#0a0a0a" metalness={0.95} roughness={0.02} />
        </RoundedBox>

        {/* === WIDE FRONT SCREEN — GIF displays here via HTML overlay === */}
        <mesh ref={screenRef} position={[0, 0, 0.535]}>
          <planeGeometry args={[2.0, 0.7]} />
          <meshStandardMaterial color="#111111" metalness={0.8} roughness={0.05} emissive="#0a1628" emissiveIntensity={0.3} />
        </mesh>

        {/* Screen bezel accents */}
        <mesh position={[0, 0.36, 0.536]}>
          <boxGeometry args={[2.02, 0.015, 0.005]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.6} />
        </mesh>
        <mesh position={[0, -0.36, 0.536]}>
          <boxGeometry args={[2.02, 0.015, 0.005]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.6} />
        </mesh>
        <mesh position={[-1.01, 0, 0.536]}>
          <boxGeometry args={[0.015, 0.72, 0.005]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.4} />
        </mesh>
        <mesh position={[1.01, 0, 0.536]}>
          <boxGeometry args={[0.015, 0.72, 0.005]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.4} />
        </mesh>

        {/* === NOSE BRIDGE === */}
        <mesh position={[0, -0.35, 0.4]}>
          <boxGeometry args={[0.35, 0.25, 0.3]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.3} roughness={0.6} />
        </mesh>

        {/* === TRACKING SENSORS === */}
        {[[-1.05, 0.32], [1.05, 0.32], [-1.05, -0.28], [1.05, -0.28]].map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0.42]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshStandardMaterial color="#404040" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}

        {/* === STRAPS === */}
        <mesh position={[-1.32, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.08, 0.025, 16, 24]} />
          <meshStandardMaterial color="#808080" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[1.32, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.08, 0.025, 16, 24]} />
          <meshStandardMaterial color="#808080" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[-1.35, 0, 0]}>
          <tubeGeometry args={[leftStrapCurve, 48, 0.05, 12, false]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.1} roughness={0.85} />
        </mesh>
        <mesh position={[1.35, 0, 0]}>
          <tubeGeometry args={[rightStrapCurve, 48, 0.05, 12, false]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.1} roughness={0.85} />
        </mesh>

        {/* Back cradle */}
        <RoundedBox args={[0.8, 0.35, 0.15]} radius={0.06} position={[0, 0, -1.2]}>
          <meshStandardMaterial color="#1a1a1a" metalness={0.1} roughness={0.9} />
        </RoundedBox>
        <RoundedBox args={[0.6, 0.25, 0.08]} radius={0.04} position={[0, 0, -1.12]}>
          <meshStandardMaterial color="#0d0d0d" metalness={0} roughness={1} />
        </RoundedBox>

        {/* Top strap */}
        <mesh position={[0, 0.45, -0.4]} rotation={[Math.PI / 2.5, 0, 0]}>
          <capsuleGeometry args={[0.04, 0.9, 8, 16]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.1} roughness={0.85} />
        </mesh>

        {/* Adjustment sliders */}
        <RoundedBox args={[0.18, 0.1, 0.06]} radius={0.02} position={[-1.15, 0, -0.5]}>
          <meshStandardMaterial color="#606060" metalness={0.7} roughness={0.25} />
        </RoundedBox>
        <RoundedBox args={[0.18, 0.1, 0.06]} radius={0.02} position={[1.15, 0, -0.5]}>
          <meshStandardMaterial color="#606060" metalness={0.7} roughness={0.25} />
        </RoundedBox>

        {/* Face cushion */}
        <mesh position={[0, 0, -0.4]}>
          <boxGeometry args={[2.2, 0.85, 0.12]} />
          <meshStandardMaterial color="#0d0d0d" metalness={0} roughness={1} />
        </mesh>
        <mesh position={[0, 0, -0.35]}>
          <torusGeometry args={[0.95, 0.08, 8, 32]} />
          <meshStandardMaterial color="#151515" metalness={0} roughness={1} />
        </mesh>

        {/* Power button */}
        <group position={[1.32, 0.38, 0.1]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.045, 0.045, 0.06, 24]} />
            <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0.035, 0, 0]}>
            <torusGeometry args={[0.035, 0.005, 8, 24]} />
            <meshBasicMaterial color="#06b6d4" />
          </mesh>
        </group>

        {/* Volume rocker */}
        <mesh position={[-1.32, 0.25, 0.1]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.025, 0.12, 8, 16]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.4} />
        </mesh>

        {/* Accent lines */}
        <mesh position={[0, -0.5, 0.42]}>
          <boxGeometry args={[1.0, 0.02, 0.015]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.5, 0.42]}>
          <boxGeometry args={[0.8, 0.015, 0.015]} />
          <meshStandardMaterial color="#808080" metalness={0.8} roughness={0.15} />
        </mesh>
      </group>
    </Float>
  );
}

// Welcome text
function WelcomeText() {
  const textRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (textRef.current) {
      textRef.current.position.y = 1.35 + Math.sin(state.clock.elapsedTime * 0.8) * 0.03;
    }
  });
  return (
    <group ref={textRef} position={[0, 1.35, 0.5]}>
      <Text fontSize={0.18} anchorX="center" anchorY="middle" letterSpacing={0.2}>
        WELCOME TO
        <meshBasicMaterial color="#888888" />
      </Text>
      <Text position={[0, -0.32, 0]} fontSize={0.38} anchorX="center" anchorY="middle" letterSpacing={0.06}>
        THIRAN'26
        <meshBasicMaterial color="#ffffff" />
      </Text>
      <mesh position={[0, -0.55, 0]}>
        <boxGeometry args={[1.3, 0.012, 0.01]} />
        <meshBasicMaterial color="#666666" />
      </mesh>
    </group>
  );
}

// Particles
function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(20 * 3);
    for (let i = 0; i < 20; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5 - 2;
    }
    return pos;
  }, []);
  useFrame((state) => {
    if (particlesRef.current) particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
  });
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={20} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#606060" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

// Glow ring
function GlowRing() {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ringRef.current) ringRef.current.rotation.z = state.clock.elapsedTime * 0.08;
  });
  return (
    <mesh ref={ringRef} position={[0, 0.2, -1.5]} rotation={[0.1, 0, 0]}>
      <torusGeometry args={[2.2, 0.008, 8, 32]} />
      <meshBasicMaterial color="#808080" transparent opacity={0.3} />
    </mesh>
  );
}

// ScreenTracker: projects the headset screen corners to screen-space and updates the overlay DOM element
function ScreenTracker({ screenRef, overlayRef }: { screenRef: React.RefObject<THREE.Mesh>, overlayRef: React.RefObject<HTMLDivElement> }) {
  const { camera, size } = useThree();
  // reuse vectors to avoid allocations each frame
  const planeW = 2.0;
  const planeH = 0.7;
  const tlLocal = useMemo(() => new THREE.Vector3(-planeW / 2, planeH / 2, 0), []);
  const trLocal = useMemo(() => new THREE.Vector3(planeW / 2, planeH / 2, 0), []);
  const brLocal = useMemo(() => new THREE.Vector3(planeW / 2, -planeH / 2, 0), []);
  const blLocal = useMemo(() => new THREE.Vector3(-planeW / 2, -planeH / 2, 0), []);
  const worldTL = useMemo(() => new THREE.Vector3(), []);
  const worldTR = useMemo(() => new THREE.Vector3(), []);
  const worldBR = useMemo(() => new THREE.Vector3(), []);
  const worldBL = useMemo(() => new THREE.Vector3(), []);
  const ndc = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const mesh = screenRef.current;
    const overlay = overlayRef.current;
    if (!mesh || !overlay) return;

    // transform corners to world once
    worldTL.copy(tlLocal); mesh.localToWorld(worldTL);
    worldTR.copy(trLocal); mesh.localToWorld(worldTR);
    worldBR.copy(brLocal); mesh.localToWorld(worldBR);
    worldBL.copy(blLocal); mesh.localToWorld(worldBL);

    const projects = (v: THREE.Vector3) => {
      ndc.copy(v).project(camera);
      return { x: (ndc.x + 1) / 2 * size.width, y: (1 - ndc.y) / 2 * size.height, z: ndc.z };
    };

    const tl = projects(worldTL);
    const tr = projects(worldTR);
    const br = projects(worldBR);
    const bl = projects(worldBL);

    // if any corner is behind the camera or invalid, hide overlay
    const behind = [tl, tr, br, bl].some((p) => p.z > 1 || p.z < -1 || !isFinite(p.x) || !isFinite(p.y));
    if (behind) {
      overlay.style.opacity = '0';
      return;
    }

    const widthPx = Math.hypot(tr.x - tl.x, tr.y - tl.y);
    const heightPx = Math.hypot(bl.x - tl.x, bl.y - tl.y);
    const angleRad = Math.atan2(tr.y - tl.y, tr.x - tl.x);
    const angleDeg = (angleRad * 180) / Math.PI;

    // position and transform the overlay's top-left to match the projected top-left
    overlay.style.width = `${Math.max(1, widthPx)}px`;
    overlay.style.height = `${Math.max(1, heightPx)}px`;
    overlay.style.transformOrigin = '0 0';
    overlay.style.transform = `translate(${tl.x}px, ${tl.y}px) rotate(${angleDeg}deg)`;
    overlay.style.opacity = '1';
  });
  return null;
}

export default function Thiran3DScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playedAudioRef = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mousePosition.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mousePosition.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    const handleMouseLeave = () => {
      mousePosition.x = 0;
      mousePosition.y = 0;
    };
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    // Entry sound: try to play immediately; if blocked, resume on first user gesture
    const playEntrySound = async () => {
      try {
        if (playedAudioRef.current) return;
        let ctx = audioCtxRef.current;
        if (!ctx) {
          ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          audioCtxRef.current = ctx;
        }
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }

        // simple layered whoosh/chime
        const now = ctx.currentTime;
        const master = ctx.createGain();
        master.gain.value = 0.18; // subtle overall volume
        master.connect(ctx.destination);

        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 1.0);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
        osc.connect(g);
        g.connect(master);
        osc.start(now);
        osc.stop(now + 1.45);

        // gentle noise burst for texture
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.6));
        const noiseSrc = ctx.createBufferSource();
        noiseSrc.buffer = noiseBuffer;
        const ng = ctx.createGain();
        ng.gain.setValueAtTime(0.04, now);
        ng.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
        noiseSrc.connect(ng);
        ng.connect(master);
        noiseSrc.start(now);

        playedAudioRef.current = true;
      } catch (err) {
        // if blocked (autoplay policy), add a one-time click/touch to resume
        const resumeHandler = async () => {
          try {
            if (!audioCtxRef.current) {
              audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            await audioCtxRef.current.resume();
            playEntrySound();
          } catch (e) {
            // ignore
          }
          window.removeEventListener('pointerdown', resumeHandler);
          window.removeEventListener('touchstart', resumeHandler);
        };
        window.addEventListener('pointerdown', resumeHandler, { once: true });
        window.addEventListener('touchstart', resumeHandler, { once: true });
      }
    };

    // attempt to play automatically (will respect browser policies)
    playEntrySound();

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
      // don't close AudioContext immediately; let browser manage resources
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-[400px] md:h-[500px] relative cursor-crosshair">
      {/* Accent lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gray-600/10 to-transparent" />
        <div className="absolute bottom-1/4 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gray-600/10 to-transparent" />
      </div>

      {/* GIF overlay — positioned and transformed by ScreenTracker to match the 3D screen */}
      <div ref={overlayRef} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 20, width: 0, height: 0, opacity: 0, transition: 'opacity 120ms linear' }}>
        <div
          className="overflow-hidden rounded-sm"
          style={{
            width: '100%',
            height: '100%',
            maskImage: 'radial-gradient(ellipse 92% 85% at center, black 65%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 92% 85% at center, black 65%, transparent 100%)',
          }}
        >
          <img
            src="/vr.gif"
            alt="VR Display"
            className="w-full h-full object-cover"
            style={{
              opacity: 0.95,
              mixBlendMode: 'screen',
              filter: 'brightness(1.15) saturate(1.2)',
              display: 'block',
              width: '100%',
              height: '100%'
            }}
          />
        </div>
      </div>

      <Canvas
        camera={{ position: [0, 0.2, 5], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 6]} intensity={1.0} color="#ffffff" />
        <directionalLight position={[-4, 2, 4]} intensity={0.3} color="#e8e8e8" />
        <directionalLight position={[0, 3, -4]} intensity={0.4} color="#ffffff" />
        <pointLight position={[0, 0.5, 4]} intensity={0.3} color="#ffffff" distance={6} />

        <WelcomeText />
        <VRHeadset screenRef={screenRef} />
        <Particles />
        <GlowRing />

        {/* tracker updates HTML overlay to match the 3D screen each frame */}
        <ScreenTracker screenRef={screenRef} overlayRef={overlayRef} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.8}
          minAzimuthAngle={-Math.PI / 6}
          maxAzimuthAngle={Math.PI / 6}
        />
      </Canvas>

      {/* Status indicator */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] text-gray-500/50 font-mono z-20">
        <span className="w-1.5 h-1.5 bg-green-500/50 rounded-full animate-pulse" />
        VR READY
      </div>

      {/* Hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/50 font-mono z-20">
        drag to rotate
      </div>
    </div>
  );
}

