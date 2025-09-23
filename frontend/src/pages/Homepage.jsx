// Importing necessary hooks and functions
import { useEffect, useState, useRef } from "react"; // Add useRef import
import { NavLink } from "react-router"; // Navigation without reloading
import { useDispatch, useSelector } from "react-redux"; // Redux hooks
import axiosClient from "../utils/axiosClient"; // Axios instance with base URL
import { logoutUser } from "../authSlice"; // Logout action from Redux

function Homepage() {
  const dispatch = useDispatch(); // For dispatching Redux actions
  const { user } = useSelector((state) => state.auth); // Get current user from Redux store

  // Local state for problems and user-specific solved problems
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);

  // Local state for filtering problems
  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: "all",
    status: "all",
  });

  // Profile image state
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);

  // Modal state for viewing profile picture
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Fetch user's profile picture on component mount
  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const response = await axiosClient.get('/user/profilePicture');
        setAvatar(response.data.profilePicture);
      } catch (error) {
        console.error('Error fetching profile picture:', error);
        setAvatar(null);
      }
    };
    
    if (user) {
      fetchProfilePicture();
    }
  }, [user]);

  const compressImage = (file, maxWidth = 300, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxWidth) {
            width = (width * maxWidth) / height;
            height = maxWidth;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB. Please choose a smaller image.');
        return;
      }
      
      try {
        // Compress the image before sending
        const compressedImage = await compressImage(file);
        
        // Update profile picture in backend
        await axiosClient.put('/user/profilePicture', {
          profilePicture: compressedImage
        });
        setAvatar(compressedImage);
      } catch (error) {
        console.error('Error updating profile picture:', error);
        alert('Failed to update profile picture. Please try again.');
      }
    }
  };

  // Trigger file input
  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // Remove avatar function
  const removeAvatar = async () => {
    try {
      // Update profile picture in backend to null
      await axiosClient.put('/user/profilePicture', {
        profilePicture: null
      });
      setAvatar(null);
    } catch (error) {
      console.error('Error removing profile picture:', error);
      alert('Failed to remove profile picture. Please try again.');
    }
  };

  // Fetching problems and solved problems on mount
  useEffect(() => {
    // Fetch all problems
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/getAllProblem");
        setProblems(data); // Save to state
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    // Fetch problems that the user has already solved
    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/problemSolvedByUser");
        setSolvedProblems(data); // Save to state
      } catch (error) {
        console.error("Error fetching solved problems:", error);
      }
    };

    fetchProblems(); // Always fetch problems
    if (user) fetchSolvedProblems(); // Fetch solved only if user is logged in
  }, [user]);

  // Handle logout by dispatching logoutUser and clearing solved list
  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]); // Clear local solved list on logout
  };

  // Apply filters to show only the relevant problems
  const filteredProblems = problems.filter((problem) => {
    const difficultyMatch =
      filters.difficulty === "all" || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === "all" || problem.tags === filters.tag;
    const statusMatch =
      filters.status === "all" ||
      (filters.status === "solved" &&
        solvedProblems.some((sp) => sp._id === problem._id));
    return difficultyMatch && tagMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-100">
      <nav className="navbar sticky top-0 z-20 bg-base-100 shadow-lg px-8 py-3 flex justify-between items-center">
        <NavLink
          to="/"
          className="flex items-center gap-2 group select-none"
          style={{ textDecoration: "none" }}
        >
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <span>
            <span className="text-2xl font-bold">
              <span className="text-blue-600">Code</span>
              <span className="text-gray-900">Master</span>
            </span>
          </span>
        </NavLink>
        <div className="flex items-center gap-6">
          <NavLink
            to="/"
            className="text-black hover:text-blue-600 font-medium transition-colors duration-200"
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className="text-black hover:text-blue-600 font-medium transition-colors duration-200"
          >
            About Us
          </NavLink>
          <NavLink
            to="/contact"
            className="text-black mr-15 hover:text-blue-600 font-medium transition-colors duration-200"
          >
            Contact
          </NavLink>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              className="btn btn-ghost flex items-center gap-2 text-lg font-semibold"
            >
              {/* Avatar (clickable for modal) */}
              <span
                className="w-9 h-9 rounded-full overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfileModal(true);
                }}
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    className="w-7 h-7 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </span>
              <span>{user?.firstName}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            <ul className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li>
                <button
                  type="button"
                  onClick={() => setShowProfileModal(true)}
                  className="flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  View Profile Picture
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Change Profile Image
                </button>
              </li>
              <li>
                <button onClick={handleLogout} className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </li>
              {user?.role === "admin" && (
                <li>
                  <NavLink to="/admin" className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.001 12.001 0 002 12c0 2.757 1.125 5.224 2.938 7.071M12 21v-8m-4-4H8m4 0h4"
                      />
                    </svg>
                    Admin
                  </NavLink>
                </li>
              )}
            </ul>
            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="w-4/5 mx-auto p-4 sm:p-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-8 mb-10 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-lg px-8 py-6 items-center justify-between border border-blue-100">
          <div className="flex flex-wrap gap-8 items-center w-full justify-between">
            <div className="form-control w-[200px]">
              <label className="label text-lg font-bold text-blue-700 mb-2">
                Status
              </label>
              <select
                className="select select-bordered select-md min-w-[150px] rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-base font-medium bg-white"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="all">All Problems</option>
                <option value="solved">Solved Problems</option>
              </select>
            </div>
            <div className="form-control w-[200px]">
              <label className="label text-lg font-bold text-blue-700 mb-2">
                Difficulty
              </label>
              <select
                className="select select-bordered select-md min-w-[150px] rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-base font-medium bg-white"
                value={filters.difficulty}
                onChange={(e) =>
                  setFilters({ ...filters, difficulty: e.target.value })
                }
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="form-control w-[200px]">
              <label className="label text-lg font-bold text-blue-700 mb-2">
                Tag
              </label>
              <select
                className="select select-bordered select-md min-w-[150px] rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-base font-medium bg-white"
                value={filters.tag}
                onChange={(e) =>
                  setFilters({ ...filters, tag: e.target.value })
                }
              >
                <option value="all">All Tags</option>
                <option value="array">Array</option>
                <option value="linkedList">Linked List</option>
                <option value="graph">Graph</option>
                <option value="dp">DP</option>
              </select>
            </div>
          </div>
        </div>

        {/* Problems vertical feed */}
        <div className="flex flex-col gap-6">
          {filteredProblems.map((problem, idx) => (
            <div
              key={problem._id}
              className="w-full bg-white shadow-lg rounded-2xl px-6 py-5 flex items-center gap-4 transition-transform hover:scale-[1.01] hover:shadow-2xl border border-base-200"
            >
              {/* Serial number in a circle */}
              <div className="flex-shrink-0">
                <div
                  className="rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center"
                  style={{ width: "48px", height: "48px", fontSize: "1.25rem" }}
                >
                  {idx + 1}
                </div>
              </div>
              {/* Main content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <NavLink
                    to={`/problem/${problem._id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-primary truncate"
                  >
                    {problem.title}
                  </NavLink>
                </div>
                <div className="flex gap-2 items-center mb-1">
                  <span
                    className={`badge ${getDifficultyBadgeColor(
                      problem.difficulty
                    )} capitalize`}
                  >
                    {problem.difficulty}
                  </span>
                  <span className="badge badge-info capitalize">
                    {problem.tags}
                  </span>
                </div>
              </div>
              {/* Action button */}
              <div className="flex-shrink-0">
                <NavLink
                  to={`/problem/${problem._id}`}
                  className="btn btn-primary btn-sm rounded-full px-4"
                >
                  Solve
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Picture Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center relative max-w-xs w-full">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
              onClick={() => setShowProfileModal(false)}
            >
              &times;
            </button>
            <div className="w-40 h-40 rounded-full overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center mb-4">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  className="w-20 h-20 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </div>
            <span className="text-lg font-semibold text-gray-800">
              {user?.firstName}'s Profile Picture
            </span>
            <div className="flex gap-3 mt-4">
              <button
                onClick={triggerFileInput}
                className="btn btn-primary btn-sm"
              >
                Change Image
              </button>
              {avatar && (
                <button onClick={removeAvatar} className="btn btn-error btn-sm">
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Function to return Tailwind class based on difficulty level
const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "badge-success";
    case "medium":
      return "badge-warning";
    case "hard":
      return "badge-error";
    default:
      return "badge-neutral";
  }
};

export default Homepage; // Exporting the component
