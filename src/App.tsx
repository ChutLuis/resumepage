import { BrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Hero, Navbar, ScrollReactiveBackground } from "./components";

// Lazy load heavy components for better initial load performance
const About = lazy(() => import("./components/About"));
const Experience = lazy(() => import("./components/Experience"));
const Tech = lazy(() => import("./components/Tech"));
const Works = lazy(() => import("./components/Works"));
const Feedbacks = lazy(() => import("./components/Feedbacks"));
const Contact = lazy(() => import("./components/Contact"));

// Loading fallback component
const SectionLoader = () => (
  <div className="flex justify-center items-center min-h-[200px]">
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <div className="relative z-0 bg-primary">
        {/* EXPERIMENTAL: Scroll-Reactive Background Canvas */}
        <ScrollReactiveBackground />
        
        <header className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
          <Navbar />
          <Hero />
        </header>
        
        <main id="main-content" className="relative">
          <Suspense fallback={<SectionLoader />}>
            <About />
          </Suspense>
          
          <Suspense fallback={<SectionLoader />}>
            <Experience />
          </Suspense>
          
          <Suspense fallback={<SectionLoader />}>
            <Tech />
          </Suspense>
          
          <Suspense fallback={<SectionLoader />}>
            <Works />
          </Suspense>
          
          <Suspense fallback={<SectionLoader />}>
            <Feedbacks />
          </Suspense>
          
          <div className="relative z-0">
            <Suspense fallback={<SectionLoader />}>
              <Contact />
            </Suspense>
            {/* Original Stars canvas removed - replaced by ScrollReactiveBackground */}
            {/* <StarsCanvas /> */}
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
