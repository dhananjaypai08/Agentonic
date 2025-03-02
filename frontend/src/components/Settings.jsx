import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  PlusIcon, 
  TrashIcon, 
  ArrowPathIcon,
  XMarkIcon,
  ShieldCheckIcon,
  KeyIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const Settings = () => {
  const [envVars, setEnvVars] = useState({});
  const [visibleKeys, setVisibleKeys] = useState({});
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    fetchEnvVars();
  }, []);

  const fetchEnvVars = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5001/env-vars');
      const data = await response.json();
      setEnvVars(data);
    } catch (error) {
      console.error('Error fetching environment variables:', error);
      toast.error('Failed to load environment variables');
    } finally {
      setIsLoading(false);
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
    
    if (!newKey.trim()) {
      toast.error('Key cannot be empty');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5001/env-vars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: newKey, value: newValue }),
      });
      
      if (response.ok) {
        toast.success('Variable added successfully');
        setNewKey('');
        setNewValue('');
        setIsAddingNew(false);
        fetchEnvVars();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to add variable');
      }
    } catch (error) {
      console.error('Error adding environment variable:', error);
      toast.error('Failed to add variable');
    }
  };

  const handleDeleteVar = async (key) => {
    try {
      const response = await fetch(`http://localhost:5001/env-vars/${key}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast.success('Variable deleted successfully');
        fetchEnvVars();
      } else {
        toast.error('Failed to delete variable');
      }
    } catch (error) {
      console.error('Error deleting environment variable:', error);
      toast.error('Failed to delete variable');
    }
  };

  const handleCopyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success('Copied to clipboard');
    
    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const filteredEnvVars = Object.entries(envVars).filter(([key]) => 
    key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ml-64 p-8 bg-gradient-to-br from-gray-900 to-gray-950 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 relative">
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
          <div className="absolute top-10 right-20 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <h2 className="text-4xl font-bold text-white mb-2">
              Environment Variables
            </h2>
            <p className="text-gray-400">
              Securely manage your API keys and configuration values
            </p>
          </motion.div>
        </div>

        {/* Controls Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
        >
          {/* Search Box */}
          <div className="relative w-full md:w-auto flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search environment variables..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-200"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full md:w-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fetchEnvVars()}
              className="px-4 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-700 hover:bg-gray-700/50 transition-all duration-200 flex items-center gap-2"
            >
              <ArrowPathIcon className="w-5 h-5" />
              <span>Refresh</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAddingNew(true)}
              className="px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-purple-500/25 flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add Variable</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Add New Variable Form */}
        <AnimatePresence>
          {isAddingNew && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleAddNew} className="mb-8 bg-gray-800/30 p-6 rounded-xl border border-gray-700 backdrop-blur-sm shadow-lg relative">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600/5 to-blue-600/5 rounded-xl"></div>
                
                <div className="relative">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <KeyIcon className="w-5 h-5 text-purple-400" />
                    Add New Environment Variable
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Variable Name
                      </label>
                      <input
                        type="text"
                        value={newKey}
                        onChange={(e) => setNewKey(e.target.value)}
                        className="w-full p-3 bg-gray-900/80 text-white border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-200"
                        placeholder="API_KEY"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Value
                      </label>
                      <input
                        type="text"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        className="w-full p-3 bg-gray-900/80 text-white border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-200"
                        placeholder="your-secret-value"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setIsAddingNew(false)}
                      className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
                    >
                      Add Variable
                    </motion.button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        )}

        {/* Environment Variables List */}
        {!isLoading && (
          <div className="space-y-4">
            {filteredEnvVars.length === 0 && (
              <div className="bg-gray-800/30 p-8 rounded-xl border border-gray-700 text-center">
                <div className="flex justify-center mb-4">
                  <ShieldCheckIcon className="w-16 h-16 text-gray-600" />
                </div>
                {searchTerm ? (
                  <p className="text-gray-400">No variables found matching "{searchTerm}"</p>
                ) : (
                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">No Environment Variables</h3>
                    <p className="text-gray-400 mb-6">Add your first variable to get started</p>
                    <button
                      onClick={() => setIsAddingNew(true)}
                      className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
                    >
                      Add First Variable
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <AnimatePresence>
              {filteredEnvVars.map(([key, value], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <KeyIcon className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{key}</h3>
                          <p className="text-gray-500 text-sm">Environment Variable</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex-1 px-4 py-2 bg-gray-900/70 rounded-lg border border-gray-700 flex items-center justify-between">
                          <span className="text-gray-300 font-mono truncate max-w-xs">
                            {visibleKeys[key] ? value : '••••••••••••••••••••'}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleVisibility(key)}
                              className="text-gray-400 hover:text-white transition-colors p-1"
                              title={visibleKeys[key] ? "Hide value" : "Show value"}
                            >
                              {visibleKeys[key] ? (
                                <EyeSlashIcon className="w-5 h-5" />
                              ) : (
                                <EyeIcon className="w-5 h-5" />
                              )}
                            </button>
                            
                            {visibleKeys[key] && (
                              <button
                                onClick={() => handleCopyToClipboard(value, key)}
                                className="text-gray-400 hover:text-white transition-colors p-1"
                                title="Copy to clipboard"
                              >
                                {copiedKey === key ? (
                                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  <ClipboardDocumentIcon className="w-5 h-5" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleDeleteVar(key)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete variable"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;