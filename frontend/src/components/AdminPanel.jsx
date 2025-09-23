import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';

// Zod schema used for form validation, matches the expected problem format
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

function AdminPanel() {
  const navigate = useNavigate();

  // Initialize react-hook-form with validation schema and default values
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      startCode: [
        { language: 'C++', initialCode: '' },
        { language: 'Java', initialCode: '' },
        { language: 'JavaScript', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' }
      ]
    }
  });

  // Manage dynamic visible test case fields
  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  // Manage dynamic hidden test case fields
  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      // Send POST request to create new problem
      await axiosClient.post('/problem/create', data);
      alert('Problem created successfully!');
      navigate('/'); // go to home page
    } catch (error) {
      // Show error message if submission fails
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-900 tracking-tight drop-shadow-sm">Create New Problem</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* Basic Info Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">Basic Information</h2>
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
          </div>
          {/* Test Cases Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">Test Cases</h2>
            {/* Visible Test Cases */}
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Visible Test Cases</h3>
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
                <h3 className="font-semibold text-gray-800">Hidden Test Cases</h3>
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
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">Code Templates</h2>
            <div className="space-y-8">
              {[0, 1, 2].map((index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'}
                  </h3>
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
          <button type="submit" className="btn btn-primary w-full rounded-full text-lg font-bold py-4 shadow-lg hover:scale-105 transition-transform duration-150">
            Create Problem
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;
