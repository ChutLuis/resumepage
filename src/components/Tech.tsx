import { motion, Variants } from "framer-motion";
import styles from "../styles";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { textVariant } from "../utils/motion";
import Marquee from "./ui/Marquee";

const TechChip = ({ tech }: { tech: { name: string; icon: string } }) => (
  <div
    data-cursor="hover"
    className="group mx-3 flex items-center gap-3 rounded-full border border-line bg-surface/70 px-5 py-3 transition-all duration-300 hover:border-accent-400 hover:shadow-accent-glow"
  >
    <img
      src={tech.icon}
      alt={tech.name}
      className="h-7 w-7 object-contain transition-transform duration-300 group-hover:scale-110"
      loading="lazy"
    />
    <span className="whitespace-nowrap text-[15px] font-medium text-body transition-colors duration-300 group-hover:text-heading">
      {tech.name}
    </span>
  </div>
);

const Tech = () => {
  const half = Math.ceil(technologies.length / 2);
  const rowOne = technologies.slice(0, half);
  const rowTwo = technologies.slice(half);

  return (
    <>
      <motion.div variants={textVariant() as Variants} className="mb-10">
        <p className={styles.styles.sectionSubText}>What I build with</p>
        <h2 className={styles.styles.sectionHeadText}>Tech Stack.</h2>
      </motion.div>

      <div className="flex flex-col gap-5">
        <Marquee>
          {rowOne.map((tech) => (
            <TechChip key={tech.name} tech={tech} />
          ))}
        </Marquee>
        <Marquee reverse>
          {rowTwo.map((tech) => (
            <TechChip key={tech.name} tech={tech} />
          ))}
        </Marquee>
      </div>
    </>
  );
};

export default SectionWrapper(Tech, "tech");
