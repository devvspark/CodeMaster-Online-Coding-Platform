import {Routes, Route ,Navigate} from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import LandingPage from "./pages/LandingPage";
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from "./authSlice";
import { useEffect } from "react";
import AdminPanel from "./components/AdminPanel";
import ProblemPage from "./pages/ProblemPage"
import Admin from "./pages/Admin";
import AdminVideo from "./components/AdminVideo"
import AdminDelete from "./components/AdminDelete"
import AdminUpload from "./components/AdminUpload"
import UpdateProblem from "./components/UpdateProblem";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";

function App(){

  const dispatch = useDispatch(); // Get the dispatch function from Redux to dispatch actions
  const {isAuthenticated,user,loading} = useSelector((state)=>state.auth); // Extract auth-related state from Redux store

  // check initial authentication
  useEffect(() => {
    dispatch(checkAuth()); // Dispatch the checkAuth action on component mount to verify user authentication
  }, [dispatch]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>; // Show a loading spinner while checking authentication
  }

  return(
  <>
    <Routes> {/* Define application routes */}
      <Route path="/" element={<LandingPage />}></Route> {/* Landing page for all users */}
      <Route path="/home" element={isAuthenticated ? <Homepage /> : <Navigate to="/" />}></Route> {/* If authenticated, go to Homepage, else redirect to landing */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login />}></Route> {/* Redirect to homepage if already logged in */}
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/home" /> : <Signup />}></Route> {/* Redirect to homepage if already signed up */}
      <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/home" />} /> {/* Only admin can access /admin route */}
      <Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/home" />} /> {/* Admin route for creating problems */}
      <Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/home" />} /> {/* Admin route for deleting problems */}
      <Route path="/admin/video" element={isAuthenticated && user?.role === 'admin' ? <AdminVideo /> : <Navigate to="/home" />} /> {/* Admin route for managing videos */}
      <Route path="/admin/upload/:problemId" element={isAuthenticated && user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/home" />} /> {/* Admin route to upload problem content */}
      <Route path="/problem/:problemId" element={<ProblemPage/>}></Route> {/* Route to view a specific problem page */}
      <Route path="/about" element={<AboutUs />}></Route> {/* About Us page */}
      <Route path="/contact" element={<Contact />}></Route> {/* Contact page */}
      <Route path="/admin/update" element={isAuthenticated && user?.role === 'admin' ? <UpdateProblem /> : <Navigate to="/home" />} /> {/* Admin route for updating problems */}
    </Routes> 
  </>
  )
}


export default App;