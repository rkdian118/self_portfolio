import React, { useEffect, useState } from "react";
import "./Footer.css";
import {
  FaLinkedin,
  FaGithub,
  // FaTwitter,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaHeart,
  // FaArrowUp,
} from "react-icons/fa";
import { IconBaseProps } from "react-icons";
import { usePortfolioStore } from "../../store/portfolioStore";
import LoadingSkeleton from "../LoadingSkeleton/LoadingSkeleton";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const logo = `${process.env.REACT_APP_BACKEND_UPLOAD_URL}/logo2.png`;
const FaLinkedinIcon = FaLinkedin as React.FunctionComponent<IconBaseProps>;
const FaGithubIcon = FaGithub as React.FunctionComponent<IconBaseProps>;
const FaEnvelopeIcon = FaEnvelope as React.FunctionComponent<IconBaseProps>;
// const FaTwitterIcon = FaTwitter as React.FunctionComponent<IconBaseProps>;
const FaPhoneIcon = FaPhone as React.FunctionComponent<IconBaseProps>;
const FaHeartIcon = FaHeart as React.FunctionComponent<IconBaseProps>;
// const FaArrowUpIcon = FaArrowUp as React.FunctionComponent<IconBaseProps>;
const FaMapMarkerAltIcon =
  FaMapMarkerAlt as React.FunctionComponent<IconBaseProps>;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Lock body scroll when menu open on mobile
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Get contact data and functions from Zustand store
  const { contact, loading, errors, fetchContact } = usePortfolioStore();

  // Fetch contact data on component mount
  useEffect(() => {
    if (!contact) {
      fetchContact();
    }
  }, [contact, fetchContact]);

  const scrollToTop = () => {
    window.scrollTo({ top: 20, behavior: "smooth" });
  };

  // Show loading skeleton while fetching contact data
  if (loading.contact) {
    return (
      <footer className="footer">
        <div className="footer-container">
          <LoadingSkeleton type="contact" count={1} />
        </div>
      </footer>
    );
  }

  // Show error if contact fetch failed
  if (errors.contact) {
    return (
      <footer className="footer">
        <div className="footer-container">
          <ErrorMessage
            message={errors.contact}
            onRetry={() => fetchContact()}
            type="error"
          />
        </div>
      </footer>
    );
  }

  // Fallback contact data if API fails
  const contactData = contact || {
    email: "dhanraj@example.com",
    phone: "+91 98765 43210",
    location: "Indore, Madhya Pradesh, India",
    linkedin: "https://linkedin.com/in/dhanraj-vishwakarma",
    github: "https://github.com/dhanraj-vishwakarma",
  };

  return (
    <footer id="about" className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <img
                src={logo}
                alt="DV - Dhanraj Vishwakarma Professional Software Development"
                className="footer-logo-img"
                onClick={scrollToTop}
              />
              <div className="footer-brand-text">
                <h3>Dhanraj Vishwakarma</h3>
                <p>Professional Software Development</p>
              </div>
            </div>
            <p className="footer-description">
              Full-Stack MERN Developer specializing in modern web technologies,
              scalable applications, and innovative digital solutions.
              Transforming ideas into powerful software experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              {["home", "skills", "projects", "experience", "education"].map(
                (section) => (
                  <li key={section}>
                    <a
                      href={`#${section}`}
                      // className="nav-link"
                      onClick={() => setIsOpen(false)}
                    >
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4>Services</h4>
            <ul className="footer-links">
              <li>Web Development</li>
              <li>Mobile Apps</li>
              <li>API Integration</li>
              <li>Cloud Solutions</li>
              <li>Deployment Services</li>
            </ul>
          </div>

          {/* Dynamic Contact Information from API */}
          <div className="footer-section">
            <h4>Get In Touch</h4>
            <div className="footer-contact">
              {contactData.email && (
                <div className="contact-item">
                  <FaEnvelopeIcon className="contact-icon" />
                  <a href={`mailto:${contactData.email}`}>
                    {contactData.email}
                  </a>
                </div>
              )}

              {contactData.phone && (
                <div className="contact-item">
                  <FaPhoneIcon className="contact-icon" />
                  <a href={`tel:${contactData.phone.replace(/\s+/g, "")}`}>
                    {contactData.phone}
                  </a>
                </div>
              )}

              {contactData.location && (
                <div className="contact-item">
                  <FaMapMarkerAltIcon className="contact-icon" />
                  <span>{contactData.location}</span>
                </div>
              )}
            </div>

            {/* Dynamic Social Media Links from API */}
            <div className="footer-social">
              {contactData.linkedin && (
                <a
                  href={contactData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                >
                  <FaLinkedinIcon />
                </a>
              )}

              {contactData.github && (
                <a
                  href={contactData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                >
                  <FaGithubIcon />
                </a>
              )}

              {/* Twitter - you can add this to your Contact model if needed */}
              {/* <a
                href="https://twitter.com/dhanraj_dev"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter Profile"
              >
                <FaTwitterIcon />
              </a> */}

              {contactData.email && (
                <a
                  href={`mailto:${contactData.email}`}
                  aria-label="Email Contact"
                >
                  <FaEnvelopeIcon />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>
              © {currentYear} <strong>Dhanraj Vishwakarma</strong>. All rights
              reserved.
            </p>
            <p className="footer-made-with">
              Made with <FaHeartIcon className="heart-icon" /> using Node,
              React, MongoDB & TypeScript
            </p>
          </div>

          {/* <div className="footer-legal">
            <a href="#privacy">Privacy Policy</a>
            <span className="separator">•</span>
            <a href="#terms">Terms of Service</a>
            <span className="separator">•</span>
            <a href="#cookies">Cookie Policy</a>
          </div> */}

          {/* Back to Top Button */}
          {/* <button
            className="back-to-top"
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            <FaArrowUpIcon />
          </button> */}
        </div>
      </div>

      {/* Background Pattern */}
      <div className="footer-bg-pattern"></div>
    </footer>
  );
};

export default Footer;
