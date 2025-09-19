import React from "react";
import "./Contact.css";
import {
  FaLinkedin,
  FaGithub,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { IconBaseProps } from "react-icons";

interface ContactInfo {
  label: string;
  value: string;
  href?: string;
  icon: React.ReactNode;
}

const FaLinkedinIcon = FaLinkedin as React.FunctionComponent<IconBaseProps>;
const FaGithubIcon = FaGithub as React.FunctionComponent<IconBaseProps>;
const FaEnvelopeIcon = FaEnvelope as React.FunctionComponent<IconBaseProps>;
const FaPhoneAltIcon = FaPhoneAlt as React.FunctionComponent<IconBaseProps>;
const FaMapMarkerAltIcon =
  FaMapMarkerAlt as React.FunctionComponent<IconBaseProps>;

const contactItems: ContactInfo[] = [
  {
    label: "Email",
    value: "Rkdian118@gmail.com",
    href: "mailto:Rkdian118@gmail.com",
    icon: <FaEnvelopeIcon />,
  },
  {
    label: "Phone",
    value: "+91 8109775647",
    href: "tel:+918109775647",
    icon: <FaPhoneAltIcon />,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/dhanraj-vishwakarma",
    href: "https://www.linkedin.com/in/dhanraj-vishwakarma/",
    icon: <FaLinkedinIcon />,
  },
  {
    label: "GitHub",
    value: "github.com/rkdian118",
    href: "https://github.com/rkdian118",
    icon: <FaGithubIcon />,
  },
  {
    label: "Location",
    value: "Nandbaag Colony, Indore, M.P.",
    icon: <FaMapMarkerAltIcon />,
  },
];

const Contact: React.FC = () => {
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
