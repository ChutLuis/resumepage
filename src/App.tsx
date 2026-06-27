import { BrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Hero, Navbar, ErrorBoundary, Footer, CustomCursor, ScrollProgress } from "./components";
import SectionLoader from "./components/SectionLoader";
import SmoothScroll from "./components/SmoothScroll";
import GlobalBackground from "./components/GlobalBackground";

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
      <div className="relative z-0">
        <SmoothScroll />
        <ScrollProgress />
        <CustomCursor />

        {/* Persistent full-page WebGL background (aurora shader + particle field). */}
        <ErrorBoundary fallbackMessage="Unable to load background animation. The page will continue to work normally.">
          <GlobalBackground />
        </ErrorBoundary>

        {/* All real content layers above the fixed WebGL canvas. */}
        <div className="relative z-10">
          <header>
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

            <ErrorBoundary fallbackMessage="Unable to load the Contact section.">
              <Suspense fallback={<SectionLoader />}>
                <Contact />
              </Suspense>
            </ErrorBoundary>
          </main>

          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
