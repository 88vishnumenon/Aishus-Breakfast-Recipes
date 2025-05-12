import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

interface VideoUploadProps {
  onUploadComplete: (videoPath: string) => void;
  category: string;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ onUploadComplete, category }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file');
      return;
    }

    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      setError('Video file size should be less than 100MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Create a unique filename
      const timestamp = Date.now();
      const filename = `${category}-${timestamp}-${file.name}`;
      const videoPath = `videos/${filename}`;
      const storageRef = ref(storage, videoPath);

      // Upload file
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Monitor upload progress
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          setError('Failed to upload video');
          setUploading(false);
        },
        async () => {
          // Upload completed
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onUploadComplete(videoPath);
          setUploading(false);
          setProgress(0);
        }
      );
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload video');
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="video-upload"
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer
            ${uploading ? 'border-gray-300 bg-gray-50' : 'border-orange-300 hover:bg-orange-50'}
            transition-colors duration-200`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <>
                <div className="w-12 h-12 mb-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                </div>
                <p className="mb-2 text-sm text-gray-500">
                  Uploading... {Math.round(progress)}%
                </p>
              </>
            ) : (
              <>
                <svg
                  className="w-12 h-12 mb-4 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">MP4, WebM or MOV (MAX. 100MB)</p>
              </>
            )}
          </div>
          <input
            id="video-upload"
            type="file"
            className="hidden"
            accept="video/mp4,video/webm,video/quicktime"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default VideoUpload; 