import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { motion } from "framer-motion";
import styles from "../styles";
import { experiences } from "../constants";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";
const ExperienceCard = ({ experience }) => {
  return (
    <VerticalTimelineElement
      contentStyle={{ 
        background: "#1a237e", 
        color: "#fff",
        boxShadow: "0 3px 0 #0ea5e9",
        border: "1px solid #1e40af"
      }}
      contentArrowStyle={{ borderRight: "7px solid #0ea5e9" }}
      date={experience.date}
      iconStyle={{ 
        background: experience.iconBg,
        boxShadow: "0 0 0 4px #0ea5e9, inset 0 2px 0 rgba(0,0,0,.08), 0 3px 0 4px rgba(0,0,0,.05)"
      }}
      icon={
        <div className="flex justify-center items-center w-full h-full">
          <img
            src={experience.icon}
            alt={experience.company_name}
            className="w-[60%] h-[60%]"
          />
        </div>
      }
    >
      <div>
        <h3 className="text-white text-[24px]">{experience.title}</h3>
        <p className="text-secondary text-[16px] font-semibold" style={{margin:0}}>{experience.company_name}</p>
      </div>
      <ul className="mt-5 list-disc ml-5 space-y-2">
        {experience.points.map((point,index)=>(
          <li key={`experience-point-${index}-${experience.company_name}`}
          className="text-white-100 text-[14px] pl-1 tracking-wider">
            {point}
          </li>
        ))}
      </ul>
    </VerticalTimelineElement>
  );
};
const Experience = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.styles.sectionSubText}>What I have done so far</p>
        <h2 className={styles.styles.heroHeadText}>Work Experience</h2>
      </motion.div>
      <div className="mt-20 flex flex-col">
        <VerticalTimeline>
          {experiences.map((experience, index) => (
            <ExperienceCard key={index} experience={experience} />
          ))}
        </VerticalTimeline>
      </div>
    </>
  );
};

export default SectionWrapper(Experience, "work");
