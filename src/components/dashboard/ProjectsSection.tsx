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
  _id?: string;
  sectionName: string;
  cards: ProjectCard[];
}

const ProjectsSection = () => {
  const [projects, setProjects] = useState<ProjectsSectionData>({
    sectionName: "Projetos",
    cards: [],
  });

  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`);
        if (res.data) {
          setProjects({
            sectionName: res.data.sectionName || "Projetos",
            cards: res.data.cards || [],
            _id: res.data._id
          });
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    };

    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);

    fetchData();
  }, []);

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
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  const saveCard = async (index: number) => {
    const card = projects.cards[index];
    try {
      if (card._id) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/projects/update/${card._id}`,
          card,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/projects/add`,
          card,
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
      }
      alert("Project saved successfully!");
    } catch (err) {
      console.error("Error saving project:", err);
    }
  };

  const saveSection = async () => {
  try {
    if (!projects._id) {
      // Handle case where section doesn't exist yet
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/projects/create`,
        { sectionName: projects.sectionName, cards: [] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProjects(prev => ({
        ...prev,
        _id: res.data._id,
        sectionName: res.data.sectionName
      }));
      alert("New section created successfully!");
      return;
    }

    await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/projects/update/${projects._id}`,
      { sectionName: projects.sectionName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    alert("Section name updated successfully!");
  } catch (err) {
    console.error("Error updating section:", err);
    alert("Failed to update section. Please try again.");
  }
};
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Projects Section</h1>

      <div className="flex items-center mb-6">
        <input
          type="text"
          placeholder="Section Name"
          value={projects.sectionName}
          onChange={(e) =>
            setProjects({ ...projects, sectionName: e.target.value })
          }
          className="w-full p-2 border border-gray-300 rounded mr-2"
        />
        <button
          onClick={saveSection}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Section
        </button>
      </div>

      {projects.cards.map((card, index) => (
        <div
          key={index}
          className="border p-4 rounded mb-4 shadow-sm bg-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input
                type="text"
                value={card.image}
                onChange={(e) => handleCardChange(index, "image", e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Project Name</label>
              <input
                type="text"
                value={card.name}
                onChange={(e) => handleCardChange(index, "name", e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={card.description}
              onChange={(e) =>
                handleCardChange(index, "description", e.target.value)
              }
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Technologies</label>
              <input
                type="text"
                placeholder="React, Node, MongoDB"
                value={card.tecnologies ? card.tecnologies.join(", ") : ""}
                onChange={(e) =>
                  handleCardChange(index, "tecnologies", e.target.value)
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">GitHub Link</label>
              <input
                type="text"
                value={card.githubLink}
                onChange={(e) =>
                  handleCardChange(index, "githubLink", e.target.value)
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Live Link</label>
              <input
                type="text"
                value={card.liveProjectLink}
                onChange={(e) =>
                  handleCardChange(index, "liveProjectLink", e.target.value)
                }
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => deleteCard(index)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Delete Project
            </button>
            <button
              onClick={() => saveCard(index)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Save Project
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={addNewCard}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-4"
      >
        + Add New Project
      </button>
    </div>
  );
};

export default ProjectsSection;