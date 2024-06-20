import React from "react";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import styles from "../styles";
import { services } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
const ServiceCard = ({ index, title, icon }:any) => {
  return (
    <Tilt className="xs:w-[250px] w-full">
      <motion.div
        variants={fadeIn("right", "spring", 0.5 * index, 0.75)}
        className="w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card"
      >
        <div options={{ max: 45, scale: 1, speed: 450 }} className="bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col">
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
        I am Luis Ortiz, an experienced software engineer with a solid
        background in full-stack web development, cloud services, and augmented
        reality technologies. I have a proven track record in both frontend and
        backend processes, database administration, and cloud infrastructure
        management. Currently, I am enriching web experiences through AR while
        ensuring optimal performance of server systems. I hold a Bachelor of
        Engineering in Computers and Systems from Universidad Rafael Landivar
        and am proficient in Javascript, Typescript, React, Nest, Express,
        Postgres, and mySQL. Bilingual in English and Spanish, I am highly
        motivated to deliver robust and innovative software solutions.
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
