import React from "react";
import "./Education.css";

interface EducationItem {
  id: number;
  degree: string;
  institution: string;
  duration: string;
  location: string;
  description?: string;
}

const education: EducationItem[] = [
  {
    id: 1,
    degree: "B.E. in Computer Science",
    institution: "Rajiv Gandhi Proudyogiki Vishwavidyalaya",
    duration: "Jul 2014 – Dec 2018",
    location: "Indore, India",
    description: undefined, // Add if any description needed
  },
  {
    id: 2,
    degree: "Intermediate (12th)",
    institution: "Ideal Academy",
    duration: "Jul 2013 – Apr 2014",
    location: "Indore, India",
  },
  {
    id: 3,
    degree: "Higher Secondary (10th)",
    institution: "Ideal Academy",
    duration: "Jul 2011 – Apr 2012",
    location: "Indore, India",
  },
];

const Education: React.FC = () => {
  return (
    <section id="education" className="education-section">
      <h2 className="education-header">Academic Journey</h2>
      <div className="education-grid">
        {education.map(
          ({ id, degree, institution, duration, location, description }) => (
            <div key={id} className="education-card">
              <h3 className="education-degree">{degree}</h3>
              <p className="education-institution">
                {institution}, {location}
              </p>
              <span className="education-duration">{duration}</span>
              {description && (
                <p className="education-description">{description}</p>
              )}
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Education;
