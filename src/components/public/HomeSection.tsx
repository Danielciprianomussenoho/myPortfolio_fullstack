"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { motion } from "framer-motion";

interface HomeData {
  name: string;
  title: string;
  description: string;
  curriculum: string;
  profile_picture: string;
  links?: {
    github?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export default function HomeSection() {
  const [homeData, setHomeData] = useState<HomeData>({
    name: "",
    title: "",
    description: "",
    curriculum: "",
    profile_picture: "/perfil.jpg",
    links: {
      github: "",
      linkedin: "",
      instagram: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/home`);
        const data = res.data;

        setHomeData({
          name: data.name || "",
          title: data.title || "",
          description: data.description || "",
          curriculum: data.curriculum || "",
          profile_picture:
            data.profile_picture && data.profile_picture.startsWith("http")
              ? data.profile_picture
              : "/perfil.jpg",
          links: {
            github: data.links?.github || "",
            linkedin: data.links?.linkedin || "",
            instagram: data.links?.instagram || "",
          },
        });
      } catch (err) {
        console.error("Erro ao buscar dados da home:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full px-4 sm:px-6 py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-12">
          {/* Conteúdo de texto */}
          <div className="w-full md:flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-3 sm:gap-4">
            <motion.h1
              initial={{ y: -20 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 dark:from-emerald-300 dark:to-teal-400 leading-snug break-words w-full"
            >
              {homeData.name || ""}
            </motion.h1>

            <motion.h2
              initial={{ y: -20 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-base sm:text-lg md:text-xl font-semibold text-gray-600 dark:text-gray-300 break-words w-full"
            >
              {homeData.title || ""}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-normal sm:leading-relaxed max-w-full overflow-hidden"
              style={{ wordBreak: "break-word" }}
            >
              {homeData.description || ""}
            </motion.p>

            {/* Botões */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="w-full max-w-xs sm:max-w-md flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 mt-4"
            >
              <Link
                href={homeData.links?.github || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[110px] px-3 py-2 text-xs sm:text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">...</svg>
                GitHub
              </Link>

              <Link
                href={homeData.links?.linkedin || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[110px] px-3 py-2 text-xs sm:text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">...</svg>
                LinkedIn
              </Link>

              <Link
                href={homeData.links?.instagram || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[110px] px-3 py-2 text-xs sm:text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">...</svg>
                Instagram
              </Link>

              <Link
                href={homeData.curriculum || "/perfil.jpg"}
                download
                className="flex-1 min-w-[140px] px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Currículo
              </Link>
            </motion.div>
          </div>

          {/* Foto de perfil */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="w-full md:flex-1 flex justify-center"
          >
            <div className="relative w-[200px] h-[250px] sm:w-[240px] sm:h-[300px] md:w-[280px] md:h-[350px] overflow-hidden rounded-lg shadow-xl group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              <Image
                src={homeData.profile_picture.startsWith("/") ? homeData.profile_picture : homeData.profile_picture || "/perfil.jpg"}
                alt="Foto de perfil"
                width={400}
                height={600}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
