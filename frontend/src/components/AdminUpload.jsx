import { useParams } from 'react-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import axiosClient from '../utils/axiosClient';

function AdminUpload() {
  // Get the problemId from URL parameters
  const { problemId } = useParams();

  // States to track upload process
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setError,
    clearErrors
  } = useForm();

  // Watch selected file
  const selectedFile = watch('videoFile')?.[0];

  // Form submit handler for uploading the video
  const onSubmit = async (data) => {
    const file = data.videoFile[0]; // Get selected file
    setUploading(true); // Start upload
    setUploadProgress(0); 
    clearErrors(); // Clear previous errors

    try {
      // Step 1: Get Cloudinary upload signature and credentials
      const signatureResponse = await axiosClient.get(`/video/create/${problemId}`);
      const { signature, timestamp, public_id, api_key, cloud_name, upload_url } = signatureResponse.data;

      // Step 2: Create FormData for Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('public_id', public_id);
      formData.append('api_key', api_key);

      // Step 3: Upload file to Cloudinary
      const uploadResponse = await axios.post(upload_url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress); // Update upload progress
        },
      });

      const cloudinaryResult = uploadResponse.data;

      // Step 4: Save uploaded video metadata to your backend
      const metadataResponse = await axiosClient.post('/video/save', {
        problemId: problemId,
        cloudinaryPublicId: cloudinaryResult.public_id,
        secureUrl: cloudinaryResult.secure_url,
        duration: cloudinaryResult.duration,
      });

      setUploadedVideo(metadataResponse.data.videoSolution); // Save response data
      reset(); // Reset the form
    } catch (err) {
      console.error('Upload error:', err);
      setError('root', {
        type: 'manual',
        message: err.response?.data?.message || 'Upload failed. Please try again.'
      });
    } finally {
      setUploading(false); // Finish upload
      setUploadProgress(0);
    }
  };

  // Format file size into readable format (e.g., MB, GB)
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format duration into mm:ss
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Upload Video</h2>

          {/* Video Upload Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* File input field */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Choose video file</span>
              </label>
              <input
                type="file"
                accept="video/*"
                {...register('videoFile', {
                  required: 'Please select a video file',
                  validate: {
                    isVideo: (files) => {
                      if (!files || !files[0]) return 'Please select a video file';
                      const file = files[0];
                      return file.type.startsWith('video/') || 'Please select a valid video file';
                    },
                    fileSize: (files) => {
                      if (!files || !files[0]) return true;
                      const file = files[0];
                      const maxSize = 100 * 1024 * 1024; // Max 100MB
                      return file.size <= maxSize || 'File size must be less than 100MB';
                    }
                  }
                })}
                className={`file-input file-input-bordered w-full ${errors.videoFile ? 'file-input-error' : ''}`}
                disabled={uploading}
              />
              {errors.videoFile && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.videoFile.message}</span>
                </label>
              )}
            </div>

            {/* Display selected file info */}
            {selectedFile && (
              <div className="alert alert-info">
                <div>
                  <h3 className="font-bold">Selected File:</h3>
                  <p className="text-sm">{selectedFile.name}</p>
                  <p className="text-sm">Size: {formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
            )}

            {/* Upload progress bar */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <progress 
                  className="progress progress-primary w-full" 
                  value={uploadProgress} 
                  max="100"
                ></progress>
              </div>
            )}

            {/* Display upload error message */}
            {errors.root && (
              <div className="alert alert-error">
                <span>{errors.root.message}</span>
              </div>
            )}

            {/* Success message with video info */}
            {uploadedVideo && (
              <div className="alert alert-success">
                <div>
                  <h3 className="font-bold">Upload Successful!</h3>
                  <p className="text-sm">Duration: {formatDuration(uploadedVideo.duration)}</p>
                  <p className="text-sm">Uploaded: {new Date(uploadedVideo.uploadedAt).toLocaleString()}</p>
                </div>
              </div>
            )}

            {/* Submit button */}
            <div className="card-actions justify-end">
              <button
                type="submit"
                disabled={uploading}
                className={`btn btn-primary ${uploading ? 'loading' : ''}`}
              >
                {uploading ? 'Uploading...' : 'Upload Video'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}

export default AdminUpload;
