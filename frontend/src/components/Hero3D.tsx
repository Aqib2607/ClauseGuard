'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Text, Box } from '@react-three/drei';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';

// Animated Shield Component
function Shield({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
      <Box ref={meshRef} position={position} args={[1, 1.2, 0.1]}>
        <meshStandardMaterial
          color="#3B82F6"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.8}
        />
      </Box>
    </Float>
  );
}

// Animated Contract Document
function Contract({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.3} floatIntensity={0.3}>
      <Box ref={meshRef} position={position} args={[0.8, 1.1, 0.05]}>
        <meshStandardMaterial
          color="#FFFFFF"
          roughness={0.1}
          metalness={0.1}
        />
      </Box>
    </Float>
  );
}

// Floating Orbs
function FloatingOrbs() {
  const orbs = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    position: [
      Math.cos((i / 6) * Math.PI * 2) * 4,
      Math.sin((i / 6) * Math.PI * 2) * 2,
      Math.sin((i / 6) * Math.PI * 2) * 4,
    ] as [number, number, number],
    color: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'][i],
  }));

  return (
    <>
      {orbs.map((orb) => (
        <Float key={orb.id} speed={2 + orb.id * 0.2} rotationIntensity={1} floatIntensity={1}>
          <Sphere position={orb.position} args={[0.1]}>
            <MeshDistortMaterial
              color={orb.color}
              attach="material"
              distort={0.3}
              speed={2}
              roughness={0}
              transparent
              opacity={0.6}
            />
          </Sphere>
        </Float>
      ))}
    </>
  );
}

// Background Scene
function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3B82F6" />
      
      <Shield position={[-2, 0, 0]} />
      <Contract position={[2, 0, 0]} />
      <FloatingOrbs />
      
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        autoRotate={true}
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </>
  );
}

export default function Hero3D() {
  return (
    <div className="w-full h-96 md:h-[500px] relative">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        className="absolute inset-0"
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/80" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}