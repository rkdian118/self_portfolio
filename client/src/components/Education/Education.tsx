import React, { useEffect } from "react";
import { usePortfolioStore } from "../../store/portfolioStore";
import LoadingSkeleton from "../LoadingSkeleton/LoadingSkeleton";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import "./Education.css";

const Education: React.FC = () => {
  const { education, loading, errors, fetchEducation } = usePortfolioStore();

  useEffect(() => {
    if (!education || education.length === 0) {
      fetchEducation({ limit: 20 });
    }
  }, [education, fetchEducation]);

  // Show loading skeleton while fetching
  if (loading.education) {
    return (
      <section className="education-section" id="education">
        <h2 className="education-header">Academic Journey</h2>
        <LoadingSkeleton type="education" count={3} />
      </section>
    );
  }

  // Show error if fetch failed
  if (errors.education) {
    return (
      <section className="education-section" id="education">
        <h2 className="education-header">Academic Journey</h2>
        <ErrorMessage
          message={errors.education}
          onRetry={() => fetchEducation({ limit: 20 })}
          type="error"
        />
      </section>
    );
  }

  // Show message if no education data
  if (!education || education.length === 0) {
    return (
      <section className="education-section" id="education">
        <h2 className="education-header">Academic Journey</h2>
        <ErrorMessage
          message="No education information available at the moment"
          type="info"
        />
      </section>
    );
  }

  return (
    <section id="education" className="education-section">
      <h2 className="education-header">Academic Journey</h2>
      <div className="education-grid">
        {education?.map((edu) => (
          <div key={edu._id} className="education-card">
            <h3 className="education-degree">{edu.degree}</h3>
            <p className="education-institution">
              {edu.institution}, {edu.location}
            </p>
            <span className="education-duration">{edu.duration}</span>
            {edu.description && (
              <p className="education-description">{edu.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Education;
