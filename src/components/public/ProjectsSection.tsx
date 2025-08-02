"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { motion } from "framer-motion";

interface ProjectCard {
  _id?: string;
  image: string;
  name: string;
  description: string;
  tecnologies: string[];
  githubLink: string;
  liveProjectLink: string;
}

interface ProjectsSectionData {
  _id?: string;
  sectionName: string;
  cards: ProjectCard[];
}

const ProjectsSection = () => {
  const [projects, setProjects] = useState<ProjectsSectionData>({
    sectionName: "Projetos",
    cards: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`);
        if (res.data) {
          setProjects({
            sectionName: res.data.sectionName || "Projetos",
            cards: res.data.cards || [],
            _id: res.data._id
          });
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-16 max-w-6xl"
    >
      <motion.h1
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
        // className="text-4xl md:text-5xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500"
        className="text-4xl md:text-5xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500"
      >
        {projects.sectionName}
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {projects.cards.map((proj, index) => (
          <motion.article
            key={proj._id || index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{
              y: -5,
              boxShadow: "0 10px 25px -5px rgba(0, 255, 200, 0.1)"
            }}
            className="relative group overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-0.5 shadow-lg"
          >
            <div className="relative h-full bg-gray-900 rounded-xl p-6">
              <div className="flex flex-col h-full">
                {/* Imagem do projeto */}
                <div className="h-48 mb-4 relative overflow-hidden rounded-lg">
                  <Image
                    // src={proj.image || "/project-placeholder.jpg"}
                    src={"/perfil.jpg"}
                    alt={proj.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Título e descrição */}
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-400">
                    {proj.name}
                  </h2>
                  <p className="text-gray-300 mt-2">
                    {proj.description}
                  </p>
                </div>

                {/* Tecnologias */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {proj.tecnologies?.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-emerald-900/30 text-emerald-400 text-sm rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>


                <div className="flex flex-col sm:flex-row justify-between mt-auto pt-4 border-t border-gray-800 gap-3 sm:gap-0">
                  <motion.a
                    href={proj.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center gap-2 flex-1 sm:flex-none"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    GitHub
                  </motion.a>

                  <motion.a
                    href={proj.liveProjectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-2 flex-1 sm:flex-none"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Live Demo
                  </motion.a>
                </div>

                {/* Efeito hover */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
};

export default ProjectsSection;