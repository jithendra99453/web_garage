import React, { useState } from 'react';
import { Sprout, Sun, Droplets, Wind } from 'lucide-react';

const EcoGardenPlanner = () => {
  const [garden, setGarden] = useState(Array(9).fill(null));
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [season, setSeason] = useState('spring');
  const [score, setScore] = useState(0);

  const plants = {
    spring: [
      { id: 1, name: "Tomatoes", emoji: "🍅", water: 3, sun: 4, wind: 2, points: 50 },
      { id: 2, name: "Lettuce", emoji: "🥬", water: 4, sun: 2, wind: 3, points: 40 },
      { id: 3, name: "Carrots", emoji: "🥕", water: 3, sun: 3, wind: 2, points: 45 },
      { id: 4, name: "Radishes", emoji: "🌰", water: 2, sun: 3, wind: 4, points: 35 }
    ],
    summer: [
      { id: 5, name: "Corn", emoji: "🌽", water: 4, sun: 5, wind: 1, points: 60 },
      { id: 6, name: "Peppers", emoji: "🌶️", water: 3, sun: 4, wind: 2, points: 55 },
      { id: 7, name: "Beans", emoji: "🫘", water: 3, sun: 3, wind: 3, points: 50 },
      { id: 8, name: "Cucumbers", emoji: "🥒", water: 4, sun: 3, wind: 2, points: 45 }
    ],
    fall: [
      { id: 9, name: "Pumpkins", emoji: "🎃", water: 3, sun: 4, wind: 2, points: 65 },
      { id: 10, name: "Broccoli", emoji: "🥦", water: 4, sun: 3, wind: 3, points: 50 },
      { id: 11, name: "Kale", emoji: "🥬", water: 4, sun: 2, wind: 4, points: 45 },
      { id: 12, name: "Spinach", emoji: "🥬", water: 3, sun: 2, wind: 3, points: 40 }
    ],
    winter: [
      { id: 13, name: "Garlic", emoji: "🧄", water: 2, sun: 3, wind: 4, points: 55 },
      { id: 14, name: "Onions", emoji: "🧅", water: 2, sun: 4, wind: 3, points: 50 },
      { id: 15, name: "Kale", emoji: "🥬", water: 3, sun: 2, wind: 4, points: 45 },
      { id: 16, name: "Carrots", emoji: "🥕", water: 3, sun: 3, wind: 2, points: 40 }
    ]
  };

  const conditions = {
    spring: { water: 3, sun: 3, wind: 3 },
    summer: { water: 2, sun: 4, wind: 2 },
    fall: { water: 3, sun: 3, wind: 3 },
    winter: { water: 4, sun: 2, wind: 4 }
  };

  const handleCellClick = (index) => {
    if (!selectedPlant) return;

    const newGarden = [...garden];
    newGarden[index] = selectedPlant;
    setGarden(newGarden);

    // Calculate score based on plant compatibility with season
    const condition = conditions[season];
    const compatibility = Math.abs(selectedPlant.water - condition.water) +
                         Math.abs(selectedPlant.sun - condition.sun) +
                         Math.abs(selectedPlant.wind - condition.wind);

    const compatibilityBonus = Math.max(0, 15 - compatibility);
    const finalPoints = selectedPlant.points + compatibilityBonus;

    setScore(prev => prev + finalPoints);
  };

  const calculateGardenHealth = () => {
    const planted = garden.filter(cell => cell !== null);
    if (planted.length === 0) return 0;

    const condition = conditions[season];
    let totalHealth = 0;

    planted.forEach(plant => {
      const health = Math.abs(plant.water - condition.water) +
                    Math.abs(plant.sun - condition.sun) +
                    Math.abs(plant.wind - condition.wind);
      totalHealth += Math.max(0, 15 - health);
    });

    return Math.round((totalHealth / planted.length) * 10) / 10;
  };

  const resetGarden = () => {
    setGarden(Array(9).fill(null));
    setScore(0);
    setSelectedPlant(null);
  };

  const gardenHealth = calculateGardenHealth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-yellow-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">🌱 Eco Garden Planner</h1>
          <p className="text-lg text-gray-600">Plan your sustainable garden for different seasons!</p>

          <div className="flex justify-center items-center gap-6 mt-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <span className="text-2xl font-bold text-green-600">{score}</span>
              <span className="text-gray-600 ml-2">Points</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <span className="text-2xl font-bold text-blue-600">{gardenHealth}</span>
              <span className="text-gray-600 ml-2">Health</span>
            </div>
            <button
              onClick={resetGarden}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              Reset Garden
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Season Selector */}
          <div className="bg-white rounded-xl shadow-2xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🌤️ Season</h2>
            <div className="grid grid-cols-2 gap-3">
              {Object.keys(plants).map((seasonName) => (
                <button
                  key={seasonName}
                  onClick={() => setSeason(seasonName)}
                  className={`p-3 rounded-lg font-medium capitalize transition-all ${
                    season === seasonName
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {seasonName}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-3">Growing Conditions:</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Droplets className="text-blue-500" size={16} />
                  <span className="text-sm">Water: {conditions[season].water}/5</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="text-yellow-500" size={16} />
                  <span className="text-sm">Sun: {conditions[season].sun}/5</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="text-gray-500" size={16} />
                  <span className="text-sm">Wind: {conditions[season].wind}/5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Plant Selector */}
          <div className="bg-white rounded-xl shadow-2xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🌿 Available Plants</h2>
            <div className="grid grid-cols-2 gap-3">
              {plants[season].map((plant) => (
                <button
                  key={plant.id}
                  onClick={() => setSelectedPlant(plant)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedPlant?.id === plant.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{plant.emoji}</div>
                  <div className="text-xs font-medium">{plant.name}</div>
                  <div className="text-xs text-gray-500">{plant.points} pts</div>
                </button>
              ))}
            </div>

            {selectedPlant && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800">{selectedPlant.name}</h4>
                <div className="text-xs text-gray-600 mt-1">
                  Water: {selectedPlant.water}/5 | Sun: {selectedPlant.sun}/5 | Wind: {selectedPlant.wind}/5
                </div>
              </div>
            )}
          </div>

          {/* Garden Grid */}
          <div className="bg-white rounded-xl shadow-2xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🏡 Your Garden</h2>
            <div className="grid grid-cols-3 gap-2 aspect-square">
              {garden.map((plant, index) => (
                <button
                  key={index}
                  onClick={() => handleCellClick(index)}
                  className="aspect-square border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-all flex items-center justify-center text-2xl"
                >
                  {plant ? plant.emoji : ''}
                </button>
              ))}
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Click on garden squares to plant selected crop
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">💡 Gardening Tips</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>• Match plants to seasonal conditions for best growth</div>
              <div>• Higher compatibility scores give more points</div>
              <div>• Different plants have different care requirements</div>
              <div>• Plan your garden layout for optimal sunlight</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoGardenPlanner;
