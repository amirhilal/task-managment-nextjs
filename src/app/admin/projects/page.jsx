'use client';

import React, { useState, useEffect } from 'react';
import { FiPlus, FiColumns } from 'react-icons/fi';
import Link from 'next/link';
import AdminSidebar from '@/app/components/admin/AdminSidebar';
import Breadcrumbs from '@/app/components/admin/Breadcrumbs';

export default function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [activeTab, setActiveTab] = useState('projects');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
    setIsLoading(false);
  };

  const handleCreateProject = async e => {
    e.preventDefault();
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProjectName }),
      });
      if (response.ok) {
        setNewProjectName('');
        fetchProjects();
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleDeleteProject = async projectId => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`/api/projects/${projectId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchProjects();
        }
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
          </div>
        </header>

        {/* Content */}
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <Breadcrumbs />
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Create New Project
              </h2>
              <form
                onSubmit={handleCreateProject}
                className="flex items-center"
              >
                <input
                  type="text"
                  value={newProjectName}
                  onChange={e => setNewProjectName(e.target.value)}
                  placeholder="Project Name"
                  className="flex-grow shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
                <button
                  type="submit"
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FiPlus className="mr-2 -ml-1 h-5 w-5" />
                  Create Project
                </button>
              </form>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Projects
              </h2>
              {isLoading ? (
                <p className="text-gray-700">Loading projects...</p>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {projects.map(project => (
                    <div
                      key={project._id}
                      className="bg-white overflow-hidden shadow rounded-lg border border-gray-200"
                    >
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          {project.name}
                        </h3>
                        <div className="mt-2 max-w-xl text-sm text-gray-600">
                          <p>{project.columns.length} columns</p>
                        </div>
                        <div className="mt-3 text-sm flex justify-between items-center">
                          <Link href={`/admin/projects/${project._id}/columns`}>
                            <span className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                              <FiColumns className="mr-2 -ml-0.5 h-4 w-4" />
                              Manage Columns
                            </span>
                          </Link>
                          <button
                            onClick={() => handleDeleteProject(project._id)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
