import React from "react";
import "./Projects.css";

interface ProjectItem {
  id: number;
  name: string;
  description: string;
  duration: string;
  skills: string;
  website: string;
}

const projects: ProjectItem[] = [
  {
    id: 1,
    name: "Easy2Show",
    description:
      "Designed and implemented a scalable microservices architecture integrating MySQL for efficient data management. Maintained RESTful APIs with a focus on performance and reliability. Implemented CI/CD pipelines to automate testing and deployment. Deployed applications on Google Cloud services, leveraging Chart.js for data visualization. Collaborated effectively within cross-functional teams to deliver a robust product.",
    duration: "May 2022 – Oct 2022",
    skills:
      "Node.js, Express.js, React.js, MySQL, Lodash, Google Cloud, Chart.js, Microservices",
    website: "https://easy2show.com",
  },
  {
    id: 2,
    name: "Clide-X Lead Management System (LMS)",
    description:
      "Developed a robust lead management system to streamline business processes. Enabled business development executives to effectively input and differentiate fresh and existing leads. Implemented admin features for API-driven import/export of employees and leads with efficient duplicate management. Enabled seamless lead transfers between employees, enhancing flexibility and workflow efficiency.",
    duration: "May 2023 – Jun 2023",
    skills:
      "Node.js, Express.js, MongoDB, React.js, MySQL, Lodash, AWS EC2, S3, RDS, Route 53",
    website: "https://newlms.webmobril.com",
  },
  {
    id: 3,
    name: "Living Rich",
    description:
      "Developed a comprehensive financial management mobile app with features such as expense tracking, income management, and personalized goal setting. Allowed users to input living arrangements, family details, pets, and monthly income. The app intelligently allocates 10% of monthly income towards personalized goals like saving for a car or vacation, helping users efficiently meet their financial aspirations.",
    duration: "Aug 2023 – Mar 2024",
    skills: "Node.js, Express.js, React.js, MongoDB, AWS EC2, Route 53, Nginx",
    website: "https://livingrich.com",
  },
];

const Projects: React.FC = () => {
  return (
    <section id="projects" className="projects-section">
      <h2 className="projects-header">Creations & Work</h2>
      <div className="projects-list">
        {projects.map(
          ({ id, name, description, website, duration, skills }) => (
            <div
              key={id}
              className="project-item"
              role="link"
              tabIndex={0}
              onClick={() =>
                window.open(website, "_blank", "noopener,noreferrer")
              }
              onKeyDown={(e) =>
                e.key === "Enter" &&
                window.open(website, "_blank", "noopener,noreferrer")
              }
            >
              <h3 className="project-name">{name}</h3>
              <span className="project-duration">{duration}</span>
              <p className="project-description">{description}</p>
              <p className="project-skills">
                <strong>Skills used:</strong> {skills}
              </p>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Projects;
