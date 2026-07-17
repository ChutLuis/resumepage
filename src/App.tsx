import { BrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Hero, Navbar, ErrorBoundary, Footer, CustomCursor, ScrollProgress } from "./components";
import SectionLoader from "./components/SectionLoader";
import SmoothScroll from "./components/SmoothScroll";
import GlobalBackground from "./components/GlobalBackground";
import { useLocale } from "./i18n/LocaleContext";

// Lazy load heavy components for better initial load performance
const About = lazy(() => import("./components/About"));
const Experience = lazy(() => import("./components/Experience"));
const Tech = lazy(() => import("./components/Tech"));
const Works = lazy(() => import("./components/Works"));
const Feedbacks = lazy(() => import("./components/Feedbacks"));
const Contact = lazy(() => import("./components/Contact"));

function App() {
  const { t } = useLocale();
  const errorLabels = {
    title: t.system.errorTitle,
    fallback: t.system.errorFallback,
    tryAgain: t.system.tryAgain,
    refresh: t.system.refresh,
    developmentError: t.system.developmentError,
  };

  return (
    <BrowserRouter>
      <div className="relative z-0">
        <SmoothScroll />
        <ScrollProgress />
        <CustomCursor />

        {/* Persistent full-page WebGL background (aurora shader + particle field). */}
        <ErrorBoundary fallbackMessage={t.system.errorFallback} labels={errorLabels}>
          <GlobalBackground />
        </ErrorBoundary>

        {/* All real content layers above the fixed WebGL canvas. */}
        <div className="relative z-10">
          <header>
            <Navbar />
            <Hero />
          </header>

          <main id="main-content" className="relative">
            <ErrorBoundary fallbackMessage={t.system.errorFallback} labels={errorLabels}>
              <Suspense fallback={<SectionLoader />}>
                <About />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary fallbackMessage={t.system.errorFallback} labels={errorLabels}>
              <Suspense fallback={<SectionLoader />}>
                <Experience />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary fallbackMessage={t.system.errorFallback} labels={errorLabels}>
              <Suspense fallback={<SectionLoader />}>
                <Tech />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary fallbackMessage={t.system.errorFallback} labels={errorLabels}>
              <Suspense fallback={<SectionLoader />}>
                <Works />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary fallbackMessage={t.system.errorFallback} labels={errorLabels}>
              <Suspense fallback={<SectionLoader />}>
                <Feedbacks />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary fallbackMessage={t.system.errorFallback} labels={errorLabels}>
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
