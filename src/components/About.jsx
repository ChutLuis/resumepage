import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import styles from "../styles";
import { services } from "../constants";
import { fadeIn, } from "../utils/motion";
import { SectionWrapper } from "../hoc";
const ServiceCard = ({ index, title, icon }) => {
  return (
    <Tilt className="xs:w-[250px] w-full">
      <motion.div
        variants={fadeIn("right", "spring", 0.5 * index, 0.75)}
        className="w-full cyan-blue-gradient p-[1px] rounded-[20px] shadow-card hover:shadow-blue-glow transition-shadow duration-300"
      >
        
        <div options={{ max: 45, scale: 1, speed: 450 }} className="bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col group-hover:bg-black-100 transition-colors duration-300">
          <img src={icon} alt={title} className="w-16 h-16 object-contain" />
          <h3 className="text-white text-[20px] font-bold text-center">{title}</h3>
        </div>
      </motion.div>
    </Tilt>
  );
};

const About = () => {
  return (
    <>
      <motion.div>
        <p className={styles.styles.sectionSubText}>Introduction</p>
        <h2 className={styles.styles.heroHeadText}>Overview</h2>
      </motion.div>
      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-secondary text-[17px] max-w-7xl leadin-[30px] text-justify"
      >
        I am Luis Ortiz, a full-stack developer and UI/UX designer who partners with businesses 
        to build custom web applications from concept to launch. Specializing in creating engaging 
        user experiences with modern technologies like React, NestJS, and Web AR, I have a proven 
        ability to deliver robust, innovative, and user-centered solutions that drive business results. 
        Currently working as a Senior Applications Developer at TELUS Digital Solutions, I architect 
        and implement key enhancements for native mobile applications while contributing to strategic 
        migrations to React Native. I hold a Bachelor of Engineering in Computers and Systems from 
        Universidad Rafael Landivar and am proficient in JavaScript, TypeScript, React, NestJS, Express, 
        PostgreSQL, and MySQL. With expertise in UI/UX design using Figma, cloud platforms (AWS), and 
        data analysis, I am bilingual in English (C2) and Spanish (Native), highly motivated to deliver 
        exceptional software solutions.
      </motion.p>
      <div className="mt-20 flex flex-wrap gap-10">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default  SectionWrapper(About,"about");
