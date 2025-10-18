import { BrowserRouter } from "react-router-dom";
import {
  About,
  Contact,
  Experience,
  Feedbacks,
  Hero,
  Navbar,
  Tech,
  Works,
  ScrollReactiveBackground,
} from "./components";
function App() {
  return (
    <BrowserRouter>
      <div className="relative z-0  bg-primary">
        {/* EXPERIMENTAL: Scroll-Reactive Background Canvas */}
        <ScrollReactiveBackground />
        
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
          {/* Original Stars canvas removed - replaced by ScrollReactiveBackground */}
          {/* <StarsCanvas /> */}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
