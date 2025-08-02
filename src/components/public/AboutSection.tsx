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
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/about`);
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
          // className="text-4xl md:text-5xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500"
          className="bg-gray-800"
        >
          {aboutData.sectionName}
        </motion.h1>

        <div className="flex flex-col lg:flex-row gap-8 h-full">
          {/* Container da imagem - agora com altura total */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="w-full lg:w-2/5 relative flex items-center"
          >
            <div className="relative w-full h-full min-h-[500px] rounded-xl border-4 border-emerald-500/20 shadow-xl overflow-hidden">
              <Image
                src={"/perfil.jpg"}
                alt="Developer"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 40vw"
                style={{ objectPosition: 'center top' }}
              />
            </div>
          </motion.div>

          {/* Conteúdo à direita */}
          <div className="w-full lg:w-3/5 flex flex-col justify-between">
            {/* Descrição */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {aboutData.description}
              </p>
            </motion.div>

            {/* Tecnologias */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
              className="mt-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 dark:text-white">
                Minhas Tecnologias
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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
                        src={"/perfil.jpg"}
                        // src={tech.image || "/tech-icon.png"}
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
        </div>
      </div>
    </motion.section>
  );
}