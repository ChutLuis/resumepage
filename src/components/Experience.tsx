import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { motion, Variants } from "framer-motion";
import styles from "../styles";
import { experiences } from "../constants";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";
import type { Experience as ExperienceType } from "../types";

interface ExperienceCardProps {
  experience: ExperienceType;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
  return (
    <VerticalTimelineElement
      contentStyle={{
        background: "rgba(19, 19, 29, 0.7)",
        backdropFilter: "blur(12px)",
        color: "#ededf6",
        boxShadow: "0 3px 0 #8b5cf6",
        border: "1px solid rgba(139, 92, 246, 0.25)",
        borderRadius: "16px",
      }}
      contentArrowStyle={{ borderRight: "7px solid rgba(139, 92, 246, 0.5)" }}
      date={experience.date}
      iconStyle={{
        background: experience.iconBg,
        boxShadow: "0 0 0 4px #8b5cf6, 0 0 20px rgba(139, 92, 246, 0.4)",
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
        <h3 className="text-heading font-display text-[24px] font-bold">
          {experience.title}
        </h3>
        <p
          className="text-accent-300 text-[16px] font-semibold"
          style={{ margin: 0 }}
        >
          {experience.company_name}
        </p>
      </div>
      <ul className="mt-5 list-disc ml-5 space-y-2">
        {experience.points.map((point, index) => (
          <li
            key={`experience-point-${index}-${experience.company_name}`}
            className="text-body text-[14px] pl-1 tracking-wide marker:text-cyan-400"
          >
            {point}
          </li>
        ))}
      </ul>
    </VerticalTimelineElement>
  );
};

const Experience: React.FC = () => {
  return (
    <>
      <motion.div variants={textVariant() as Variants}>
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