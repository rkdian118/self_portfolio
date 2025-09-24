import React, { useState, useEffect } from "react";
import { usePortfolioStore } from "../../store/portfolioStore";
import LoadingSkeleton from "../LoadingSkeleton/LoadingSkeleton";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import "./Hero.css";

const Hero: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    company: "",
    message: "",
  });

  const { hero, loading, errors, fetchHero, submitContactForm } =
    usePortfolioStore();

  useEffect(() => {
    if (!hero) {
      fetchHero();
    }
  }, [hero, fetchHero]);
  const toggleModal = () => setModalOpen((prev) => !prev);

  const handleModalClick = (e: React.MouseEvent) => e.stopPropagation();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.role ||
      !formData.company ||
      !formData.message
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const result = await submitContactForm(formData);

    if (result.success) {
      alert(result.message);
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "",
        company: "",
        message: "",
      });
      toggleModal();
    } else {
      alert(`Error: ${result.message}`);
    }
  };

  const handleDownloadCV = () => {
    window.open(hero?.cvUrl, "_blank");
  };

  // Show loading skeleton while fetching
  if (loading.hero) {
    return <LoadingSkeleton type="hero" />;
  }

  // Show error if fetch failed
  if (errors.hero) {
    return (
      <ErrorMessage
        message={errors.hero}
        onRetry={() => fetchHero()}
        type="error"
      />
    );
  }

  // Show fallback if no data
  if (!hero) {
    return (
      <ErrorMessage message="Hero information not available" type="info" />
    );
  }

  return (
    <section id="home" className="hero-section">
      <h1 className="hero-title">{hero.name}</h1>
      <h2 style={{ marginTop: "-10px", fontSize: "1.2rem", fontWeight: "600" }}>
        {hero.title}
      </h2>
      <div className="profile-circle">
        {/* <img src="avatar.png" alt="Avatar" className="profile-img" /> */}
        <img
          src={hero.profileImage ? hero.profileImage : "avatar.png"}
          alt={hero.name}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
          className="profile-img"
        />
      </div>

      <div className="hero-text-container">
        {/* <h1 className="hero-title">{hero.title}</h1> */}
        {/* <h1 className="hero-heading">
          I do code and <br />
          <span className="orange-text">make content</span> about it!{" "}
          <span className="pink-text">😊</span>
        </h1> */}

        <p className="hero-description">{hero.bio}</p>

        <div className="button-group">
          <button
            className="btn btn-primary"
            onClick={toggleModal}
            // aria-haspopup="dialog"
            // aria-expanded={isModalOpen}
          >
            Get In Touch
          </button>

          <button onClick={handleDownloadCV} className="btn btn-secondary">
            Download CV
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="modal-overlay"
          onClick={toggleModal}
          // role="dialog"
          // aria-modal="true"
          // aria-labelledby="modal-title"
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

            <form className="contact-form" onSubmit={handleSubmit}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Name *"
                value={formData.name}
                onChange={handleInputChange}
                required
              />

              <div className="inline-fields">
                <div className="inline-field">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="inline-field">
                  <label htmlFor="phone">Phone (optional)</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone (optional)"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="inline-fields">
                <div className="inline-field">
                  <label htmlFor="role">Role / Position</label>
                  <input
                    type="text"
                    name="role"
                    placeholder="Role / Position *"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="inline-field">
                  <label htmlFor="company">Company</label>
                  <input
                    type="text"
                    name="company"
                    placeholder="Company *"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <label htmlFor="message">Requirement Message</label>
              <textarea
                name="message"
                placeholder="Requirement Message *"
                value={formData.message}
                onChange={handleInputChange}
                required
              />

              <button
                type="submit"
                className="submit-btn"
                disabled={loading.contactForm}
              >
                {loading.contactForm ? "Sending..." : "Send"}
              </button>
            </form>

            {errors.contactForm && (
              <p className="error-text">{errors.contactForm}</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
