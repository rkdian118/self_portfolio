import React, { useEffect } from "react";
import { usePortfolioStore } from "../../store/portfolioStore";
import LoadingSkeleton from "../LoadingSkeleton/LoadingSkeleton";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import "./Contact.css";
import {
  FaLinkedin,
  FaGithub,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { IconBaseProps } from "react-icons";

const FaLinkedinIcon = FaLinkedin as React.FunctionComponent<IconBaseProps>;
const FaGithubIcon = FaGithub as React.FunctionComponent<IconBaseProps>;
const FaEnvelopeIcon = FaEnvelope as React.FunctionComponent<IconBaseProps>;
const FaPhoneAltIcon = FaPhoneAlt as React.FunctionComponent<IconBaseProps>;
const FaMapMarkerAltIcon =
  FaMapMarkerAlt as React.FunctionComponent<IconBaseProps>;

const Contact: React.FC = () => {
  const { contact, loading, errors, fetchContact } = usePortfolioStore();

  useEffect(() => {
    if (!contact) {
      fetchContact();
    }
  }, [contact, fetchContact]);

  // Show loading skeleton while fetching
  if (loading.contact) {
    return (
      <section className="contact-section" id="contact">
        <h2 className="contact-header">Let's Connect</h2>
        <LoadingSkeleton type="contact" />
      </section>
    );
  }

  // Show error if fetch failed
  if (errors.contact) {
    return (
      <section className="contact-section" id="contact">
        <h2 className="contact-header">Let's Connect</h2>
        <ErrorMessage
          message={errors.contact}
          onRetry={() => fetchContact()}
          type="error"
        />
      </section>
    );
  }

  // Show message if no contact data
  if (!contact) {
    return (
      <section className="contact-section" id="contact">
        <h2 className="contact-header">Let's Connect</h2>
        <ErrorMessage
          message="Contact information not available at the moment"
          type="info"
        />
      </section>
    );
  }

  const contactItems = [
    {
      label: "Email",
      value: contact.email,
      href: `mailto:${contact.email}`,
      icon: <FaEnvelopeIcon size={20} />,
    },
    {
      label: "Phone",
      value: contact.phone,
      href: `tel:${contact.phone.replace(/[^\d+]/g, "")}`,
      icon: <FaPhoneAltIcon size={20} />,
    },
    {
      label: "LinkedIn",
      value: contact.linkedin,
      href: contact.linkedin,
      icon: <FaLinkedinIcon size={20} />,
    },
    {
      label: "GitHub",
      value: contact.github,
      href: contact.github,
      icon: <FaGithubIcon size={20} />,
    },
    {
      label: "Location",
      value: contact.location,
      href: undefined,
      icon: <FaMapMarkerAltIcon size={20} />,
    },
  ];

  return (
    <section id="contact" className="contact-section">
      <h2 className="contact-header">Let’s Connect</h2>
      <div className="contact-container">
        {contactItems.map(({ label, value, href, icon }) => (
          <div key={label} className="contact-item">
            <div className="contact-icon">{icon}</div>
            <div className="contact-info">
              <span className="contact-label">{label}:</span>
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  {value}
                </a>
              ) : (
                <span className="contact-text">{value}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Contact;
