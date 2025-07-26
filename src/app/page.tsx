import Head from "next/head";

import InicioPage from "@/components/public/HomeSection";
import AboutPage from "@/components/public/AboutSection";
import SkillsPage from "@/components/public/SkillsSection";
import ProjetosPage from "@/components/public/ProjectsSection";
import ExperienciasPage from "@/components/public/ExperienceSection";
import EducationPage from "@/components/public/EducationSection";
import ContatoPage from "@/components/public/ContactSection";

export default function Home() {

  return (
    <>
       <Head>
        <title>Meu Portfólio</title>
        <meta name="description" content="Portfolio profissional com projetos, skills e mais de Daniel Cipriano Mussenoho" />
      </Head>

           {/* Conteúdo principal com as seções em scroll */}
     <main className="pt-20 space-y-16 scroll-smooth">
        <section>
          <InicioPage />
        </section>

        <section id="about">
          <AboutPage />
        </section>

        <section id="skills">
          <SkillsPage />
        </section>

        <section id="projects">
          <ProjetosPage />
        </section>

        <section id="experience">
          <ExperienciasPage />
        </section>

        <section id="education">
          <EducationPage />
        </section>

        <section id="contact">
          <ContatoPage />
        </section>
     </main>
    </>
  );
}
