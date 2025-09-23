import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router";
import axiosClient from "../utils/axiosClient";
import SubmissionHistory from "../components/SubmissionHistory";
import ChatAi from "../components/ChatAi";
import Editorial from "../components/Editorial";
// import TimerStopwatch from '../components/TimerStopwatch';

const langMap = {
  cpp: "C++",
  java: "Java",
  javascript: "JavaScript",
};

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [runLoading, setRunLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState("description");
  const [activeRightTab, setActiveRightTab] = useState("code");
  const editorRef = useRef(null);
  let { problemId } = useParams();
  const [serialNumber, setSerialNumber] = useState(1);

  const { handleSubmit } = useForm();

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(
          `/problem/problemById/${problemId}`
        );
        // Defensive check for startCode
        let initialCode = "";
        if (response.data.startCode && Array.isArray(response.data.startCode)) {
          const codeObj = response.data.startCode.find(
            (sc) => sc.language === langMap[selectedLanguage]
          );
          initialCode = codeObj ? codeObj.initialCode : "";
        }
        setProblem(response.data);
        setCode(initialCode);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching problem:", error);
        setProblem(null);
        setCode("");
        setLoading(false);
      }
    };
    fetchProblem();
  }, [problemId]); // Re-run if problemId changes

  // Update code when language changes
  useEffect(() => {
    if (problem && problem.startCode && Array.isArray(problem.startCode)) {
      const codeObj = problem.startCode.find(
        (sc) => sc.language === langMap[selectedLanguage]
      );
      setCode(codeObj ? codeObj.initialCode : "");
    }
  }, [selectedLanguage, problem]);

  // Fetch all problems to determine serial number
  useEffect(() => {
    const fetchAllProblems = async () => {
      try {
        const response = await axiosClient.get("/problem/getAllProblem");
        const problems = response.data;
        const idx = problems.findIndex((p) => p._id === problemId);
        if (idx !== -1) setSerialNumber(idx + 1);
      } catch (e) {
        setSerialNumber(1);
      }
    };
    fetchAllProblems();
  }, [problemId]);

  const handleEditorChange = (value) => {
    setCode(value || "");
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("Run button clicked!");

    if (runLoading || submitLoading) {
      console.log("Already loading, ignoring click");
      return;
    }

    setRunLoading(true);
    setRunResult(null);

    try {
      console.log("Sending run request...");
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage,
      });

      setRunResult(response.data);
      setRunLoading(false);
      setActiveRightTab("testcase");
      console.log("Run completed successfully");
    } catch (error) {
      console.error("Error running code:", error);
      setRunResult({
        success: false,
        error: "Internal server error",
      });
      setRunLoading(false);
      setActiveRightTab("testcase");
    }
  };

  const handleSubmitCode = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("Submit button clicked!");

    if (runLoading || submitLoading) {
      console.log("Already loading, ignoring click");
      return;
    }

    setSubmitLoading(true);
    setSubmitResult(null);

    try {
      console.log("Sending submit request...");
      const response = await axiosClient.post(
        `/submission/submit/${problemId}`,
        {
          code: code,
          language: selectedLanguage,
        }
      );

      setSubmitResult(response.data);
      setSubmitLoading(false);
      setActiveRightTab("result");
      console.log("Submit completed successfully");
    } catch (error) {
      console.error("Error submitting code:", error);
      setSubmitResult(null);
      setSubmitLoading(false);
      setActiveRightTab("result");
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case "javascript":
        return "javascript";
      case "java":
        return "java";
      case "cpp":
        return "cpp";
      default:
        return "javascript";
    }
  };

  const getDifficultyColor = (difficulty, pastel = false) => {
    if (pastel) {
      switch (difficulty) {
        case "easy":
          return "bg-green-50 text-green-700 border-green-100";
        case "medium":
          return "bg-yellow-50 text-yellow-700 border-yellow-100";
        case "hard":
          return "bg-red-50 text-red-700 border-red-100";
        default:
          return "bg-gray-50 text-gray-700 border-gray-100";
      }
    } else {
      switch (difficulty) {
        case "easy":
          return "text-green-500";
        case "medium":
          return "text-yellow-500";
        case "hard":
          return "text-red-500";
        default:
          return "text-gray-500";
      }
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-base-100">
      {/* Left Panel */}
      <div className="w-1/2 flex flex-col border-r border-base-300">
        {/* Left Tabs - Modern pill style */}
        <div className="flex gap-2 px-6 pt-4 pb-2 bg-base-200 border-b border-base-300">
          {[
            {
              key: "description",
              label: "Description",
              icon: (
                <svg
                  className={`h-5 w-5 ${
                    activeLeftTab === "description"
                      ? "text-blue-500"
                      : "text-blue-200"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
                  />
                </svg>
              ),
            },
            {
              key: "solutions",
              label: "Solutions",
              icon: (
                <svg
                  className={`h-5 w-5 ${
                    activeLeftTab === "solutions"
                      ? "text-blue-500"
                      : "text-blue-200"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536M9 13h6m2 2a9 9 0 11-6.219-8.56"
                  />
                </svg>
              ),
            },
            {
              key: "editorial",
              label: "Editorial",
              icon: (
                <svg
                  className={`h-5 w-5 ${
                    activeLeftTab === "editorial"
                      ? "text-yellow-500"
                      : "text-yellow-200"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 20h9"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16.5 3.5a2.121 2.121 0 013 3L7 19.5 3 21l1.5-4L16.5 3.5z"
                  />
                </svg>
              ),
            },
            {
              key: "submissions",
              label: "Submissions",
              icon: (
                <svg
                  className={`h-5 w-5 ${
                    activeLeftTab === "submissions"
                      ? "text-blue-500"
                      : "text-blue-200"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ),
            },
            {
              key: "chatAI",
              label: "ChatAI",
              icon: (
                <svg
                  className={`h-5 w-5 ${
                    activeLeftTab === "chatAI"
                      ? "text-purple-500"
                      : "text-purple-200"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 20h9"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M8 15h8M8 11h8M8 7h8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ),
            },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`px-4 py-1 rounded-full font-semibold transition-all duration-150 text-sm flex items-center gap-2
                ${
                  activeLeftTab === tab.key
                    ? "bg-blue-100 text-blue-800 shadow"
                    : "bg-base-100 text-gray-700 hover:bg-blue-50"
                }`}
              onClick={() => setActiveLeftTab(tab.key)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Left Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {problem && (
            <>
              {activeLeftTab === "description" && (
                <div>
                  {/* Problem Title and Badges */}
                  <div className="flex flex-wrap items-center mb-8 pb-4 border-b border-base-300">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-extrabold text-gray-700 flex items-center">
                        {serialNumber}.
                      </span>
                      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
                        {problem.title}
                      </h1>
                    </div>
                    <span
                      className={`ml-5 px-3 py-1 rounded-full font-semibold text-sm shadow-sm flex items-center ${getDifficultyColor(
                        problem.difficulty,
                        true
                      )} border border-base-300`}
                    >
                      {problem.difficulty.charAt(0).toUpperCase() +
                        problem.difficulty.slice(1)}
                    </span>
                    <span className="ml-2 px-3 py-1 rounded-full font-semibold text-sm bg-blue-50 text-blue-700 shadow-sm border border-blue-100 flex items-center">
                      {problem.tags}
                    </span>
                  </div>

                  {/* Problem Description */}
                  <div className="prose max-w-none mb-8">
                    <div className="whitespace-pre-wrap text-base leading-relaxed text-gray-800">
                      {problem.description}
                    </div>
                  </div>

                  {/* Examples Card */}
                  <div className="mt-6">
                    <h3 className="text-lg font-bold mb-4 text-gray-900">
                      Examples:
                    </h3>
                    <div className="space-y-4">
                      {problem.visibleTestCases.map((example, index) => (
                        <div
                          key={index}
                          className="bg-blue-50 border border-blue-100 p-5 rounded-xl shadow-sm"
                        >
                          <h4 className="font-semibold mb-2 text-blue-700">
                            Example {index + 1}:
                          </h4>
                          <div className="space-y-2 text-base font-mono">
                            <div>
                              <span className="font-bold text-gray-700">
                                Input:
                              </span>{" "}
                              <span className="text-gray-800">
                                {example.input}
                              </span>
                            </div>
                            <div>
                              <span className="font-bold text-gray-700">
                                Output:
                              </span>{" "}
                              <span className="text-gray-800">
                                {example.output}
                              </span>
                            </div>
                            <div>
                              <span className="font-bold text-gray-700">
                                Explanation:
                              </span>{" "}
                              <span className="text-gray-800">
                                {example.explanation}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* {activeLeftTab === 'editorial' && (
                <div className="prose max-w-none">
                  <h2 className="text-xl font-bold mb-4">Editorial</h2>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration}/>
                  </div>
                </div>
              )} */}
              

              {activeLeftTab === "editorial" && (
                <div className="prose max-w-none">
                  <h2 className="text-xl font-bold mb-4">Editorial</h2>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {problem.secureUrl ? (
                      <video
                        src={problem.secureUrl} // Cloudinary video URL
                        poster={problem.thumbnailUrl} // Thumbnail image
                        controls
                        width="100%"
                        preload="metadata"
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <p>No video available</p>
                    )}
                    {problem.duration && (
                      <p className="text-sm text-gray-500 mt-2">
                        Duration: {Math.floor(problem.duration)} seconds
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeLeftTab === "solutions" && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Solutions</h2>
                  <div className="space-y-6">
                    {problem.referenceSolution?.map((solution, index) => (
                      <div
                        key={index}
                        className="border border-base-300 rounded-lg"
                      >
                        <div className="bg-base-200 px-4 py-2 rounded-t-lg">
                          <h3 className="font-semibold">
                            {problem?.title} - {solution?.language}
                          </h3>
                        </div>
                        <div className="p-4">
                          <pre className="bg-base-300 p-4 rounded text-sm overflow-x-auto">
                            <code>{solution?.completeCode}</code>
                          </pre>
                        </div>
                      </div>
                    )) || (
                      <p className="text-gray-500">
                        Solutions will be available after you solve the problem.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeLeftTab === "submissions" && (
                <div>
                  <h2 className="text-xl font-bold mb-4">My Submissions</h2>
                  <div className="text-gray-500">
                    <SubmissionHistory problemId={problemId} />
                  </div>
                </div>
              )}

              {activeLeftTab === "chatAI" && (
                <div className="prose max-w-none">
                  <h2 className="text-xl font-bold mb-4">CHAT with AI</h2>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    <ChatAi problem={problem}></ChatAi>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 flex flex-col">
        {/* Right Tabs - Modern pill style */}
        <div className="flex gap-2 px-6 pt-4 pb-2 bg-base-200 border-b border-base-300">
          {[
            {
              key: "code",
              label: "Code",
              icon: (
                <svg
                  className={`h-5 w-5 ${
                    activeRightTab === "code"
                      ? "text-green-500"
                      : "text-green-200"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 18l6-6-6-6M8 6l-6 6 6 6"
                  />
                </svg>
              ),
            },
            {
              key: "testcase",
              label: "Testcase",
              icon: (
                <svg
                  className={`h-5 w-5 ${
                    activeRightTab === "testcase"
                      ? "text-blue-500"
                      : "text-blue-200"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L6 21.75 2.25 17M6 21.75V3"
                  />
                </svg>
              ),
            },
            {
              key: "result",
              label: "Result",
              icon: (
                <svg
                  className={`h-5 w-5 ${
                    activeRightTab === "result"
                      ? "text-purple-500"
                      : "text-purple-200"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ),
            },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`px-4 py-1 rounded-full font-semibold transition-all duration-150 text-sm flex items-center gap-2
                ${
                  activeRightTab === tab.key
                    ? "bg-blue-100 text-blue-800 shadow"
                    : "bg-base-100 text-gray-700 hover:bg-blue-50"
                }`}
              onClick={() => setActiveRightTab(tab.key)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
          {/* <div className="flex items-end gap-2 ml-78">
                  <TimerStopwatch problemId={problemId} />
          </div> */}
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col">
          {activeRightTab === "code" && (
            <div className="flex-1 flex flex-col bg-base-100 rounded-b-xl border-b border-base-200">
              {/* Language Selector - Modern pills */}
              <div className="flex justify-between items-center p-4 border-b border-base-300">
                <div className="flex gap-2">
                  {["javascript", "java", "cpp"].map((lang) => (
                    <button
                      key={lang}
                      className={`px-4 py-1 rounded-full font-semibold transition-all duration-150 text-sm
                        ${
                          selectedLanguage === lang
                            ? "bg-blue-100 text-blue-800 shadow"
                            : "bg-base-100 text-gray-700 hover:bg-blue-50"
                        }`}
                      onClick={() => handleLanguageChange(lang)}
                    >
                      {lang === "cpp"
                        ? "C++"
                        : lang === "javascript"
                        ? "JavaScript"
                        : "Java"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1 border-t border-base-200 bg-base-200">
                <Editor
                  height="100%"
                  language={getLanguageForMonaco(selectedLanguage)}
                  value={code}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  theme="vs-dark"
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    insertSpaces: true,
                    wordWrap: "on",
                    lineNumbers: "on",
                    glyphMargin: false,
                    folding: true,
                    lineDecorationsWidth: 10,
                    lineNumbersMinChars: 3,
                    renderLineHighlight: "line",
                    selectOnLineNumbers: true,
                    roundedSelection: false,
                    readOnly: false,
                    cursorStyle: "line",
                    mouseWheelZoom: true,
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-base-300 flex justify-between bg-base-100 rounded-b-xl">
                <div className="flex gap-2">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setActiveRightTab("testcase")}
                  >
                    Console
                  </button>
                </div>
                <div className="flex gap-3">
                  <button
                    id="run-button"
                    type="button"
                    className={`px-6 py-2 rounded-full font-semibold border border-blue-300 text-blue-700 bg-white hover:bg-blue-50 transition-all duration-150 shadow-sm ${
                      runLoading ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                    onClick={handleRun}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    disabled={runLoading}
                    style={{ position: "relative", zIndex: 10 }}
                  >
                    {runLoading ? "Running..." : "Run"}
                  </button>
                  <button
                    id="submit-button"
                    type="button"
                    className={`px-6 py-2 rounded-full font-semibold border border-blue-400 text-white bg-blue-400 hover:bg-blue-500 transition-all duration-150 shadow-sm ${
                      submitLoading ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                    onClick={handleSubmitCode}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    disabled={submitLoading}
                    style={{ position: "relative", zIndex: 10 }}
                  >
                    {submitLoading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeRightTab === "testcase" && (
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="font-semibold mb-4">Test Results</h3>
              {runResult ? (
                <div
                  className={`alert ${
                    runResult.success ? "alert-success" : "alert-error"
                  } mb-4`}
                >
                  <div>
                    {runResult.success ? (
                      <div>
                        <h4 className="font-bold">✅ All test cases passed!</h4>
                        <p className="text-sm mt-2">
                          Runtime: {runResult.runtime + " sec"}
                        </p>
                        <p className="text-sm">
                          Memory: {runResult.memory + " KB"}
                        </p>

                        <div className="mt-4 space-y-2">
                          {runResult.testCases.map((tc, i) => (
                            <div
                              key={i}
                              className="bg-base-100 p-3 rounded text-xs"
                            >
                              <div className="font-mono">
                                <div>
                                  <strong>Input:</strong> {tc.stdin}
                                </div>
                                <div>
                                  <strong>Expected:</strong>{" "}
                                  {tc.expected_output}
                                </div>
                                <div>
                                  <strong>Output:</strong> {tc.stdout}
                                </div>
                                <div className={"text-green-600"}>
                                  {"✓ Passed"}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-bold">❌ Error</h4>
                        <div className="mt-4 space-y-2">
                          {runResult.testCases.map((tc, i) => (
                            <div
                              key={i}
                              className="bg-base-100 p-3 rounded text-xs"
                            >
                              <div className="font-mono">
                                <div>
                                  <strong>Input:</strong> {tc.stdin}
                                </div>
                                <div>
                                  <strong>Expected:</strong>{" "}
                                  {tc.expected_output}
                                </div>
                                <div>
                                  <strong>Output:</strong> {tc.stdout}
                                </div>
                                <div
                                  className={
                                    tc.status_id == 3
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }
                                >
                                  {tc.status_id == 3 ? "✓ Passed" : "✗ Failed"}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">
                  Click "Run" to test your code with the example test cases.
                </div>
              )}
            </div>
          )}

          {activeRightTab === "result" && (
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="font-semibold mb-4">Submission Result</h3>
              {submitResult ? (
                <div
                  className={`alert ${
                    submitResult.accepted ? "alert-success" : "alert-error"
                  }`}
                >
                  <div>
                    {submitResult.accepted ? (
                      <div>
                        <h4 className="font-bold text-lg">🎉 Accepted</h4>
                        <div className="mt-4 space-y-2">
                          <p>
                            Test Cases Passed: {submitResult.passedTestCases}/
                            {submitResult.totalTestCases}
                          </p>
                          <p>Runtime: {submitResult.runtime + " sec"}</p>
                          <p>Memory: {submitResult.memory + "KB"} </p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-bold text-lg">
                          ❌ {submitResult.error}
                        </h4>
                        <div className="mt-4 space-y-2">
                          <p>
                            Test Cases Passed: {submitResult.passedTestCases}/
                            {submitResult.totalTestCases}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">
                  Click "Submit" to submit your solution for evaluation.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
