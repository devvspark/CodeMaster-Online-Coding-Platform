import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';

const AdminDelete = () => {
  // State to store all problems
  const [problems, setProblems] = useState([]);

  // Loading and error states for data fetch and delete actions
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch problems once component mounts
  useEffect(() => {
    fetchProblems();
  }, []);

  // Function to fetch all problems from backend
  const fetchProblems = async () => {
    try {
      setLoading(true); // Show loading spinner
      const { data } = await axiosClient.get('/problem/getAllProblem'); // Fetch all problems
      setProblems(data); // Store problems in state
    } catch (err) {
      setError('Failed to fetch problems'); // Show fetch error
      console.error(err);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  // Function to delete a specific problem
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this problem?')) return; // Confirmation popup

    try {
      await axiosClient.delete(`/problem/delete/${id}`); // API call to delete
      setProblems(problems.filter(problem => problem._id !== id)); // Remove from UI
    } catch (err) {
      setError('Failed to delete problem'); // Show delete error
      console.error(err);
    }
  };

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Display error message if any
  if (error) {
    return (
      <div className="alert alert-error shadow-lg my-4">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  // Render table of problems with delete buttons
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">Delete Problems</h1>
        </div>
        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-lg font-bold text-gray-700">#</th>
                <th className="px-4 py-3 text-left text-lg font-bold text-gray-700">Title</th>
                <th className="px-4 py-3 text-left text-lg font-bold text-gray-700">Difficulty</th>
                <th className="px-4 py-3 text-left text-lg font-bold text-gray-700">Tags</th>
                <th className="px-4 py-3 text-left text-lg font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {problems.map((problem, index) => (
                <tr key={problem._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {/* Serial number */}
                  <td className="px-4 py-4 font-bold text-lg text-gray-800">{index + 1}</td>
                  {/* Problem title */}
                  <td className="px-4 py-4 text-gray-900 font-medium">{problem.title}</td>
                  {/* Difficulty badge */}
                  <td className="px-4 py-4">
                    <span className={`px-5 py-1.5 rounded-full text-base font-semibold shadow-sm ${
                      problem.difficulty.toLowerCase() === 'easy'
                        ? 'bg-green-100 text-green-600'
                        : problem.difficulty.toLowerCase() === 'medium'
                        ? 'bg-orange-100 text-orange-500'
                        : 'bg-red-100 text-red-500'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  {/* Tag badge */}
                  <td className="px-4 py-4">
                    <span className="px-4 py-1 rounded-full text-base font-semibold bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">
                      {problem.tags}
                    </span>
                  </td>
                  {/* Delete button */}
                  <td className="px-4 py-4">
                    <button
                      onClick={() => handleDelete(problem._id)}
                      className="btn btn-error btn-md rounded-full shadow-md font-bold px-6 transition-all duration-150 hover:scale-105 hover:shadow-lg"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDelete;
