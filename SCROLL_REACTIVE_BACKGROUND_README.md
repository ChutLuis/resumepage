# Scroll-Reactive Three.js Background - EXPERIMENTAL FEATURE

## Overview
This is an **experimental** scroll-reactive Three.js background canvas that replaces the original Stars canvas. It creates an immersive, dynamic 3D background that responds to user scrolling throughout the portfolio.

## Implementation Date
October 17, 2025

## What It Does
The scroll-reactive background includes three main visual elements:

### 1. **ScrollParticles** - Dynamic Particle Field
- 8,000 particles arranged in a spherical distribution
- Particles change color as you scroll:
  - **Top of page**: Cyan (#22d3ee)
  - **Middle**: Ocean Blue (#0ea5e9)
  - **Bottom**: Navy Blue (#0369a1)
- Rotation speed increases based on scroll position
- Pulse/scale effect that oscillates with scroll progress

### 2. **WaveMesh** - Animated Wave Plane
- Wireframe plane with animated wave distortions
- Wave intensity increases as you scroll down (0.1 to 0.4)
- Subtle rotation based on scroll position
- Very transparent (5% opacity) to stay in background

### 3. **FloatingShapes** - Geometric Shapes
- Three wireframe geometric shapes (Icosahedron, Torus, Octahedron)
- Shapes rotate and move vertically based on scroll
- Minimal opacity (10%) to avoid distraction
- Different blue/cyan colors matching the theme

## Technical Details

### Performance Optimizations
- **Throttled scroll listeners**: Uses `requestAnimationFrame` for smooth performance
- **Low device pixel ratio**: Set to [1, 1.5] to reduce GPU load
- **No antialiasing**: Disabled to improve performance
- **High-performance power preference**: Optimizes for GPU usage
- **Particle count**: 8,000 particles (balanced for visual impact vs performance)
- **Fixed position**: Canvas is positioned as `fixed` with `z-index: -1` to stay behind all content

### WebGL Context Management
- Replaces the original Stars canvas to maintain 3 WebGL contexts total:
  1. Hero Computer (3D desktop model)
  2. Contact Earth (Rotating Earth)
  3. **ScrollReactiveBackground** (New - replaces Stars)

### File Structure
```
src/
├── components/
│   └── canvas/
│       ├── ScrollReactiveBackground.tsx  (NEW - Main implementation)
│       ├── Stars.jsx                      (Kept for potential rollback)
│       └── index.js                       (Updated with new export)
└── App.tsx                                (Updated to use new background)
```

## Changes Made

### Files Created
- `src/components/canvas/ScrollReactiveBackground.tsx`

### Files Modified
1. **src/components/canvas/index.js**
   - Added export for `ScrollReactiveBackground`

2. **src/components/index.ts**
   - Added export for `ScrollReactiveBackground`

3. **src/App.tsx**
   - Replaced `<StarsCanvas />` with `<ScrollReactiveBackground />`
   - Moved to top of component for full-page coverage
   - Original Stars canvas commented out (not deleted) for easy rollback

## Color Scheme
Matches the blue theme of the portfolio:
- Primary particles: Cyan (#22d3ee) → Ocean Blue (#0ea5e9) → Navy Blue (#0369a1)
- Wave mesh: Ocean Blue (#0ea5e9) at 5% opacity
- Geometric shapes: Cyan/Blue variants at 10% opacity
- Point light: Cyan (#22d3ee) accent

## How to Revert (If Needed)

If you want to go back to the original Stars canvas:

1. Open `src/App.tsx`
2. Remove or comment out: `<ScrollReactiveBackground />`
3. Uncomment: `<StarsCanvas />`
4. Move it back to its original position in the Contact section

```tsx
// Revert changes:
function App() {
  return (
    <BrowserRouter>
      <div className="relative z-0  bg-primary">
        {/* Remove this: */}
        {/* <ScrollReactiveBackground /> */}
        
        <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
          <Navbar />
          <Hero />
        </div>
        <About />
        <Experience />
        <Tech />
        <Works />
        <Feedbacks />
        <div className="relative z-0">
          <Contact />
          {/* Uncomment this: */}
          <StarsCanvas />
        </div>
      </div>
    </BrowserRouter>
  );
}
```

## Browser Testing
- ✅ Tested on modern browsers with WebGL support
- ✅ Scroll performance verified with throttled event listeners
- ✅ Visual impact confirmed across all portfolio sections
- ✅ NaN error in particle color interpolation fixed

## Future Enhancements (Optional)
- Add more scroll-based effects (parallax, color shifts)
- Implement mouse interaction (particle attraction/repulsion)
- Add custom shapes or logo integration
- Create different effects for different sections
- Add performance monitoring/adaptive quality

## Notes
- This is an **experimental test** feature
- Original Stars.jsx is preserved for easy rollback
- All existing 3D canvases (Hero Computer, Contact Earth) remain functional
- Performance impact is minimal due to optimizations
- Background stays behind all content (z-index: -1)
