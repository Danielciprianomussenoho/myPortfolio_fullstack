"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";


export default function SkillsSection() {
  const [skillsData, setSkillsData] = useState({
    title: "",
    subtitle: "",
    skills: [""],
  });

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/skills`);
        setSkillsData(res.data);
      } catch (error) {
        console.error("Failed to fetch skills data:", error);
      }
    };

    fetchSkills();
  }, []);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div 
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={container}
      className="container mx-auto px-4 py-16"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          variants={item}
          // className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500"
          className="text-4xl md:text-5xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500"
        >
          {skillsData.title}
        </motion.h1>
        
        <motion.h2 
          variants={item}
          className="text-xl md:text-2xl mb-12 text-gray-400 dark:text-gray-300"
        >
          {skillsData.subtitle}
        </motion.h2>

        <motion.div 
          variants={container}
          className="flex flex-wrap gap-4"
        >
          {skillsData?.skills?.map((skill, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
              <div className="relative px-6 py-3 bg-gray-900 rounded-lg leading-none flex items-center">
                <span className="text-gray-100 font-medium text-sm md:text-base">
                  {skill}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}