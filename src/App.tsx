import { BrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Hero, Navbar, ErrorBoundary, Footer } from "./components";
import SectionLoader from "./components/SectionLoader";
import SmoothScroll from "./components/SmoothScroll";
import ScrollProgress from "./components/ui/ScrollProgress";
import { useLocale } from "./i18n/LocaleContext";

// Lazy load below-the-fold sections for a lean initial payload.
const Works = lazy(() => import("./components/Works"));
const Experience = lazy(() => import("./components/Experience"));
const Tech = lazy(() => import("./components/Tech"));
const About = lazy(() => import("./components/About"));
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

  const sections = [Works, Experience, Tech, About, Feedbacks, Contact];

  return (
    <BrowserRouter>
      <div className="relative z-0 bg-primary">
        <SmoothScroll />
        <ScrollProgress />

        <header>
          <Navbar />
          <Hero />
        </header>

        <main id="main-content" className="relative">
          {sections.map((SectionComponent, index) => (
            <ErrorBoundary
              key={index}
              fallbackMessage={t.system.errorFallback}
              labels={errorLabels}
            >
              <Suspense fallback={<SectionLoader />}>
                <SectionComponent />
              </Suspense>
            </ErrorBoundary>
          ))}
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
