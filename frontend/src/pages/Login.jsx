// React Hook Form for form handling
import { useForm } from 'react-hook-form';
// Zod resolver for schema validation
import { zodResolver } from '@hookform/resolvers/zod';
// Zod library for defining the schema
import { z } from 'zod';
// Redux hooks to access state and dispatch actions
import { useDispatch, useSelector } from 'react-redux';
// React Router utilities for navigation
import { useNavigate, NavLink } from 'react-router'; 
// Import login thunk action
import { loginUser } from "../authSlice";
// React hooks
import { useEffect, useState } from 'react';

// Schema to validate login form inputs using Zod
const loginSchema = z.object({
  emailId: z.string().email("Invalid Email"), // email should be valid
  password: z.string().min(8, "Password is too weak") // minimum 8 chars
});

function Login() {
  // State to toggle show/hide password
  const [showPassword, setShowPassword] = useState(false);
  // Get dispatch function to dispatch actions
  const dispatch = useDispatch();
  // For programmatic navigation
  const navigate = useNavigate();
  // Extract auth state from Redux store
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  // Initialize form with schema validation
  const {
    register, // used to register input fields
    handleSubmit, // function to handle submit
    formState: { errors }, // form validation errors
  } = useForm({ resolver: zodResolver(loginSchema) });

  // If already logged in, navigate to homepage
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  // When form is submitted
  const onSubmit = (data) => {
    dispatch(loginUser(data)); // Dispatch login action with user input
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-base-200"> {/* Full page centered card with light background */}
      <div className="card w-96 bg-base-100 shadow-xl"> {/* Card box */}
        <div className="card-body">
          <h2 className="card-title justify-center text-3xl mb-6">CodeMaster</h2> {/* Title */}

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
                className={`input input-bordered w-full ${errors.emailId ? 'input-error' : ''}`} 
                {...register('emailId')} // bind to react-hook-form
              />
              {/* Show error if email is invalid */}
              {errors.emailId && (
                <span className="text-error text-sm mt-1">{errors.emailId.message}</span>
              )}
            </div>

            {/* Password Input Field */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} // toggle password visibility
                  placeholder="••••••••"
                  className={`input input-bordered w-full pr-10 ${errors.password ? 'input-error' : ''}`}
                  {...register('password')}
                />
                {/* Toggle password show/hide icon button */}
                <button
                  type="button"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    // Eye-off icon
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    // Eye icon
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {/* Password validation error */}
              {errors.password && (
                <span className="text-error text-sm mt-1">{errors.password.message}</span>
              )}
            </div>

            {/* Submit Button */}
            <div className="form-control mt-8 flex justify-center">
              <button
                type="submit"
                className={`btn btn-primary ${loading ? 'loading btn-disabled' : ''}`} // loading state
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner"></span> {/* Spinner animation */}
                    Logging in...
                  </>
                ) : 'Login'}
              </button>
            </div>
          </form>

          {/* Redirect to Sign Up Page */}
          <div className="text-center mt-6">
            <span className="text-sm">
              Don't have an account?{' '}
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
