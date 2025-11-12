import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import styles from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
  live_link,
}: any) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        options={{ max: 45, scale: 1, speed: 450 }}
        className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full border border-blue-900/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-blue-glow"
      >
        <div className="relative w-full h-[230px]">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover rounded-2xl"
          />
          <div className="absolute inset-0 flex justify-end m-3 card-img_hover gap-2">
            {source_code_link && (
              <div
                onClick={() => {
                  window.open(source_code_link, "_blank");
                }}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 w-10 h-10 rounded-full flex justify-center items-center cursor-pointer hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 hover:shadow-blue-glow"
              >
                <img
                  src={github}
                  alt={"github"}
                  className="w-1/2 h-1/2 object-contain"
                />
              </div>
            )}
            {live_link && (
              <div
                onClick={() => {
                  window.open(live_link, "_blank");
                }}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 w-10 h-10 rounded-full flex justify-center items-center cursor-pointer hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 hover:shadow-cyan-glow"
                title="View Live Site"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
        <div className="mt-5">
          <h3 className="text-white font-bold text-[24px]">{name}</h3>
          <p className="mt-2 text-secondary text-[14px]">{description}</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag: any) => (
            <p key={tag.name} className={`text-[14px] ${tag.color}`}>
              #{tag.name}
            </p>
          ))}
        </div>
      </Tilt>
    </motion.div>
  );
};
const Works = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.styles.sectionSubText}>My work</p>
        <h2 className={styles.styles.heroHeadText}>Projects.</h2>
      </motion.div>
      <div className="w-full flex">
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className="mt-3 text-secondary text-[17px] max-w-5xl leading-[30px] text-justify"
        >
          The following projects showcase my skills and experience through
          real-world examples of my work. Each project is briefly described with
          links to code repositories and live demos when available. It
          reflects my ability to resolve complex problems, work with different
          technologies, and manage projects effectively
        </motion.p>
      </div>
      <div className="mt-20 flex flex-wrap gap-7">
        {projects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "");
