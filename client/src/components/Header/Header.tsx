import React, { useState, useEffect } from "react";
import "./Header.css";

const logo = `${process.env.REACT_APP_BACKEND_UPLOAD_URL}/logo2.png`;
const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setScrolled(true);
      else setScrolled(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Lock body scroll when menu open on mobile
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80; // Account for fixed header
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setIsOpen(false); // Close mobile menu after navigation
  };

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        <div
          className="logo"
          onClick={() => scrollToSection("home")}
          title="Logo"
        >
          <img src={logo} alt="DV Logo" className="logo-img" />
        </div>

        <button
          className={`hamburger ${isOpen ? "open" : ""}`}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          aria-controls="primary-navigation"
          onClick={toggleMenu}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          id="primary-navigation"
          className={`nav ${isOpen ? "open" : ""}`}
          role="navigation"
        >
          <ul className="nav-list">
            {[
              "home",
              "skills",
              "projects",
              "experience",
              "education",
              "about",
            ].map((section) => (
              <li key={section}>
                <a
                  href={`#${section}`}
                  className="nav-link"
                  onClick={() => setIsOpen(false)}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
