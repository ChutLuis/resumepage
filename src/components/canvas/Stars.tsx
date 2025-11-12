import { useRef, Suspense, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import * as THREE from 'three';
import * as random from 'maath/random/dist/maath-random.esm';

interface ShootingStar {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  lifetime: number;
  maxLifetime: number;
  color: THREE.Color;
}

interface ExplosionParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  lifetime: number;
  maxLifetime: number;
  color: THREE.Color;
}

// Theme color palette from the site design
const THEME_COLORS = [
  new THREE.Color(0x06b6d4), // Cyan
  new THREE.Color(0x0ea5e9), // Sky Blue
  new THREE.Color(0x56ccf2), // Light Blue
  new THREE.Color(0xec008c), // Hot Pink
  new THREE.Color(0xfc6767), // Coral Pink
  new THREE.Color(0xf272c8), // Magenta
  new THREE.Color(0x38ef7d), // Bright Green
  new THREE.Color(0x11998e), // Teal
  new THREE.Color(0xdfd9ff), // Lavender
  new THREE.Color(0xf5af19), // Golden Orange
];

// Create a single shooting star with random properties (outside component to avoid recreating)
function createShootingStar(): ShootingStar {
  // Start from random position on one side of the screen
  const startX = (Math.random() - 0.5) * 4;
  const startY = (Math.random() - 0.5) * 4 + 2;
  const startZ = (Math.random() - 0.5) * 2 - 1;
  
  // Velocity vector (shooting diagonally down and across)
  const velocityX = (Math.random() - 0.5) * 0.5;
  const velocityY = -(Math.random() * 0.8 + 0.4); // Always downward
  const velocityZ = (Math.random() - 0.5) * 0.3;
  
  // Pick a random color from the theme palette
  const randomColor = THEME_COLORS[Math.floor(Math.random() * THEME_COLORS.length)];
  
  return {
    position: new THREE.Vector3(startX, startY, startZ),
    velocity: new THREE.Vector3(velocityX, velocityY, velocityZ),
    lifetime: Math.random() * 5, // Random start time for staggered effect
    maxLifetime: 3 + Math.random() * 2, // Stars live for 3-5 seconds
    color: randomColor.clone()
  };
}

const Stars: React.FC = () => {
  const starsRef = useRef<THREE.Group>(null!);
  const rotatingStarsRef = useRef<THREE.Points>(null!);
  
  // Initialize shooting stars with random positions and velocities
  const shootingStars = useMemo(() => {
    const stars: ShootingStar[] = [];
    const count = 50; // Reduced count for hybrid POC with static stars
    
    for (let i = 0; i < count; i++) {
      stars.push(createShootingStar());
    }
    return stars;
  }, []);
  
  // Create rotating sphere of stars (like the original) - 500 stars
  const rotatingSphere = useMemo(() => random.inSphere(new Float32Array(1500), { radius: 1.2 }), []);
  
  // Explosion particles state
  const explosionParticles = useRef<ExplosionParticle[]>([]);
  const COLLISION_DISTANCE = 0.15; // Distance threshold for collision detection
  
  // Function to create explosion particles at a collision point
  const createExplosion = (position: THREE.Vector3, color1: THREE.Color, color2: THREE.Color) => {
    const particleCount = 8; // Small explosion with 8 particles
    const mixedColor = color1.clone().lerp(color2, 0.5); // Blend the two star colors
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 0.3 + Math.random() * 0.2;
      
      explosionParticles.current.push({
        position: position.clone(),
        velocity: new THREE.Vector3(
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          (Math.random() - 0.5) * 0.2
        ),
        lifetime: 0,
        maxLifetime: 0.5 + Math.random() * 0.3, // Short-lived particles
        color: mixedColor.clone()
      });
    }
  };
  
  // Create geometry and material for shooting stars with trails
  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const mat = new THREE.LineBasicMaterial({
      color: 0xf272c8,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    // Pre-allocate arrays for performance
    const positions = new Float32Array(shootingStars.length * 2 * 3); // 2 points per star, 3 coords per point
    const colors = new Float32Array(shootingStars.length * 2 * 3); // RGB for each point
    
    // Initialize positions with valid values from shooting stars
    shootingStars.forEach((star, i) => {
      const headIdx = i * 6;
      // Head position
      positions[headIdx] = star.position.x;
      positions[headIdx + 1] = star.position.y;
      positions[headIdx + 2] = star.position.z;
      // Tail position (slightly behind)
      positions[headIdx + 3] = star.position.x;
      positions[headIdx + 4] = star.position.y - 0.1;
      positions[headIdx + 5] = star.position.z;
      
      // Initialize colors using each star's assigned theme color
      const colorIdx = i * 6;
      colors[colorIdx] = star.color.r;
      colors[colorIdx + 1] = star.color.g;
      colors[colorIdx + 2] = star.color.b;
      colors[colorIdx + 3] = star.color.r * 0.3;
      colors[colorIdx + 4] = star.color.g * 0.3;
      colors[colorIdx + 5] = star.color.b * 0.3;
    });
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    mat.vertexColors = true;
    
    return { geometry: geo, material: mat };
  }, [shootingStars]);
  
  // Create geometry and material for explosion particles (as line segments for firework effect)
  const explosionGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    // Pre-allocate space for max 100 particles, each particle needs 2 points (head and tail)
    const positions = new Float32Array(100 * 2 * 3); // 2 points per particle, 3 coords per point
    const colors = new Float32Array(100 * 2 * 3);
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setDrawRange(0, 0); // Start with no particles visible
    
    return geo;
  }, []);
  
  const explosionMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });
  }, []);
  
  useFrame((_state, delta) => {
    if (!starsRef.current) return;
    
    // Rotate the background sphere of stars (like the original)
    if (rotatingStarsRef.current) {
      rotatingStarsRef.current.rotation.x -= delta / 8;
      rotatingStarsRef.current.rotation.y -= delta / 8;
    }
    
    const positions = geometry.attributes.position.array as Float32Array;
    const colors = geometry.attributes.color.array as Float32Array;
    
    // Collision detection - check each star against others
    for (let i = 0; i < shootingStars.length; i++) {
      for (let j = i + 1; j < shootingStars.length; j++) {
        const star1 = shootingStars[i];
        const star2 = shootingStars[j];
        const distance = star1.position.distanceTo(star2.position);
        
        // If stars are close enough, create an explosion
        if (distance < COLLISION_DISTANCE) {
          const collisionPoint = star1.position.clone().lerp(star2.position, 0.5);
          createExplosion(collisionPoint, star1.color, star2.color);
          
          // Reset both stars to avoid repeated collisions
          const newStar1 = createShootingStar();
          star1.position.copy(newStar1.position);
          star1.velocity.copy(newStar1.velocity);
          star1.lifetime = 0;
          
          const newStar2 = createShootingStar();
          star2.position.copy(newStar2.position);
          star2.velocity.copy(newStar2.velocity);
          star2.lifetime = 0;
        }
      }
    }
    
    shootingStars.forEach((star, i) => {
      // Update lifetime
      star.lifetime += delta;
      
      // Reset star if it's lived too long or gone off screen
      if (star.lifetime > star.maxLifetime || star.position.y < -3) {
        const newStar = createShootingStar();
        star.position.copy(newStar.position);
        star.velocity.copy(newStar.velocity);
        star.lifetime = 0;
        star.maxLifetime = newStar.maxLifetime;
      }
      
      // Update position based on velocity
      star.position.add(star.velocity.clone().multiplyScalar(delta));
      
      // Calculate trail length based on velocity magnitude
      const trailLength = star.velocity.length() * 0.15;
      const trailDirection = star.velocity.clone().normalize().multiplyScalar(-trailLength);
      
      // Head position (bright)
      const headIdx = i * 6;
      positions[headIdx] = star.position.x;
      positions[headIdx + 1] = star.position.y;
      positions[headIdx + 2] = star.position.z;
      
      // Tail position (faded)
      const tailPos = star.position.clone().add(trailDirection);
      positions[headIdx + 3] = tailPos.x;
      positions[headIdx + 4] = tailPos.y;
      positions[headIdx + 5] = tailPos.z;
      
      // Calculate opacity based on lifetime (fade in and out)
      const lifetimeRatio = star.lifetime / star.maxLifetime;
      let opacity = 1.0;
      
      if (lifetimeRatio < 0.1) {
        // Fade in
        opacity = lifetimeRatio / 0.1;
      } else if (lifetimeRatio > 0.8) {
        // Fade out
        opacity = (1.0 - lifetimeRatio) / 0.2;
      }
      
      // Head color (bright, using star's theme color)
      const colorIdx = i * 6;
      colors[colorIdx] = star.color.r * opacity;
      colors[colorIdx + 1] = star.color.g * opacity;
      colors[colorIdx + 2] = star.color.b * opacity;
      
      // Tail color (dimmer, same color with reduced intensity)
      colors[colorIdx + 3] = star.color.r * opacity * 0.3;
      colors[colorIdx + 4] = star.color.g * opacity * 0.3;
      colors[colorIdx + 5] = star.color.b * opacity * 0.3;
    });
    
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
    
    // Update explosion particles (as firework streaks)
    const expPositions = explosionGeometry.attributes.position.array as Float32Array;
    const expColors = explosionGeometry.attributes.color.array as Float32Array;
    
    // Filter out dead particles and update living ones
    explosionParticles.current = explosionParticles.current.filter((particle, idx) => {
      particle.lifetime += delta;
      
      if (particle.lifetime >= particle.maxLifetime) {
        return false; // Remove dead particles
      }
      
      // Update position
      particle.position.add(particle.velocity.clone().multiplyScalar(delta));
      
      // Fade out based on lifetime
      const lifetimeRatio = particle.lifetime / particle.maxLifetime;
      const opacity = 1.0 - lifetimeRatio;
      
      // Create small streak oriented in direction of velocity
      const streakLength = 0.03; // Very small streak (firework spark size)
      const streakDirection = particle.velocity.clone().normalize().multiplyScalar(-streakLength);
      
      // Head position (bright, leading edge of the spark)
      const headIdx = idx * 6; // Each particle has 2 points, 3 coords each = 6 values
      expPositions[headIdx] = particle.position.x;
      expPositions[headIdx + 1] = particle.position.y;
      expPositions[headIdx + 2] = particle.position.z;
      
      // Tail position (dimmer, trailing edge of the spark)
      const tailPos = particle.position.clone().add(streakDirection);
      expPositions[headIdx + 3] = tailPos.x;
      expPositions[headIdx + 4] = tailPos.y;
      expPositions[headIdx + 5] = tailPos.z;
      
      // Head color (bright)
      const colorIdx = idx * 6;
      expColors[colorIdx] = particle.color.r * opacity;
      expColors[colorIdx + 1] = particle.color.g * opacity;
      expColors[colorIdx + 2] = particle.color.b * opacity;
      
      // Tail color (dimmer for streak effect)
      expColors[colorIdx + 3] = particle.color.r * opacity * 0.4;
      expColors[colorIdx + 4] = particle.color.g * opacity * 0.4;
      expColors[colorIdx + 5] = particle.color.b * opacity * 0.4;
      
      return true; // Keep living particles
    });
    
    // Update draw range to render active particles (2 vertices per particle)
    explosionGeometry.setDrawRange(0, explosionParticles.current.length * 2);
    explosionGeometry.attributes.position.needsUpdate = true;
    explosionGeometry.attributes.color.needsUpdate = true;
  });
  
  return (
    <group ref={starsRef} rotation={[0, 0, Math.PI / 4]}>
      {/* Rotating sphere of stars (subtle white circular stars) */}
      <points ref={rotatingStarsRef} position-z={0}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={rotatingSphere.length / 3}
            array={rotatingSphere}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          transparent
          color="#ffffff"
          size={0.0023}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.5}
          alphaTest={0.01}
          map={(() => {
            const canvas = document.createElement('canvas');
            canvas.width = 32;
            canvas.height = 32;
            const ctx = canvas.getContext('2d')!;
            const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
            gradient.addColorStop(0, 'rgba(255,255,255,1)');
            gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
            gradient.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 32, 32);
            const texture = new THREE.CanvasTexture(canvas);
            return texture;
          })()}
        />
      </points>
      {/* Shooting stars with colored trails */}
      <lineSegments geometry={geometry} material={material} />
      {/* Explosion particles as firework streaks */}
      <lineSegments geometry={explosionGeometry} material={explosionMaterial} />
    </group>
  );
};

const StarsCanvas: React.FC = () => {
  const [mountCanvas, setMountCanvas] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Remount canvas when section comes into view to recover from WebGL context loss
            setMountCanvas(false);
            setTimeout(() => setMountCanvas(true), 100);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className='w-full h-auto absolute inset-0 z-[-1]'>
      {mountCanvas && (
        <Canvas 
          key={Date.now()}
          camera={{position: [0, 0, 1]}}
          gl={{
            alpha: true,
            antialias: false,
            powerPreference: "high-performance",
            failIfMajorPerformanceCaveat: false
          }}
          dpr={[1, 1]}
        >
          <Suspense fallback={null}>
            <Stars />
          </Suspense>
          <Preload all />
        </Canvas>
      )}
    </div>
  );
};

export default StarsCanvas;