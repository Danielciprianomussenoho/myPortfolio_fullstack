"use client";
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { 
      name: 'GitHub', 
      icon: <FaGithub />, 
      url: 'https://github.com/Danielciprianomussenoho' 
    },
    { 
      name: 'LinkedIn', 
      icon: <FaLinkedin />, 
      url: 'https://www.linkedin.com/in/danielciprianomussenoho' 
    },
    { 
      name: 'Instagram', 
      icon: <FaInstagram />, 
      url: 'https://www.instagram.com/dado_cipriano_junior' 
    },
    { 
      name: 'Email', 
      icon: <FaEnvelope />, 
      url: 'danielciprianomussenoho@gmail.com' 
    }
  ];

  const quickLinks = [
    { name: 'Sobre Mim', url: '/about' },
    { name: 'Projetos', url: '/projects' },
    { name: 'Skills', url: '/skills' },
    { name: 'Contato', url: '/contact' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.footer 
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={containerVariants}
      className="w-full bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="flex flex-col">
            <Link href="/" className="text-2xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Meu Portfolio
              </span>
            </Link>
            <p className="text-gray-400 mb-4">
              Desenvolvedor Full Stack criando soluções digitais inovadoras e eficientes.
            </p>
            <p className="text-gray-500 text-sm">
              © {currentYear} Daniel Cipriano. Todos os direitos reservados.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="flex flex-col">
            <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-4">Links Rápidos</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li 
                  key={index}
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                >
                  <Link 
                    href={link.url} 
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={itemVariants} className="flex flex-col">
            <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-4">Redes Sociais</h3>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gradient-to-r from-blue-500 to-cyan-500 text-white transition-all duration-300"
                  aria-label={link.name}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div 
          variants={itemVariants}
          className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent my-8"
        />

        {/* Credits */}
        <motion.div 
          variants={itemVariants}
          className="text-center text-gray-500 text-sm"
        >
          <p>
            Desenvolvido com Next.js, Tailwind CSS, TypeScript e React Icons
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}