



// // Import Express framework
// const express = require('express');
// const app = express(); // Initialize Express app

// // Load environment variables from .env file
// require('dotenv').config();

// // Import MongoDB connection setup function
// const main = require('./config/db');

// // Middleware for parsing cookies
// const cookieParser = require('cookie-parser');

// // Import route handler for user authentication
// const authRouter = require("./routes/userAuth");

// // Import Redis client setup
// const redisClient = require('./config/redis');

// // Import route handler for problem creation
// const problemRouter = require("./routes/problemCreator");

// // Import route handler for solution submission
// const submitRouter = require("./routes/submit");

// // Import route handler for AI-based chatting
// const aiRouter = require("./routes/aiChatting");

// // Import route handler for video content creation
// const videoRouter = require("./routes/videoCreator");

// // Import CORS middleware to allow frontend/backend communication
// const cors = require('cors');

// // Enable Cross-Origin Resource Sharing
// // Allows requests from frontend (on http://localhost:5173) and includes credentials (like cookies)
// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true 
// }));

// // Middleware to parse JSON bodies from incoming requests
// // Increase limit to handle base64 encoded images (50MB limit)
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ limit: '50mb', extended: true }));

// // Middleware to parse cookies from client requests
// app.use(cookieParser());

// // Mount user authentication routes at /user
// app.use('/user', authRouter);

// // Mount problem creation routes at /problem
// app.use('/problem', problemRouter);

// // Mount solution submission routes at /submission
// app.use('/submission', submitRouter);

// // Mount AI chatting routes at /ai
// app.use('/ai', aiRouter);

// // Mount video creation routes at /video
// app.use("/video", videoRouter);

// // Function to initialize DB and Redis, then start the server
// const InitalizeConnection = async () => {
//     try {
//         // Connect to both MongoDB and Redis before starting server
//         await Promise.all([main(), redisClient.connect()]);
//         console.log("DB Connected");

//         // Start server on specified port (from .env file)
//         app.listen(process.env.PORT, () => {
//             console.log("Server listening at port number: " + process.env.PORT);
//         });

//     } catch (err) {
//         // Log connection errors
//         console.log("Error: " + err);
//     }
// }

// // Call the initialization function to start everything
// InitalizeConnection();



















// Import Express framework
const express = require('express');
const app = express(); // Initialize Express app

// Load environment variables from .env file
require('dotenv').config();

// Import MongoDB connection setup function
const main = require('./config/db');

// Middleware for parsing cookies
const cookieParser = require('cookie-parser');

// Import route handler for user authentication
const authRouter = require("./routes/userAuth");

// Import Redis client setup
const redisClient = require('./config/redis');

// Import route handler for problem creation
const problemRouter = require("./routes/problemCreator");

// Import route handler for solution submission
const submitRouter = require("./routes/submit");

// Import route handler for AI-based chatting
const aiRouter = require("./routes/aiChatting");

// Import route handler for video content creation
const videoRouter = require("./routes/videoCreator");

// Import CORS middleware to allow frontend/backend communication
const cors = require('cors');

// Enable Cross-Origin Resource Sharing
// Allows requests from frontend (on http://localhost:5173) and includes credentials (like cookies)
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://code-master-online-coding-platform.vercel.app",
        "https://code-master-online-coding-platform-bt5bfkane.vercel.app"
    ],
    credentials: true 
}));



// Middleware to parse JSON bodies from incoming requests
// Increase limit to handle base64 encoded images (50MB limit)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Middleware to parse cookies from client requests
app.use(cookieParser());

// Mount user authentication routes at /user
app.use('/user', authRouter);

// Mount problem creation routes at /problem
app.use('/problem', problemRouter);

// Mount solution submission routes at /submission
app.use('/submission', submitRouter);

// Mount AI chatting routes at /ai
app.use('/ai', aiRouter);

// Mount video creation routes at /video
app.use("/video", videoRouter);

// Function to initialize DB and Redis, then start the server
const InitalizeConnection = async () => {
    try {
        // Connect to both MongoDB and Redis before starting server
        await Promise.all([main(), redisClient.connect()]);
        console.log("DB Connected");

        // Start server on specified port (from .env file)
        app.listen(process.env.PORT, () => {
            console.log("Server listening at port number: " + process.env.PORT);
        });

    } catch (err) {
        // Log connection errors
        console.log("Error: " + err);
    }
}

// Call the initialization function to start everything
InitalizeConnection();
