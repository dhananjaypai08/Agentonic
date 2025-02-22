import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { create } from 'ipfs-http-client';
import { Dialog } from '@headlessui/react';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';

// IPFS configuration (unchanged)
const projectId = '2WCbZ8YpmuPxUtM6PzbFOfY5k4B';
const projectSecretKey = 'c8b676d8bfe769b19d88d8c77a9bd1e2';
const authorization = "Basic " + btoa(projectId + ":" + projectSecretKey);
const ipfs = create({
  url: "https://ipfs.infura.io:5001/api/v0",
  headers: {
    authorization: authorization
  },
});

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [tokenizeOpen, setTokenizeOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [tokenizing, setTokenizing] = useState(false);
  const [tokenizeStep, setTokenizeStep] = useState(0);
  const [txHash, setTxHash] = useState(null);

  const TOKENIZE_STEPS = [
    "Reading agent configuration...",
    "Uploading to IPFS...",
    "Minting SBT...",
    "Finalizing transaction..."
  ];

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

  const handleTokenize = async (agentName) => {
    setSelectedAgent(agentName);
    setTokenizeOpen(true);
    setWalletAddress('');
    setTxHash(null);
  };

  const handleTokenizeSubmit = async (e) => {
    e.preventDefault();
    if (!ethers.isAddress(walletAddress)) {
      toast.error('Please enter a valid wallet address');
      return;
    }

    setTokenizing(true);
    setTokenizeStep(0);

    try {
      // Step 1: Read agent configuration
      setTokenizeStep(0);
      const response = await axios.get(`http://localhost:5001/readAgent?agent_name=${selectedAgent}`);
      const agentConfig = response.data;

      // Step 2: Upload to IPFS
      setTokenizeStep(1);
      const result = await ipfs.add(JSON.stringify(agentConfig));
      const ipfsUri = `https://ipfs.io/ipfs/${result.path}`;

      // Step 3: Mint SBT
      setTokenizeStep(2);
      const mintResponse = await axios.post('http://localhost:5001/mintSbt', {
        uri: ipfsUri,
        walletAddress: walletAddress
      });

      // Step 4: Finalize
      setTokenizeStep(3);
      const tx_hash = `https://testnet.sonicscan.org/tx/0x${mintResponse.data}`;
      console.log(tx_hash);
      setTxHash(tx_hash);
      
      toast.success('Agent tokenized successfully!');
    } catch (error) {
      console.error('Tokenization error:', error);
      toast.error('Failed to tokenize agent');
    } finally {
      setTokenizing(false);
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
              <div className="flex gap-2">
                <button
                  onClick={() => handleLoadAgent(agent)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-200"
                >
                  Load Agent
                </button>
                <button
                  onClick={() => handleTokenize(agent)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                >
                  Tokenize
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Tokenize Modal */}
        <Dialog
          open={tokenizeOpen}
          onClose={() => !tokenizing && setTokenizeOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title className="text-xl font-bold text-white mb-4">
                Tokenize Agent: {selectedAgent}
              </Dialog.Title>

              {!tokenizing && !txHash && (
                <form onSubmit={handleTokenizeSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Owner Wallet Address
                    </label>
                    <input
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                      placeholder="0x..."
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setTokenizeOpen(false)}
                      className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                    >
                      Tokenize
                    </button>
                  </div>
                </form>
              )}

              {tokenizing && (
                <div className="py-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500" />
                    <p className="text-gray-300">{TOKENIZE_STEPS[tokenizeStep]}</p>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((tokenizeStep + 1) / TOKENIZE_STEPS.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {txHash && (
                <div className="py-4">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-green-500 mb-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-medium">Tokenization Successful!</span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Your agent has been successfully tokenized as an SBT.
                    </p>
                  </div>
                  <a
                    href={txHash}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-4 py-2 text-center bg-gray-700 text-blue-400 rounded-lg hover:bg-gray-600 transition-all duration-200"
                  >
                    View on Explorer →
                  </a>
                </div>
              )}
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default Agents;