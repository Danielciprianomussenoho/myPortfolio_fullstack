"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";

export default function NavbarSection() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const verificarToken = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    verificarToken();

    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialMode = savedTheme ? savedTheme === "dark" : prefersDark;
    setDarkMode(initialMode);
    document.documentElement.classList.toggle("dark", initialMode);

    const observer = () => verificarToken();
    window.addEventListener("storage", observer);
    return () => window.removeEventListener("storage", observer);
  }, [pathname]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newMode);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    router.push("/login");
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 768) setMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:text-primary transition-colors">
          Meu Portfólio
        </Link>

        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-900 dark:text-white p-2 focus:outline-none"
            aria-label="Abrir menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div
          className={`${
            menuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row absolute md:static top-20 left-0 w-full md:w-auto bg-white dark:bg-gray-900 gap-4 px-6 py-4 md:py-0 md:px-0 items-start md:items-center transition-all duration-300`}
        >
          {[
            { href: "#home", label: "Home" },
            { href: "#about", label: "Sobre mim" },
            { href: "#skills", label: "Skills" },
            { href: "#projects", label: "Projetos" },
            { href: "#experience", label: "Experiência" },
            { href: "#education", label: "Educação" },
            { href: "#contact", label: "Contato" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={handleLinkClick}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium"
            >
              {label}
            </Link>
          ))}

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            aria-label="Alternar tema"
          >
            {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-blue-400" />}
          </button>

          {isAuthenticated ? (
            <div className="flex flex-col md:flex-row gap-2">
              <Link
                href="/dashboard"
                onClick={handleLinkClick}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors shadow-md"
              >
                Editar
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  handleLinkClick();
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors shadow-md"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={handleLinkClick}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors shadow-md"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
