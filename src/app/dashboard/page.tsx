"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HomeSection from "@/components/dashboard/HomeSection";
import AboutSection from "@/components/dashboard/AboutSection";
import SkillsSection from "@/components/dashboard/SkillsSection";
import ProjectsSection from "@/components/dashboard/ProjectsSection";
import ExperienceSection from "@/components/dashboard/ExperienceSection";
import EducationSection from "@/components/dashboard/EducationSection";
import ContactSection from "@/components/dashboard/ContactSection";

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Adicionando estado de loading

  useEffect(() => {
    // Verificar autenticação
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Adicionar listener para mudanças no localStorage
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup function
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [router]); // Adicionando router como dependência

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Ou um componente de redirecionamento
  }

  return (
    <main className="p-6 space-y-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Painel de Edição do Portfólio</h1>

      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <HomeSection />
      </section>

      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <AboutSection />
      </section>

      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <SkillsSection />
      </section>

      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <ProjectsSection />
      </section>

      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <ExperienceSection />
      </section>

      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <EducationSection />
      </section>

      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <ContactSection />
      </section>
    </main>
  );
}