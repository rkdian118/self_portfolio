import React, { useEffect } from "react";
import { usePortfolioStore } from "../../store/portfolioStore";
import LoadingSkeleton from "../LoadingSkeleton/LoadingSkeleton";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import "./Projects.css";

const Projects: React.FC = () => {
  const { projects, loading, errors, fetchProjects } = usePortfolioStore();

  useEffect(() => {
    if (projects?.length === 0) {
      fetchProjects({ limit: 20 });
    }
  }, [projects?.length, fetchProjects]);

  const handleProjectClick = (website: string) => {
    if (website) {
      window.open(website, "_blank", "noopener,noreferrer");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, website: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleProjectClick(website);
    }
  };

  // Show loading skeleton while fetching
  if (loading.projects) {
    return (
      <section className="projects-section" id="projects">
        <div className="container">
          <h2 className="projects-header">Creations & Work</h2>
          <LoadingSkeleton type="project" count={3} />
        </div>
      </section>
    );
  }

  // Show error if fetch failed
  if (errors.projects) {
    return (
      <section className="projects-section" id="projects">
        <div className="container">
          <h2 className="projects-header">Creations & Work</h2>
          <ErrorMessage
            message={errors.projects}
            onRetry={() => fetchProjects({ limit: 20 })}
            type="error"
          />
        </div>
      </section>
    );
  }

  // Show message if no projects
  if (projects?.length === 0) {
    return (
      <section className="projects-section" id="projects">
        <div className="container">
          <h2 className="projects-header">Creations & Work</h2>
          <ErrorMessage
            message="No projects available at the moment"
            type="info"
          />
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="projects-section">
      <h2 className="projects-header">Creations & Work</h2>
      <div className="projects-list">
        {projects.map((project) => (
          <div
            key={project._id || project.name}
            className="project-item"
            role="button"
            tabIndex={0}
            onClick={() => handleProjectClick(project.website)}
            aria-label={`View ${project.name} project`}
            onKeyDown={(e) => handleKeyDown(e, project.website)}
          >
            <h3 className="project-name">{project.name}</h3>
            <span className="project-duration">{project.duration}</span>
            <p className="project-description">{project.description}</p>
            <p className="project-skills">
              <strong>Skills used:</strong> {project.skills}
            </p>
            {/* {project.website && (
              <span className="project-link-indicator">Click to view →</span>
            )} */}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
