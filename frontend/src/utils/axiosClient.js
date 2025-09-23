// Import the axios library for making HTTP requests
import axios from "axios"

// Create a custom axios instance with predefined configuration
const axiosClient = axios.create({
    // Base URL for all requests made using this instance
    baseURL: 'http://localhost:3000',

    // Allow sending cookies and authentication headers along with requests
    withCredentials: true,

    // Set default headers for every request
    headers: {
        'Content-Type': 'application/json' // Tell the server we are sending JSON data
    }
});

// Export the custom axios instance so it can be used throughout the app
export default axiosClient;
