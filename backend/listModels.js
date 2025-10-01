// require('dotenv').config();
// const { GoogleGenAI } = require("@google/genai");

// async function listModels() {
//   try {
//     const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });
//     const response = await ai.models.list();
//     console.log("Full response:", response);  // <-- Inspect this
//   } catch (err) {
//     console.error("Error listing models:", err);
//   }
// }

// listModels();



// require('dotenv').config();
// const { GoogleGenAI } = require("@google/genai");

// async function listModels() {
//   try {
//     const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });
//     const response = await ai.models.list();

//     // Access the array of models
//     response.pageInternal.forEach(model => {
//       console.log(model.name, "-", model.displayName);
//     });
//   } catch (err) {
//     console.error("Error listing models:", err);
//   }
// }

// listModels();
