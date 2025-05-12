import React, { useState, useEffect, useRef } from 'react';
import RecipeDetail from './RecipeDetail';
import VideoUpload from './VideoUpload';

interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
  color: string;
}

interface Recipe {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  ingredients: string[];
  instructions: string[];
}

const categories: Category[] = [
  {
    id: '1',
    name: 'Breakfast Recipes',
    image: '/images/breakfast.jpg',
    description: 'Start your day with these delicious and nutritious breakfast recipes',
    color: 'bg-gradient-to-br from-orange-400 to-pink-500'
  },
  {
    id: '2',
    name: 'Baby Recipes',
    image: '/images/baby.jpg',
    description: 'Healthy and easy-to-make recipes for your little ones',
    color: 'bg-gradient-to-br from-green-400 to-teal-500'
  }
];

const recipes: Recipe[] = [
  {
    id: '1',
    title: 'Breakfast Recipes',
    description: 'Delicious and nutritious breakfast recipes to start your day',
    videoUrl: '/videos/breakfast.mp4',
    ingredients: [
      '2 eggs',
      'Bread slices',
      'Butter',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Toast the bread slices',
      'Fry eggs sunny side up',
      'Season with salt and pepper',
      'Serve hot'
    ]
  },
  {
    id: '2',
    title: 'Baby Recipes',
    description: 'Healthy and tasty recipes for your little ones',
    videoUrl: '/videos/breakfast.mp4', // Using the same video for now
    ingredients: [
      'Rice',
      'Carrots',
      'Peas',
      'Water'
    ],
    instructions: [
      'Cook rice until soft',
      'Steam vegetables until tender',
      'Blend together',
      'Serve warm'
    ]
  }
];

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [browser, setBrowser] = useState('');
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const [selectedCategoryForUpload, setSelectedCategoryForUpload] = useState<string | null>(null);
  const [isCooking, setIsCooking] = useState(false);
  const [timer, setTimer] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Check if the app is running in standalone mode
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(isInStandaloneMode);

    // Detect browser
    const userAgent = navigator.userAgent.toLowerCase();
    let detectedBrowser = 'other';
    if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
      detectedBrowser = 'safari';
    } else if (userAgent.includes('chrome')) {
      detectedBrowser = 'chrome';
    }
    setBrowser(detectedBrowser);

    // Check if the device is iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Show install prompt for iOS devices if not in standalone mode
    if (isIOSDevice && !isInStandaloneMode) {
      setShowInstallPrompt(true);
    } else if (!isIOSDevice) {
      // For non-iOS devices, listen for the beforeinstallprompt event
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowInstallPrompt(true);
      };
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }

    let intervalId: number;

    if (isCooking) {
      intervalId = window.setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
      timerIntervalRef.current = intervalId;
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isCooking]);

  const handleInstallClick = async () => {
    if (isIOS) {
      // For iOS, we just close the modal as we can't programmatically trigger the install
      setShowInstallPrompt(false);
    } else if (deferredPrompt) {
      // For other devices, show the native install prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
      console.log(`User response to the install prompt: ${outcome}`);
    }
  };

  const handleDismissInstall = () => {
    setShowInstallPrompt(false);
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedRecipe(null);
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleBackClick = () => {
    setSelectedRecipe(null);
  };

  const handleVideoUploadComplete = (videoPath: string) => {
    // Here you would typically save the recipe with the new video path
    // For now, we'll just close the upload dialog
    setShowVideoUpload(false);
    setSelectedCategoryForUpload(null);
  };

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
    setIsCooking(true);
    setTimer(0);
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

  if (selectedRecipe) {
    return <RecipeDetail recipe={selectedRecipe} onBackClick={handleBackClick} />;
  }

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
      {/* Install Prompt Modal */}
      {showInstallPrompt && !isStandalone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4">Install Aishu's Recipes</h3>
            {isIOS ? (
              <div className="text-gray-600 mb-6">
                <p className="mb-4">To install this app on your iPhone:</p>
                {browser === 'chrome' ? (
                  <>
                    <p className="mb-2 text-sm text-gray-500">For best experience, please use Safari:</p>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Open this website in Safari</li>
                      <li>Tap the Share button <span className="inline-block">⎋</span></li>
                      <li>Scroll down and tap "Add to Home Screen"</li>
                      <li>Tap "Add" to install</li>
                    </ol>
                  </>
                ) : (
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Tap the Share button <span className="inline-block">⎋</span></li>
                    <li>Scroll down and tap "Add to Home Screen"</li>
                    <li>Tap "Add" to install</li>
                  </ol>
                )}
              </div>
            ) : (
              <p className="text-gray-600 mb-6">
                Install this app on your device for quick and easy access when you're on the go.
              </p>
            )}
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleDismissInstall}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Not Now
              </button>
              <button
                onClick={handleInstallClick}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {isIOS ? 'Got it!' : 'Install'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 text-center">
            Aishu's Recipes
          </h1>
          <p className="mt-3 text-gray-600 text-center text-lg">
            Discover delicious recipes for breakfast and your little ones
          </p>
          <div className="mt-6 max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 rounded-full border-2 border-orange-200 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
              />
              <svg
                className="w-6 h-6 text-gray-400 absolute right-4 top-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {!selectedCategory ? (
          // Categories Grid
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`${category.color} rounded-lg shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="aspect-video bg-gray-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-gray-400"
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
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">{category.name}</h2>
                  <p className="text-white text-opacity-90">{category.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Recipes List
          <div>
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={handleBackClick}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
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
                Back to Categories
              </button>
              <button
                onClick={() => {
                  setShowVideoUpload(true);
                  setSelectedCategoryForUpload(selectedCategory);
                }}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Upload New Recipe Video
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 transform hover:scale-105"
                  onClick={() => handleRecipeClick(recipe)}
                >
                  <div className="aspect-video bg-gradient-to-br from-orange-100 to-pink-100 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-2xl font-bold text-gray-800">{recipe.title}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600">{recipe.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Video Upload Modal */}
      {showVideoUpload && selectedCategoryForUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Upload Recipe Video</h2>
              <button
                onClick={() => {
                  setShowVideoUpload(false);
                  setSelectedCategoryForUpload(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <VideoUpload
              category={selectedCategoryForUpload}
              onUploadComplete={handleVideoUploadComplete}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage; 