"use client";
import { useEffect, useState } from "react";
import axios from "axios";

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
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAboutData({ ...aboutData, [e.target.name]: e.target.value });
  };

  const handleTechnologyChange = (index: number, field: keyof Technology, value: string) => {
    const updated = [...aboutData.technologies];
    updated[index] = { ...updated[index], [field]: value };
    setAboutData({ ...aboutData, technologies: updated });
  };

  const handleAddTechnology = async () => {
    try {
      const newTech = {
        title: "Nova Tecnologia",
        image: "https://link-da-imagem.com",
        description: "Descrição da tecnologia",
      };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/about/add-tech`,
        newTech,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAboutData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, res.data],
      }));
    } catch (err) {
      console.error("Erro ao adicionar tecnologia:", err);
    }
  };

  const handleDeleteTechnology = async (id?: string) => {
    if (!id) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/about/delete-tech/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAboutData((prev) => ({
        ...prev,
        technologies: prev.technologies.filter((tech) => tech._id !== id),
      }));
    } catch (err) {
      console.error("Erro ao deletar tecnologia:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem("");
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/about`, aboutData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensagem("Seção 'About' atualizada com sucesso!");
    } catch (err) {
      setMensagem("Erro ao atualizar a seção 'About'.");
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Editar Seção About</h1>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">Nome da Seção*</label>
            <input
              type="text"
              name="sectionName"
              value={aboutData.sectionName}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
              />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">URL da Foto</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                name="picture"
                value={aboutData.picture}
                onChange={handleChange}
                 className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                 />
              {aboutData.picture && (
                <a 
                  href={aboutData.picture} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 text-blue-600 hover:text-blue-800 dark:hover:text-blue-400"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">Descrição*</label>
            <textarea
              name="description"
              value={aboutData.description}
              onChange={handleChange}
              required
              rows={6}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
              />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Tecnologias</h3>
              <button
                type="button"
                onClick={handleAddTechnology}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Adicionar Tecnologia
              </button>
            </div>

            {aboutData.technologies.length === 0 ? (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 text-center text-gray-500 dark:text-gray-400">
                Nenhuma tecnologia adicionada ainda
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aboutData.technologies.map((tech, index) => (
                  <div key={tech._id || index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-500 dark:text-gray-400">Título</label>
                        <input
                          type="text"
                          placeholder="Título"
                          value={tech.title}
                          onChange={(e) => handleTechnologyChange(index, "title", e.target.value)}
                           className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"/>
                      </div>

                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-500 dark:text-gray-400">URL da Imagem</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="URL da Imagem"
                            value={tech.image}
                            onChange={(e) => handleTechnologyChange(index, "image", e.target.value)}
                             className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                             />
                          {tech.image && (
                            <a 
                              href={tech.image} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-1 text-blue-600 hover:text-blue-800 dark:hover:text-blue-400"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-500 dark:text-gray-400">Descrição</label>
                        <textarea
                          placeholder="Descrição"
                          value={tech.description}
                          onChange={(e) => handleTechnologyChange(index, "description", e.target.value)}
                          rows={3}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                          />
                      </div>

                      {tech._id && (
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleDeleteTechnology(tech._id)}
                            className="flex items-center gap-1 px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Remover
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Salvar Alterações
          </button>
        </div>

        {mensagem && (
          <div className={`mt-4 p-3 rounded-lg ${mensagem.includes("Erro") ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"}`}>
            {mensagem}
          </div>
        )}
      </form>
    </div>
  );
}