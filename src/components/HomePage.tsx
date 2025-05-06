import React, { useState } from 'react';
import BreakfastRecipes from './BreakfastRecipes';

interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
  color: string;
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

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [clickedId, setClickedId] = useState<string | null>(null);

  const handleCategoryClick = (categoryId: string) => {
    setClickedId(categoryId);
    // Add a small delay before navigation to show the animation
    setTimeout(() => {
      setSelectedCategory(categoryId);
    }, 300);
  };

  const handleBackClick = () => {
    setSelectedCategory(null);
  };

  if (selectedCategory === '1') {
    return <BreakfastRecipes onBackClick={handleBackClick} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
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

      {/* Categories Grid */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`group cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                clickedId === category.id ? 'animate-pulse' : ''
              }`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className={`${category.color} rounded-2xl shadow-lg overflow-hidden`}>
                <div className="h-72 relative">
                  {/* Placeholder for category image */}
                  <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                    {category.name}
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
                </div>
                <div className="p-8 bg-white">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{category.name}</h3>
                  <p className="text-gray-600 text-lg mb-6">{category.description}</p>
                  <button 
                    className={`w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-6 rounded-full text-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 ${
                      clickedId === category.id ? 'animate-bounce' : ''
                    }`}
                  >
                    View Recipes
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

export default HomePage; 