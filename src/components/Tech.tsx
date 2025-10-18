import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { motion } from "framer-motion";

const TechIcon = ({ tech, index }: { tech: { name: string; icon: string }; index: number }) => {
  return (
    <motion.div
      className="w-28 h-28 group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
    >
      <div className="w-full h-full flex flex-col items-center justify-center gap-3">
        {/* Icon container with gradient border and hover effects */}
        <div className="relative w-20 h-20">
          {/* Animated gradient border */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
          
          {/* Icon background */}
          <div className="relative w-full h-full bg-tertiary rounded-full flex items-center justify-center p-3 shadow-lg group-hover:shadow-2xl group-hover:shadow-blue-500/50 transition-all duration-300 transform group-hover:scale-110">
            {/* Shine effect overlay */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Tech icon */}
            <img
              src={tech.icon}
              alt={tech.name}
              className="w-full h-full object-contain relative z-10 filter group-hover:brightness-110 transition-all duration-300"
            />
            
            {/* Rotating ring effect */}
            <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-cyan-400/50 group-hover:animate-spin-slow transition-all duration-500"></div>
          </div>
        </div>
        
        {/* Tech name with hover effect */}
        <p className="text-center text-xs font-medium text-secondary group-hover:text-white transition-colors duration-300">
          {tech.name}
        </p>
      </div>
    </motion.div>
  );
};

const Tech = () => {
  return (
    <div className="flex flex-row flex-wrap justify-center gap-10">
      {technologies.map((tech, index) => (
        <TechIcon key={tech.name} tech={tech} index={index} />
      ))}
    </div>
  );
};

export default SectionWrapper(Tech, "");
