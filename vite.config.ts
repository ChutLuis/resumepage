import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  build: {
    // Output directory
    outDir: 'dist',
    
    // Generate sourcemaps for production (set to false for smaller builds)
    sourcemap: false,
    
    // Chunk size warning limit (in kbs)
    chunkSizeWarningLimit: 1000,
    
    // Minification
    minify: 'terser',
    
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
    
    // Rollup options for bundle optimization
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // Three.js and related libraries
          'three-vendor': [
            'three',
            '@react-three/fiber',
            '@react-three/drei',
            'maath',
          ],
          
          // Animation libraries
          'animation-vendor': ['framer-motion'],
          
          // Form and validation
          'form-vendor': ['@emailjs/browser'],
        },
        
        // Naming pattern for chunks
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    
    // Asset handling
    assetsInlineLimit: 4096, // 4kb - inline assets smaller than this
    
    // CSS code splitting
    cssCodeSplit: true,
  },
  
  // Server configuration for development
  server: {
    port: 5173,
    open: true,
  },
  
  // Preview server configuration
  preview: {
    port: 4173,
  },
})
