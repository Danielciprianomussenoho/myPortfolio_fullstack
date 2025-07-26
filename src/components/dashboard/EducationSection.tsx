"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Education {
  degree: string;
  year: string;
  collegeName: string;
}

export default function EducationSection() {
  const [educationData, setEducationData] = useState<Education>({
    degree: "",
    year: "",
    collegeName: ""
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/education`);
        setEducationData(res.data);
      } catch (err) {
        console.error("Failed to fetch education data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEducationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/education`, educationData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("Education updated successfully!");
    } catch (err) {
      console.error("Error updating education:", err);
      setMessage("Error updating education");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Education Section</h1>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">Degree*</label>
            <input
              type="text"
              name="degree"
              value={educationData.degree}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">Year*</label>
            <input
              type="text"
              name="year"
              value={educationData.year}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">College/University Name*</label>
            <input
              type="text"
              name="collegeName"
              value={educationData.collegeName}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
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
            Save Education
          </button>
        </div>

        {message && (
          <div className={`mt-4 p-3 rounded-lg ${message.includes("Error") ? 
            "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : 
            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"}`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}