import { Tilt } from "react-tilt";
import { motion, Variants } from "framer-motion";
import styles from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import type { CaseStudy, CaseStudyLink, Project, Tag } from "../types";
import { useLocale } from "../i18n/LocaleContext";

interface ProjectCardProps extends Project {
  index: number;
}

interface CaseStudyCardProps extends CaseStudy {
  index: number;
}

const ExternalLinkIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
  </svg>
);

const CaseStudyLinkButton = ({ link }: { link: CaseStudyLink }) => {
  const { t } = useLocale();

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={link.label}
      data-cursor="hover"
      className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-accent-600 to-cyan-600 px-4 text-[14px] text-white transition-all duration-300 hover:from-accent-500 hover:to-cyan-500 hover:shadow-cyan-glow"
    >
      {link.kind === "source" ? (
        <img src={github} alt="" aria-hidden="true" className="h-4 w-4 object-contain" />
      ) : (
        <ExternalLinkIcon />
      )}
      {link.kind === "source" ? t.works.viewSource : t.works.viewLive}
    </a>
  );
};

const CaseStudyCard: React.FC<CaseStudyCardProps> = ({
  index,
  name,
  summary,
  description,
  highlights,
  tags,
  links,
}) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.3, 0.75) as Variants}>
      <Tilt
        options={{ max: 12, scale: 1.02, speed: 450 }}
        className="card-lift group gradient-border glass w-full rounded-2xl p-6 md:w-[480px] lg:w-[560px]"
      >
        <p className="text-[13px] uppercase tracking-[0.2em] text-cyan-400">
          {summary}
        </p>
        <h3 className="mt-2 font-display text-[28px] font-bold text-heading">{name}</h3>
        <p className="mt-3 text-[14px] leading-relaxed text-body">{description}</p>

        <ul className="mt-5 space-y-2">
          {highlights.map((highlight) => (
            <li key={highlight.text} className="flex gap-2 text-[14px] text-secondary">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
              {highlight.text}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <p key={tag.name} className={`text-[14px] ${tag.color}`}>
              #{tag.name}
            </p>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {links.map((link) => (
            <CaseStudyLinkButton key={link.url} link={link} />
          ))}
        </div>
      </Tilt>
    </motion.div>
  );
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
  live_link,
}) => {
  const { t } = useLocale();

  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75) as Variants}>
      <Tilt
        options={{ max: 12, scale: 1.02, speed: 450 }}
        className="card-lift group gradient-border glass p-5 rounded-2xl sm:w-[360px] w-full"
      >
        <div className="relative w-full h-[230px] overflow-hidden rounded-2xl">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex justify-end m-3 card-img_hover gap-2">
            {source_code_link && (
              <div
                onClick={() => {
                  window.open(source_code_link, "_blank");
                }}
                className="bg-gradient-to-r from-accent-600 to-cyan-600 w-10 h-10 rounded-full flex justify-center items-center cursor-pointer hover:from-accent-500 hover:to-cyan-500 transition-all duration-300 hover:shadow-accent-glow"
                data-cursor="hover"
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
                className="bg-gradient-to-r from-accent-600 to-cyan-600 w-10 h-10 rounded-full flex justify-center items-center cursor-pointer hover:from-accent-500 hover:to-cyan-500 transition-all duration-300 hover:shadow-cyan-glow"
                title={t.works.viewLive}
                data-cursor="hover"
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
          <h3 className="text-heading font-display font-bold text-[24px]">
            {name}
          </h3>
          <p className="mt-2 text-body text-[14px] leading-relaxed">
            {description}
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag: Tag) => (
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
  const { t, content } = useLocale();

  return (
    <>
      <motion.div variants={textVariant() as Variants}>
        <p className={styles.styles.sectionSubText}>{t.works.subhead}</p>
        <h2 className={styles.styles.heroHeadText}>{t.works.heading}</h2>
      </motion.div>
      <div className="w-full flex">
        <motion.p
          variants={fadeIn("", "spring", 0.1, 1) as Variants}
          className="mt-3 text-secondary text-[17px] max-w-5xl leading-[30px] text-justify"
        >
          {t.works.intro}
        </motion.p>
      </div>
      <div className="mt-16 flex flex-wrap gap-7">
        {content.caseStudies.map((caseStudy, index) => (
          <CaseStudyCard key={caseStudy.id} index={index} {...caseStudy} />
        ))}
      </div>
      <h3 className="mt-20 font-display text-2xl font-bold text-heading">{t.works.moreBuilds}</h3>
      <div className="mt-20 flex flex-wrap gap-7">
        {content.projects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "projects");
