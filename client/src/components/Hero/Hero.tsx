import React, { useState } from "react";
import "./Hero.css";

const Hero: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => setModalOpen((prev) => !prev);

  const handleModalClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <section id="home" className="hero-section">
      <div className="profile-circle">
        <img src="avatar.png" alt="Avatar" className="profile-img" />
      </div>

      <div className="hero-text-container">
        <h1 className="hero-heading">
          I do code and <br />
          <span className="orange-text">make content</span> about it!{" "}
          <span className="pink-text">😊</span>
        </h1>

        <p className="hero-description">
          I am a seasoned full-stack software engineer with over <br />
          8 years of professional experience, specializing in backend
          development. <br />
          My expertise lies in crafting robust and scalable SaaS-based
          architectures on the Amazon AWS platform.
        </p>

        <div className="button-group">
          <button
            className="btn btn-primary"
            onClick={toggleModal}
            aria-haspopup="dialog"
            aria-expanded={isModalOpen}
          >
            Get In Touch
          </button>

          <a
            href="cvsept25.pdf"
            download="DhanrajCV.pdf"
            className="btn btn-secondary"
            role="button"
          >
            Download CV
          </a>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="modal-overlay"
          onClick={toggleModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="modal-content" onClick={handleModalClick}>
            <button
              className="modal-close-btn"
              onClick={toggleModal}
              aria-label="Close modal"
            >
              &times;
            </button>

            <h2 id="modal-title" className="modal-title">
              Hire Me
            </h2>

            <form
              className="contact-form"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Form submitted!");
                toggleModal();
              }}
            >
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Your Full Name"
              />

              <div className="inline-fields">
                <div className="inline-field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="Your Email"
                  />
                </div>

                <div className="inline-field">
                  <label htmlFor="phone">Phone (optional)</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Your Contact Number"
                  />
                </div>
              </div>

              <div className="inline-fields">
                <div className="inline-field">
                  <label htmlFor="role">Role / Position</label>
                  <input
                    id="role"
                    name="role"
                    type="text"
                    placeholder="e.g. Hiring Manager"
                    required
                  />
                </div>

                <div className="inline-field">
                  <label htmlFor="company">Company</label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    placeholder="Company Name"
                    required
                  />
                </div>
              </div>

              <label htmlFor="message">Requirement Message</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Share details about the job or project"
                required
              />

              <button type="submit" className="submit-btn">
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
