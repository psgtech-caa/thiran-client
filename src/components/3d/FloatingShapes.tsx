import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Icosahedron, Torus, Octahedron } from '@react-three/drei';

function Shape({ type, position, color, scale, rotationSpeed = 0.01 }: any) {
    const meshRef = useRef<any>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * rotationSpeed;
            meshRef.current.rotation.y += delta * rotationSpeed;
        }
    });

    const Material = () => (
        <meshStandardMaterial
            color={color}
            roughness={0.1}
            metalness={0.8}
            transparent
            opacity={0.6}
            wireframe
        />
    );

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh ref={meshRef} position={position} scale={scale}>
                {type === 'icosahedron' && <icosahedronGeometry args={[1, 0]} />}
                {type === 'torus' && <torusGeometry args={[1, 0.4, 8, 24]} />}
                {type === 'octahedron' && <octahedronGeometry args={[1, 0]} />}
                <Material />
            </mesh>
        </Float>
    );
}

export default function FloatingShapes() {
    return (
        <div className="absolute inset-0 pointer-events-none z-0">
            <Canvas camera={{ position: [0, 0, 10], fov: 50 }} dpr={[1, 1.5]}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ec4899" />

                {/* Left Side Shapes */}
                <Shape type="icosahedron" position={[-6, 2, -2]} scale={1.5} color="#a855f7" rotationSpeed={0.2} />
                <Shape type="torus" position={[-5, -3, -4]} scale={1} color="#06b6d4" rotationSpeed={0.3} />

                {/* Right Side Shapes */}
                <Shape type="octahedron" position={[6, 3, -3]} scale={1.8} color="#ec4899" rotationSpeed={0.15} />
                <Shape type="icosahedron" position={[5, -2, -5]} scale={1.2} color="#8b5cf6" rotationSpeed={0.25} />

                {/* Floating background details */}
                <Shape type="torus" position={[0, -4, -8]} scale={2} color="#3b82f6" rotationSpeed={0.1} />
            </Canvas>
        </div>
    );
}
