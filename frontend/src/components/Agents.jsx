import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';


const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const [prompt, setPrompt] = useState('');

  const fetchAgents = async () => {
    try {
      const response = await axios.get('http://localhost:5001/listAgents');
      setAgents(response.data.agents);
    } catch (error) {
      toast.error('Failed to fetch agents');
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleCreateAgent = async () => {
    setLoading(true);
    try {
      // First, create agent file
      const createFileResponse = await axios.post('http://localhost:5001/createAgentFile', {
        prompt
      });

      // Then create agent with the config
      const createAgentResponse = await axios.post('http://localhost:5001/createAgent', {
        agentConfig: JSON.parse(createFileResponse.data)
      });

      toast.success('Agent created successfully!');
      setPromptOpen(false);
      setPrompt('');
      fetchAgents();
    } catch (error) {
      toast.error('Failed to create agent');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadAgent = async (agentName) => {
    try {
      const response = await axios.get(`http://localhost:5001/loadAgent?agent_name=${agentName}`);
      toast.success(`Agent ${agentName} loaded successfully!`);
    } catch (error) {
      toast.error(`Failed to load agent ${agentName}`);
    }
  };

  return (
    <div className="ml-64 p-8 bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Agents</h2>
          <button
            onClick={() => setPromptOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
          >
            Create Agent
          </button>
        </div>

        {/* Create Agent Modal */}
        {promptOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
              <h3 className="text-xl font-bold text-white mb-4">Create New Agent</h3>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-32 p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                placeholder="Describe your agent..."
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setPromptOpen(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAgent}
                  disabled={loading}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <div
              key={agent}
              className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-200"
            >
              <h3 className="text-xl font-semibold text-white mb-4">{agent}</h3>
              <button
                onClick={() => handleLoadAgent(agent)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-200"
              >
                Load Agent
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Agents;