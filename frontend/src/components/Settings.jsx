import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon, PlusIcon } from '@heroicons/react/24/outline';

const Settings = () => {
  const [envVars, setEnvVars] = useState({});
  const [visibleKeys, setVisibleKeys] = useState({});
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    fetchEnvVars();
  }, []);

  const fetchEnvVars = async () => {
    try {
      const response = await fetch('http://localhost:5001/env-vars');
      const data = await response.json();
      setEnvVars(data);
    } catch (error) {
      console.error('Error fetching environment variables:', error);
    }
  };

  const toggleVisibility = (key) => {
    setVisibleKeys(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleAddNew = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/env-vars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: newKey, value: newValue }),
      });
      
      if (response.ok) {
        setNewKey('');
        setNewValue('');
        setIsAddingNew(false);
        fetchEnvVars();
      }
    } catch (error) {
      console.error('Error adding environment variable:', error);
    }
  };

  return (
    <div className="ml-40 p-8 bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Environment Variables</h2>
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add New Variable
          </button>
        </div>

        {isAddingNew && (
          <form onSubmit={handleAddNew} className="mb-8 bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Key</label>
                <input
                  type="text"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Value</label>
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  required
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
              >
                Add Variable
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {Object.entries(envVars).map(([key, value]) => (
            <div
              key={key}
              className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-200"
            >
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">{key}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-300 font-mono">
                    {visibleKeys[key] ? value : '••••••••'}
                  </span>
                  <button
                    onClick={() => toggleVisibility(key)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {visibleKeys[key] ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings; 