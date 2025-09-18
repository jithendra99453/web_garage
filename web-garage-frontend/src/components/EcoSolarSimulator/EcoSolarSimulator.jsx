import React, { useState, useEffect } from 'react';
import { Sun, Battery, Zap, RotateCcw } from 'lucide-react';

const EcoSolarSimulator = () => {
  const [panels, setPanels] = useState(4);
  const [sunlight, setSunlight] = useState(70); // percentage
  const [batteryLevel, setBatteryLevel] = useState(50);
  const [energyGenerated, setEnergyGenerated] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState(12); // 24-hour format
  const [weather, setWeather] = useState('sunny');
  const [score, setScore] = useState(0);
  const [dayComplete, setDayComplete] = useState(false);

  const weatherConditions = {
    sunny: { multiplier: 1.0, icon: '☀️', name: 'Sunny' },
    cloudy: { multiplier: 0.6, icon: '☁️', name: 'Cloudy' },
    rainy: { multiplier: 0.3, icon: '🌧️', name: 'Rainy' },
    stormy: { multiplier: 0.1, icon: '⛈️', name: 'Stormy' }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!dayComplete) {
        simulateEnergyGeneration();
        updateTime();
      }
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [panels, sunlight, weather, timeOfDay, dayComplete]);

  const simulateEnergyGeneration = () => {
    const weatherMultiplier = weatherConditions[weather].multiplier;
    const timeMultiplier = getTimeMultiplier(timeOfDay);
    const baseGeneration = panels * 10; // 10 kWh per panel per hour

    const generation = baseGeneration * weatherMultiplier * timeMultiplier;
    const actualGeneration = Math.max(0, generation);

    setEnergyGenerated(prev => prev + actualGeneration);

    // Update battery level
    const consumption = 5; // 5 kWh consumed per interval
    setBatteryLevel(prev => {
      const newLevel = prev + actualGeneration - consumption;
      return Math.max(0, Math.min(100, newLevel));
    });

    // Update score based on efficiency
    if (actualGeneration > 0) {
      const efficiency = (actualGeneration / baseGeneration) * 100;
      setScore(prev => prev + Math.round(efficiency / 10));
    }
  };

  const getTimeMultiplier = (hour) => {
    // Solar generation peaks at noon and drops to zero at night
    if (hour >= 6 && hour <= 18) {
      return Math.sin(((hour - 6) / 12) * Math.PI);
    }
    return 0;
  };

  const updateTime = () => {
    setTimeOfDay(prev => {
      const newTime = prev + 0.5; // 30 minutes per update
      if (newTime >= 24) {
        setDayComplete(true);
        return 24;
      }
      return newTime;
    });
  };

  const changeWeather = () => {
    const weathers = Object.keys(weatherConditions);
    const currentIndex = weathers.indexOf(weather);
    const nextIndex = (currentIndex + 1) % weathers.length;
    setWeather(weathers[nextIndex]);
  };

  const adjustPanels = (change) => {
    setPanels(prev => Math.max(1, Math.min(20, prev + change)));
  };

  const resetSimulation = () => {
    setPanels(4);
    setSunlight(70);
    setBatteryLevel(50);
    setEnergyGenerated(0);
    setTimeOfDay(6); // Start at 6 AM
    setWeather('sunny');
    setScore(0);
    setDayComplete(false);
  };

  const formatTime = (hour) => {
    const h = Math.floor(hour);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayHour}:00 ${period}`;
  };

  const getEfficiencyRating = () => {
    const avgEfficiency = (energyGenerated / Math.max(1, timeOfDay - 6)) * 10;
    if (avgEfficiency > 80) return { rating: 'Excellent', color: 'text-green-600' };
    if (avgEfficiency > 60) return { rating: 'Good', color: 'text-blue-600' };
    if (avgEfficiency > 40) return { rating: 'Fair', color: 'text-yellow-600' };
    return { rating: 'Poor', color: 'text-red-600' };
  };

  if (dayComplete) {
    const efficiency = getEfficiencyRating();
    const totalEnergy = Math.round(energyGenerated * 10) / 10;

    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100 p-4 flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center max-w-2xl w-full">
          <div className="text-6xl mb-4">☀️</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Day Complete!</h2>
          <div className="text-4xl font-bold text-yellow-600 mb-2">{score} Points</div>
          <p className="text-lg text-gray-600 mb-6">
            You generated {totalEnergy} kWh of solar energy today!
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{panels}</div>
              <div className="text-sm text-gray-600">Solar Panels</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalEnergy} kWh</div>
              <div className="text-sm text-gray-600">Energy Generated</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className={`text-2xl font-bold ${efficiency.color}`}>{efficiency.rating}</div>
              <div className="text-sm text-gray-600">Efficiency</div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-orange-800 mb-2">☀️ Solar Power Tips:</h3>
            <ul className="text-left text-sm text-gray-700 space-y-1">
              <li>• Install panels facing south for maximum sun exposure</li>
              <li>• Keep panels clean and free of debris</li>
              <li>• Use energy-efficient appliances to maximize savings</li>
              <li>• Consider battery storage for nighttime use</li>
              <li>• Take advantage of government incentives</li>
              <li>• Monitor your system's performance regularly</li>
            </ul>
          </div>

          <button
            onClick={resetSimulation}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            <RotateCcw size={20} className="inline mr-2" />
            Start New Day
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-yellow-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-800 mb-2">☀️ Eco Solar Simulator</h1>
          <p className="text-lg text-gray-600">Manage your solar power system and maximize energy generation!</p>

          <div className="flex justify-center items-center gap-6 mt-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <span className="text-2xl font-bold text-green-600">{score}</span>
              <span className="text-gray-600 ml-2">Points</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <span className="text-2xl font-bold text-blue-600">{formatTime(timeOfDay)}</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <span className="text-2xl font-bold text-yellow-600">{Math.round(energyGenerated * 10) / 10} kWh</span>
              <span className="text-gray-600 ml-2">Generated</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Solar Panel Controls */}
          <div className="bg-white rounded-xl shadow-2xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">⚙️ System Controls</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Solar Panels: {panels}
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => adjustPanels(-1)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    -
                  </button>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-yellow-500 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${(panels / 20) * 100}%` }}
                    ></div>
                  </div>
                  <button
                    onClick={() => adjustPanels(1)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weather: {weatherConditions[weather].icon} {weatherConditions[weather].name}
                </label>
                <button
                  onClick={changeWeather}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Change Weather
                </button>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-xl shadow-2xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">📊 System Status</h2>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Battery Level</span>
                  <span className="text-sm text-gray-600">{Math.round(batteryLevel)}%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-300 ${
                      batteryLevel > 60 ? 'bg-green-500' :
                      batteryLevel > 30 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${batteryLevel}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Sun className="mx-auto text-yellow-500 mb-2" size={24} />
                  <div className="text-sm font-medium text-gray-700">Sunlight</div>
                  <div className="text-lg font-bold text-yellow-600">
                    {Math.round(weatherConditions[weather].multiplier * getTimeMultiplier(timeOfDay) * 100)}%
                  </div>
                </div>

                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Battery className="mx-auto text-blue-500 mb-2" size={24} />
                  <div className="text-sm font-medium text-gray-700">Efficiency</div>
                  <div className="text-lg font-bold text-blue-600">
                    {getEfficiencyRating().rating}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Solar Array */}
        <div className="bg-white rounded-xl shadow-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">☀️ Solar Array</h2>
          <div className="flex justify-center">
            <div className="grid grid-cols-5 gap-4 max-w-md">
              {Array.from({ length: panels }, (_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-yellow-200 border-2 border-yellow-400 rounded-lg flex items-center justify-center shadow-lg"
                >
                  <div className="text-2xl">☀️</div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-center text-gray-600 mt-4">
            {panels} solar panel{panels !== 1 ? 's' : ''} generating clean energy
          </p>
        </div>

        <div className="text-center">
          <p className="text-gray-600">
            Simulation runs from 6:00 AM to 12:00 AM. Maximize your energy generation!
          </p>
        </div>
      </div>
    </div>
  );
};

export default EcoSolarSimulator;
