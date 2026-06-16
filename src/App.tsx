import { BrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Hero, Navbar, StarsCanvas, ErrorBoundary, Footer } from "./components";
import SectionLoader from "./components/SectionLoader";

// Lazy load heavy components for better initial load performance
const About = lazy(() => import("./components/About"));
const Experience = lazy(() => import("./components/Experience"));
const Tech = lazy(() => import("./components/Tech"));
const Works = lazy(() => import("./components/Works"));
const Feedbacks = lazy(() => import("./components/Feedbacks"));
const Contact = lazy(() => import("./components/Contact"));

function App() {
  return (
    <BrowserRouter>
      <div className="relative z-0 bg-primary">
        {/* Shooting Stars Background Canvas - Wrapped in Error Boundary */}
        <ErrorBoundary fallbackMessage="Unable to load background animation. The page will continue to work normally.">
          <StarsCanvas />
        </ErrorBoundary>
        
        <header className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
          <Navbar />
          <Hero />
        </header>
        
        <main id="main-content" className="relative">
          <ErrorBoundary fallbackMessage="Unable to load the About section.">
            <Suspense fallback={<SectionLoader />}>
              <About />
            </Suspense>
          </ErrorBoundary>
          
          <ErrorBoundary fallbackMessage="Unable to load the Experience section.">
            <Suspense fallback={<SectionLoader />}>
              <Experience />
            </Suspense>
          </ErrorBoundary>
          
          <ErrorBoundary fallbackMessage="Unable to load the Tech section.">
            <Suspense fallback={<SectionLoader />}>
              <Tech />
            </Suspense>
          </ErrorBoundary>
          
          <ErrorBoundary fallbackMessage="Unable to load the Works section.">
            <Suspense fallback={<SectionLoader />}>
              <Works />
            </Suspense>
          </ErrorBoundary>
          
          <ErrorBoundary fallbackMessage="Unable to load the Feedbacks section.">
            <Suspense fallback={<SectionLoader />}>
              <Feedbacks />
            </Suspense>
          </ErrorBoundary>
          
          <div className="relative z-0">
            <ErrorBoundary fallbackMessage="Unable to load the Contact section.">
              <Suspense fallback={<SectionLoader />}>
                <Contact />
              </Suspense>
            </ErrorBoundary>
            {/* Stars canvas moved to top level for full-page background */}
          </div>
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
