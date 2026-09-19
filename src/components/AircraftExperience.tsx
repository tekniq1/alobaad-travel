import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer, Sparkles } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Aircraft() {
  const aircraft = useRef<THREE.Group>(null);
  const pointer = useThree((state) => state.pointer);

  useFrame(({ clock }, rawDelta) => {
    const group = aircraft.current;
    if (!group) return;
    const dt = Math.min(rawDelta, 0.05);
    const ease = 1 - Math.exp(-3.2 * dt);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, -0.07 + pointer.y * 0.1, ease);
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, -0.42 + pointer.x * 0.14, ease);
    group.rotation.z = THREE.MathUtils.lerp(
      group.rotation.z,
      -0.12 - pointer.x * 0.16 + Math.sin(clock.elapsedTime * 0.65) * 0.025,
      ease,
    );
  });

  return (
    <Float speed={1.4} rotationIntensity={0.12} floatIntensity={0.32}>
      <group ref={aircraft} scale={0.82} rotation={[-0.07, -0.42, -0.12]}>
        <mesh castShadow rotation-z={Math.PI / 2}>
          <capsuleGeometry args={[0.42, 5.8, 16, 36]} />
          <meshPhysicalMaterial color="#eaf7ff" metalness={0.72} roughness={0.2} clearcoat={0.9} />
        </mesh>
        <mesh position={[3.05, 0, 0]} rotation-z={-Math.PI / 2}>
          <coneGeometry args={[0.42, 1.2, 36]} />
          <meshPhysicalMaterial color="#d9f1ff" metalness={0.65} roughness={0.18} />
        </mesh>
        <mesh position={[-2.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.3, 1.2, 28]} />
          <meshStandardMaterial color="#d7edf8" metalness={0.5} roughness={0.25} />
        </mesh>
        <mesh position={[0.2, -0.03, 0]} rotation-x={Math.PI / 2} scale={[1.1, 1, 1]}>
          <boxGeometry args={[1.15, 6.4, 0.12]} />
          <meshPhysicalMaterial color="#6cb5e9" metalness={0.55} roughness={0.2} />
        </mesh>
        <mesh position={[-2.25, 0.1, 0]} rotation-x={Math.PI / 2}>
          <boxGeometry args={[0.72, 2.5, 0.1]} />
          <meshStandardMaterial color="#5ca8df" metalness={0.5} roughness={0.25} />
        </mesh>
        <mesh position={[-2.62, 0.58, 0]} rotation-z={0.18}>
          <boxGeometry args={[0.8, 1.1, 0.1]} />
          <meshStandardMaterial color="#5ca8df" metalness={0.5} roughness={0.25} />
        </mesh>
        {[-1.35, 1.35].map((z) => (
          <group key={z} position={[0.2, -0.42, z]} rotation-z={Math.PI / 2}>
            <mesh castShadow>
              <capsuleGeometry args={[0.19, 0.8, 10, 22]} />
              <meshPhysicalMaterial color="#17394f" metalness={0.72} roughness={0.18} />
            </mesh>
            <mesh position={[0, 0.48, 0]}>
              <cylinderGeometry args={[0.12, 0.16, 0.08, 20]} />
              <meshStandardMaterial color="#77c6f0" emissive="#5ca8df" emissiveIntensity={0.8} />
            </mesh>
          </group>
        ))}
        <mesh position={[2.82, 0.13, 0]} rotation-z={Math.PI / 2}>
          <capsuleGeometry args={[0.1, 0.28, 8, 20]} />
          <meshStandardMaterial color="#0f1f2c" roughness={0.22} />
        </mesh>
      </group>
    </Float>
  );
}

function FlightTrail() {
  const positions = useMemo(() => {
    const points = new Float32Array(160 * 3);
    for (let index = 0; index < 160; index += 1) {
      const t = index / 159;
      points[index * 3] = -3.1 - t * 6.2;
      points[index * 3 + 1] = -0.12 + Math.sin(index * 1.7) * 0.13 * t;
      points[index * 3 + 2] = (Math.sin(index * 2.31) * 0.44 + Math.cos(index * 0.7) * 0.16) * t;
    }
    return points;
  }, []);
  return (
    <points position={[-0.2, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#6cb5e9" size={0.055} transparent opacity={0.62} depthWrite={false} />
    </points>
  );
}

export default function AircraftExperience() {
  return (
    <div className="h-full min-h-[340px] w-full" aria-label="طائرة تفاعلية تحلق نحو وجهتها">
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 1.6, 10.5], fov: 39 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        shadows
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 7, 6]} intensity={3.2} castShadow shadow-mapSize={[1024, 1024]} />
        <pointLight position={[-4, 0, 2]} color="#5ca8df" intensity={8} distance={18} />
        <Aircraft />
        <FlightTrail />
        <Sparkles count={36} scale={[12, 5, 5]} size={1.2} speed={0.22} color="#9cdcff" opacity={0.38} />
        <Environment resolution={64}>
          <Lightformer intensity={4} position={[0, 5, 2]} scale={[8, 3, 1]} />
          <Lightformer intensity={2} color="#6cb5e9" position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}
