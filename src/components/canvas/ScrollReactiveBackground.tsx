import { useRef, Suspense, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
// @ts-expect-error - maath doesn't have types
import * as random from 'maath/random/dist/maath-random.esm'

// Detect device capabilities
const getParticleCount = () => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4
  
  if (isMobile || isLowEndDevice) {
    return 1000 // Reduced for mobile/low-end devices
  }
  return 2000 // Reduced from 8000 for better performance
}

// Scroll-reactive particle field
const ScrollParticles = () => {
  const ref = useRef<THREE.Points>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  
  // Generate particles in a sphere with dynamic count based on device
  const sphere = useMemo(() => {
    const count = getParticleCount()
    return random.inSphere(new Float32Array(count), { radius: 1.8 })
  }, [])
  
  // Listen to scroll events (throttled for performance)
  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop
          const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
          const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0
          setScrollProgress(progress)
          ticking = false
        })
        ticking = true
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  useFrame((_state, delta) => {
    if (!ref.current) return
    
    // Base rotation (slower than original stars)
    ref.current.rotation.x -= delta / 12
    ref.current.rotation.y -= delta / 15
    
    // Add scroll-reactive rotation boost
    ref.current.rotation.z = scrollProgress * Math.PI * 0.5
    
    // Pulse effect based on scroll
    const scale = 1 + Math.sin(scrollProgress * Math.PI * 2) * 0.1
    ref.current.scale.set(scale, scale, scale)
  })
  
  // Interpolate color based on scroll progress
  const particleColor = useMemo(() => {
    // Start: cyan (#22d3ee), Middle: blue (#0ea5e9), End: deep blue (#0369a1)
    const t = Math.max(0, Math.min(1, scrollProgress)) // Clamp between 0 and 1
    
    if (t < 0.5) {
      // Interpolate between cyan and ocean blue
      const normalizedT = t * 2
      return new THREE.Color('#22d3ee').lerp(new THREE.Color('#0ea5e9'), normalizedT)
    } else {
      // Interpolate between ocean blue and navy blue
      const normalizedT = (t - 0.5) * 2
      return new THREE.Color('#0ea5e9').lerp(new THREE.Color('#0369a1'), normalizedT)
    }
  }, [scrollProgress])
  
  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color={particleColor}
          size={0.0025}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  )
}

// Scroll-reactive wave mesh
const WaveMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  
  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop
          const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
          const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0
          setScrollProgress(progress)
          ticking = false
        })
        ticking = true
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  useFrame((state) => {
    if (!meshRef.current) return
    
    const mesh = meshRef.current
    const geometry = mesh.geometry as THREE.PlaneGeometry
    const positions = geometry.attributes.position
    
    const time = state.clock.getElapsedTime()
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      
      // Create wave effect that intensifies with scroll
      const waveIntensity = 0.1 + scrollProgress * 0.3
      const z = Math.sin(x * 2 + time * 0.5) * Math.cos(y * 2 + time * 0.3) * waveIntensity
      
      positions.setZ(i, z)
    }
    
    positions.needsUpdate = true
    geometry.computeVertexNormals()
    
    // Rotate mesh based on scroll
    mesh.rotation.z = scrollProgress * Math.PI * 0.2
  })
  
  return (
    <mesh ref={meshRef} position={[0, 0, -2]} rotation={[-Math.PI / 6, 0, 0]}>
      <planeGeometry args={[8, 8, 64, 64]} />
      <meshStandardMaterial
        color="#0ea5e9"
        transparent
        opacity={0.05}
        wireframe={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// Floating geometric shapes that react to scroll
const FloatingShapes = () => {
  const groupRef = useRef<THREE.Group>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  
  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop
          const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
          const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0
          setScrollProgress(progress)
          ticking = false
        })
        ticking = true
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  useFrame((_state, delta) => {
    if (!groupRef.current) return
    
    groupRef.current.rotation.y += delta * 0.1
    groupRef.current.position.y = Math.sin(scrollProgress * Math.PI * 2) * 0.5
  })
  
  return (
    <group ref={groupRef}>
      {/* Icosahedron */}
      <mesh position={[-2, 0, -3]}>
        <icosahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial
          color="#22d3ee"
          transparent
          opacity={0.1}
          wireframe={true}
        />
      </mesh>
      
      {/* Torus */}
      <mesh position={[2, 1, -4]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <torusGeometry args={[0.3, 0.1, 16, 32]} />
        <meshStandardMaterial
          color="#0ea5e9"
          transparent
          opacity={0.1}
          wireframe={true}
        />
      </mesh>
      
      {/* Octahedron */}
      <mesh position={[0, -1.5, -3.5]}>
        <octahedronGeometry args={[0.25]} />
        <meshStandardMaterial
          color="#06b6d4"
          transparent
          opacity={0.1}
          wireframe={true}
        />
      </mesh>
    </group>
  )
}

const ScrollReactiveBackground = () => {
  return (
    <div className='fixed inset-0 z-[-1] w-full h-full'>
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false
        }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          {/* Ambient light for subtle illumination */}
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#22d3ee" />
          
          {/* Main scroll-reactive components */}
          <ScrollParticles />
          <WaveMesh />
          <FloatingShapes />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default ScrollReactiveBackground
