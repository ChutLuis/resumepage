import { Tilt } from "react-tilt";
import { motion, Variants } from "framer-motion";
import styles from "../styles";
import { services } from "../constants";
import { fadeIn } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import type { Service } from "../types";

interface ServiceCardProps extends Service {
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ index, title, icon }) => {
  return (
    <Tilt className="xs:w-[250px] w-full">
      <motion.div
        variants={fadeIn("right", "spring", 0.5 * index, 0.75) as Variants}
        className="w-full cyan-blue-gradient p-[1px] rounded-[20px] shadow-card hover:shadow-blue-glow transition-shadow duration-300"
      >
        
        <div className="bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col group-hover:bg-black-100 transition-colors duration-300">
          <img src={icon} alt={title} className="w-16 h-16 object-contain" />
          <h3 className="text-white text-[20px] font-bold text-center">{title}</h3>
        </div>
      </motion.div>
    </Tilt>
  );
};

const About: React.FC = () => {
  return (
    <>
      <motion.div>
        <p className={styles.styles.sectionSubText}>Introduction</p>
        <h2 className={styles.styles.heroHeadText}>Overview</h2>
      </motion.div>
      <motion.div
        variants={fadeIn("", "spring", 0.1, 1) as Variants}
        className="mt-4 text-secondary text-[17px] max-w-7xl leading-[30px] space-y-4"
      >
        <p>
          I'm a full-stack developer specializing in building modern web applications with React,
          TypeScript, and Node.js. Currently working as a <span className="text-white font-medium">Senior Applications Developer
          at TELUS Digital Solutions</span>, I architect and implement enhancements for native mobile applications
          while leading strategic migrations to React Native.
        </p>
        
        <p>
          I bring <span className="text-white font-medium">4+ years of professional experience</span> delivering
          full-stack solutions across multiple industries, from enterprise applications to interactive Web AR experiences.
          My expertise spans modern frontend frameworks (React, Vue, Angular), backend development (NestJS, Express),
          cloud infrastructure (AWS), and UI/UX design.
        </p>
        
        <p>
          I hold a Bachelor of Engineering in Computers and Systems from Universidad Rafael Landivar and am
          bilingual in English (C2) and Spanish (Native). Let's build something impactful together.
        </p>
      </motion.div>
      <div className="mt-20 flex flex-wrap gap-10">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");