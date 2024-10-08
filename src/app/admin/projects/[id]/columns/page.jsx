'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FiSave, FiEdit, FiTrash2, FiX, FiPlus } from 'react-icons/fi';
import {
  HiOutlineClipboardList,
  HiOutlineLightBulb,
  HiOutlineFlag,
  HiOutlineCube,
  HiOutlineStar,
} from 'react-icons/hi';
import AdminSidebar from '@/app/components/admin/AdminSidebar';
import Breadcrumbs from '@/app/components/admin/Breadcrumbs';
const iconOptions = [
  { value: 'clipboard', icon: HiOutlineClipboardList },
  { value: 'lightbulb', icon: HiOutlineLightBulb },
  { value: 'flag', icon: HiOutlineFlag },
  { value: 'cube', icon: HiOutlineCube },
  { value: 'star', icon: HiOutlineStar },
];

export default function ProjectColumns() {
  const [project, setProject] = useState(null);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [newColumnColor, setNewColumnColor] = useState('#3B82F6'); // Default to blue
  const [newColumnIcon, setNewColumnIcon] = useState('clipboard');
  const [editingColumn, setEditingColumn] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');

  const params = useParams();

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${params.id}`);
      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
    }
    setIsLoading(false);
  };

  const handleAddColumn = async e => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/projects/${params.id}/columns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newColumnTitle,
          color: newColumnColor,
          icon: newColumnIcon,
        }),
      });
      if (response.ok) {
        setNewColumnTitle('');
        setNewColumnColor('#3B82F6');
        setNewColumnIcon('clipboard');
        fetchProject();
      }
    } catch (error) {
      console.error('Error adding column:', error);
    }
  };

  const handleEditColumn = async (columnId, newTitle, newColor, newIcon) => {
    try {
      const response = await fetch(
        `/api/projects/${params.id}/columns/${columnId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newTitle,
            color: newColor,
            icon: newIcon,
          }),
        },
      );
      if (response.ok) {
        setEditingColumn(null);
        fetchProject();
      }
    } catch (error) {
      console.error('Error editing column:', error);
    }
  };

  const handleDeleteColumn = async columnId => {
    if (window.confirm('Are you sure you want to delete this column?')) {
      try {
        const response = await fetch(
          `/api/projects/${params.id}/columns/${columnId}`,
          {
            method: 'DELETE',
          },
        );
        if (response.ok) {
          fetchProject();
        }
      } catch (error) {
        console.error('Error deleting column:', error);
      }
    }
  };

  const IconComponent = ({ iconName, className }) => {
    const IconComp =
      iconOptions.find(option => option.value === iconName)?.icon ||
      HiOutlineClipboardList;
    return <IconComp className={className} />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-2xl font-semibold text-gray-800">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-2xl font-semibold text-red-600">
          Project not found
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs />

        <span className="mx-2">/</span>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-indigo-600">
            <h1 className="text-2xl font-bold text-white">
              {project.name} - Manage Columns
            </h1>
          </div>
          <div className="p-6">
            <form onSubmit={handleAddColumn} className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  value={newColumnTitle}
                  onChange={e => setNewColumnTitle(e.target.value)}
                  placeholder="New Column Title"
                  className="mx-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm text-black rounded-md"
                />
                <input
                  type="color"
                  value={newColumnColor}
                  onChange={e => setNewColumnColor(e.target.value)}
                  className="h-10 w-full rounded-md cursor-pointer"
                />
                <select
                  value={newColumnIcon}
                  onChange={e => setNewColumnIcon(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  {iconOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.value.charAt(0).toUpperCase() +
                        option.value.slice(1)}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FiPlus className="mr-2 -ml-1 h-5 w-5" />
                  Add Column
                </button>
              </div>
            </form>
            <div className="space-y-4">
              {project.columns.map(column => (
                <div
                  key={column._id}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-md shadow"
                >
                  <div className="flex items-center">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mr-4"
                      style={{ backgroundColor: column.color }}
                    >
                      <IconComponent
                        iconName={column.icon}
                        className="h-6 w-6 text-white"
                      />
                    </div>
                    {editingColumn === column._id ? (
                      <input
                        type="text"
                        value={column.title}
                        onChange={e => {
                          const updatedColumns = project.columns.map(c =>
                            c._id === column._id
                              ? { ...c, title: e.target.value }
                              : c,
                          );
                          setProject({ ...project, columns: updatedColumns });
                        }}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    ) : (
                      <span className="text-gray-700 font-medium">
                        {column.title}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    {editingColumn === column._id ? (
                      <>
                        <input
                          type="color"
                          value={column.color}
                          onChange={e => {
                            const updatedColumns = project.columns.map(c =>
                              c._id === column._id
                                ? { ...c, color: e.target.value }
                                : c,
                            );
                            setProject({ ...project, columns: updatedColumns });
                          }}
                          className="h-8 w-8 rounded-md cursor-pointer mr-2"
                        />
                        <select
                          value={column.icon}
                          onChange={e => {
                            const updatedColumns = project.columns.map(c =>
                              c._id === column._id
                                ? { ...c, icon: e.target.value }
                                : c,
                            );
                            setProject({ ...project, columns: updatedColumns });
                          }}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md mr-2"
                        >
                          {iconOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.value.charAt(0).toUpperCase() +
                                option.value.slice(1)}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() =>
                            handleEditColumn(
                              column._id,
                              column.title,
                              column.color,
                              column.icon,
                            )
                          }
                          className="mr-2 text-green-600 hover:text-green-800"
                        >
                          <FiSave className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setEditingColumn(null)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <FiX className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEditingColumn(column._id)}
                        className="mr-2 text-indigo-600 hover:text-indigo-800"
                      >
                        <FiEdit className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteColumn(column._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
