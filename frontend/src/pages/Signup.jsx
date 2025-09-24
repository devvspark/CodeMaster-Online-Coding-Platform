// Import React hooks
import { useState, useEffect } from "react";

// Import React Hook Form and Zod for form handling and validation
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Import Redux hooks
import { useDispatch, useSelector } from "react-redux";

// Import router functions
import { useNavigate, NavLink } from "react-router";

// Import the registerUser async action
import { registerUser } from "../authSlice";

// Define validation schema using Zod
const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum character should be 3"), // first name must be at least 3 characters
  emailId: z.string().email("Invalid Email"), // must be valid email format
  password: z.string().min(8, "Password is too weak"), // password must be at least 8 characters
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false); // toggle to show/hide password
  const dispatch = useDispatch(); // get Redux dispatch
  const navigate = useNavigate(); // navigate function from react-router
  const { isAuthenticated, loading } = useSelector((state) => state.auth); // get auth state from Redux

  // useForm hook with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  // Submit handler for the form
  const onSubmit = (data) => {
    dispatch(registerUser(data)); // dispatch registerUser thunk with form data
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-base-200">
      {" "}
      {/* Full screen centered card */}
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-3xl mb-6">
            CodeMaster
          </h2>{" "}
          {/* App title */}
          {/* Signup Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* First Name Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <input
                type="text"
                placeholder="John"
                className={`input input-bordered w-full ${
                  errors.firstName ? "input-error" : ""
                }`}
                {...register("firstName")}
              />
              {errors.firstName && (
                <span className="text-error text-sm mt-1">
                  {errors.firstName.message}
                </span>
              )}
            </div>

            {/* Email Field */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className={`input input-bordered w-full ${
                  errors.emailId ? "input-error" : ""
                }`}
                {...register("emailId")}
              />
              {errors.emailId && (
                <span className="text-error text-sm mt-1">
                  {errors.emailId.message}
                </span>
              )}
            </div>

            {/* Password Field with Show/Hide Button */}
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
                  className={`input input-bordered w-full ${
                    errors.password ? "input-error" : ""
                  }`}
                  style={{
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
                    zIndex: 10,
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
              <div className="mt-2">
                <p className="text-xs text-gray-500">
                  Password format e.g:39jG49@8
                </p>
              </div>
              {errors.password && (
                <span className="text-error text-sm mt-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <div className="form-control mt-8 flex justify-center">
              <button
                type="submit"
                className={`btn btn-primary ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </div>
          </form>
          {/* Redirect to Login Page */}
          <div className="text-center mt-6">
            <span className="text-sm">
              Already have an account?{" "}
              <NavLink to="/login" className="link link-primary">
                Login
              </NavLink>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
