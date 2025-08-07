"use client"
import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface Experience {
  _id?: string
  position: string
  company: string
  duration: string
  location: string
  jobProfile: string
}

const ExperienceSection = () => {
    const [experiences, setExperiences] = useState<Experience[]>([])
  const [token, setToken] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<Experience, '_id'>>({
    position: '',
    company: '',
    duration: '',
    location: '',
    jobProfile: ''
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  // Fetch experiences on component mount
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const savedToken = localStorage.getItem('token')
        if (savedToken) setToken(savedToken)
        
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/experience`)
        setExperiences(response.data)
      } catch (err) {
        setError('Failed to fetch experiences')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchExperiences()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      if (editingId) {
        // Update existing experience
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/experience/update/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setExperiences(prev => 
          prev.map(exp => 
            exp._id === editingId ? { ...formData, _id: editingId } : exp
          )
        )
      } else {
        // Add new experience
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/experience/add`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setExperiences(prev => [...prev, response.data])
      }

      resetForm()
    } catch (err) {
      setError('Failed to save experience')
      console.error(err)
    }
  }

  const handleEdit = (experience: Experience) => {
    setFormData({
      position: experience.position,
      company: experience.company,
      duration: experience.duration,
      location: experience.location,
      jobProfile: experience.jobProfile
    })
    setEditingId(experience._id || null)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/experience/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setExperiences(prev => prev.filter(exp => exp._id !== id))
    } catch (err) {
      setError('Failed to delete experience')
      console.error(err)
    }
  }

  const resetForm = () => {
    setFormData({
      position: '',
      company: '',
      duration: '',
      location: '',
      jobProfile: ''
    })
    setEditingId(null)
  }

  if (loading) return <div className="text-center py-8">Loading experiences...</div>
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>


  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Experience Section</h1>
      
      {/* Experience Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
          {editingId ? 'Edit Experience' : 'Add New Experience'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">Position*</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">Company*</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                required
                 className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                 />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">Duration*</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
                 className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                 />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                 className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                 />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">Job Profile*</label>
            <textarea
              name="jobProfile"
              value={formData.jobProfile}
              onChange={handleInputChange}
              required
              rows={4}
               className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
               />
          </div>

          <div className="flex justify-end space-x-4">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md"
            >
              {editingId ? 'Update Experience' : 'Add Experience'}
            </button>
          </div>
        </form>
      </div>

      {/* Experiences List - Estilização melhorada */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Your Experiences</h2>
        
        {experiences.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-500 dark:text-gray-400">No experiences added yet</p>
          </div>
        ) : (
          experiences.map((exp, index) => (
            <div 
              key={exp._id || `temp-${index}`}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">{exp.position}</h3>
                      <p className="text-blue-600 dark:text-blue-400 font-medium">{exp.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {exp.duration}
                    </span>
                    {exp.location && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {exp.location}
                        </span>
                      </>
                    )}
                  </div>
                  
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {exp.jobProfile}
                    </p>
                  </div>
                </div>
                
                <div className="flex md:flex-col gap-2 md:gap-1 justify-end">
                  <button
                    onClick={() => handleEdit(exp)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  {exp._id && (
                    <button
                      onClick={() => exp._id && handleDelete(exp._id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ExperienceSection