import React, { useState, useEffect, useContext } from 'react';
import { Zap, RotateCcw, Trophy, Wind } from 'lucide-react';
import UserContext from '../../context/UserContext';
import { awardPoints } from '../../utils/api';

const EcoRenewableEnergy = () => {
  const { refreshStudentData } = useContext(UserContext);
  const [energySources, setEnergySources] = useState({
    solar: { level: 0, maxLevel: 5, cost: [0, 100, 200, 350, 500, 700] },
    wind: { level: 0, maxLevel: 5, cost: [0, 120, 240, 400, 600, 850] },
    hydro: { level: 0, maxLevel: 5, cost: [0, 150, 300, 500, 750, 1000] },
    geothermal: { level: 0, maxLevel: 5, cost: [0, 180, 360, 600, 900, 1200] },
    biomass: { level: 0, maxLevel: 5, cost: [0, 90, 180, 300, 450, 600] }
  });

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [gameOver, setGameOver] = useState(false);
  const [budget, setBudget] = useState(2000);
  const [energyOutput, setEnergyOutput] = useState(0);
  const [co2Reduction, setCo2Reduction] = useState(0);

  const sourceInfo = {
    solar: {
      name: "Solar Power",
      emoji: "☀️",
      description: "Clean energy from the sun",
      output: [0, 50, 120, 200, 300, 450],
      co2Save: [0, 30, 75, 125, 190, 285]
    },
    wind: {
      name: "Wind Power",
      emoji: "💨",
      description: "Harness wind energy",
      output: [0, 60, 140, 240, 360, 520],
      co2Save: [0, 35, 85, 145, 220, 315]
    },
    hydro: {
      name: "Hydro Power",
      emoji: "💧",
      description: "Water-powered electricity",
      output: [0, 80, 180, 300, 450, 650],
      co2Save: [0, 45, 105, 175, 265, 380]
    },
    geothermal: {
      name: "Geothermal",
      emoji: "🌋",
      description: "Earth's heat energy",
      output: [0, 70, 160, 270, 400, 580],
      co2Save: [0, 40, 95, 160, 240, 345]
    },
    biomass: {
      name: "Biomass",
      emoji: "🌱",
      description: "Organic waste energy",
      output: [0, 40, 90, 150, 220, 320],
      co2Save: [0, 25, 55, 95, 140, 200]
    }
  };

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  useEffect(() => {
    // Calculate total energy output and CO2 reduction
    let totalOutput = 0;
    let totalCo2Save = 0;

    Object.entries(energySources).forEach(([key, source]) => {
      totalOutput += sourceInfo[key].output[source.level];
      totalCo2Save += sourceInfo[key].co2Save[source.level];
    });

    setEnergyOutput(totalOutput);
    setCo2Reduction(totalCo2Save);
  }, [energySources]);

  const upgradeSource = (sourceKey) => {
    const source = energySources[sourceKey];
    if (source.level >= source.maxLevel) return;

    const upgradeCost = source.cost[source.level + 1];
    if (budget < upgradeCost) return;

    setEnergySources(prev => ({
      ...prev,
      [sourceKey]: { ...source, level: source.level + 1 }
    }));

    setBudget(prev => prev - upgradeCost);
    setScore(prev => prev + sourceInfo[sourceKey].output[source.level + 1] * 2);
  };

  const resetGame = () => {
    setEnergySources({
      solar: { level: 0, maxLevel: 5, cost: [0, 100, 200, 350, 500, 700] },
      wind: { level: 0, maxLevel: 5, cost: [0, 120, 240, 400, 600, 850] },
      hydro: { level: 0, maxLevel: 5, cost: [0, 150, 300, 500, 750, 1000] },
      geothermal: { level: 0, maxLevel: 5, cost: [0, 180, 360, 600, 900, 1200] },
      biomass: { level: 0, maxLevel: 5, cost: [0, 90, 180, 300, 450, 600] }
    });
    setScore(0);
    setTimeLeft(300);
    setGameOver(false);
    setBudget(2000);
    setEnergyOutput(0);
    setCo2Reduction(0);
  };

  // Award eco points and refresh dashboard when game is over
  useEffect(() => {
    if (gameOver && score > 0) {
      const finalScore = score + (energyOutput * 1.5) + (co2Reduction * 3) + (budget * 0.5);
      awardPoints(Math.round(finalScore)).then(() => {
        refreshStudentData();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver]);

  const getEfficiencyRating = () => {
    const totalLevels = Object.values(energySources).reduce((sum, source) => sum + source.level, 0);
    const maxLevels = Object.values(energySources).reduce((sum, source) => sum + source.maxLevel, 0);
    const efficiency = (totalLevels / maxLevels) * 100;

    if (efficiency >= 90) return { rating: "Exceptional", color: "text-green-600", emoji: "🌟" };
    if (efficiency >= 70) return { rating: "Excellent", color: "text-blue-600", emoji: "⭐" };
    if (efficiency >= 50) return { rating: "Good", color: "text-yellow-600", emoji: "👍" };
    if (efficiency >= 30) return { rating: "Fair", color: "text-orange-600", emoji: "🤔" };
    return { rating: "Poor", color: "text-red-600", emoji: "😕" };
  };

  const totalLevels = Object.values(energySources).reduce((sum, source) => sum + source.level, 0);
  const maxLevels = Object.values(energySources).reduce((sum, source) => sum + source.maxLevel, 0);

  if (gameOver) {
    const efficiencyRating = getEfficiencyRating();
    const finalScore = score + (energyOutput * 1.5) + (co2Reduction * 3) + (budget * 0.5);

    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100 p-4 flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center max-w-2xl w-full">
          <div className="text-6xl mb-4">{efficiencyRating.emoji}</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Energy Transition Complete!
          </h2>
          <div className="text-4xl font-bold text-yellow-600 mb-2">{Math.round(finalScore)} Points</div>
          <p className="text-lg text-gray-600 mb-6">
            Efficiency Rating: <span className={`font-bold ${efficiencyRating.color}`}>{efficiencyRating.rating}</span>
          </p>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{energyOutput} MW</div>
              <div className="text-sm text-gray-600">Energy Output</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{co2Reduction}t</div>
              <div className="text-sm text-gray-600">CO₂ Reduced</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalLevels}/{maxLevels}</div>
              <div className="text-sm text-gray-600">Upgrades</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">${budget}</div>
              <div className="text-sm text-gray-600">Budget Left</div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-orange-800 mb-2">⚡ Renewable Energy Tips:</h3>
            <ul className="text-left text-sm text-gray-700 space-y-1">
              <li>• Solar panels work best in sunny regions with good roof orientation</li>
              <li>• Wind turbines need consistent wind speeds above 7 m/s</li>
              <li>• Hydro power requires access to flowing water sources</li>
              <li>• Geothermal energy is most viable in tectonically active areas</li>
              <li>• Biomass can use agricultural and forestry waste</li>
              <li>• Combine multiple renewable sources for energy reliability</li>
            </ul>
          </div>

          <button
            onClick={resetGame}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            <RotateCcw size={20} className="inline mr-2" />
            Start New Transition
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-800 mb-2">⚡ Eco Renewable Energy</h1>
          <p className="text-lg text-gray-600">Build a sustainable energy infrastructure for the future!</p>

          <div className="flex justify-center items-center gap-6 mt-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <span className="text-2xl font-bold text-green-600">{score}</span>
              <span className="text-gray-600 ml-2">Points</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <span className="text-2xl font-bold text-blue-600">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
              <span className="text-gray-600 ml-2">Time</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <span className="text-2xl font-bold text-yellow-600">${budget}</span>
              <span className="text-gray-600 ml-2">Budget</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <span className="text-2xl font-bold text-purple-600">{energyOutput} MW</span>
              <span className="text-gray-600 ml-2">Output</span>
            </div>
          </div>
        </div>

        {/* Energy Sources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Object.entries(energySources).map(([key, source]) => {
            const info = sourceInfo[key];
            const currentOutput = info.output[source.level];
            const currentCo2Save = info.co2Save[source.level];
            const nextCost = source.level < source.maxLevel ? source.cost[source.level + 1] : null;
            const canUpgrade = nextCost && budget >= nextCost;

            return (
              <div key={key} className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{info.emoji}</div>
                  <h3 className="text-lg font-bold text-gray-800">{info.name}</h3>
                  <p className="text-sm text-gray-600">{info.description}</p>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Level:</span>
                    <span className="font-medium">{source.level}/{source.maxLevel}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(source.level / source.maxLevel) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Output:</span>
                    <span className="font-medium text-blue-600">{currentOutput} MW</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">CO₂ Saved:</span>
                    <span className="font-medium text-green-600">{currentCo2Save}t/year</span>
                  </div>
                </div>

                {source.level < source.maxLevel ? (
                  <button
                    onClick={() => upgradeSource(key)}
                    disabled={!canUpgrade}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      canUpgrade
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Upgrade (${nextCost})
                  </button>
                ) : (
                  <div className="w-full py-2 px-4 rounded-lg bg-green-100 text-green-800 text-center font-medium">
                    Max Level Reached!
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Stats and Progress */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Energy Portfolio</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Energy Output:</span>
                <span className="font-bold text-blue-600">{energyOutput} MW</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">CO₂ Reduction:</span>
                <span className="font-bold text-green-600">{co2Reduction} tons/year</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Efficiency Rating:</span>
                <span className={`font-bold ${getEfficiencyRating().color}`}>
                  {getEfficiencyRating().rating}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Upgrades Completed:</span>
                <span className="font-bold text-purple-600">{totalLevels}/{maxLevels}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">💡 Strategy Tips</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <div>• Start with cost-effective sources like biomass</div>
              <div>• Balance high-output sources with budget constraints</div>
              <div>• Focus on CO₂ reduction for maximum environmental impact</div>
              <div>• Upgrade sources strategically for optimal efficiency</div>
              <div>• Time management is key - don't waste your budget!</div>
            </div>
          </div>
        </div>

        {/* Visual Energy Grid */}
        <div className="bg-white rounded-xl shadow-2xl p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">⚡ Renewable Energy Grid</h2>
          <div className="flex justify-center items-center space-x-8">
            {Object.entries(energySources).map(([key, source]) => {
              const info = sourceInfo[key];
              const intensity = source.level / source.maxLevel;

              return (
                <div key={key} className="text-center">
                  <div className="text-4xl mb-2">{info.emoji}</div>
                  <div className="text-sm font-medium text-gray-700">{info.name}</div>
                  <div className="w-16 h-2 bg-gray-200 rounded-full mt-2">
                    <div
                      className="h-2 bg-yellow-500 rounded-full transition-all duration-300"
                      style={{ width: `${intensity * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Lv. {source.level}</div>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-4">
            <div className="text-lg font-bold text-blue-600">
              Total Output: {energyOutput} MW ⚡
            </div>
            <div className="text-sm text-green-600">
              CO₂ Reduced: {co2Reduction} tons/year 🌱
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoRenewableEnergy;
