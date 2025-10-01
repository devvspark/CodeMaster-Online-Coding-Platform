// // Import necessary React hooks and libraries
// import { useState, useRef, useEffect } from "react";
// import { useForm } from "react-hook-form"; // Form handling library
// import axiosClient from "../utils/axiosClient"; // Axios instance for API calls
// import { Send } from 'lucide-react'; // Icon for send button

// // ChatAi component accepts a 'problem' prop containing problem data
// function ChatAi({ problem }) {

//   // Chat messages state with default initial messages
//   const [messages, setMessages] = useState([
//     { role: 'model', parts: [{ text: "Hi, How are you" }] },  // AI message
//     { role: 'user', parts: [{ text: "I am Good" }] }           // User message
//   ]);

//   // React Hook Form setup
//   const { register, handleSubmit, reset, formState: { errors } } = useForm();

//   // Ref to scroll chat to bottom automatically
//   const messagesEndRef = useRef(null);

//   // // for preventing data on page refresh
//   // useEffect(() => {
//   //   localStorage.setItem(`chatMessages-${problem.id}`, JSON.stringify(messages));
//   // }, [messages, problem.id]);

//   // useEffect(() => {
//   //   const storedMessages = localStorage.getItem(`chatMessages-${problem.id}`);
//   //   if (storedMessages) {
//   //     setMessages(JSON.parse(storedMessages));
//   //   }
//   // }, [problem.id]);
  
  
//   // Scroll to the latest message whenever the message list changes
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // New state for thinking indicator
//   const [isThinking, setIsThinking] = useState(false);

//   // Form submit handler
//   const onSubmit = async (data) => {
//     // Add user's message to the chat history
//     setMessages(prev => [...prev, { role: 'user', parts: [{ text: data.message }] }]);
//     reset(); // Clear input field
//     setIsThinking(true);

//     try {
//       // Send chat history and problem details to backend for AI response
//       const response = await axiosClient.post("/ai/chat", {
//         messages: messages,                     // entire chat context
//         title: problem.title,                   // problem title
//         description: problem.description,       // problem description
//         testCases: problem.visibleTestCases,    // example test cases
//         startCode: problem.startCode            // initial code template
//       });

//       setIsThinking(false);
//       // Add AI's response to the chat
//       setMessages(prev => [...prev, {
//         role: 'model',
//         parts: [{ text: response.data.message }]
//       }]);
//     } catch (error) {
//       setIsThinking(false);
//       // Handle API error by adding a failure message
//       console.error("API Error:", error);
//       setMessages(prev => [...prev, {
//         role: 'model',
//         parts: [{ text: "Error from AI Chatbot" }]
//       }]);
//     }
//   };

//   // JSX return for rendering the chat interface
//   return (
//     <div className="flex flex-col h-[78vh] bg-white rounded-2xl shadow-lg border border-base-200 overflow-hidden">
//       {/* Chat history container */}
//       <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
//         {messages.map((msg, index) => (
//           <div key={index} className={`flex items-end mb-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
//             {msg.role === "model" && (
//               <div className="flex-shrink-0 mr-2">
//                 <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg shadow-sm">A</div>
//               </div>
//             )}
//             <div className={`px-4 py-2 rounded-2xl text-base max-w-[70%] break-words shadow-sm ${msg.role === "user" ? "bg-blue-500 text-white rounded-br-md" : "bg-gray-100 text-gray-900 rounded-bl-md"}`}>
//               {msg.parts[0].text}
//             </div>
//             {msg.role === "user" && (
//               <div className="flex-shrink-0 ml-2">
//                 <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg shadow-sm">U</div>
//               </div>
//             )}
//           </div>
//         ))}
//         {/* Show 'Thinking...' message when waiting for AI */}
//         {isThinking && (
//           <div className="flex items-end mb-3 justify-start">
//             <div className="flex-shrink-0 mr-2">
//               <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg shadow-sm">A</div>
//             </div>
//             <div className="px-4 py-2 rounded-2xl text-base max-w-[70%] break-words shadow-sm bg-gray-100 text-gray-400 rounded-bl-md italic">
//               Thinking...
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Message input form */}
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="p-4 bg-white border-t border-base-200 shadow-sm"
//       >
//         <div className="flex items-center gap-2">
//           <input
//             placeholder="Ask me anything"
//             className="input input-bordered flex-1 text-base px-4 py-2 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
//             {...register("message", { required: true, minLength: 2 })}
//           />
//           <button
//             type="submit"
//             className="btn btn-primary rounded-full px-4 py-2 shadow-md disabled:opacity-50"
//             disabled={errors.message}
//           >
//             <Send size={20} />
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// // Export the component for use in other files
// export default ChatAi;
















// Import necessary React hooks and libraries
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form"; // Form handling library
import axiosClient from "../utils/axiosClient"; // Axios instance for API calls
import { Send } from 'lucide-react'; // Icon for send button

// ChatAi component accepts a 'problem' prop containing problem data
function ChatAi({ problem }) {

  // Chat messages state with default initial messages
  const [messages, setMessages] = useState([
    { role: 'model', parts: [{ text: "Hi, How are you" }] },  // AI message
    { role: 'user', parts: [{ text: "I am Good" }] }           // User message
  ]);

  // React Hook Form setup
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Ref to scroll chat to bottom automatically
  const messagesEndRef = useRef(null);

  // // for preventing data on page refresh
  // useEffect(() => {
  //   localStorage.setItem(`chatMessages-${problem.id}`, JSON.stringify(messages));
  // }, [messages, problem.id]);

  // useEffect(() => {
  //   const storedMessages = localStorage.getItem(`chatMessages-${problem.id}`);
  //   if (storedMessages) {
  //     setMessages(JSON.parse(storedMessages));
  //   }
  // }, [problem.id]);
  
  
  // Scroll to the latest message whenever the message list changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // New state for thinking indicator
  const [isThinking, setIsThinking] = useState(false);

  // Form submit handler
  const onSubmit = async (data) => {
    // Build next messages array synchronously to avoid stale state
    const userMessage = { role: 'user', parts: [{ text: data.message }] };
    const nextMessages = [...messages, userMessage];

    // Update UI immediately
    setMessages(nextMessages);
    reset();
    setIsThinking(true);

    try {
      // Send updated chat history and problem details to backend for AI response
      const response = await axiosClient.post("/ai/chat", {
        messages: nextMessages,
        title: problem.title,
        description: problem.description,
        testCases: problem.visibleTestCases,
        startCode: problem.startCode
      });

      setIsThinking(false);
      // Append AI response
      setMessages(prev => [...prev, {
        role: 'model',
        parts: [{ text: response?.data?.message || "" }]
      }]);
    } catch (error) {
      setIsThinking(false);
      console.error("API Error:", error);
      setMessages(prev => [...prev, {
        role: 'model',
        parts: [{ text: "Error from AI Chatbot" }]
      }]);
    }
  };

  // JSX return for rendering the chat interface
  return (
    <div className="flex flex-col h-[78vh] bg-white rounded-2xl shadow-lg border border-base-200 overflow-hidden">
      {/* Chat history container */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end mb-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "model" && (
              <div className="flex-shrink-0 mr-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg shadow-sm">A</div>
              </div>
            )}
            <div className={`px-4 py-2 rounded-2xl text-base max-w-[70%] break-words shadow-sm ${msg.role === "user" ? "bg-blue-500 text-white rounded-br-md" : "bg-gray-100 text-gray-900 rounded-bl-md"}`}>
              {msg.parts[0].text}
            </div>
            {msg.role === "user" && (
              <div className="flex-shrink-0 ml-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg shadow-sm">U</div>
              </div>
            )}
          </div>
        ))}
        {/* Show 'Thinking...' message when waiting for AI */}
        {isThinking && (
          <div className="flex items-end mb-3 justify-start">
            <div className="flex-shrink-0 mr-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg shadow-sm">A</div>
            </div>
            <div className="px-4 py-2 rounded-2xl text-base max-w-[70%] break-words shadow-sm bg-gray-100 text-gray-400 rounded-bl-md italic">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 bg-white border-t border-base-200 shadow-sm"
      >
        <div className="flex items-center gap-2">
          <input
            placeholder="Ask me anything"
            className="input input-bordered flex-1 text-base px-4 py-2 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            {...register("message", { required: true, minLength: 2 })}
          />
          <button
            type="submit"
            className="btn btn-primary rounded-full px-4 py-2 shadow-md disabled:opacity-50"
            disabled={errors.message}
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}

// Export the component for use in other files
export default ChatAi;
