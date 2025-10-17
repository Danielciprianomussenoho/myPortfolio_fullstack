import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/dashboard/Footer";
import Navbar from "@/components/dashboard/NavbarSection";
import { ReactNode } from "react";
import Head from "next/head";
import { ThemeProvider } from '@/contexts/ThemeContext';

export const metadata: Metadata = {
  title: "Meu Portfolio",
  description: "Portfolio profissional de Daniel Cipriano Mussenoho",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <Head>
        {/* Script que aplica dark mode antes do carregamento da interface */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  const theme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (_) {}
              })();
            `,
          }}
        />
      </Head>
      <body className="bg-white flex flex-col min-h-screen dark:bg-gray-900 antialiased text-black dark:text-white">
        {/* ENVOLVA TODO O CONTEÚDO COM ThemeProvider */}
        <ThemeProvider>
          <Navbar />
          <main className="min-h-screen w-full px-4 mt-6">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}