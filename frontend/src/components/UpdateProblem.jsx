// import { useEffect, useState } from 'react';
// import axiosClient from '../utils/axiosClient';
// import { useForm, useFieldArray } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';

// // Constants for form options
// const TAGS = ['array', 'linkedList', 'graph', 'dp'];
// const DIFFICULTIES = ['easy', 'medium', 'hard'];
// const LANGUAGES = ['C++', 'Java', 'JavaScript'];

// // Zod schema for form validation
// const problemSchema = z.object({
//   title: z.string().min(1, 'Title is required'),
//   description: z.string().min(1, 'Description is required'),
//   difficulty: z.enum(['easy', 'medium', 'hard']),
//   tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
//   visibleTestCases: z.array(
//     z.object({
//       input: z.string().min(1, 'Input is required'),
//       output: z.string().min(1, 'Output is required'),
//       explanation: z.string().min(1, 'Explanation is required')
//     })
//   ).min(1, 'At least one visible test case required'),
//   hiddenTestCases: z.array(
//     z.object({
//       input: z.string().min(1, 'Input is required'),
//       output: z.string().min(1, 'Output is required')
//     })
//   ).min(1, 'At least one hidden test case required'),
//   startCode: z.array(
//     z.object({
//       language: z.enum(['C++', 'Java', 'JavaScript']),
//       initialCode: z.string().min(1, 'Initial code is required')
//     })
//   ).length(3, 'All three languages required'),
//   referenceSolution: z.array(
//     z.object({
//       language: z.enum(['C++', 'Java', 'JavaScript']),
//       completeCode: z.string().min(1, 'Complete code is required')
//     })
//   ).length(3, 'All three languages required')
// });

// function UpdateProblem() {
//   const [problems, setProblems] = useState([]);
//   const [search, setSearch] = useState('');
//   const [selectedProblem, setSelectedProblem] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [feedback, setFeedback] = useState(null);

//   const {
//     register,
//     control,
//     handleSubmit,
//     reset,
//     formState: { errors }
//   } = useForm({
//     resolver: zodResolver(problemSchema),
//     defaultValues: {
//       visibleTestCases: [{
//         input: '',
//         output: '',
//         explanation: ''
//       }],
//       hiddenTestCases: [{
//         input: '',
//         output: ''
//       }],
//       startCode: LANGUAGES.map(lang => ({
//         language: lang,
//         initialCode: ''
//       })),
//       referenceSolution: LANGUAGES.map(lang => ({
//         language: lang,
//         completeCode: ''
//       }))
//     }
//   });

//   const {
//     fields: visibleFields,
//     append: appendVisible,
//     remove: removeVisible
//   } = useFieldArray({
//     control,
//     name: 'visibleTestCases'
//   });

//   const {
//     fields: hiddenFields,
//     append: appendHidden,
//     remove: removeHidden
//   } = useFieldArray({
//     control,
//     name: 'hiddenTestCases'
//   });

//   useEffect(() => {
//     const fetchProblems = async () => {
//       try {
//         setLoading(true);
//         const { data } = await axiosClient.get('/problem/getAllProblem');
//         setProblems(data);
//       } catch (err) {
//         setFeedback({ type: 'error', message: 'Failed to fetch problems' });
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProblems();
//   }, []);

//   useEffect(() => {
//     if (selectedProblem) {
//       const fetchProblemDetails = async () => {
//         try {
//           setLoading(true);
//           const { data } = await axiosClient.get(`/problem/problemById/${selectedProblem._id}`);
          
//           // Transform the data to match our form structure
//           const formData = {
//             ...data,
//             visibleTestCases: data.visibleTestCases || [{
//               input: '',
//               output: '',
//               explanation: ''
//             }],
//             hiddenTestCases: data.hiddenTestCases || [{
//               input: '',
//               output: ''
//             }],
//             startCode: LANGUAGES.map(lang => {
//               const existingCode = data.startCode?.find(sc => sc.language === lang);
//               return {
//                 language: lang,
//                 initialCode: existingCode?.initialCode || `// ${lang} initial code here`
//               };
//             }),
//             referenceSolution: LANGUAGES.map(lang => {
//               const existingSolution = data.referenceSolution?.find(rs => rs.language === lang);
//               return {
//                 language: lang,
//                 completeCode: existingSolution?.completeCode || `// ${lang} solution here`
//               };
//             })
//           };

//           reset(formData);
//           setFeedback(null);
//         } catch (err) {
//           setFeedback({ type: 'error', message: 'Failed to fetch problem details' });
//           console.error(err);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchProblemDetails();
//     }
//   }, [selectedProblem, reset]);

//   const onSubmit = async (data) => {
//     if (!selectedProblem) return;
    
//     try {
//       setLoading(true);
//       setFeedback(null);
      
//       await axiosClient.put(`/problem/update/${selectedProblem._id}`, data);
      
//       setFeedback({ type: 'success', message: 'Problem updated successfully!' });
      
//       // Refresh problems list
//       const { data: updatedProblems } = await axiosClient.get('/problem/getAllProblem');
//       setProblems(updatedProblems);
//     } catch (err) {
//       setFeedback({ 
//         type: 'error', 
//         message: err.response?.data?.message || 'Failed to update problem' 
//       });
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredProblems = problems.filter(problem =>
//     problem.title.toLowerCase().includes(search.toLowerCase()) ||
//     problem.tags?.toLowerCase().includes(search.toLowerCase())
//   );

//   if (loading && !selectedProblem) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center mb-10">
//           <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">Update Problems</h1>
//         </div>

//         <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-10 overflow-x-auto">
//           <div className="mb-6">
//             <input
//               type="text"
//               placeholder="Search by title or tag..."
//               className="input input-bordered w-full max-w-lg"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>
          
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 py-3 text-left text-lg font-bold text-gray-700">#</th>
//                 <th className="px-4 py-3 text-left text-lg font-bold text-gray-700">Title</th>
//                 <th className="px-4 py-3 text-left text-lg font-bold text-gray-700">Difficulty</th>
//                 <th className="px-4 py-3 text-left text-lg font-bold text-gray-700">Tags</th>
//                 <th className="px-4 py-3 text-left text-lg font-bold text-gray-700">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {filteredProblems.map((problem, index) => (
//                 <tr key={problem._id} className={selectedProblem?._id === problem._id ? 'bg-blue-50' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                   <td className="px-4 py-4 font-bold text-lg text-gray-800">{index + 1}</td>
//                   <td className="px-4 py-4 text-gray-900 font-medium">{problem.title}</td>
//                   <td className="px-4 py-4">
//                     <span className={`px-5 py-1.5 rounded-full text-base font-semibold shadow-sm ${
//                       problem.difficulty.toLowerCase() === 'easy'
//                         ? 'bg-green-100 text-green-600'
//                         : problem.difficulty.toLowerCase() === 'medium'
//                         ? 'bg-orange-100 text-orange-500'
//                         : 'bg-red-100 text-red-500'
//                     }`}>
//                       {problem.difficulty}
//                     </span>
//                   </td>
//                   <td className="px-4 py-4">
//                     <span className="px-4 py-1 rounded-full text-base font-semibold bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">
//                       {problem.tags}
//                     </span>
//                   </td>
//                   <td className="px-4 py-4">
//                     <button
//                       onClick={() => setSelectedProblem(problem)}
//                       className="btn btn-warning btn-md rounded-full shadow-md font-bold px-6 transition-all duration-150 hover:scale-105 hover:shadow-lg"
//                     >
//                       Update
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {selectedProblem && (
//           <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100">
//             <h2 className="text-2xl font-bold mb-6 text-blue-700">Edit Problem</h2>
            
//             {feedback && (
//               <div className={`alert mb-6 ${feedback.type === 'success' ? 'alert-success' : 'alert-error'}`}>
//                 <div>
//                   {feedback.type === 'success' ? (
//                     <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                   ) : (
//                     <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                   )}
//                   <span>{feedback.message}</span>
//                 </div>
//               </div>
//             )}
            
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
//                 <div className="space-y-6">
//                   <div className="form-control">
//                     <label className="label font-semibold text-gray-700">Title</label>
//                     <input
//                       {...register('title')}
//                       className={`input input-bordered input-lg w-full ${errors.title ? 'input-error' : ''}`}
//                     />
//                     {errors.title && <span className="text-error text-sm">{errors.title.message}</span>}
//                   </div>
//                   <div className="form-control">
//                     <label className="label font-semibold text-gray-700">Description</label>
//                     <textarea
//                       {...register('description')}
//                       className={`textarea textarea-bordered textarea-lg w-full ${errors.description ? 'textarea-error' : ''}`}
//                       rows={5}
//                     />
//                     {errors.description && <span className="text-error text-sm">{errors.description.message}</span>}
//                   </div>
//                 </div>
//                 <div className="flex flex-col gap-6 justify-between w-full">
//                   <div className="form-control">
//                     <label className="label font-semibold text-gray-700">Difficulty</label>
//                     <select
//                       {...register('difficulty')}
//                       className={`select select-bordered select-lg w-full ${errors.difficulty ? 'select-error' : ''}`}
//                     >
//                       <option value="easy">Easy</option>
//                       <option value="medium">Medium</option>
//                       <option value="hard">Hard</option>
//                     </select>
//                   </div>
//                   <div className="form-control self-start mt-0 w-full">
//                     <label className="label font-semibold text-gray-700">Tag</label>
//                     <select
//                       {...register('tags')}
//                       className={`select select-bordered select-lg w-full ${errors.tags ? 'select-error' : ''}`}
//                     >
//                       <option value="array">Array</option>
//                       <option value="linkedList">Linked List</option>
//                       <option value="graph">Graph</option>
//                       <option value="dp">DP</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>
              
//               <div>
//                 <h3 className="text-xl font-bold mb-4 text-gray-800">Test Cases</h3>
                
//                 <div className="space-y-4 mb-8">
//                   <div className="flex justify-between items-center">
//                     <h4 className="font-semibold text-gray-800">Visible Test Cases</h4>
//                     <button
//                       type="button"
//                       onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
//                       className="btn btn-primary btn-md rounded-full shadow"
//                     >
//                       Add Visible Case
//                     </button>
//                   </div>
//                   {visibleFields.map((field, index) => (
//                     <div key={field.id} className="border border-gray-200 p-4 rounded-xl bg-gray-50 space-y-2">
//                       <div className="flex justify-end">
//                         <button
//                           type="button"
//                           onClick={() => removeVisible(index)}
//                           className="btn btn-xs btn-error rounded-full"
//                         >
//                           Remove
//                         </button>
//                       </div>
//                       <input
//                         {...register(`visibleTestCases.${index}.input`)}
//                         placeholder="Input"
//                         className="input input-bordered w-full"
//                       />
//                       <input
//                         {...register(`visibleTestCases.${index}.output`)}
//                         placeholder="Output"
//                         className="input input-bordered w-full"
//                       />
//                       <textarea
//                         {...register(`visibleTestCases.${index}.explanation`)}
//                         placeholder="Explanation"
//                         className="textarea textarea-bordered w-full"
//                       />
//                     </div>
//                   ))}
//                 </div>
                
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center">
//                     <h4 className="font-semibold text-gray-800">Hidden Test Cases</h4>
//                     <button
//                       type="button"
//                       onClick={() => appendHidden({ input: '', output: '' })}
//                       className="btn btn-primary btn-md rounded-full shadow"
//                     >
//                       Add Hidden Case
//                     </button>
//                   </div>
//                   {hiddenFields.map((field, index) => (
//                     <div key={field.id} className="border border-gray-200 p-4 rounded-xl bg-gray-50 space-y-2">
//                       <div className="flex justify-end">
//                         <button
//                           type="button"
//                           onClick={() => removeHidden(index)}
//                           className="btn btn-xs btn-error rounded-full"
//                         >
//                           Remove
//                         </button>
//                       </div>
//                       <input
//                         {...register(`hiddenTestCases.${index}.input`)}
//                         placeholder="Input"
//                         className="input input-bordered w-full"
//                       />
//                       <input
//                         {...register(`hiddenTestCases.${index}.output`)}
//                         placeholder="Output"
//                         className="input input-bordered w-full"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
              
//               <div>
//                 <h3 className="text-xl font-bold mb-4 text-gray-800">Code Templates</h3>
//                 <div className="space-y-8">
//                   {LANGUAGES.map((language, index) => (
//                     <div key={language} className="space-y-6 border rounded-lg p-4 bg-gray-50">
//                       <h4 className="font-semibold text-lg text-gray-800">{language}</h4>
                      
//                       <div className="form-control">
//                         <label className="label font-semibold text-gray-700">
//                           <span className="label-text">Initial Code</span>
//                         </label>
//                         <div className="bg-gray-800 rounded-lg p-4">
//                           <textarea
//                             {...register(`startCode.${index}.initialCode`)}
//                             className="w-full bg-transparent text-white font-mono text-sm"
//                             rows={8}
//                             spellCheck="false"
//                           />
//                         </div>
//                         {errors.startCode?.[index]?.initialCode && (
//                           <span className="text-error text-sm">{errors.startCode[index].initialCode.message}</span>
//                         )}
//                       </div>
                      
//                       <div className="form-control">
//                         <label className="label font-semibold text-gray-700">
//                           <span className="label-text">Reference Solution</span>
//                         </label>
//                         <div className="bg-gray-800 rounded-lg p-4">
//                           <textarea
//                             {...register(`referenceSolution.${index}.completeCode`)}
//                             className="w-full bg-transparent text-white font-mono text-sm"
//                             rows={8}
//                             spellCheck="false"
//                           />
//                         </div>
//                         {errors.referenceSolution?.[index]?.completeCode && (
//                           <span className="text-error text-sm">{errors.referenceSolution[index].completeCode.message}</span>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
              
//               <button 
//                 type="submit" 
//                 className="btn btn-warning w-full rounded-full text-lg font-bold py-4 shadow-lg hover:scale-105 transition-transform duration-150"
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <>
//                     <span className="loading loading-spinner loading-sm mr-2"></span>
//                     Updating...
//                   </>
//                 ) : 'Update Problem'}
//               </button>
//             </form>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default UpdateProblem;




import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Constants for form options
const TAGS = ['array', 'linkedList', 'graph', 'dp'];
const DIFFICULTIES = ['easy', 'medium', 'hard'];
const LANGUAGES = ['C++', 'Java', 'JavaScript'];

// Zod schema for form validation
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(3, 'All three languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3, 'All three languages required')
});

function UpdateProblem() {
  // State for problems list and selection
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  // Fetch all problems on component mount
  useEffect(() => {
    fetchProblems();
  }, []);

  // Function to fetch all problems
  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (err) {
      setFeedback({ type: 'error', message: 'Failed to fetch problems' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initialize react-hook-form
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
  });

  // Setup field arrays for dynamic test cases
  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  // When a problem is selected, fetch its details and pre-fill the form
  useEffect(() => {
    if (selectedProblem) {
      const fetchProblemDetails = async () => {
        try {
          setLoading(true);
          const { data } = await axiosClient.get(`/problem/problemById/${selectedProblem._id}`);
          
          // Pre-fill the form with problem data
          reset({
            ...data,
            visibleTestCases: data.visibleTestCases || [],
            hiddenTestCases: data.hiddenTestCases || [],
            startCode: data.startCode || LANGUAGES.map(l => ({ language: l, initialCode: '' })),
            referenceSolution: data.referenceSolution || LANGUAGES.map(l => ({ language: l, completeCode: '' })),
          });
          
          setFeedback(null);
        } catch (err) {
          setFeedback({ type: 'error', message: 'Failed to fetch problem details' });
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchProblemDetails();
    }
  }, [selectedProblem, reset]);

  // Handle form submission
  const onSubmit = async (data) => {
    if (!selectedProblem) return;
    
    try {
      setLoading(true);
      setFeedback(null);
      
      await axiosClient.put(`/problem/update/${selectedProblem._id}`, data);
      
      setFeedback({ type: 'success', message: 'Problem updated successfully!' });
      
      // Refresh problems list
      const { data: updatedProblems } = await axiosClient.get('/problem/getAllProblem');
      setProblems(updatedProblems);
    } catch (err) {
      setFeedback({ 
        type: 'error', 
        message: err.response?.data || 'Failed to update problem' 
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter problems based on search term
  const filteredProblems = problems.filter(problem =>
    problem.title.toLowerCase().includes(search.toLowerCase()) ||
    problem.tags?.toLowerCase().includes(search.toLowerCase())
  );

  // Show loading spinner while data is being fetched
  if (loading && !selectedProblem) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">Update Problems</h1>
        </div>

        {/* Problems List */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-10 overflow-x-auto">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by title or tag..."
              className="input input-bordered w-full max-w-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-lg font-bold text-gray-700">#</th>
                <th className="px-4 py-3 text-left text-lg font-bold text-gray-700">Title</th>
                <th className="px-4 py-3 text-left text-lg font-bold text-gray-700">Difficulty</th>
                <th className="px-4 py-3 text-left text-lg font-bold text-gray-700">Tags</th>
                <th className="px-4 py-3 text-left text-lg font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProblems.map((problem, index) => (
                <tr key={problem._id} className={selectedProblem?._id === problem._id ? 'bg-blue-50' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {/* Serial number */}
                  <td className="px-4 py-4 font-bold text-lg text-gray-800">{index + 1}</td>
                  {/* Problem title */}
                  <td className="px-4 py-4 text-gray-900 font-medium">{problem.title}</td>
                  {/* Difficulty badge */}
                  <td className="px-4 py-4">
                    <span className={`px-5 py-1.5 rounded-full text-base font-semibold shadow-sm ${
                      problem.difficulty.toLowerCase() === 'easy'
                        ? 'bg-green-100 text-green-600'
                        : problem.difficulty.toLowerCase() === 'medium'
                        ? 'bg-orange-100 text-orange-500'
                        : 'bg-red-100 text-red-500'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  {/* Tag badge */}
                  <td className="px-4 py-4">
                    <span className="px-4 py-1 rounded-full text-base font-semibold bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">
                      {problem.tags}
                    </span>
                  </td>
                  {/* Update button */}
                  <td className="px-4 py-4">
                    <button
                      onClick={() => setSelectedProblem(problem)}
                      className="btn btn-warning btn-md rounded-full shadow-md font-bold px-6 transition-all duration-150 hover:scale-105 hover:shadow-lg"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProblems.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500 font-medium">No problems found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Update Form */}
        {selectedProblem && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">Edit Problem</h2>
            
            {/* Feedback message */}
            {feedback && (
              <div className={`alert mb-6 ${feedback.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                <div>
                  {feedback.type === 'success' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <span>{feedback.message}</span>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              {/* Basic Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                  {/* Title Field */}
                  <div className="form-control">
                    <label className="label font-semibold text-gray-700">Title</label>
                    <input
                      {...register('title')}
                      className={`input input-bordered input-lg w-full ${errors.title ? 'input-error' : ''}`}
                    />
                    {errors.title && <span className="text-error text-sm">{errors.title.message}</span>}
                  </div>
                  {/* Description Field */}
                  <div className="form-control">
                    <label className="label font-semibold text-gray-700">Description</label>
                    <textarea
                      {...register('description')}
                      className={`textarea textarea-bordered textarea-lg w-full ${errors.description ? 'textarea-error' : ''}`}
                      rows={5}
                    />
                    {errors.description && <span className="text-error text-sm">{errors.description.message}</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-6 justify-between w-full">
                  <div className="form-control">
                    <label className="label font-semibold text-gray-700">Difficulty</label>
                    <select
                      {...register('difficulty')}
                      className={`select select-bordered select-lg w-full ${errors.difficulty ? 'select-error' : ''}`}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  <div className="form-control self-start mt-0 w-full">
                    <label className="label font-semibold text-gray-700">Tag</label>
                    <select
                      {...register('tags')}
                      className={`select select-bordered select-lg w-full ${errors.tags ? 'select-error' : ''}`}
                    >
                      <option value="array">Array</option>
                      <option value="linkedList">Linked List</option>
                      <option value="graph">Graph</option>
                      <option value="dp">DP</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Test Cases Section */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Test Cases</h3>
                
                {/* Visible Test Cases */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-gray-800">Visible Test Cases</h4>
                    <button
                      type="button"
                      onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                      className="btn btn-primary btn-md rounded-full shadow"
                    >
                      Add Visible Case
                    </button>
                  </div>
                  {visibleFields.map((field, index) => (
                    <div key={field.id} className="border border-gray-200 p-4 rounded-xl bg-gray-50 space-y-2">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeVisible(index)}
                          className="btn btn-xs btn-error rounded-full"
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        {...register(`visibleTestCases.${index}.input`)}
                        placeholder="Input"
                        className="input input-bordered w-full"
                      />
                      <input
                        {...register(`visibleTestCases.${index}.output`)}
                        placeholder="Output"
                        className="input input-bordered w-full"
                      />
                      <textarea
                        {...register(`visibleTestCases.${index}.explanation`)}
                        placeholder="Explanation"
                        className="textarea textarea-bordered w-full"
                      />
                    </div>
                  ))}
                </div>
                
                {/* Hidden Test Cases */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-gray-800">Hidden Test Cases</h4>
                    <button
                      type="button"
                      onClick={() => appendHidden({ input: '', output: '' })}
                      className="btn btn-primary btn-md rounded-full shadow"
                    >
                      Add Hidden Case
                    </button>
                  </div>
                  {hiddenFields.map((field, index) => (
                    <div key={field.id} className="border border-gray-200 p-4 rounded-xl bg-gray-50 space-y-2">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeHidden(index)}
                          className="btn btn-xs btn-error rounded-full"
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        {...register(`hiddenTestCases.${index}.input`)}
                        placeholder="Input"
                        className="input input-bordered w-full"
                      />
                      <input
                        {...register(`hiddenTestCases.${index}.output`)}
                        placeholder="Output"
                        className="input input-bordered w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Code Templates Section */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Code Templates</h3>
                <div className="space-y-8">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="space-y-2">
                      <h4 className="font-semibold text-lg text-gray-800">
                        {index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'}
                      </h4>
                      <div className="form-control">
                        <label className="label font-semibold text-gray-700">Initial Code</label>
                        <pre className="bg-base-200 p-4 rounded-lg">
                          <textarea
                            {...register(`startCode.${index}.initialCode`)}
                            className="w-full bg-transparent font-mono text-base"
                            rows={6}
                          />
                        </pre>
                      </div>
                      <div className="form-control">
                        <label className="label font-semibold text-gray-700">Reference Solution</label>
                        <pre className="bg-base-200 p-4 rounded-lg">
                          <textarea
                            {...register(`referenceSolution.${index}.completeCode`)}
                            className="w-full bg-transparent font-mono text-base"
                            rows={6}
                          />
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Submit Button */}
              <button 
                type="submit" 
                className="btn btn-warning w-full rounded-full text-lg font-bold py-4 shadow-lg hover:scale-105 transition-transform duration-150"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                    Updating...
                  </>
                ) : 'Update Problem'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default UpdateProblem;