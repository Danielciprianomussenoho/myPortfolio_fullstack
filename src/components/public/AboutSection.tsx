"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";

interface Technology {
  _id?: string;
  title: string;
  image: string;
  description: string;
}

export default function AboutSection() {
  const [aboutData, setAboutData] = useState({
    sectionName: "",
    picture: "",
    description: "",
    technologies: [] as Technology[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://myportfolioapi.up.railway.app/api/about");
        setAboutData(res.data);
      } catch (err) {
        console.error("Erro ao buscar dados do about:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="w-full px-4 py-16 md:py-24 bg-white dark:bg-gray-900"
    >
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500"
        >
          {aboutData.sectionName}
        </motion.h1>

        <div className="flex flex-col lg:flex-row gap-12 items-center mb-16">
          {/* Imagem à esquerda */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/3 flex justify-center"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80 overflow-hidden border-4 border-emerald-500/20 shadow-xl">
              <Image
                // src={aboutData.picture || "/developer-icon.png"}
                src={"/perfil.jpg"}
                alt="Developer"
                // fill
                className="object-cover"
                height={600}
                width={400}
              />
            </div>
          </motion.div>

          {/* Descrição à direita */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="w-full lg:w-2/3"
          >
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {aboutData.description}
            </p>
          </motion.div>
        </div>

        {/* Tecnologias */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">
            Minhas Tecnologias
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {aboutData.technologies.map((tech, index) => (
              <motion.div
                key={tech._id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 p-6 text-center"
              >
                <div className="h-16 w-16 mx-auto mb-4 relative">
                  <Image
                    // src={tech.image || "/tech-icon.png"}
                    src={"/perfil.jpg"}
                    alt={tech.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  {tech.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {tech.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}