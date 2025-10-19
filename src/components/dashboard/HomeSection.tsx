"use client";
import { useEffect, useState } from "react";
import axios from "axios";


// Interface para tipagem
interface HomeData {
  name: string;
  title: string;
  description: string;
  curriculum: string;
  profile_picture: string;
  links: {
    github: string;
    linkedin: string;
    instagram: string;
  };
}

export default function HomeSection() {
  const [homeData, setHomeData] = useState<HomeData>({
    name: "",
    title: "",
    description: "",
    curriculum: "",
    profile_picture: "",
    links: {
      github: "",
      linkedin: "",
      instagram: "",
    },
  });

  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedCV, setSelectedCV] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Função para validar URL
  const isValidUrl = (urlString: string) => {
    if (!urlString) return false;
    if (urlString.startsWith('blob:')) return true;
    
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (e) {
      console.error("Invalid URL:", urlString, e);
      return false;
    }
  };

  // Função para garantir que os links tenham a estrutura correta
  const ensureLinksStructure = (links: unknown): HomeData['links'] => {
    if (!links) {
      return { github: "", linkedin: "", instagram: "" };
    }
    
    // Se links é uma string, tenta fazer parse
    if (typeof links === 'string') {
      try {
        const parsed = JSON.parse(links);
        return {
          github: parsed?.github || "",
          linkedin: parsed?.linkedin || "",
          instagram: parsed?.instagram || "",
        };
      } catch {
        return { github: "", linkedin: "", instagram: "" };
      }
    }
    
    
    if (typeof links === "object") {
      const obj = links as Record<string, string>; // ALTERAÇÃO: cast seguro
      return {
        github: obj.github || "",
        linkedin: obj.linkedin || "",
        instagram: obj.instagram || "",
      };
    }
    return { github: "", linkedin: "", instagram: "" };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/home`);
        const data = res.data;
        
        const safeData: HomeData = {
          name: data.name || "",
          title: data.title || "",
          description: data.description || "",
          curriculum: data.curriculum || "",
          profile_picture: data.profile_picture || "",
          links: ensureLinksStructure(data.links),
        };
        
        setHomeData(safeData);
        if (safeData.profile_picture && isValidUrl(safeData.profile_picture)) {
          setPreviewImage(safeData.profile_picture);
        }
      } catch (err: unknown) {
        const error = err as { response?: { data?: { error?: string } } }; // ALTERAÇÃO: cast seguro
        console.error("Erro ao buscar dados da home:", error.response?.data?.error || err); // ALTERAÇÃO: substituído err por error.response seguro
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("links.")) {
      const linkKey = name.split(".")[1];
      setHomeData((prev) => ({
        ...prev,
        links: { 
          ...prev.links, 
          [linkKey]: value 
        },
      }));
    } else {
      setHomeData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedImage(null);
      return;
    }
    
    const file = e.target.files[0];
    setSelectedImage(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);
  };

  const handleCVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedCV(null);
      return;
    }
    const file = e.target.files[0];
    setSelectedCV(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem("");

    try {
      const formData = new FormData();
      
      // Adiciona campos de texto
      formData.append("name", homeData.name);
      formData.append("title", homeData.title);
      formData.append("description", homeData.description);
      
      // ✅ SOLUÇÃO: Enviar links como campos separados
      formData.append("links[github]", homeData.links.github);
      formData.append("links[linkedin]", homeData.links.linkedin);
      formData.append("links[instagram]", homeData.links.instagram);

      // Adiciona arquivos se selecionados
      if (selectedImage) {
        formData.append("profile_picture", selectedImage);
      }
      
      if (selectedCV) {
        formData.append("curriculum", selectedCV);
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/home`, 
        formData, 
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMensagem("Dados da Home atualizados com sucesso!");
      
      // Atualiza os dados com a resposta do servidor
      if (response.data.home) {
        const updatedData: HomeData = {
          ...response.data.home,
          links: ensureLinksStructure(response.data.home.links),
        };
        setHomeData(updatedData);
        if (updatedData.profile_picture && isValidUrl(updatedData.profile_picture)) {
          setPreviewImage(updatedData.profile_picture);
        }
      }
      
      // Limpa os arquivos selecionados após o upload
      setSelectedImage(null);
      setSelectedCV(null);

    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } }; // ALTERAÇÃO: cast seguro
      console.error("Erro detalhado:", error.response?.data?.error || err);
      setMensagem(error.response?.data?.error || "Erro ao atualizar os dados da Home.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Editar Seção Home</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      >
        {/* Campos de texto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">Nome*</label>
            <input
              type="text"
              name="name"
              value={homeData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
              Título Profissional*
            </label>
            <input
              type="text"
              name="title"
              value={homeData.title}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">Descrição*</label>
          <textarea
            name="description"
            value={homeData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Upload de Currículo */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
            Currículo {selectedCV ? `(Novo arquivo: ${selectedCV.name})` : "(Arquivo PDF)"}
          </label>
          <input 
            type="file" 
            accept=".pdf,.doc,.docx" 
            onChange={handleCVChange} 
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          {homeData.curriculum && isValidUrl(homeData.curriculum) && (
            <div className="mt-2">
              <a 
                href={homeData.curriculum} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
                </svg>
                Visualizar currículo atual
              </a>
            </div>
          )}
        </div>

        {/* Upload de Foto de Perfil */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
            Foto de Perfil {selectedImage && `(Nova imagem: ${selectedImage.name})`}
          </label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-3"
          />
          
          {/* Preview da imagem */}
          {previewImage && isValidUrl(previewImage) && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Preview:</p>
              <div className="w-32 h-32 relative rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                <img
                  src={previewImage}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("Erro ao carregar imagem:", previewImage);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Links sociais */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Links Sociais</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["github", "linkedin", "instagram"].map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <input
                  type="text"
                  name={`links.${key}`}
                  value={homeData.links[key as keyof typeof homeData.links] || ""}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Botão de salvar */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md flex items-center gap-2 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Salvar Alterações
          </button>
        </div>

        {/* Mensagem de feedback */}
        {mensagem && (
          <div
            className={`mt-4 p-3 rounded-lg ${
              mensagem.includes("Erro")
                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            }`}
          >
            {mensagem}
          </div>
        )}
      </form>
    </div>
  );
}