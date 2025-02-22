import { Environment, Stars, OrbitControls, Grid } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import React, { useRef, Suspense } from "react";
import { TextureLoader } from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import day from "./assets/8k_earth_daymap.jpg";
import night from "./assets/8k_earth_nightmap.jpg"
import  clouds   from "./assets/8k_earth_clouds.jpg";
import moon from "./assets/8k_moon.jpg"
import "./App.css";

const Space = () => {
  return (
    <group>
      <Stars radius={100} depth={100} count={5000} factor={4} saturation={1} fade speed={1} />
      <OrbitControls />
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 10, 10]} intensity={1} />
    </group>
  );
};


const Earth = () => {
  const [dayMap, nightMap, cloudsMap] = useLoader(TextureLoader, [
    day,     
    night,   
    clouds,  
  ]);
  const moonMap =useLoader(TextureLoader,moon)
  const earthRef = useRef();
  const cloudsRef = useRef();
  const moonRef = useRef();
  let angle = 0;
  const moonOrbitRadius = 3; 
  useFrame(() => {
    earthRef.current.rotation.y+=0.001
    cloudsRef.current.rotation.y+=0.001
    if (moonRef.current) {
      angle += 0.001; 
      moonRef.current.position.x = Math.cos(angle) * moonOrbitRadius;
      moonRef.current.position.z = Math.sin(angle) * moonOrbitRadius;
      moonRef.current.rotation.y += 0.002; }
  });
  return (
    <group>
    {/* Earth Sphere */}
    <mesh position={[0, 0, 0]} ref={earthRef}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshStandardMaterial 
        map={dayMap} 
        emissiveMap={nightMap} 
        emissiveIntensity={0.5}
      />
    </mesh>

    {/* Cloud Layer */}
    <mesh position={[0, 0, 0]} ref={cloudsRef}>
      <sphereGeometry args={[1.52, 64, 64]} /> 
      <meshStandardMaterial 
        map={cloudsMap} 
        transparent 
        opacity={0.4} 
        depthWrite={false}
      />
    </mesh>

    {/* Moon */}
    <mesh ref={moonRef} position={[moonOrbitRadius, 0, 0]}>
        <sphereGeometry args={[0.25, 64, 64]} /> 
        <meshStandardMaterial map={moonMap} />
      </mesh>
    {/* Lights */}
    <ambientLight intensity={0.4} />
    <directionalLight position={[5, 5, 5]} intensity={1} />
    {/* <Grid infiniteGrid sectionSize={0.5} sectionColor={"white"} /> */}
  </group>
  );
};

const App = () => {
  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Suspense fallback={null}>
          <Space />
          <Earth />
          {/* Post-processing effects */}
          <EffectComposer>
            <Bloom intensity={12.5} luminanceThreshold={0.8} luminanceSmoothing={0.8} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default App;
