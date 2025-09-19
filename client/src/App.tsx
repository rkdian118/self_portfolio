import React, { useEffect } from "react";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Technologies from "./components/Technologies/Technologies";
import Projects from "./components/Projects/Projects";
import Experience from "./components/Experience/Experience";
import Contact from "./components/Contact/Contact";
import AnimatedBackground from "./components/AnimatedBackground/AnimatedBackground";
import Education from "./components/Education/Education";

const App: React.FC = () => {
  useEffect(() => {
    const handleAnchorScroll = (event: Event) => {
      if (window.location.hash) {
        setTimeout(() => {
          const elem = document.getElementById(window.location.hash.slice(1));
          if (elem) {
            const yOffset = -70;
            const y =
              elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
          }
        }, 10);
      }
    };

    window.addEventListener("hashchange", handleAnchorScroll, false);

    return () => {
      window.removeEventListener("hashchange", handleAnchorScroll, false);
    };
  }, []);

  return (
    <div className="app">
      <AnimatedBackground />
      <Header />
      <main>
        <Hero />
        <Technologies />
        <Projects />
        <Experience />
        <Education />
        <Contact />
      </main>
    </div>
  );
};

export default App;
