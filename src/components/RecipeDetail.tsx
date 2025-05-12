import React, { useState, useEffect, useRef } from 'react';
import VideoPlayer from './VideoPlayer';

interface Recipe {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  ingredients: string[];
  instructions: string[];
}

interface RecipeDetailProps {
  recipe: Recipe;
  onBackClick: () => void;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onBackClick }) => {
  const [isCooking, setIsCooking] = useState(false);
  const [timer, setTimer] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerIntervalRef = useRef<number | null>(null);

  // Add debug logging for video URL
  useEffect(() => {
    console.log('Recipe Detail - Video URL:', recipe.videoUrl);
    console.log('Recipe Detail - Full Recipe:', recipe);
  }, [recipe]);

  useEffect(() => {
    console.log('Recipe Detail - loaded');
  }, []);

  // Timer effect
  useEffect(() => {
    if (isCooking) {
      // Clear any existing interval
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }

      // Start new interval
      const intervalId = window.setInterval(() => {
        setTimer(prevTimer => {
          console.log('Timer incrementing:', prevTimer + 1); // Debug log
          return prevTimer + 1;
        });
      }, 1000);

      timerIntervalRef.current = intervalId;
    } else {
      // Clear interval when cooking stops
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    // Cleanup function
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [isCooking]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateProgress = (seconds: number) => {
    // Calculate progress for a 5-minute cooking session
    const totalSeconds = 5 * 60; // 5 minutes
    return Math.min((seconds / totalSeconds) * 100, 100);
  };

  const handleCookWithMe = () => {
    setTimer(0); // Reset timer first
    setIsCooking(true); // Then start cooking
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(error => {
        console.error('Error playing video:', error);
      });
    }
  };

  const handleStopCooking = () => {
    setIsCooking(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleReset = () => {
    setTimer(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  // Debug log for timer value
  useEffect(() => {
    console.log('Current timer value:', timer);
  }, [timer]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={onBackClick}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Recipes
        </button>

        {/* Recipe Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{recipe.title}</h1>
        
        {/* Video Player Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-4 bg-gradient-to-r from-orange-500 to-pink-500">
            <h2 className="text-xl font-semibold text-white">Recipe Video</h2>
          </div>
          <div className="p-4">
            <VideoPlayer 
              videoPath={recipe.videoUrl} 
              className="w-full"
              onLoadingChange={(isLoading) => {
                console.log('Video loading state changed:', isLoading);
              }}
            />
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">About this Recipe</h2>
          <p className="text-gray-600 text-lg">{recipe.description}</p>
        </div>

        {/* Cook with Me Button and Timer */}
        <div className="mb-8 flex items-center justify-center space-x-4">
          {!isCooking ? (
            <button
              onClick={handleCookWithMe}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Cook with Me
            </button>
          ) : (
            <div className="flex items-center space-x-6">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-200"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-orange-500"
                    strokeWidth="8"
                    strokeDasharray={`${calculateProgress(timer) * 2.51} 251.2`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                    style={{
                      transform: 'rotate(-90deg)',
                      transformOrigin: '50% 50%',
                      transition: 'stroke-dasharray 0.5s ease'
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-orange-500">
                    {formatTime(timer)}
                  </span>
                  <span className="text-sm text-gray-500">Cooking Time</span>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={handleStopCooking}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 15l-3-3m0 0l3-3m-3 3h12"
                    />
                  </svg>
                  Stop
                </button>
                <button
                  onClick={handleReset}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Ingredients */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ingredients</h2>
          <ul className="space-y-3">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center mr-3 mt-1">
                  {index + 1}
                </span>
                <span className="text-gray-700">{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Instructions</h2>
          <ol className="space-y-6">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex">
                <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center mr-4">
                  {index + 1}
                </span>
                <span className="text-gray-700">{instruction}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail; 