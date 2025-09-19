import React from "react";
import "./Experience.css";

interface ExperienceItem {
  id: number;
  title: string;
  company: string;
  website: string;
  duration: string;
  location: string;
  description: string;
}

const experiences: ExperienceItem[] = [
  {
    id: 1,
    title: "Full Stack Developer (MERN Stack)",
    company: "MindCrew Technologies",
    website: "https://www.mindcrewtech.com/",
    duration: "Jul 2024 – Present",
    location: "Indore, India",
    description:
      "Designed and implemented a scalable microservices architecture to enhance modularity and maintainability of applications. Managed and integrated highly available MongoDB databases ensuring data consistency and optimized queries. Developed and maintained RESTful APIs using Node.js and Express, improving API performance and security. Implemented automated continuous integration and deployment (CI/CD) pipelines, reducing deployment time significantly. Collaborated across cross-functional agile teams using Git for version control and code reviews. Deployed multiple complex applications on AWS infrastructure including EC2, S3, RDS, and Route 53 services, optimizing cloud resource usage and cost. Continuously researched and integrated new technologies to enhance system performance and maintainability.",
  },
  {
    id: 2,
    title: "Node.js Backend Developer",
    company: "Community Heritage Pvt. Ltd.",
    website: "https://www.communityheritage.in/",
    duration: "May 2024 – Jul 2024",
    location: "Ahmedabad, India",
    description:
      "Collaborated actively with clients and internal teams to gather detailed user requirements and translate these into technical solutions. Participated in the full software development lifecycle, emphasizing clean and efficient coding practices using Node.js and Express. Developed functional and reliable backend web applications with a focus on debugging and performance optimization. Seamlessly integrated frontend user-facing components with robust server-side logic ensuring responsive and user-friendly applications. Worked closely with UI/UX teams to address technical and design aspects, resulting in deliverables that met project goals and timelines.",
  },
  {
    id: 3,
    title: "Software Developer (Backend)",
    company: "Webmobril Gaming Studioz",
    website: "https://www.webmobril.com/",
    duration: "Mar 2023 – Apr 2024",
    location: "Indore, India",
    description:
      "Contributed to backend development for gaming and entertainment web applications, focusing on writing clean, efficient, and maintainable code using Node.js. Collaborated intensively with frontend developers to synchronize server-side logic with user-interface components for seamless integration and enhanced user experience. Played an essential role in the entire application development lifecycle from requirements gathering, coding, testing to deployment. Addressed complex technical challenges by optimizing backend operations and maintaining code quality standards. Ensured the applications adhered to security best practices and performance benchmarks.",
  },
  {
    id: 4,
    title: "Backend Developer (Node.js)",
    company: "Saturncube Technologies",
    website: "https://www.saturncube.com/",
    duration: "Jan 2022 – Mar 2023",
    location: "Ahmedabad, India",
    description:
      "Built reusable and modular Node.js libraries to streamline development across multiple projects, enhancing code reusability and maintainability. Collaborated closely with developers, designers, and system administrators to identify and implement new product features. Managed and improved legacy applications through the adoption of modern technologies and best practices. Demonstrated deep understanding of the entire web development process, from backend database merging to microservices architecture design. Developed and maintained complex database operations and ensured smooth communication between microservices to support scalable backend infrastructure.",
  },
  {
    id: 5,
    title: "Junior Node.js Developer",
    company: "Havfly Services",
    website: "https://www.havfly.com/",
    duration: "Jun 2021 – Dec 2021",
    location: "Haryana, India",
    description:
      "Integrated frontend-developed UI components with backend server-side logic using Node.js, ensuring smooth data flow and user interaction. Authored reusable, testable, and efficient backend code with attention to performance and scalability. Designed and implemented low-latency and highly available Node.js applications focused on operational excellence. Took active measures to implement security protocols and data protection techniques, safeguarding sensitive user information and maintaining compliance with standards. Engaged in debugging, testing, and deploying APIs and backend services.",
  },
];

const Experience: React.FC = () => {
  return (
    <section id="experience" className="experience-section">
      <h2 className="experience-header">Professional Journey</h2>

      <div className="timeline">
        {experiences.map(
          ({
            id,
            title,
            company,
            website,
            duration,
            location,
            description,
          }) => (
            <div key={id} className="timeline-item">
              <span className="timeline-dot" />
              <div className="timeline-content">
                <div className="timeline-title-row">
                  <div className="timeline-main">
                    <span className="timeline-title">{title}</span>
                    <a
                      href={website}
                      className="timeline-company"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @ {company}
                    </a>
                    <span className="timeline-location"> • {location}</span>
                  </div>
                </div>
                <span className="timeline-duration">{duration}</span>
                <p className="timeline-description">{description}</p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Experience;
