import React from "react";
import { IconBaseProps } from "react-icons";
import {
  FaAws,
  FaReact,
  FaNodeJs,
  FaDigitalOcean,
  FaJira,
  FaTrello,
  FaCcStripe,
  FaBitbucket,
} from "react-icons/fa";
import { RiNextjsFill } from "react-icons/ri";
import {
  SiTypescript,
  SiMongodb,
  SiPostgresql,
  SiGit,
  SiMysql,
  SiGooglecloud,
  SiLodash,
  SiExpress,
  SiSocketdotio,
  SiClickup,
  SiAmazondynamodb,
  SiAmazonec2,
  SiAmazons3,
  SiAmazonroute53,
  SiAmazondocumentdb,
  SiAmazonsqs,
  SiAmazonsimpleemailservice,
  SiAmazonelasticache,
} from "react-icons/si";
import { IoLogoJavascript } from "react-icons/io";

import "./Technologies.css";

// Dynamic array with all icons, labels, and brand colors
const technologies: {
  Icon: React.FunctionComponent<IconBaseProps>;
  label: string;
  color: string;
}[] = [
  {
    Icon: IoLogoJavascript as React.FunctionComponent<IconBaseProps>,
    label: "JavaScript",
    color: "#F0DB4F",
  },
  {
    Icon: SiTypescript as React.FunctionComponent<IconBaseProps>,
    label: "TypeScript",
    color: "#3178C6",
  },
  {
    Icon: FaNodeJs as React.FunctionComponent<IconBaseProps>,
    label: "Node.js",
    color: "#339933",
  },
  {
    Icon: SiExpress as React.FunctionComponent<IconBaseProps>,
    label: "Express.js",
    color: "blue",
  },
  {
    Icon: FaReact as React.FunctionComponent<IconBaseProps>,
    label: "React",
    color: "#61DAFB",
  },
  {
    Icon: RiNextjsFill as React.FunctionComponent<IconBaseProps>,
    label: "Next.js",
    color: "yellow",
  },
  {
    Icon: FaAws as React.FunctionComponent<IconBaseProps>,
    label: "AWS",
    color: "#FF9900",
  },
  {
    Icon: SiGooglecloud as React.FunctionComponent<IconBaseProps>,
    label: "Google Cloud",
    color: "#4285F4",
  },
  {
    Icon: FaDigitalOcean as React.FunctionComponent<IconBaseProps>,
    label: "DigitalOcean",
    color: "#0080FF",
  },
  {
    Icon: SiAmazondynamodb as React.FunctionComponent<IconBaseProps>,
    label: "DynamoDB",
    color: "#4053D6",
  },
  {
    Icon: SiAmazons3 as React.FunctionComponent<IconBaseProps>,
    label: "S3",
    color: "#569A31",
  },
  {
    Icon: SiAmazonec2 as React.FunctionComponent<IconBaseProps>,
    label: "EC2",
    color: "#FF9900",
  },
  {
    Icon: SiAmazonroute53 as React.FunctionComponent<IconBaseProps>,
    label: "Route53",
    color: "#FF9900",
  },
  {
    Icon: SiAmazondocumentdb as React.FunctionComponent<IconBaseProps>,
    label: "DocumentDB",
    color: "#4053D6",
  },
  {
    Icon: SiAmazonsqs as React.FunctionComponent<IconBaseProps>,
    label: "SQS",
    color: "#FF9900",
  },
  {
    Icon: SiAmazonsimpleemailservice as React.FunctionComponent<IconBaseProps>,
    label: "SES",
    color: "#FF9900",
  },
  {
    Icon: SiAmazonelasticache as React.FunctionComponent<IconBaseProps>,
    label: "ElastiCache",
    color: "#FF9900",
  },
  {
    Icon: SiMongodb as React.FunctionComponent<IconBaseProps>,
    label: "MongoDB",
    color: "#47A248",
  },
  {
    Icon: SiPostgresql as React.FunctionComponent<IconBaseProps>,
    label: "PostgreSQL",
    color: "#336791",
  },
  {
    Icon: SiMysql as React.FunctionComponent<IconBaseProps>,
    label: "MySQL",
    color: "#4479A1",
  },
  {
    Icon: SiGit as React.FunctionComponent<IconBaseProps>,
    label: "Git",
    color: "#F05032",
  },
  {
    Icon: FaBitbucket as React.FunctionComponent<IconBaseProps>,
    label: "BitBucket",
    color: "blue",
  },
  {
    Icon: SiLodash as React.FunctionComponent<IconBaseProps>,
    label: "Lodash",
    color: "#3492FF",
  },
  {
    Icon: SiSocketdotio as React.FunctionComponent<IconBaseProps>,
    label: "Socket.io",
    color: "green",
  },
  {
    Icon: FaJira as React.FunctionComponent<IconBaseProps>,
    label: "Jira",
    color: "#0052CC",
  },
  {
    Icon: FaTrello as React.FunctionComponent<IconBaseProps>,
    label: "Trello",
    color: "#0079BF",
  },
  {
    Icon: FaCcStripe as React.FunctionComponent<IconBaseProps>,
    label: "Stripe",
    color: "#635BFF",
  },
  {
    Icon: SiClickup as React.FunctionComponent<IconBaseProps>,
    label: "ClickUp",
    color: "#7B68EE",
  },
];

const Technologies: React.FC = () => {
  return (
    <section id="skills" className="technologies-section">
      <h3 className="tech-header">Toolkit of Choice</h3>
      <div className="tech-icons">
        {technologies.map(({ Icon, label, color }) => (
          <div className="tech-card" key={label}>
            <Icon size={32} color={color} />
            <span className="tech-label">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Technologies;
