import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { logoutUser } from "../authSlice";
import bgimage from "../assets/LeetCodeHeroBackground.png";
import bgimg from "../assets/back.png";

import axiosClient from "../utils/axiosClient";

function LandingPage() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Avatar logic
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);
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
    
    if (user && isAuthenticated) {
      fetchProfilePicture();
    }
  }, [user, isAuthenticated]);

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

  const handleClick = (e) => {
    e.preventDefault(); // prevent default NavLink navigation
    if (isAuthenticated) {
      navigate("/Home");
    } else {
      navigate("/signup"); // or "/login"
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };
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
  const handleLogout = () => {
    dispatch(logoutUser());
  };


  useEffect(() => {
    if (showProfileModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showProfileModal]);
  

  return (
    <div className=" min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="navbar sticky top-0 z-20 bg-base-100 shadow-lg px-8 py-3 flex justify-between items-center">
        <div className="navbar-start">
          <div className="flex items-center gap-2">
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
          </div>
        </div>
        <div className="navbar-end">
          {/* Navigation Links */}
          <div className="flex items-center gap-6 mr-6">
            <NavLink
              to={isAuthenticated ? "/Home" : "/signup"}
              onClick={handleClick}
              className="text-black hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Problems
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
          </div>

          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-4">
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
                      <button
                        onClick={handleLogout}
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
              {/* Profile Picture Modal */}
              {showProfileModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
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
                        <button
                          onClick={removeAvatar}
                          className="btn btn-error btn-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex gap-4">
              

              <NavLink
                to="/login"
                className="px-6 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:text-blue-600 hover:border-blue-400 transition-all duration-200 font-medium"
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="px-6 py-2 rounded-full bg-gradient-to-r from-sky-400 to-blue-600 text-white font-bold shadow-[0_4px_12px_rgba(0,123,255,0.4)] transition duration-300 hover:opacity-90"
              >
                Get Started
              </NavLink>
            </div>
          )}
        </div>
      </nav>

      {/* hero section */}
      <section
        className="hero  relative text-white min-h-[calc(100vh-64px)] flex  bg-cover bg-center"
        style={{ backgroundImage: `url(${bgimage})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content */}
        <div className="hero-content relative z-10">
          <div className="max-w-2xl mx-20">
            <h1 className="text-3xl md:text-6xl font-extrabold leading-tight mb-6">
              <span className="block">
                Master Coding
                <br />
                Challenges.Ace
              </span>
              <span className="text-orange-500">Technical Interviews</span>
            </h1>

            <p className="text-lg mb-8 text-gray-200">
              Join thousands of developers improving their problem-solving
              skills with our curated collection of coding challenges. From
              arrays to dynamic programming, we've got you covered.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <NavLink
                to="/signup"
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:from-blue-600 hover:to-blue-700 transition"
              >
                Start Your Journey
              </NavLink>

              <NavLink
                to="/signup"
                className="border border-blue-600 text-blue-600 font-semibold py-2 px-6 rounded-full hover:bg-blue-50 transition"
              >
                Explore Challenges
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why Choose CodeMaster?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform is designed to help you become a better problem
              solver through structured learning and practice.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Curated Problems
                </h3>
                <p className="text-gray-600">
                  Hand-picked coding challenges covering fundamental concepts to
                  advanced algorithms.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span style={{ fontSize: "34px" }}>🤖</span>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  AI Chatbot Assistance
                </h3>
                <p className="text-gray-600">
                  Get real-time hints and guided help from an AI chatbot to find
                  solutions and understand coding problems step-by-step.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-pink-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Video Solutions
                </h3>
                <p className="text-gray-600">
                  Learn from expert explanations with step-by-step video
                  solutions for every problem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-lg opacity-90">Coding Problems</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10+</div>
              <div className="text-lg opacity-90">Topics covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-lg opacity-90">Vidio Solutions</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Ready to Level Up Your Coding Skills?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join our community of developers and start solving problems today.
          </p>
          <NavLink
            to="/signup"
            className="btn btn-primary btn-lg text-lg px-8 py-4"
          >
            Get Started Now
          </NavLink>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
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
                <span className="text-xl font-bold">CodeMaster</span>
              </div>
              <p className="text-gray-400">
                Empowering developers to become better problem solvers through
                structured learning.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <NavLink
                    to="/"
                    className="hover:text-white transition-colors"
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/about"
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </NavLink>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <NavLink
                    to="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </NavLink>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CodeMaster. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );

}

export default LandingPage;
