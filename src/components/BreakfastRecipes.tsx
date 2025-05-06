import React, { useState } from 'react';

interface Recipe {
  id: string;
  name: string;
  image: string;
  description: string;
  prepTime: string;
  color: string;
}

interface BreakfastRecipesProps {
  onBackClick: () => void;
}

const breakfastRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Chia Pudding',
    image: '/images/chia-pudding.jpg',
    description: 'Healthy and delicious chia pudding with your favorite toppings',
    prepTime: '5 mins prep, overnight soak',
    color: 'from-purple-400 to-pink-400'
  },
  {
    id: '2',
    name: 'Overnight Oats',
    image: '/images/overnight-oats.jpg',
    description: 'Easy make-ahead breakfast with endless flavor combinations',
    prepTime: '5 mins prep, overnight soak',
    color: 'from-yellow-400 to-orange-400'
  },
  {
    id: '3',
    name: 'Avocado Toast',
    image: '/images/avocado-toast.jpg',
    description: 'Creamy avocado on crispy toast with various toppings',
    prepTime: '10 mins',
    color: 'from-green-400 to-emerald-400'
  },
  {
    id: '4',
    name: 'Apple Banana Smoothie',
    image: '/images/apple-banana-smoothie.jpg',
    description: 'Refreshing and nutritious smoothie with apple and banana',
    prepTime: '5 mins',
    color: 'from-red-400 to-orange-400'
  },
  {
    id: '5',
    name: 'Avocado Apple Smoothie',
    image: '/images/avocado-apple-smoothie.jpg',
    description: 'Creamy and healthy smoothie with avocado and apple',
    prepTime: '5 mins',
    color: 'from-green-400 to-yellow-400'
  }
];

const BreakfastRecipes: React.FC<BreakfastRecipesProps> = ({ onBackClick }) => {
  const [clickedRecipeId, setClickedRecipeId] = useState<string | null>(null);
  const [isBackButtonClicked, setIsBackButtonClicked] = useState(false);

  const handleRecipeClick = (recipeId: string) => {
    setClickedRecipeId(recipeId);
    // Reset the clicked state after animation
    setTimeout(() => {
      setClickedRecipeId(null);
    }, 1000);
  };

  const handleBackButtonClick = () => {
    setIsBackButtonClicked(true);
    // Add a small delay before navigation to show the animation
    setTimeout(() => {
      onBackClick();
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={handleBackButtonClick}
              className={`text-gray-600 hover:text-orange-500 transition-colors duration-300 ${
                isBackButtonClicked ? 'animate-spin' : ''
              }`}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
              Breakfast Recipes
            </h1>
            <div className="w-8"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      {/* Recipes Grid */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {breakfastRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className={`group transform transition-all duration-300 hover:scale-105 ${
                clickedRecipeId === recipe.id ? 'animate-pulse' : ''
              }`}
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className={`h-48 bg-gradient-to-br ${recipe.color} relative`}>
                  {/* Placeholder for recipe image */}
                  <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
                    {recipe.name}
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{recipe.name}</h3>
                  <p className="text-gray-600 mb-3">{recipe.description}</p>
                  <p className="text-sm text-gray-500 mb-4">{recipe.prepTime}</p>
                  <button 
                    onClick={() => handleRecipeClick(recipe.id)}
                    className={`w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-6 rounded-full text-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 ${
                      clickedRecipeId === recipe.id ? 'animate-bounce' : ''
                    }`}
                  >
                    View Recipe
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BreakfastRecipes; 