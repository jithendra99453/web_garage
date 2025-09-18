import React, { useState } from 'react';
import { Trash2, Recycle, Plus, Minus } from 'lucide-react';

const EcoWasteAudit = () => {
  const [wasteItems, setWasteItems] = useState([
    { category: 'Plastic', amount: 0, unit: 'kg', recyclable: true },
    { category: 'Paper', amount: 0, unit: 'kg', recyclable: true },
    { category: 'Glass', amount: 0, unit: 'kg', recyclable: true },
    { category: 'Metal', amount: 0, unit: 'kg', recyclable: true },
    { category: 'Organic', amount: 0, unit: 'kg', recyclable: false },
    { category: 'Other', amount: 0, unit: 'kg', recyclable: false }
  ]);

  const [auditComplete, setAuditComplete] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const updateAmount = (index, change) => {
    const newItems = [...wasteItems];
    newItems[index].amount = Math.max(0, newItems[index].amount + change);
    setWasteItems(newItems);
  };

  const calculateTotals = () => {
    const totalWaste = wasteItems.reduce((sum, item) => sum + item.amount, 0);
    const recyclableWaste = wasteItems
      .filter(item => item.recyclable)
      .reduce((sum, item) => sum + item.amount, 0);
    const nonRecyclableWaste = totalWaste - recyclableWaste;
    const recyclingRate = totalWaste > 0 ? (recyclableWaste / totalWaste) * 100 : 0;

    return { totalWaste, recyclableWaste, nonRecyclableWaste, recyclingRate };
  };

  const generateRecommendations = (stats) => {
    const recs = [];

    if (stats.recyclingRate < 50) {
      recs.push("Consider recycling more paper and cardboard");
      recs.push("Set up separate bins for different waste types");
    }

    if (wasteItems.find(item => item.category === 'Plastic').amount > 5) {
      recs.push("Reduce single-use plastic consumption");
      recs.push("Choose reusable alternatives for plastic items");
    }

    if (wasteItems.find(item => item.category === 'Organic').amount > 3) {
      recs.push("Start composting organic waste");
      recs.push("Use food scraps for garden compost");
    }

    if (stats.totalWaste > 10) {
      recs.push("Track waste for a week to identify reduction opportunities");
      recs.push("Buy products with less packaging");
    }

    return recs.length > 0 ? recs : ["Great job! Your waste management is excellent. Keep it up!"];
  };

  const completeAudit = () => {
    const stats = calculateTotals();
    const recs = generateRecommendations(stats);
    setRecommendations(recs);
    setAuditComplete(true);
  };

  const resetAudit = () => {
    setWasteItems(wasteItems.map(item => ({ ...item, amount: 0 })));
    setAuditComplete(false);
    setRecommendations([]);
  };

  const stats = calculateTotals();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📊 Eco Waste Audit</h1>
          <p className="text-lg text-gray-600">Track and analyze your household waste to improve recycling habits!</p>
        </div>

        {!auditComplete ? (
          <div className="bg-white rounded-xl shadow-2xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Weekly Waste Tracking</h2>
              <p className="text-gray-600 mb-6">
                Estimate how much waste you generate in each category per week:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {wasteItems.map((item, index) => (
                <div key={item.category} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {item.recyclable ? (
                        <Recycle className="text-green-500" size={20} />
                      ) : (
                        <Trash2 className="text-gray-500" size={20} />
                      )}
                      <span className="font-medium text-gray-800">{item.category}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      item.recyclable
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {item.recyclable ? 'Recyclable' : 'Non-recyclable'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => updateAmount(index, -0.5)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                    >
                      <Minus size={16} />
                    </button>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{item.amount}</div>
                      <div className="text-sm text-gray-600">{item.unit}</div>
                    </div>

                    <button
                      onClick={() => updateAmount(index, 0.5)}
                      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={completeAudit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
              >
                Complete Waste Audit
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Results Summary */}
            <div className="bg-white rounded-xl shadow-2xl p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">📈 Your Waste Analysis</h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{stats.totalWaste.toFixed(1)}</div>
                  <div className="text-gray-600">Total Waste (kg)</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{stats.recyclableWaste.toFixed(1)}</div>
                  <div className="text-gray-600">Recyclable (kg)</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">{stats.nonRecyclableWaste.toFixed(1)}</div>
                  <div className="text-gray-600">Non-recyclable (kg)</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600">{stats.recyclingRate.toFixed(1)}%</div>
                  <div className="text-gray-600">Recycling Rate</div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Waste Breakdown</h3>
                <div className="space-y-3">
                  {wasteItems.map((item) => (
                    <div key={item.category} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        {item.recyclable ? (
                          <Recycle className="text-green-500" size={16} />
                        ) : (
                          <Trash2 className="text-gray-500" size={16} />
                        )}
                        <span className="font-medium">{item.category}</span>
                      </div>
                      <span className="font-bold text-blue-600">{item.amount} kg</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">💡 Recommendations</h2>
              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <span className="text-green-600 mt-1">•</span>
                    <span className="text-gray-700">{rec}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={resetAudit}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Start New Audit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EcoWasteAudit;
