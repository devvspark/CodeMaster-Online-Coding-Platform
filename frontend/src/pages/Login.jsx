// React Hook Form for form handling
import { useForm } from "react-hook-form";
// Zod resolver for schema validation
import { zodResolver } from "@hookform/resolvers/zod";
// Zod library for defining the schema
import { z } from "zod";
// Redux hooks to access state and dispatch actions
import { useDispatch, useSelector } from "react-redux";
// React Router utilities for navigation
import { useNavigate, NavLink } from "react-router";
// Import login thunk action
import { loginUser } from "../authSlice";
// React hooks
import { useEffect, useState } from "react";

// Schema to validate login form inputs using Zod
const loginSchema = z.object({
  emailId: z.string().email("Invalid Email"), // email should be valid
  password: z.string().min(8, "Password is too weak"), // minimum 8 chars
});

function Login() {
  // State to toggle show/hide password
  const [showPassword, setShowPassword] = useState(false);
  // Get dispatch function to dispatch actions
  const dispatch = useDispatch();
  // For programmatic navigation
  const navigate = useNavigate();
  // Extract auth state from Redux store
  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  // Initialize form with schema validation
  const {
    register, // used to register input fields
    handleSubmit, // function to handle submit
    formState: { errors }, // form validation errors
  } = useForm({ resolver: zodResolver(loginSchema) });

  // If already logged in, navigate to homepage
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  // When form is submitted
  const onSubmit = (data) => {
    dispatch(loginUser(data)); // Dispatch login action with user input
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-base-200">
      {" "}
      {/* Full page centered card with light background */}
      <div className="card w-96 bg-base-100 shadow-xl">
        {" "}
        {/* Card box */}
        <div className="card-body">
          <h2 className="card-title justify-center text-3xl mb-6">
            CodeMaster
          </h2>{" "}
          {/* Title */}
          {/* Login Form Starts */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email Input Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className={`input input-bordered w-full ${
                  errors.emailId ? "input-error" : ""
                }`}
                {...register("emailId")} // bind to react-hook-form
              />
              {/* Show error if email is invalid */}
              {errors.emailId && (
                <span className="text-error text-sm mt-1">
                  {errors.emailId.message}
                </span>
              )}
            </div>

            {/* Password Input Field */}

            {/* Password Input Field */}
            

            {/* Password Input Field */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`input input-bordered ${
                    errors.password ? "input-error" : ""
                  }`}
                  style={{
                    width: "100%",
                    paddingRight: "40px",
                    boxSizing: "border-box",
                  }}
                  {...register("password")}
                />
                {/* Eye icon button - fixed positioning */}
                <button
                  type="button"
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    zIndex: 10, // Ensure it stays above the input
                    padding: "4px",
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    // Eye-off icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    // Eye icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
              {/* Password validation error */}
              {errors.password && (
                <span
                  style={{ color: "red", fontSize: "14px", marginTop: "4px" }}
                >
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <div className="form-control mt-8 flex justify-center">
              <button
                type="submit"
                className={`btn btn-primary ${
                  loading ? "loading btn-disabled" : ""
                }`} // loading state
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner"></span>{" "}
                    {/* Spinner animation */}
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>
          {/* Redirect to Sign Up Page */}
          <div className="text-center mt-6">
            <span className="text-sm">
              Don't have an account?{" "}
              <NavLink to="/signup" className="link link-primary">
                Sign Up
              </NavLink>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export the Login component
export default Login;
