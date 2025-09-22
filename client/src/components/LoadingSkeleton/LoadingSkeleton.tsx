import React from "react";
import "./LoadingSkeleton.css";

interface LoadingSkeletonProps {
  type: "hero" | "project" | "experience" | "education" | "contact";
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type,
  count = 1,
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case "hero":
        return (
          <div className="skeleton-hero">
            <div className="skeleton-line skeleton-title"></div>
            <div className="skeleton-line skeleton-subtitle"></div>
            <div className="skeleton-line skeleton-text"></div>
            <div className="skeleton-line skeleton-text short"></div>
            <div className="skeleton-buttons">
              <div className="skeleton-button"></div>
              <div className="skeleton-button"></div>
            </div>
          </div>
        );

      case "project":
        return (
          <div className="skeleton-projects">
            {Array.from({ length: count }, (_, i) => (
              <div key={i} className="skeleton-project-item">
                <div className="skeleton-line skeleton-project-title"></div>
                <div className="skeleton-line skeleton-project-duration"></div>
                <div className="skeleton-line skeleton-text"></div>
                <div className="skeleton-line skeleton-text"></div>
                <div className="skeleton-line skeleton-text short"></div>
              </div>
            ))}
          </div>
        );

      case "experience":
        return (
          <div className="skeleton-experiences">
            {Array.from({ length: count }, (_, i) => (
              <div key={i} className="skeleton-experience-item">
                <div className="skeleton-line skeleton-exp-title"></div>
                <div className="skeleton-line skeleton-exp-company"></div>
                <div className="skeleton-line skeleton-exp-duration"></div>
                <div className="skeleton-line skeleton-text"></div>
                <div className="skeleton-line skeleton-text"></div>
              </div>
            ))}
          </div>
        );

      case "education":
        return (
          <div className="skeleton-education">
            {Array.from({ length: count }, (_, i) => (
              <div key={i} className="skeleton-education-item">
                <div className="skeleton-line skeleton-edu-degree"></div>
                <div className="skeleton-line skeleton-edu-institution"></div>
                <div className="skeleton-line skeleton-edu-duration"></div>
              </div>
            ))}
          </div>
        );

      case "contact":
        return (
          <div className="skeleton-contact">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="skeleton-contact-item">
                <div className="skeleton-circle small"></div>
                <div className="skeleton-contact-text">
                  <div className="skeleton-line skeleton-contact-label"></div>
                  <div className="skeleton-line skeleton-contact-value"></div>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return <div className="skeleton-line"></div>;
    }
  };

  return <div className="loading-skeleton">{renderSkeleton()}</div>;
};

export default LoadingSkeleton;
