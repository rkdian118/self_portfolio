import { IconType } from "react-icons";
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

// Icon mapping object
export const iconMap: Record<string, IconType> = {
  IoLogoJavascript: IoLogoJavascript,
  FaAws: FaAws,
  FaReact: FaReact,
  FaNodeJs: FaNodeJs,
  FaDigitalOcean: FaDigitalOcean,
  FaJira: FaJira,
  FaTrello: FaTrello,
  FaCcStripe: FaCcStripe,
  FaBitbucket: FaBitbucket,
  RiNextjsFill: RiNextjsFill,
  SiTypescript: SiTypescript,
  SiMongodb: SiMongodb,
  SiPostgresql: SiPostgresql,
  SiGit: SiGit,
  SiMysql: SiMysql,
  SiGooglecloud: SiGooglecloud,
  SiLodash: SiLodash,
  SiExpress: SiExpress,
  SiSocketdotio: SiSocketdotio,
  SiClickup: SiClickup,
  SiAmazondynamodb: SiAmazondynamodb,
  SiAmazonec2: SiAmazonec2,
  SiAmazons3: SiAmazons3,
  SiAmazonroute53: SiAmazonroute53,
  SiAmazondocumentdb: SiAmazondocumentdb,
  SiAmazonsqs: SiAmazonsqs,
  SiAmazonsimpleemailservice: SiAmazonsimpleemailservice,
  SiAmazonelasticache: SiAmazonelasticache,
};

// Get icon by name
export const getIcon = (iconName: string): IconType | null =>
  iconMap[iconName] || null;

export const hasIcon = (iconName: string): boolean => iconName in iconMap;

// // Fallback icon component
// export const DefaultIcon: IconType = (props) => (
//   <div
//     style={{
//       width: props.size ?? 24,
//       height: props.size ?? 24,
//       backgroundColor: "#ddd",
//       borderRadius: 4,
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       fontSize: (props.size ?? 24) / 2,
//       color: props.color ?? "#666",
//     }}
//   >
//     ?
//   </div>
// );
