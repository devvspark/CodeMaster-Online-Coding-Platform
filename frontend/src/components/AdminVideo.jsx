import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { NavLink } from 'react-router';

const AdminVideo = () => {
  // State to hold problems data
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);  // Indicates loading status
  const [error, setError] = useState(null);      // Holds error message if any

  // useEffect runs once on component mount
  useEffect(() => {
    fetchProblems(); // Load all problems when component mounts
  }, []);

  // Fetch problems from backend API
  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem'); // GET request
      setProblems(data); // Store fetched problems
    } catch (err) {
      setError('Failed to fetch problems'); // Set error message
      console.error(err);
    } finally {
      setLoading(false); // Always turn off loading
    }
  };

  // Handle deletion of video
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this problem?')) return;

    try {
      await axiosClient.delete(`/video/delete/${id}`); // Delete request to backend
      setProblems(problems.filter(problem => problem._id !== id)); // Remove from UI
    } catch (err) {
      setError(err); // Set error on failure
      console.log(err);
    }
  };

  // Loading state UI
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className="alert alert-error shadow-lg my-4">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error.response?.data?.error || error}</span>
        </div>
      </div>
    );
  }

  // Main UI for listing problems and allowing upload/delete video
  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Video Upload and Delete</h1>
      </div>

      {/* Card wrapper for table */}
      <div className="bg-white rounded-2xl shadow-lg p-6 overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 px-4 text-left font-semibold text-lg text-gray-700">#</th>
              <th className="py-3 px-4 text-left font-semibold text-lg text-gray-700">Title</th>
              <th className="py-3 px-4 text-left font-semibold text-lg text-gray-700">Difficulty</th>
              <th className="py-3 px-4 text-left font-semibold text-lg text-gray-700">Tags</th>
              <th className="py-3 px-4 text-left font-semibold text-lg text-gray-700">Actions</th>
            </tr>
          </thead>

          <tbody>
            {problems.map((problem, index) => (
              <tr key={problem._id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="py-3 px-4 font-semibold text-gray-800">{index + 1}</td>

                {/* Problem Title */}
                <td className="py-3 px-4 text-gray-700">{problem.title}</td>

                {/* Difficulty Badge */}
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm ${
                    problem.difficulty.toLowerCase() === 'easy'
                      ? 'bg-green-100 text-green-700'
                      : problem.difficulty.toLowerCase() === 'medium'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-red-100 text-red-700'
                  }`}>
                    {problem.difficulty}
                  </span>
                </td>

                {/* Problem Tags */}
                <td className="py-3 px-4">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    {problem.tags}
                  </span>
                </td>

                {/* Actions: Upload & Delete */}
                <td className="py-3 px-4">
                  <div className="flex gap-3">
                    <NavLink 
                      to={`/admin/upload/${problem._id}`}
                      className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      Upload
                    </NavLink>
                    <button 
                      onClick={() => handleDelete(problem._id)}
                      className="px-5 py-2 rounded-lg bg-red-400 text-white font-semibold shadow-md hover:bg-red-500 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminVideo;
