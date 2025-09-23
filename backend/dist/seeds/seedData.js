"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = void 0;
const Admin_1 = require("../models/Admin");
const Hero_1 = require("../models/Hero");
const Project_1 = require("../models/Project");
const Experience_1 = require("../models/Experience");
const Education_1 = require("../models/Education");
const Contact_1 = require("../models/Contact");
const database_1 = require("../config/database");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const seedDatabase = async () => {
    try {
        await (0, database_1.connectDB)();
        await Promise.all([
            Admin_1.Admin.deleteMany({}),
            Hero_1.Hero.deleteMany({}),
            Project_1.Project.deleteMany({}),
            Experience_1.Experience.deleteMany({}),
            Education_1.Education.deleteMany({}),
            Contact_1.Contact.deleteMany({}),
        ]);
        console.log("🗑️  Cleared existing data");
        const admin = await Admin_1.Admin.create({
            name: "Admin User",
            email: process.env.ADMIN_EMAIL || "admin@portfolio.com",
            password: process.env.ADMIN_PASSWORD || "SecurePassword123!",
            role: "super-admin",
            websiteLogo: "http://localhost:5000/uploads/logo.png",
        });
        console.log("👤 Admin user created");
        const hero = await Hero_1.Hero.create({
            name: "Dhanraj Vishwakarma",
            title: "Full Stack Developer (MERN Stack)",
            bio: "I am a passionate Full-Stack Developer with over 4 years of experience building scalable web applications and innovative digital solutions. I specialize in Node.js, TypeScript, and React, with hands-on experience in MongoDB, SQL databases, and cloud services. My work focuses on creating robust backend systems, intuitive frontend interfaces, and seamless integrations that solve real-world problems. I enjoy taking ideas from concept to deployment, leveraging modern technologies and best practices to deliver efficient, maintainable, and high-performing applications. Beyond coding, I actively contribute to open-source projects and continuously explore emerging tools and frameworks to stay ahead in the ever-evolving tech landscape. When I’m not writing code, I love learning about new tech trends, optimizing workflows, and experimenting with personal projects that combine creativity with technology.",
            yearsExperience: 4.5,
            profileImage: "https://avatar.iran.liara.run/public/28",
            cvUrl: "https://drive.google.com/uc?export=download&id=1r5bX6Yk1n8b0u3jz8Fqj5c6H7x9y2zA1",
        });
        console.log("🦸 Hero data created");
        const projects = await Project_1.Project.insertMany([
            {
                name: "Easy2Show",
                description: "Designed and implemented a scalable microservices architecture integrating MySQL for efficient data management. Maintained RESTful APIs with a focus on performance and reliability. Implemented CI/CD pipelines to automate testing and deployment. Deployed applications on Google Cloud services, leveraging Chart.js for data visualization. Collaborated effectively within cross-functional teams to deliver a robust product.",
                duration: "May 2022 – Oct 2022",
                skills: "Node.js, Express.js, React.js, MySQL, Lodash, Google Cloud, Chart.js, Microservices",
                website: "https://easy2show.com",
                order: 1,
            },
            {
                name: "Clide-X Lead Management System (LMS)",
                description: "Developed a robust lead management system to streamline business processes. Enabled business development executives to effectively input and differentiate fresh and existing leads. Implemented admin features for API-driven import/export of employees and leads with efficient duplicate management. Enabled seamless lead transfers between employees, enhancing flexibility and workflow efficiency.",
                duration: "May 2023 – Jun 2023",
                skills: "Node.js, Express.js, MongoDB, React.js, MySQL, Lodash, AWS EC2, S3, RDS, Route 53",
                website: "https://newlms.webmobril.com",
                order: 2,
            },
            {
                name: "Living Rich",
                description: "Developed a comprehensive financial management mobile app with features such as expense tracking, income management, and personalized goal setting. Allowed users to input living arrangements, family details, pets, and monthly income. The app intelligently allocates 10% of monthly income towards personalized goals like saving for a car or vacation, helping users efficiently meet their financial aspirations.",
                duration: "Aug 2023 – Mar 2024",
                skills: "Node.js, Express.js, React.js, MongoDB, AWS EC2, Route 53, Nginx",
                website: "https://livingrich.com",
                order: 3,
            },
        ]);
        console.log("🚀 Projects seeded");
        const experiences = await Experience_1.Experience.insertMany([
            {
                title: "Full Stack Developer (MERN Stack)",
                company: "MindCrew Technologies",
                website: "https://www.mindcrewtech.com/",
                duration: "Aug 2024 - Present",
                location: "Indore, India",
                description: "Designed and implemented a scalable microservices architecture to enhance modularity and maintainability of applications. Managed and integrated highly available MongoDB databases ensuring data consistency.",
                order: 1,
            },
            {
                title: "Node.js Backend Developer",
                company: "Community Heritage Pvt. Ltd.",
                website: "https://www.communityheritage.in/",
                duration: "May 2024 - Jul 2024",
                location: "Ahmedabad, India",
                description: "Collaborated actively with clients and internal teams to gather detailed user requirements and translate these into technical solutions.",
                order: 2,
            },
            {
                order: 3,
                title: "Software Developer (Backend)",
                company: "Webmobril Gaming Studioz",
                website: "https://www.webmobril.com/",
                duration: "Mar 2023 - Apr 2024",
                location: "Indore, India",
                description: "Contributed to backend development for gaming and entertainment web applications, focusing on writing clean, efficient, and maintainable code using Node.js. Collaborated intensively with frontend developers to synchronize server-side logic with user-interface components for seamless integration and enhanced user experience. Played an essential role in the entire application development lifecycle from requirements gathering, coding, testing to deployment. Addressed complex technical challenges by optimizing backend operations and maintaining code quality standards. Ensured the applications adhered to security best practices and performance benchmarks.",
            },
            {
                order: 4,
                title: "Backend Developer (Node.js)",
                company: "Saturncube Technologies",
                website: "https://www.saturncube.com/",
                duration: "Jan 2022 - Mar 2023",
                location: "Ahmedabad, India",
                description: "Built reusable and modular Node.js libraries to streamline development across multiple projects, enhancing code reusability and maintainability. Collaborated closely with developers, designers, and system administrators to identify and implement new product features. Managed and improved legacy applications through the adoption of modern technologies and best practices. Demonstrated deep understanding of the entire web development process, from backend database merging to microservices architecture design. Developed and maintained complex database operations and ensured smooth communication between microservices to support scalable backend infrastructure.",
            },
            {
                order: 5,
                title: "Junior Node.js Developer",
                company: "Havfly Services",
                website: "https://www.havfly.com/",
                duration: "Jun 2021 - Dec 2021",
                location: "Haryana, India",
                description: "Integrated frontend-developed UI components with backend server-side logic using Node.js, ensuring smooth data flow and user interaction. Authored reusable, testable, and efficient backend code with attention to performance and scalability. Designed and implemented low-latency and highly available Node.js applications focused on operational excellence. Took active measures to implement security protocols and data protection techniques, safeguarding sensitive user information and maintaining compliance with standards. Engaged in debugging, testing, and deploying APIs and backend services.",
            },
        ]);
        console.log("💼 Experience seeded");
        const education = await Education_1.Education.insertMany([
            {
                degree: "B.E. in Computer Science",
                institution: "Rajiv Gandhi Proudyogiki Vishwavidyalaya",
                duration: "Jul 2014 – Dec 2018",
                location: "Indore, India",
                order: 1,
            },
            {
                degree: "Intermediate (12th)",
                institution: "Ideal Academy",
                duration: "Jul 2013 – Apr 2014",
                location: "Indore, India",
                order: 2,
            },
            {
                degree: "Intermediate (12th)",
                institution: "Ideal Academy",
                duration: "Jul 2010 – Apr 2011",
                location: "Indore, India",
                order: 3,
            },
        ]);
        console.log("🎓 Education seeded");
        const contact = await Contact_1.Contact.create({
            email: "Rkdian118@gmail.com",
            phone: "+91 8109775647",
            linkedin: "https://www.linkedin.com/in/dhanraj-vishwakarma/",
            github: "https://github.com/rkdian118",
            location: "153/3, sector C, Nandbaag Colony, Indore, M.P.",
        });
        console.log("📞 Contact seeded");
        console.log("\\n✅ Database seeded successfully!");
        console.log(`\\n🔑 Admin credentials:`);
        console.log(`Email: ${admin.email}`);
        console.log(`Password: ${process.env.ADMIN_PASSWORD || "SecurePassword123!"}`);
        await (0, database_1.disconnectDB)();
    }
    catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
};
exports.seedDatabase = seedDatabase;
if (require.main === module) {
    seedDatabase();
}
//# sourceMappingURL=seedData.js.map