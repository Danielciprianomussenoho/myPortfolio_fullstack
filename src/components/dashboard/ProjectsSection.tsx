"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";

interface ProjectCard {
  _id?: string;
  image: string;
  name: string;
  description: string;
  tecnologies: string[];
  githubLink: string;
  liveProjectLink: string;
}

interface ProjectsSectionData {
  sectionName: string;
  cards: ProjectCard[];
}

const ProjectsSection = () => {
  const [projects, setProjects] = useState<ProjectsSectionData>({
    sectionName: "Projetos",
    cards: [],
  });

  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState<{ [key: number]: File }>({});
  const [previewImages, setPreviewImages] = useState<{ [key: number]: string }>({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`);
        if (res.data) {
          setProjects({
            sectionName: res.data.sectionName || "Projetos",
            cards: res.data.cards || []
          });
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setMessage("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);

    fetchData();
  }, []);

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

  // Upload de imagem para projeto
  const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      const newSelected = { ...selectedImages };
      delete newSelected[index];
      setSelectedImages(newSelected);

      const newPreview = { ...previewImages };
      delete newPreview[index];
      setPreviewImages(newPreview);
      return;
    }
    
    const file = e.target.files[0];
    setSelectedImages(prev => ({ ...prev, [index]: file }));
    
    // Criar preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewImages(prev => ({ ...prev, [index]: objectUrl }));
  };

  // Função para fazer upload de uma imagem
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);
    
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
      formData,
      { 
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        } 
      }
    );
    
    return response.data.url;
  };

  const handleCardChange = (
    index: number,
    field: keyof ProjectCard,
    value: string
  ) => {
    setProjects(prev => {
      const updatedCards = [...prev.cards];
      
      if (field === "tecnologies") {
        updatedCards[index] = {
          ...updatedCards[index],
          [field]: value ? value.split(",").map(tech => tech.trim()) : []
        };
      } else {
        updatedCards[index] = {
          ...updatedCards[index],
          [field]: value
        };
      }
      
      return { ...prev, cards: updatedCards };
    });
  };

  const addNewCard = () => {
    setProjects(prev => ({
      ...prev,
      cards: [
        ...prev.cards,
        {
          image: "",
          name: "",
          description: "",
          tecnologies: [],
          githubLink: "",
          liveProjectLink: ""
        }
      ]
    }));
  };

  const deleteCard = async (index: number) => {
    const cardToDelete = projects.cards[index];
    
    if (!cardToDelete._id) {
      setProjects(prev => ({
        ...prev,
        cards: prev.cards.filter((_, i) => i !== index)
      }));
      return;
    }

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/projects/delete/${cardToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setProjects(prev => ({
        ...prev,
        cards: prev.cards.filter((_, i) => i !== index)
      }));
      
      setMessage("Project deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      console.error("Error deleting project:", error);
      setMessage(error.response?.data?.error || "Failed to delete project");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const saveCard = async (index: number) => {
    const card = projects.cards[index];
    
    if (!card.name || !card.description) {
      setMessage("Project name and description are required!");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setUploading(true);

    try {
      let imageUrl = card.image;

      // Upload da imagem se houver
      if (selectedImages[index]) {
        try {
          imageUrl = await uploadImage(selectedImages[index]);
          
          // Remove a imagem das selecionadas
          const newSelected = { ...selectedImages };
          delete newSelected[index];
          setSelectedImages(newSelected);

          const newPreview = { ...previewImages };
          delete newPreview[index];
          setPreviewImages(newPreview);
        } catch (err) {
          console.error("Erro ao fazer upload da imagem:", err);
          setMessage("Erro ao fazer upload da imagem do projeto.");
          setUploading(false);
          return;
        }
      }

      const cardToSave = {
        ...card,
        image: imageUrl
      };

      if (card._id) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/projects/update/${card._id}`,
          cardToSave,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessage("Project updated successfully!");
      } else {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/projects/add`,
          cardToSave,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        setProjects(prev => {
          const updatedCards = [...prev.cards];
          updatedCards[index] = res.data;
          return { ...prev, cards: updatedCards };
        });
        setMessage("Project created successfully!");
      }
      setTimeout(() => setMessage(""), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      console.error("Error saving project:", error);
      setMessage(error.response?.data?.error || "Failed to save project");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setUploading(false);
    }
  };

  const saveSection = async () => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/projects/update-section`,
        { sectionName: projects.sectionName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setMessage("Section name updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      console.error("Error updating section:", error);
      setMessage(error.response?.data?.error || "Failed to update section");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Projects Section</h1>

      {message && (
        <div className={`mb-4 p-3 rounded-lg ${
          message.includes("success") 
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        }`}>
          {message}
        </div>
      )}

      <div className="flex items-center mb-6">
        <input
          type="text"
          placeholder="Section Name"
          value={projects.sectionName}
          onChange={(e) =>
            setProjects({ ...projects, sectionName: e.target.value })
          }
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
        />
        <button
          onClick={saveSection}
          className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
        >
          Save Section
        </button>
      </div>

      {projects.cards.map((card, index) => (
        <div
          key={index}
          className="border p-4 rounded mb-4 shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Upload de Imagem do Projeto - CORREÇÃO APLICADA */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                Imagem do Projeto {selectedImages[index] && `(Nova: ${selectedImages[index].name})`}
              </label>
              
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleImageChange(index, e)} 
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-2"
              />
              
              {/* Preview da imagem do projeto - CORREÇÃO APLICADA */}
              {(previewImages[index] || (card.image && isValidUrl(card.image))) && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Preview:</p>
                  <div className="w-32 h-32 relative rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                    <img
                      src={previewImages[index] || card.image}
                      alt="Project preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Erro ao carregar preview da imagem:", previewImages[index] || card.image);
                        e.currentTarget.style.display = 'none';
                      }}
                      onLoad={(e) => {
                        e.currentTarget.style.display = 'block';
                      }}
                    />
                  </div>
                </div>
              )}
              
              {/* Link para imagem atual (se existir) - CORREÇÃO APLICADA */}
              {card.image && isValidUrl(card.image) && !selectedImages[index] && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Imagem atual:</p>
                  <a 
                    href={card.image} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm break-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    {card.image}
                  </a>
                </div>
              )}
              
              {/* Mensagem de erro se a URL for inválida */}
              {card.image && !isValidUrl(card.image) && (
                <p className="text-red-500 text-sm mt-1">URL da imagem inválida</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">Project Name*</label>
              <input
                type="text"
                value={card.name}
                onChange={(e) => handleCardChange(index, "name", e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">Description*</label>
            <textarea
              value={card.description}
              onChange={(e) =>
                handleCardChange(index, "description", e.target.value)
              }
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">Technologies</label>
              <input
                type="text"
                placeholder="React, Node, MongoDB"
                value={card.tecnologies.join(", ")}
                onChange={(e) =>
                  handleCardChange(index, "tecnologies", e.target.value)
                }
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">GitHub Link</label>
              <input
                type="text"
                value={card.githubLink}
                onChange={(e) =>
                  handleCardChange(index, "githubLink", e.target.value)
                }
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">Live Link</label>
              <input
                type="text"
                value={card.liveProjectLink}
                onChange={(e) =>
                  handleCardChange(index, "liveProjectLink", e.target.value)
                }
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => deleteCard(index)}
              className="text-white hover:bg-red-800 text-sm px-4 py-2 rounded bg-red-600 transition-colors"
            >
              Delete Project
            </button>
            <button
              onClick={() => saveCard(index)}
              disabled={uploading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Salvando...
                </>
              ) : (
                "Save Project"
              )}
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={addNewCard}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-4 transition-colors"
      >
        + Add New Project
      </button>
    </div>
  );
};

export default ProjectsSection;