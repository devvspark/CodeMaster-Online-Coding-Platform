// Import necessary React hooks and icons
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Home, RefreshCw, Zap, Video } from 'lucide-react'; // Icons from lucide-react
import { NavLink } from 'react-router'; // NavLink for routing

function Admin() {
  // State to store which admin option is currently selected (not used actively here, but reserved for future use)
  const [selectedOption, setSelectedOption] = useState(null);

  // Array of admin option cards with their respective properties
  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding problem to the platform',
      icon: Plus,
      color: 'btn-success',       // Tailwind/daisyUI button color
      bgColor: 'bg-success/10',   // Background color of icon circle
      route: '/admin/create'      // Route path on click
    },
    {
      id: 'update',
      title: 'Update Problem',
      description: 'Edit existing problems and their details',
      icon: Edit,
      color: 'btn-warning',
      bgColor: 'bg-warning/10',
      route: '/admin/update'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Remove problems from the platform',
      icon: Trash2,
      color: 'btn-error',
      bgColor: 'bg-error/10',
      route: '/admin/delete'
    },
    {
      id: 'video',
      title: 'Video Problem',
      description: 'Upload And Delete Videos',
      icon: Video,
      color: 'btn-success',
      bgColor: 'bg-success/10',
      route: '/admin/video'
    }
  ];

  // JSX return block to render the Admin page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-3 drop-shadow-sm tracking-tight">
            Admin Panel
          </h1>
          <p className="text-gray-500 text-lg font-medium">
            Manage coding problems on your platform
          </p>
        </div>

        {/* Admin Options displayed as cards in grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {adminOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.id}
                className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer rounded-3xl border border-gray-100 group"
              >
                <div className="card-body items-center text-center p-10">
                  {/* Icon Circle */}
                  <div className={`mb-6 w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-tr ${option.id === 'create' ? 'from-green-100 to-green-200' : option.id === 'update' ? 'from-yellow-100 to-yellow-200' : option.id === 'delete' ? 'from-red-100 to-red-200' : 'from-blue-100 to-blue-200'} shadow group-hover:scale-110 transition-transform duration-200`}>
                    <IconComponent size={38} className="text-gray-700" />
                  </div>
                  {/* Card Title */}
                  <h2 className="text-2xl font-bold mb-2 text-gray-900 tracking-tight">
                    {option.title}
                  </h2>
                  {/* Description Text */}
                  <p className="text-gray-500 mb-8 text-base font-medium">
                    {option.description}
                  </p>
                  {/* Button with NavLink for redirection */}
                  <div className="card-actions">
                    <NavLink
                      to={option.route}
                      className={`btn ${option.color} btn-wide rounded-full shadow-md text-base font-semibold transition-all duration-150 group-hover:scale-105 group-hover:shadow-lg`}
                    >
                      {option.title}
                    </NavLink>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Exporting the component to be used in other files
export default Admin;


