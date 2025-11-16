"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md fixed w-full z-50 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
          Meu Portfólios
        </Link>

        {/* Ícone do menu mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-800 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400 transition"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <NavLinks />
          <Acoes
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
          />
        </div>
      </div>

      {/* Menu Mobile animado */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden md:hidden px-4"
          >
            <div className="flex flex-col gap-4 pb-4">
              <NavLinks mobile />
              <Acoes
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                isAuthenticated={isAuthenticated}
                handleLogout={handleLogout}
                mobile
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// Componente de links de navegação
function NavLinks({ mobile = false }: { mobile?: boolean }) {
  const classes = "text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium";
  const mobileClasses = "block text-base py-1";
  return (
    <div className={`flex ${mobile ? "flex-col gap-2" : "gap-6 items-center"}`}>
      <Link href="#home" className={`${classes} ${mobile ? mobileClasses : ""}`}>Home</Link>
      <Link href="#about" className={`${classes} ${mobile ? mobileClasses : ""}`}>Sobre mim</Link>
      <Link href="#skills" className={`${classes} ${mobile ? mobileClasses : ""}`}>Skills</Link>
      <Link href="#projects" className={`${classes} ${mobile ? mobileClasses : ""}`}>Projetos</Link>
      <Link href="#experience" className={`${classes} ${mobile ? mobileClasses : ""}`}>Experiência</Link>
      <Link href="#education" className={`${classes} ${mobile ? mobileClasses : ""}`}>Educação</Link>
      <Link href="#contact" className={`${classes} ${mobile ? mobileClasses : ""}`}>Contato</Link>
    </div>
  );
}

// Botões de tema, login e logout
function Acoes({
  darkMode,
  toggleDarkMode,
  isAuthenticated,
  handleLogout,
  mobile = false,
}: {
  darkMode: boolean;
  toggleDarkMode: () => void;
  isAuthenticated: boolean;
  handleLogout: () => void;
  mobile?: boolean;
}) {
  const baseBtn = "px-4 py-2 rounded-lg shadow-md transition-colors text-white font-medium text-sm w-full md:w-auto";
  return (
    <div className={`flex ${mobile ? "flex-col gap-2 mt-4" : "items-center gap-4"}`}>
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        aria-label="Alternar tema"
      >
        {darkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-blue-400" />}
      </button>

      {isAuthenticated ? (
        <>
          <Link href="/dashboard" className={`${baseBtn} bg-green-600 hover:bg-green-700`}>
            Editar
          </Link>
          <button onClick={handleLogout} className={`${baseBtn} bg-red-600 hover:bg-red-700`}>
            Logout
          </button>
        </>
      ) : (
        <Link href="/login" className={`${baseBtn} bg-blue-600 hover:bg-blue-700`}>
          Login
        </Link>
      )}
    </div>
  );
}
