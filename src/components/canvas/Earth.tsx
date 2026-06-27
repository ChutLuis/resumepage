import { Component, ReactNode, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF, Sphere } from "@react-three/drei";
import CanvasLoader from "../Loader";
import ContextLossRecovery from "./ContextLossRecovery";

const Earth: React.FC = () => {
  // useGLTF suspends while loading (it throws a promise), so it must NOT be
  // wrapped in try/catch — that would swallow the Suspense promise and prevent
  // the model from ever loading. Loading is handled by the parent <Suspense>,
  // and genuine load failures are caught by <EarthErrorBoundary> below.
  const earth = useGLTF("./planet/scene.gltf");
  return (
    <primitive object={earth.scene} scale={2.5} position-y={0} rotation-y={0} />
  );
};

// Wireframe sphere shown only if the model genuinely fails to load.
const EarthFallback: React.FC = () => (
  <Sphere args={[2.5, 32, 32]}>
    <meshStandardMaterial color="#4a90e2" wireframe />
  </Sphere>
);

// 3D-safe error boundary (the app-level ErrorBoundary renders HTML and can't be
// used inside a <Canvas>). Renders the wireframe fallback if the model errors.
class EarthErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <EarthFallback />;
    }
    return this.props.children;
  }
}

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
      <ContextLossRecovery />
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
        <EarthErrorBoundary>
          <Earth />
        </EarthErrorBoundary>
        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default EarthCanvas;
