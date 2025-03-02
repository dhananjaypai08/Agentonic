import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { create } from 'ipfs-http-client';
import { Dialog, Transition } from '@headlessui/react';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';
import { 
  PlusIcon, 
  XMarkIcon, 
  ArrowRightIcon, 
  SparklesIcon, 
  DocumentIcon, 
  GlobeAltIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

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

const AgentCard = ({ agent, onLoad, onTokenize }) => {
  return (
    <div className="bg-gradient-to-br from-black/80 to-gray-900/60 backdrop-blur-sm p-7 rounded-2xl border border-gray-800/80 shadow-xl shadow-black/20 hover:shadow-purple-800/5 hover:border-purple-500/20 transition-all duration-300 group">
      <div className="flex justify-between mb-6">
        <div className="bg-black/60 rounded-full px-3 py-1 border border-gray-800">
          <div className="w-2 h-2 bg-purple-500 rounded-full inline-block mr-2 animate-pulse" />
          <span className="text-xs font-medium text-purple-300">Agent</span>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-500 transition-all duration-300">
        {agent}
      </h3>
      
      <p className="text-gray-400 text-sm mb-6 line-clamp-2">
        AI assistant with specialized blockchain knowledge
      </p>
      
      <div className="flex gap-3">
        <button
          onClick={() => onLoad(agent)}
          className="flex-1 px-4 py-2.5 bg-black border border-gray-800 backdrop-blur-sm text-white rounded-xl hover:bg-gray-900 hover:border-gray-700 transition-all duration-200 shadow-lg shadow-black/20 font-medium text-sm"
        >
          Load Agent
        </button>
        <button
          onClick={() => onTokenize(agent)}
          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-900/90 to-blue-900/90 backdrop-blur-sm text-white rounded-xl hover:from-purple-800 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-black/30 font-medium text-sm flex items-center justify-center"
        >
          <SparklesIcon className="w-4 h-4 mr-1.5 opacity-70" />
          Tokenize
        </button>
      </div>
    </div>
  );
};

const MintCard = ({ mint }) => {
  return (
    <div className="bg-gradient-to-br from-black/80 to-gray-900/50 backdrop-blur-sm rounded-xl p-5 border border-gray-800/80 shadow-lg transition-all duration-300 hover:shadow-purple-900/5 group">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black border border-gray-800">
          <CheckCircleIcon className="w-5 h-5 text-green-500" />
        </div>
        <div>
          <span className="text-white font-medium group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-300">
            {mint.agentName}
          </span>
          <span className="text-gray-500 text-xs ml-2">{mint.timestamp}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mt-4">
        <a
          href={mint.explorer}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center px-4 py-2 bg-black/80 border border-gray-800 hover:bg-gray-900 hover:border-gray-700 text-blue-400 rounded-lg transition-all duration-200 text-xs font-medium"
        >
          <GlobeAltIcon className="w-3.5 h-3.5 mr-1.5 opacity-70" />
          View on Explorer
        </a>
        <a
          href={mint.ipfs}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center px-4 py-2 bg-black/80 border border-gray-800 hover:bg-gray-900 hover:border-gray-700 text-blue-400 rounded-lg transition-all duration-200 text-xs font-medium"
        >
          <DocumentIcon className="w-3.5 h-3.5 mr-1.5 opacity-70" />
          View on IPFS
        </a>
      </div>
    </div>
  );
};

const ProgressIndicator = ({ step, totalSteps, text }) => {
  return (
    <div className="py-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-6 h-6 rounded-full bg-black border border-gray-800 flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent" />
        </div>
        <p className="text-gray-300 text-sm">{text}</p>
      </div>
      <div className="w-full bg-black border border-gray-800 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-purple-800 to-blue-800 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
};

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
  const [ipfsHash, setIpfsHash] = useState(null);
  const [successfulMints, setSuccessfulMints] = useState([]);

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
    if (!prompt.trim()) {
      toast.error('Please provide a description for your agent');
      return;
    }
    
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
      setIpfsHash(ipfsUri);
      
      // Step 3: Mint SBT
      setTokenizeStep(2);
      const mintResponse = await axios.post('http://localhost:5001/mintSbt', {
        uri: ipfsUri,
        walletAddress: walletAddress
      });
      
      // Step 4: Finalize
      setTokenizeStep(3);
      const explorerUrl = `https://testnet.sonicscan.org/tx/0x${mintResponse.data}`;
      
      // Add to successful mints
      setSuccessfulMints(prev => [...prev, {
        agentName: selectedAgent,
        explorer: explorerUrl,
        ipfs: ipfsUri,
        timestamp: new Date().toLocaleString()
      }]);

      setTokenizeOpen(false);
      toast.success('Agent tokenized successfully!');

    } catch (error) {
      console.error('Tokenization error:', error);
      toast.error('Failed to tokenize agent');
    } finally {
      setTokenizing(false);
      setTxHash(null);
      setIpfsHash(null);
    }
  };

  return (
    <div className="ml-64 p-8 bg-gradient-to-b from-black to-gray-950 min-h-screen overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header with glow effect */}
        <div className="relative mb-12">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-600/5 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute -top-10 left-40 w-64 h-64 bg-blue-600/5 rounded-full filter blur-3xl opacity-30"></div>
          
          <div className="relative flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Agents</h2>
            <div className="space-y-2">
              <p className="text-gray-300 max-w-2xl">
                Create and command adaptive AI agents with natural language, seamlessly bridging wallets, 
                analyzing DeFi protocols, and launching tokens based on real-time social sentiment.
              </p>
              <p className="text-gray-500 text-sm flex items-center">
                <span className="inline-block mr-2">Powered by</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 font-semibold">ZerePy</span>
                <span className="mx-2 text-gray-600">and</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 font-semibold">Sonic</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setPromptOpen(true)}
            className="px-5 py-3 bg-gradient-to-r from-purple-900 to-blue-900 text-white rounded-xl hover:from-purple-800 hover:to-blue-800 transition-all duration-300 shadow-xl shadow-black/30 hover:shadow-purple-900/10 flex items-center group border border-gray-800"
          >
            <PlusIcon className="w-5 h-5 mr-2 opacity-70 group-hover:opacity-100 transition-opacity" />
            <span className="font-medium">Create Agent</span>
          </button>
        </div>
        </div>

        {/* Successful Mints Section */}
        {successfulMints.length > 0 && (
          <div className="mb-12">
            <div className="mb-5 flex items-center">
              <h3 className="text-xl font-semibold text-white">Tokenized Agents</h3>
              <div className="ml-4 h-px flex-1 bg-gradient-to-r from-gray-800 to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {successfulMints.map((mint, index) => (
                <MintCard key={index} mint={mint} />
              ))}
            </div>
          </div>
        )}

        {/* Agents Grid with subtle animation */}
        <div className="mb-5 flex items-center">
          <h3 className="text-xl font-semibold text-white">Available Agents</h3>
          <div className="ml-4 h-px flex-1 bg-gradient-to-r from-gray-800 to-transparent"></div>
        </div>
        
        {agents.length === 0 ? (
          <div className="bg-black/60 rounded-2xl p-10 text-center border border-gray-800/80">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-black border border-gray-800 flex items-center justify-center">
              <SparklesIcon className="w-8 h-8 text-gray-700" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No Agents Yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">Create your first agent to get started with AI-powered blockchain interactions</p>
            <button
              onClick={() => setPromptOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-900 to-blue-900 text-white rounded-xl hover:from-purple-800 hover:to-blue-800 transition-all duration-200 border border-gray-800"
            >
              Create Your First Agent
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent, index) => (
              <AgentCard 
                key={agent} 
                agent={agent} 
                onLoad={handleLoadAgent} 
                onTokenize={handleTokenize}
              />
            ))}
          </div>
        )}

        {/* Create Agent Modal */}
        <Transition show={promptOpen} as="div" className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as="div"
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity" />
            </Transition.Child>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <Transition.Child
              as="div"
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-black rounded-2xl border border-gray-800 shadow-2xl">
                <div className="flex justify-between items-start mb-5">
                  <h3 className="text-xl font-bold text-white">
                    Create New Agent
                  </h3>
                  <button
                    onClick={() => setPromptOpen(false)}
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Describe your agent's capabilities
                  </label>
                  <div className="relative">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full min-h-32 p-4 rounded-xl bg-gray-900/70 text-white border border-gray-800 focus:border-purple-700 focus:ring-1 focus:ring-purple-700/50 outline-none shadow-inner resize-none"
                      placeholder="Example: Create an AI agent that specializes in analyzing DeFi protocols, evaluating yields, and providing guidance on optimal swap strategies..."
                    />
                    <div className="absolute inset-0 pointer-events-none rounded-xl bg-gradient-to-br from-purple-900/5 via-transparent to-blue-900/5"></div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setPromptOpen(false)}
                    className="px-4 py-2 text-gray-500 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateAgent}
                    disabled={loading}
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-900 to-blue-900 text-white rounded-xl hover:from-purple-800 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-black/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center border border-gray-800"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-4 h-4 mr-2 opacity-70" />
                        <span>Create Agent</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Transition>

        {/* Tokenize Modal */}
        <Transition show={tokenizeOpen} as="div" className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as="div"
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity" />
            </Transition.Child>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <Transition.Child
              as="div"
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-black rounded-2xl border border-gray-800 shadow-2xl">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Tokenize Agent
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {selectedAgent}
                    </p>
                  </div>
                  {!tokenizing && (
                    <button
                      onClick={() => setTokenizeOpen(false)}
                      className="text-gray-500 hover:text-white transition-colors"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {!tokenizing && !txHash && (
                  <form onSubmit={handleTokenizeSubmit}>
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Owner Wallet Address
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={walletAddress}
                          onChange={(e) => setWalletAddress(e.target.value)}
                          className="w-full p-3 rounded-xl bg-gray-900/70 text-white border border-gray-800 focus:border-purple-700 focus:ring-1 focus:ring-purple-700/50 outline-none shadow-inner"
                          placeholder="0x..."
                        />
                        <div className="absolute inset-0 pointer-events-none rounded-xl bg-gradient-to-br from-purple-900/5 via-transparent to-blue-900/5"></div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-950 p-4 rounded-xl mb-6 border border-gray-800">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-5 h-5 rounded-full bg-blue-900/40 flex items-center justify-center">
                            <span className="text-blue-400 text-xs">ℹ️</span>
                          </div>
                        </div>
                        <p className="ml-3 text-xs text-gray-500">
                          Tokenizing this agent will create a Soul-Bound Token (SBT) representing ownership of this agent configuration on the blockchain
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setTokenizeOpen(false)}
                        className="px-4 py-2 text-gray-500 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-gradient-to-r from-purple-900 to-blue-900 text-white rounded-xl hover:from-purple-800 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-black/30 flex items-center border border-gray-800"
                      >
                        <SparklesIcon className="w-4 h-4 mr-2 opacity-70" />
                        <span>Tokenize</span>
                      </button>
                    </div>
                  </form>
                )}

                {tokenizing && (
                  <div className="py-4">
                    <ProgressIndicator 
                      step={tokenizeStep} 
                      totalSteps={TOKENIZE_STEPS.length} 
                      text={TOKENIZE_STEPS[tokenizeStep]} 
                    />
                  </div>
                )}

                {txHash && (
                  <div className="py-4">
                    <div className="mb-4">
                      <div className="flex items-center gap-2 text-green-500 mb-2">
                        <CheckCircleIcon className="w-5 h-5" />
                        <span className="font-medium">Tokenization Successful!</span>
                      </div>
                      <p className="text-gray-300 text-sm">
                        Your agent has been successfully tokenized as an SBT.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Transition.Child>
          </div>
        </Transition>
      </div>
    </div>
  );
};

export default Agents;