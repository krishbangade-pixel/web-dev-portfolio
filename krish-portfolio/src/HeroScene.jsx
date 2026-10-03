import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Float, ContactShadows } from '@react-three/drei';

const PlanetModel = () => {
  const { scene: sourceScene } = useGLTF('/Planet.glb');
  const modelRef = useRef();
  const scene = useMemo(() => {
    const model = sourceScene.clone(true);
    model.rotation.x = 0.3;
    model.rotation.z = -0.2;
    return model;
  }, [sourceScene]);

  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>
      <primitive ref={modelRef} object={scene} scale={1.8} position={[0, 0, 0]} />
    </Float>
  );
};

export default function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 1.25]} frameloop="always">
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 10]} intensity={2} />
      <Environment preset="city" />
      <PlanetModel />
      <ContactShadows position={[0, -2.5, 0]} opacity={0.3} scale={15} blur={3} far={5} frames={1} resolution={256} />
    </Canvas>
  );
}

useGLTF.preload('/Planet.glb');
