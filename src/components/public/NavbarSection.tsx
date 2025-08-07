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

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Fechar menu ao mudar de rota (para links âncora e navegação normal)
  useEffect(() => {
    const handleRouteChange = () => {
      if (window.innerWidth < 768) {
        closeMenu();
      }
    };

    // Para Next.js 13+ com app router
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  // Fechar menu ao clicar fora (melhor UX)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (menuOpen && !target.closest('.navbar-content') && !target.closest('.menu-button')) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <nav className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-md fixed top-0 left-0 w-full z-50 navbar-content">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link 
          href="/" 
          className="text-xl sm:text-2xl font-bold hover:text-primary transition-colors"
          onClick={closeMenu}
        >
          Meu Portfólio
        </Link>

        {/* Menu Mobile */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            aria-label="Alternar tema"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="menu-button text-gray-900 dark:text-white p-2 focus:outline-none"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex gap-6">
            {[
              { href: "/#home", label: "Home" },
              { href: "/#about", label: "Sobre mim" },
              { href: "/#skills", label: "Skills" },
              { href: "/#projects", label: "Projetos" },
              { href: "/#experience", label: "Experiência" },
              { href: "/#education", label: "Educação" },
              { href: "/#contact", label: "Contato" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium"
                onClick={closeMenu}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Alternar tema"
            >
              {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-blue-400" />}
            </button>

            {isAuthenticated ? (
              <div className="flex gap-2">
                <Link
                  href="/dashboard"
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors text-sm sm:text-base"
                  onClick={closeMenu}
                >
                  Editar
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors text-sm sm:text-base"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors text-sm sm:text-base"
                onClick={closeMenu}
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Menu Mobile Expandido */}
        {menuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-lg px-6 py-4 flex flex-col gap-4">
            {[
              { href: "/#home", label: "Home" },
              { href: "/#about", label: "Sobre mim" },
              { href: "/#skills", label: "Skills" },
              { href: "/#projects", label: "Projetos" },
              { href: "/#experience", label: "Experiência" },
              { href: "/#education", label: "Educação" },
              { href: "/#contact", label: "Contato" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium py-2 border-b border-gray-200 dark:border-gray-700"
                onClick={closeMenu}
              >
                {label}
              </Link>
            ))}

            <div className="pt-2">
              {isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors text-center"
                    onClick={closeMenu}
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors text-center"
                  onClick={closeMenu}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}