import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture, RoundedBox, Float } from "@react-three/drei";
import * as THREE from "three";

function BrandLogo3D() {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useTexture("/logo-high-res.png");
  
  // Slowly rotate the emblem
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
        {/* Front Logo - Pure */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[4.5, 1.9]} />
          <meshBasicMaterial map={texture} transparent alphaTest={0.01} side={THREE.FrontSide} />
        </mesh>

        {/* Back Logo - Pure (Mirrored horizontally) */}
        <mesh position={[0, 0, -0.02]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[4.5, 1.9]} />
          <meshBasicMaterial map={texture} transparent alphaTest={0.01} side={THREE.FrontSide} />
        </mesh>
      </Float>
    </group>
  );
}

function OrbitingPlane() {
  const orbitRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (orbitRef.current) {
      // Orbit around the center
      orbitRef.current.rotation.y -= delta * 1.2; 
      // Slight vertical wave
      orbitRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.3;
      // Banking effect based on rotation
      orbitRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
    }
  });

  return (
    <group ref={orbitRef}>
      <group position={[3.5, 0, 0]}>
        {/* The abstract minimalist airplane */}
        <group rotation={[0, -Math.PI / 2, Math.PI / 8]}>
          {/* Main Body */}
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <capsuleGeometry args={[0.08, 0.5, 8, 16]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.1} metalness={0.1} />
          </mesh>
          {/* Wings */}
          <mesh position={[0, -0.02, 0]}>
            <boxGeometry args={[0.8, 0.02, 0.25]} />
            <meshStandardMaterial color="#159DD3" roughness={0.2} metalness={0.3} />
          </mesh>
          {/* Tail */}
          <mesh position={[0, 0.08, -0.25]}>
            <boxGeometry args={[0.02, 0.15, 0.1]} />
            <meshStandardMaterial color="#159DD3" roughness={0.2} metalness={0.3} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function SkyBlueParticles() {
  const count = 40;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -5 + Math.random() * 10;
      const yFactor = -5 + Math.random() * 10;
      const zFactor = -5 + Math.random() * 10;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);

      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.set(s * 0.05, s * 0.05, s * 0.05);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();

      if (meshRef.current) {
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
    });
    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.8, 16, 16]} />
      <meshBasicMaterial color="#159DD3" transparent opacity={0.6} />
    </instancedMesh>
  );
}

export function TravelScene3D({ className }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} color="#EEF5FF" />
          <directionalLight position={[4, 6, 5]} intensity={2} color="#FFFFFF" />
          <directionalLight position={[-3, 2, -2]} intensity={1} color="#159DD3" />
          <pointLight position={[0, 4, 4]} intensity={1.5} color="#159DD3" />
          
          <BrandLogo3D />
          <OrbitingPlane />
          <SkyBlueParticles />

          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

