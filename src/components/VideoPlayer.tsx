import React, { useState, useRef, useEffect } from 'react';

interface VideoPlayerProps {
  videoPath: string;
  onVideoEnd?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoPath, onVideoEnd }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      console.log('Video loaded successfully');
      setIsLoading(false);
      setError(null);
    };

    const handleError = (e: Event) => {
      console.error('Video error:', e);
      setError('Failed to load video. Please try again.');
      setIsLoading(false);
    };

    const handleEnded = () => {
      console.log('Video ended');
      if (onVideoEnd) {
        onVideoEnd();
      }
    };

    // Add event listeners
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('ended', handleEnded);

    // Set video attributes for better iOS compatibility
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('x5-playsinline', '');
    video.setAttribute('x5-video-player-type', 'h5');
    video.setAttribute('x5-video-player-fullscreen', 'true');

    // Cleanup
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onVideoEnd]);

  // Function to handle video source change
  const handleSourceChange = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      video.load(); // Force reload the video
      video.play().catch(err => {
        console.error('Error playing video:', err);
        setError('Failed to play video. Please try again.');
      });
    }
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-white text-center p-4">
            <p className="text-red-500 mb-2">{error}</p>
            <button 
              onClick={handleSourceChange}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        controls
        playsInline
        preload="metadata"
        style={{ display: isLoading ? 'none' : 'block' }}
        onLoadedMetadata={() => {
          console.log('Video metadata loaded');
          setIsLoading(false);
        }}
        onCanPlay={() => {
          console.log('Video can play');
          setIsLoading(false);
        }}
      >
        <source 
          src={videoPath} 
          type="video/mp4" 
          onError={(e) => {
            console.error('Source error:', e);
            setError('Failed to load video source');
          }}
        />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer; 