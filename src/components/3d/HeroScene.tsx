import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Sphere, MeshDistortMaterial, Octahedron, Torus, Grid } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as THREE from 'three';

function RotatingSphere() {
    const meshRef = useRef<THREE.Mesh>(null!);
    const [hovered, setHover] = useState(false);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.x = t * 0.2;
            meshRef.current.rotation.y = t * 0.3;

            // Mouse interaction influence (subtle)
            const { x, y } = state.pointer;
            meshRef.current.rotation.x += y * 0.02;
            meshRef.current.rotation.y += x * 0.02;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <Sphere
                args={[1.5, 64, 64]}
                ref={meshRef}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
                scale={hovered ? 1.1 : 1}
            >
                <MeshDistortMaterial
                    color={hovered ? "#8b5cf6" : "#6d28d9"}
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                />
            </Sphere>
        </Float>
    );
}

function FloatingCrystal({ position, color, speed, delay }: { position: [number, number, number], color: string, speed: number, delay: number }) {
    const ref = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (ref.current) {
            ref.current.rotation.x = t * speed + delay;
            ref.current.rotation.y = t * speed * 0.5 + delay;
            ref.current.position.y = position[1] + Math.sin(t * speed + delay) * 0.5;
        }
    });

    return (
        <Float speed={speed} rotationIntensity={1} floatIntensity={0.5}>
            <Octahedron args={[0.5]} position={position} ref={ref}>
                <meshStandardMaterial color={color} wireframe />
            </Octahedron>
        </Float>
    )
}

function OrbitingTorus() {
    const ref = useRef<THREE.Mesh>(null!);
    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.z -= 0.01;
            ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
        }
    })

    return (
        <Torus args={[3.5, 0.1, 16, 100]} ref={ref} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#22d3ee" transparent opacity={0.3} wireframe />
        </Torus>
    )
}



export default function HeroScene() {
    return (
        <div className="absolute inset-0 -z-10">
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }} gl={{ antialias: true }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#22d3ee" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ec4899" />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                {/* Central Element */}
                <RotatingSphere />

                {/* Orbiting Elements */}
                <OrbitingTorus />

                {/* Floating Crystals */}
                <FloatingCrystal position={[-3, 2, -2]} color="#00e5ff" speed={0.8} delay={0} />
                <FloatingCrystal position={[3, -1, -1]} color="#d946ef" speed={0.6} delay={2} />
                <FloatingCrystal position={[-2, -3, 0]} color="#8b5cf6" speed={0.7} delay={4} />

                {/* Cyber Grid Floor */}
                <group position={[0, -3, 0]} rotation={[0, 0, 0]}>
                    <Grid
                        args={[20, 20]}
                        cellSize={0.5}
                        cellThickness={0.5}
                        cellColor="#6d28d9"
                        sectionSize={3}
                        sectionThickness={1}
                        sectionColor="#22d3ee"
                        fadeDistance={10}
                        infiniteGrid
                    />
                </group>

            </Canvas>
        </div>
    );
}
