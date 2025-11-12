import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF, Sphere } from "@react-three/drei";
import CanvasLoader from "../Loader";

const Earth: React.FC = () => {
  try {
    const earth = useGLTF('./planet/scene.gltf');
    return (
      <primitive object={earth.scene} scale={2.5} position-y={0} rotation-y={0}/>
    );
  } catch (error) {
    // Fallback sphere if model fails to load
    return (
      <Sphere args={[2.5, 32, 32]}>
        <meshStandardMaterial color="#4a90e2" wireframe />
      </Sphere>
    );
  }
};

const EarthCanvas: React.FC = () => {
  return (
    <Canvas
      shadows
      frameloop="demand"
      dpr={[1, 1.5]}
      gl={{ 
        preserveDrawingBuffer: true,
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false
      }}
      camera={{fov:45, near:0.1, far:200, position:[-4,3,6]}}
    >
      <Suspense fallback={<CanvasLoader />}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <OrbitControls
          autoRotate
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
          enablePan={false}
        />
        <Earth />
        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default EarthCanvas;