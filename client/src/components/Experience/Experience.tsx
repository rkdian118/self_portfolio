import React, { useEffect } from "react";
import { usePortfolioStore } from "../../store/portfolioStore";
import LoadingSkeleton from "../LoadingSkeleton/LoadingSkeleton";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import "./Experience.css";

const Experience: React.FC = () => {
  const { experiences, loading, errors, fetchExperiences } =
    usePortfolioStore();

  useEffect(() => {
    if (experiences?.length === 0) {
      fetchExperiences({ limit: 20 });
    }
  }, [experiences?.length, fetchExperiences]);

  const handleCompanyClick = (website: string) => {
    if (website) {
      window.open(website, "_blank", "noopener,noreferrer");
    }
  };

  // Show loading skeleton while fetching
  if (loading.experiences) {
    return (
      <section className="experience-section" id="experience">
        <h2 className="experience-header">Professional Journey</h2>
        <LoadingSkeleton type="experience" count={5} />
      </section>
    );
  }

  // Show error if fetch failed
  if (errors.experiences) {
    return (
      <section className="experience-section" id="experience">
        <h2 className="experience-header">Professional Journey</h2>
        <ErrorMessage
          message={errors.experiences}
          onRetry={() => fetchExperiences({ limit: 20 })}
          type="error"
        />
      </section>
    );
  }

  // Show message if no experiences
  if (experiences?.length === 0) {
    return (
      <section className="experience-section" id="experience">
        <h2 className="experience-header">Professional Journey</h2>
        <ErrorMessage
          message="No work experience available at the moment"
          type="info"
        />
      </section>
    );
  }

  return (
    <section id="experience" className="experience-section">
      <h2 className="experience-header">Professional Journey</h2>

      <div className="timeline">
        {experiences.map((exp) => (
          <div
            key={exp._id || `${exp.company}-${exp.title}`}
            className="timeline-item"
          >
            <span className="timeline-dot" />
            <div className="timeline-content">
              <div className="timeline-title-row">
                <div className="timeline-main">
                  <span className="timeline-title">{exp.title}</span>
                  <h4
                    onClick={() => handleCompanyClick(exp.website)}
                    style={{ cursor: exp.website ? "pointer" : "default" }}
                    title={exp.website ? "Click to visit company website" : ""}
                    className="timeline-company"
                  >
                    @ {exp.company}
                  </h4>
                  <span className="timeline-location"> • {exp.location}</span>
                </div>
              </div>
              <span className="timeline-duration">{exp.duration}</span>
              <p className="timeline-description">{exp.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
