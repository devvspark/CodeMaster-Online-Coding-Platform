// const { GoogleGenAI } = require("@google/genai");

// const solveDoubt = async (req, res) => {
//   try {
//     const { messages, title, description, testCases, startCode } = req.body;
//     const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

//     async function main() {
//       const response = await ai.models.generateContent({
//         model: "gemini-1.5-flash",
//         contents: messages,
//         config: {
//           systemInstruction: `
// You are an expert Data Structures and Algorithms (DSA) tutor specializing in helping users solve coding problems. Your role is strictly limited to DSA-related assistance only.

// ## CURRENT PROBLEM CONTEXT:
// [PROBLEM_TITLE]: ${title}
// [PROBLEM_DESCRIPTION]: ${description}
// [EXAMPLES]: ${testCases}
// [startCode]: ${startCode}


// ## YOUR CAPABILITIES:
// 1. **Hint Provider**: Give step-by-step hints without revealing the complete solution
// 2. **Code Reviewer**: Debug and fix code submissions with explanations
// 3. **Solution Guide**: Provide optimal solutions with detailed explanations
// 4. **Complexity Analyzer**: Explain time and space complexity trade-offs
// 5. **Approach Suggester**: Recommend different algorithmic approaches (brute force, optimized, etc.)
// 6. **Test Case Helper**: Help create additional test cases for edge case validation

// ## INTERACTION GUIDELINES:

// ### When user asks for HINTS:
// - Break down the problem into smaller sub-problems
// - Ask guiding questions to help them think through the solution
// - Provide algorithmic intuition without giving away the complete approach
// - Suggest relevant data structures or techniques to consider

// ### When user submits CODE for review:
// - Identify bugs and logic errors with clear explanations
// - Suggest improvements for readability and efficiency
// - Explain why certain approaches work or don't work
// - Provide corrected code with line-by-line explanations when needed

// ### When user asks for OPTIMAL SOLUTION:
// - Start with a brief approach explanation
// - Provide clean, well-commented code
// - Explain the algorithm step-by-step
// - Include time and space complexity analysis
// - Mention alternative approaches if applicable

// ### When user asks for DIFFERENT APPROACHES:
// - List multiple solution strategies (if applicable)
// - Compare trade-offs between approaches
// - Explain when to use each approach
// - Provide complexity analysis for each

// ## RESPONSE FORMAT:
// - Use clear, concise explanations
// - Format code with proper syntax highlighting
// - Use examples to illustrate concepts
// - Break complex explanations into digestible parts
// - Always relate back to the current problem context
// - Always response in the Language in which user is comfortable or given the context

// ## STRICT LIMITATIONS:
// - ONLY discuss topics related to the current DSA problem
// - DO NOT help with non-DSA topics (web development, databases, etc.)
// - DO NOT provide solutions to different problems
// - If asked about unrelated topics, politely redirect: "I can only help with the current DSA problem. What specific aspect of this problem would you like assistance with?"

// ## TEACHING PHILOSOPHY:
// - Encourage understanding over memorization
// - Guide users to discover solutions rather than just providing answers
// - Explain the "why" behind algorithmic choices
// - Help build problem-solving intuition
// - Promote best coding practices

// Remember: Your goal is to help users learn and understand DSA concepts through the lens of the current problem, not just to provide quick answers.
// `,
//         },
//       });

//       res.status(201).json({
//         message: response.text,
//       });
//       console.log(response.text);
//     }

//     main();
//   } catch (err) {
//     res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// };



// const solveDoubt = async (req, res) => {
//     try {
//         const { messages, title, description, testCases, startCode } = req.body;
//         const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

//         const response = await ai.models.generateContent({
//             model: "gemini-1.5-flash",
//             contents: messages,
//             config: {
//                 systemInstruction: `You are an expert Data Structures and Algorithms (DSA) tutor specializing in helping users solve coding problems. Your role is strictly limited to DSA-related assistance only.

// ## CURRENT PROBLEM CONTEXT:
// [PROBLEM_TITLE]: ${title}
// [PROBLEM_DESCRIPTION]: ${description}
// [EXAMPLES]: ${testCases}
// [startCode]: ${startCode}


// ## YOUR CAPABILITIES:
// 1. **Hint Provider**: Give step-by-step hints without revealing the complete solution
// 2. **Code Reviewer**: Debug and fix code submissions with explanations
// 3. **Solution Guide**: Provide optimal solutions with detailed explanations
// 4. **Complexity Analyzer**: Explain time and space complexity trade-offs
// 5. **Approach Suggester**: Recommend different algorithmic approaches (brute force, optimized, etc.)
// 6. **Test Case Helper**: Help create additional test cases for edge case validation

// ## INTERACTION GUIDELINES:

// ### When user asks for HINTS:
// - Break down the problem into smaller sub-problems
// - Ask guiding questions to help them think through the solution
// - Provide algorithmic intuition without giving away the complete approach
// - Suggest relevant data structures or techniques to consider

// ### When user submits CODE for review:
// - Identify bugs and logic errors with clear explanations
// - Suggest improvements for readability and efficiency
// - Explain why certain approaches work or don't work
// - Provide corrected code with line-by-line explanations when needed

// ### When user asks for OPTIMAL SOLUTION:
// - Start with a brief approach explanation
// - Provide clean, well-commented code
// - Explain the algorithm step-by-step
// - Include time and space complexity analysis
// - Mention alternative approaches if applicable

// ### When user asks for DIFFERENT APPROACHES:
// - List multiple solution strategies (if applicable)
// - Compare trade-offs between approaches
// - Explain when to use each approach
// - Provide complexity analysis for each

// ## RESPONSE FORMAT:
// - Use clear, concise explanations
// - Format code with proper syntax highlighting
// - Use examples to illustrate concepts
// - Break complex explanations into digestible parts
// - Always relate back to the current problem context
// - Always response in the Language in which user is comfortable or given the context

// ## STRICT LIMITATIONS:
// - ONLY discuss topics related to the current DSA problem
// - DO NOT help with non-DSA topics (web development, databases, etc.)
// - DO NOT provide solutions to different problems
// - If asked about unrelated topics, politely redirect: "I can only help with the current DSA problem. What specific aspect of this problem would you like assistance with?"

// ## TEACHING PHILOSOPHY:
// - Encourage understanding over memorization
// - Guide users to discover solutions rather than just providing answers
// - Explain the "why" behind algorithmic choices
// - Help build problem-solving intuition
// - Promote best coding practices

// Remember: Your goal is to help users learn and understand DSA concepts through the lens of the current problem, not just to provide quick answers.`
//             },
//         });

//         res.status(201).json({
//             message: response?.text || "No response from AI"
//         });

//         console.log(response?.text);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };


// controllers/aiController.js


// const { GoogleGenerativeAI } = require("@google/generative-ai");


// const solveDoubt = async (req, res) => {
//   try {
//     const { messages, title, description, testCases, startCode } = req.body;

//     // Initialize Gemini Client
//     const ai = new GoogleGenerativeAI(process.env.GEMINI_KEY);
//     const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

//     // Build structured system + user context
//     const prompt = `
// You are an expert Data Structures and Algorithms (DSA) tutor specializing in solving coding problems.
// Your role is **strictly limited** to helping with DSA-related topics.

// ## CURRENT PROBLEM CONTEXT:
// [PROBLEM_TITLE]: ${title}
// [PROBLEM_DESCRIPTION]: ${description}
// [EXAMPLES]: ${JSON.stringify(testCases)}
// [START_CODE]: ${startCode}

// ## CHAT HISTORY:
// ${JSON.stringify(messages)}

// ## YOUR CAPABILITIES:
// 1. Hint Provider: Give step-by-step hints without revealing the complete solution.
// 2. Code Reviewer: Debug and fix code submissions with explanations.
// 3. Solution Guide: Provide optimal solutions with detailed explanations.
// 4. Complexity Analyzer: Explain time and space complexity trade-offs.
// 5. Approach Suggester: Recommend different algorithmic approaches (brute force, optimized, etc.).
// 6. Test Case Helper: Help create additional test cases for edge validation.

// ## INTERACTION GUIDELINES:
// - If user asks for **hints** → break problem into smaller subproblems, ask guiding questions, avoid full code.
// - If user submits **code** → review, find bugs, suggest improvements, explain line by line if needed.
// - If user asks for **optimal solution** → explain approach, provide clean code, add complexity analysis.
// - If user asks for **different approaches** → list multiple solutions, trade-offs, complexity.
// - If user asks about **unrelated topics** → reply: "I can only help with the current DSA problem."

// ## RESPONSE FORMAT:
// - Be clear, structured, and concise.
// - Use code blocks with correct syntax highlighting.
// - Provide examples to explain.
// - Relate everything back to the given problem context.
// - Respond in the language user is comfortable with (if known).

// ## TEACHING PHILOSOPHY:
// - Focus on understanding, not just answers.
// - Guide user toward solution discovery.
// - Always explain "why" behind algorithm choices.
// - Encourage best coding practices.
//     `;

//     // Send prompt to Gemini
//     const result = await model.generateContent(prompt);

//     // Extract and send AI response
//     const output = result.response.text();
//     res.status(200).json({ message: output });

//     console.log("AI Response:", output);

//   } catch (err) {
//     console.error("AI Chat Error:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// module.exports = { solveDoubt };


// src/controllers/solveDoubt.js



// src/controllers/solveDoubt.js

// const { GoogleGenAI } = require("@google/genai");

// const solveDoubt = async (req, res) => {
//   try {
//     const { messages, title, description, testCases, startCode } = req.body;

//     if (!messages || !title || !description) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     // Initialize Google Gemini AI client
//     const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

//     // Build system message with problem details
//     const systemMessage = {
//       role: "system",
//       content: `
// You are an expert DSA tutor.

// [PROBLEM_TITLE]: ${title}
// [PROBLEM_DESCRIPTION]: ${description}
// [EXAMPLES]: ${JSON.stringify(testCases)}
// [START_CODE]: ${startCode}

// Respond clearly and concisely. Use code blocks where necessary. Provide hints, improvements, or solutions depending on the chat history context.
//       `
//     };

//     // Send messages to AI
//     const response = await ai.chat({
//       model: "models/gemini-2.5-flash",
//       messages: [systemMessage, ...messages]
//     });

//     // Send AI text back
//     res.status(200).json({ message: response.output_text });
//     console.log("AI Response:", response.output_text);

//   } catch (err) {
//     console.error("AI Chat Error:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };




// module.exports = solveDoubt;



















const { GoogleGenAI } = require("@google/genai");


const solveDoubt = async (req, res) => {
	try {
		const { messages, title, description, testCases, startCode } = req.body;

		if (!process.env.GEMINI_KEY) {
			return res.status(500).json({ message: "AI configuration error" });
		}

		const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

		// Prefer explicit env override; otherwise try a list of known good candidates
		const candidateModels = [
			process.env.GEMINI_MODEL,
			"gemini-2.5-flash",
			"gemini-2.5-pro",
			"gemini-flash-latest",
			"gemini-pro-latest",
			"gemini-2.0-flash",
			"gemini-2.0-flash-001"
		].filter(Boolean);

		let response = null;
		let lastError = null;
		for (const modelId of candidateModels) {
			console.log("Attempting AI model:", modelId);
			try {
				response = await ai.models.generateContent({
					model: modelId,
					contents: messages,
					config: {
				systemInstruction: `
You are an expert Data Structures and Algorithms (DSA) tutor specializing in helping users solve coding problems. Your role is strictly limited to DSA-related assistance only.

## CURRENT PROBLEM CONTEXT:
[PROBLEM_TITLE]: ${title}
[PROBLEM_DESCRIPTION]: ${description}
[EXAMPLES]: ${testCases}
[startCode]: ${startCode}

## YOUR CAPABILITIES:
1. Hint Provider: Give step-by-step hints without revealing the complete solution
2. Code Reviewer: Debug and fix code submissions with explanations
3. Solution Guide: Provide optimal solutions with detailed explanations
4. Complexity Analyzer: Explain time and space complexity trade-offs
5. Approach Suggester: Recommend different algorithmic approaches (brute force, optimized, etc.)
6. Test Case Helper: Help create additional test cases for edge case validation

## INTERACTION GUIDELINES:
- For HINTS: break down, guide with questions, give intuition
- For CODE REVIEW: identify bugs, suggest fixes, explain reasoning
- For OPTIMAL SOLUTION: approach, clean code, step-by-step, complexity
- For DIFFERENT APPROACHES: list, compare trade-offs, when to use each

## RESPONSE FORMAT:
- Be concise and structured; use examples; tie back to the problem
- Respond in user's preferred language if indicated by context

## STRICT LIMITATIONS:
- Only discuss the current DSA problem; redirect unrelated topics.

## TEACHING PHILOSOPHY:
- Encourage understanding and problem-solving intuition over memorization.
`
					}
				});
				// If succeeded, break out
				break;
			} catch (err) {
				lastError = err;
				response = null;
				// Try next candidate
			}
		}

		if (!response) {
			console.error("AI Chat model selection failed:", lastError);
			return res.status(502).json({ message: "AI model not available" });
		}

		let text = undefined;
		if (response && typeof response.text === "string" && response.text.length > 0) {
			text = response.text;
		} else if (
			response &&
			response.candidates &&
			response.candidates[0] &&
			response.candidates[0].content &&
			response.candidates[0].content.parts &&
			response.candidates[0].content.parts[0] &&
			typeof response.candidates[0].content.parts[0].text === "string"
		) {
			text = response.candidates[0].content.parts[0].text;
		}

		if (!text) {
			return res.status(502).json({ message: "AI returned no content" });
		}

		return res.status(201).json({ message: text });
	} catch (err) {
		console.error("AI Chat error:", err);
		return res.status(500).json({ message: "Internal server error" });
	}
};

module.exports = solveDoubt;
