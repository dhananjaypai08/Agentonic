import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowUpCircleIcon, 
  CheckCircleIcon, 
  SparklesIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  MegaphoneIcon,
  ArrowPathIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  { 
    id: 'analyze', 
    title: 'Market Analysis', 
    icon: ChartBarIcon,
    description: 'Analyzing sentiment and market conditions'
  },
  { 
    id: 'deploy', 
    title: 'Contract Deployment', 
    icon: RocketLaunchIcon,
    description: 'Creating and deploying smart contract'
  },
  { 
    id: 'mint', 
    title: 'Initial Supply', 
    icon: CurrencyDollarIcon,
    description: 'Minting initial token supply'
  },
  { 
    id: 'tweet', 
    title: 'Social Launch', 
    icon: MegaphoneIcon,
    description: 'Announcing your token to the world'
  }
];

// Enhanced message bubble with animations and better styling
const MessageBubble = ({ message }) => {
  const isUser = message.type === 'user';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}
    >
      {!isUser && (
        <div className="flex-shrink-0 mr-4 mt-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center border border-purple-500/20 shadow-lg shadow-purple-500/5">
            <RocketLaunchIcon className="w-5 h-5 text-purple-400" />
          </div>
        </div>
      )}
      
      <div
        className={`max-w-[75%] rounded-2xl px-7 py-5 shadow-lg ${
          isUser
            ? 'bg-gradient-to-br from-purple-600 to-blue-700 text-white shadow-purple-800/20'
            : 'bg-gray-800/70 backdrop-blur-sm text-gray-100 border border-gray-700/50 shadow-black/30'
        }`}
      >
        <p className={`text-lg leading-relaxed ${isUser ? 'text-white' : 'text-gray-200'}`}>
          {message.content}
        </p>
        
        {message.links && message.links.length > 0 && (
          <div className="mt-5 space-y-3">
            {message.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-5 py-3 bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-md text-white rounded-xl hover:from-purple-800/60 hover:to-blue-800/60 transition-all duration-300 shadow-lg shadow-purple-900/20 hover:shadow-purple-800/30 text-center border border-purple-500/20 group"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>{link.text}</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 ml-4 mt-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-purple-500/10 shadow-lg shadow-purple-500/5">
            <span className="text-white font-medium">You</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Enhanced step indicator with better visuals and tooltips
const StepIndicator = ({ currentStep, completedSteps }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed bottom-32 left-1/2 -translate-x-1/2 w-full max-w-3xl bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-2xl shadow-purple-900/10 z-10"
    >
      <div className="flex justify-between relative">
        {/* Background progress line */}
        <div className="absolute top-5 left-10 right-10 h-1 bg-gray-700 rounded-full"></div>
        
        {/* Active progress line */}
        <div 
          className="absolute top-5 left-10 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-700 ease-in-out"
          style={{ 
            width: `calc(${completedSteps.length / STEPS.length * 100}% ${completedSteps.length === 0 ? '' : '- 20px'})` 
          }}
        ></div>
        
        {STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const StepIcon = step.icon;
          
          return (
            <div key={step.id} className="flex flex-col items-center z-10">
              <div className="relative group">
                <motion.div
                  initial={false}
                  animate={isCompleted ? { scale: [1, 1.3, 1], rotate: [0, 10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                  className={`relative w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                    isCompleted
                      ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-green-500/30'
                      : isCurrent
                      ? 'bg-gradient-to-br from-purple-400 to-blue-600 text-white border border-purple-500/50 shadow-purple-500/30 animate-pulse'
                      : 'bg-gray-800 text-gray-400 border border-gray-700'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircleIcon className="w-6 h-6" />
                  ) : (
                    <StepIcon className="w-5 h-5" />
                  )}
                </motion.div>
                
                {/* Step number badge */}
                <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center">
                  <span className="text-xs text-gray-300">{index + 1}</span>
                </div>
                
                {/* Tooltip */}
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none">
                  <div className="bg-gray-900 rounded-lg p-2 shadow-lg border border-gray-700">
                    <p className="text-xs text-gray-400 text-center">{step.description}</p>
                  </div>
                  <div className="w-2 h-2 bg-gray-900 transform rotate-45 absolute -top-1 left-1/2 -translate-x-1/2 border-t border-l border-gray-700"></div>
                </div>
              </div>
              
              <span className={`mt-3 text-sm font-medium transition-all duration-300 ${
                isCurrent ? 'text-purple-400' : isCompleted ? 'text-green-400' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

// Placeholder component for token preview
const TokenPreview = ({ tokenInfo }) => {
  if (!tokenInfo) return null;
  
  return (
    <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-lg shadow-purple-900/5 mb-8">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center border border-purple-500/20">
          <span className="text-xl font-bold text-white">{tokenInfo.symbol?.charAt(0)}</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{tokenInfo.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Symbol:</span>
            <span className="text-sm font-medium text-purple-400">${tokenInfo.symbol}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-700/40">
          <span className="text-sm text-gray-400">Initial Supply</span>
          <div className="text-xl font-bold text-white mt-1">
            {tokenInfo.initialSupply?.toLocaleString()}
          </div>
        </div>
        
        <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-700/40">
          <span className="text-sm text-gray-400">Max Supply</span>
          <div className="text-xl font-bold text-white mt-1">
            {tokenInfo.maxSupply?.toLocaleString() || 'Unlimited'}
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced input component
const EnhancedInput = ({ input, setInput, handleSubmit, isProcessing }) => {
  return (
    <div className="border-t border-gray-800/50 bg-gradient-to-b from-transparent to-gray-900 p-8">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5 rounded-2xl pointer-events-none"></div>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your token launch (e.g., Create a token named Rocket with symbol RKT and supply of 100,000)"
            className="w-full bg-gray-800/50 backdrop-blur-sm text-white rounded-2xl px-6 py-5 pr-16 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-lg border border-gray-700/50 shadow-inner shadow-black/20"
            disabled={isProcessing}
          />
          
          <AnimatePresence>
            {isProcessing ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center">
                  <ArrowPathIcon className="w-6 h-6 text-purple-400 animate-spin" />
                </div>
              </motion.div>
            ) : (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="submit"
                disabled={isProcessing || !input.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-900/30 hover:shadow-purple-800/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowUpCircleIcon className="w-6 h-6 text-white" />
              </motion.button>
            )}
          </AnimatePresence>
        </form>
        
        <div className="flex justify-center mt-4">
          <p className="text-xs text-gray-500 max-w-xl text-center">
            Launch your token with just one prompt. Be specific about name, symbol, and supply.
            Our AI will handle contract deployment, minting, and social announcements.
          </p>
        </div>
      </div>
    </div>
  );
};

// Welcome/intro component
const WelcomeScreen = ({ onStart }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center p-8"
    >
      <div className="max-w-2xl w-full bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 shadow-2xl shadow-purple-900/10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center border border-purple-500/20 mb-6">
            <RocketLaunchIcon className="w-10 h-10 text-purple-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Social Launchpad</h2>
          <p className="text-gray-300 mb-4">
            Launch your token with AI-assisted deployment, market analysis, and social promotion.
          </p>
          <p className="text-gray-400 text-sm">
            Simply describe your token, and our AI will handle the rest - from sentiment analysis to contract deployment and social media announcements.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-8">
          {STEPS.map((step) => {
            const StepIcon = step.icon;
            return (
              <div key={step.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/40 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-purple-500/10">
                  <StepIcon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{step.title}</h3>
                  <p className="text-gray-400 text-xs">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20 hover:shadow-purple-800/30 transition-all duration-300"
        >
          <SparklesIcon className="w-5 h-5" />
          <span>Launch Your Token</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

// Success screen component
const SuccessScreen = ({ tokenInfo, contractAddress, onReset }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-lg rounded-2xl border border-green-500/30 shadow-2xl shadow-green-900/10 mb-8"
    >
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-400/20 rounded-full flex items-center justify-center border border-green-500/20 mb-4">
          <CheckCircleIcon className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Token Launch Successful!</h3>
        <p className="text-gray-300 max-w-lg">
          Your token <span className="text-green-400 font-medium">
          {tokenInfo?.name} (${tokenInfo?.symbol})
          </span> has been successfully deployed to the blockchain.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/40">
          <span className="text-sm text-gray-400">Contract Address</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-white font-mono text-sm truncate">
              {contractAddress}
            </span>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(contractAddress);
                toast.success('Address copied!');
              }}
              className="p-1.5 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/40">
          <span className="text-sm text-gray-400">Initial Minted Supply</span>
          <div className="flex items-center justify-between mt-2">
            <div>
              <span className="text-white font-bold">
                {Math.floor(tokenInfo?.initialSupply * 0.5).toLocaleString()}
              </span>
              <span className="text-gray-400 ml-2 text-sm">${tokenInfo?.symbol}</span>
            </div>
            <CurrencyDollarIcon className="w-6 h-6 text-green-400" />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href={`https://testnet.sonicscan.org/address/${contractAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-5 py-3 bg-gradient-to-r from-purple-600/90 to-blue-600/90 text-white rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-purple-900/20 text-center flex items-center justify-center gap-2 font-medium"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span>View on Explorer</span>
        </a>
        <button
          onClick={onReset}
          className="flex-1 px-5 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-all duration-300 font-medium flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Launch Another Token</span>
        </button>
      </div>
    </motion.div>
  );
};

// Main component
const SocialLaunchpad = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [contractAddress, setContractAddress] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const resetLaunchpad = () => {
    setMessages([]);
    setInput('');
    setCurrentStep(null);
    setCompletedSteps([]);
    setTokenInfo(null);
    setContractAddress(null);
    setShowSuccess(false);
  };

  const completeStep = (stepId) => {
    setCompletedSteps(prev => [...prev, stepId]);
  };

  const addMessage = (content, type = 'bot', links = []) => {
    setMessages(prev => [...prev, { type, content, links }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userPrompt = input;
    setInput('');
    addMessage(userPrompt, 'user');
    setIsProcessing(true);

    try {
      // Step 1: Sentiment Analysis
      setCurrentStep('analyze');
      const sentimentResponse = await fetch('http://localhost:5001/sentimentAnalysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt })
      });
      const sentimentData = await sentimentResponse.json();

      // Get token information
      const tokenInfoResponse = await fetch('http://localhost:5001/launchpadChat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt })
      });
      const tokenInfoData = await tokenInfoResponse.json();
      setTokenInfo(tokenInfoData);
      
      // If sentiment is negative, stop the process
      if (!sentimentData.sentiment) {
        addMessage("I've analyzed the current market conditions, and unfortunately, the sentiment doesn't appear favorable for your token launch at this time. Consider refining your token concept or trying again when market conditions improve.");
        setIsProcessing(false);
        return;
      }
      
      // Continue with positive sentiment
      completeStep('analyze');
      addMessage("The market sentiment analysis looks favorable! ✅ I've analyzed current conditions and your token concept has potential. Let's move forward with deployment.");
      
      // Step 2: Deploy Contract
      setCurrentStep('deploy');
      const deployResponse = await fetch('http://localhost:5001/deployContract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tokenInfoData)
      });
      const deployData = await deployResponse.json();
      setContractAddress(deployData);
      completeStep('deploy');
      
      addMessage(`Smart contract successfully deployed! ✅ Your ${tokenInfoData.name} token contract is now live on the blockchain with the address: ${deployData}`);
      
      // Step 3: Mint Tokens
      setCurrentStep('mint');
      const mintAmount = Math.floor(tokenInfoData.initialSupply * 0.5);
      const mintResponse = await fetch('http://localhost:5001/mintTokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractAddress: deployData,
          to: tokenInfoData.owner,
          amount: mintAmount
        })
      });
      const mintData = await mintResponse.json();
      completeStep('mint');
      
      addMessage(`Initial token supply minted! ✅ ${mintAmount.toLocaleString()} ${tokenInfoData.symbol} tokens have been minted and sent to your wallet.`);

      // Step 4: Post Tweet
      setCurrentStep('tweet');
      const tweetContent = `I'm excited to announce the launch of my new token $${tokenInfoData.symbol}! Check it out on the Sonic testnet: ${deployData} #Blockchain #Crypto`;
      const tweetResponse = await fetch('http://localhost:5001/postTweet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: tweetContent })
      });
      const tweetData = await tweetResponse.json();
      completeStep('tweet');
      
      addMessage("Social announcement successful! ✅ Your token launch has been shared on Twitter to start building community awareness.");

      // Show final success message
      setShowSuccess(true);
      
    } catch (error) {
      console.error('Error:', error);
      addMessage(
        "I encountered an issue while processing your request. This could be due to network connectivity or server problems. Please try again or check your connection.",
        'bot'
      );
    } finally {
      setIsProcessing(false);
      setCurrentStep(null);
    }
  };

  return (
    <div className="ml-64 h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black overflow-hidden flex flex-col relative">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-10 w-72 h-72 bg-purple-600/5 rounded-full filter blur-3xl"></div>
        <div className="absolute top-20 right-20 w-80 h-80 bg-blue-600/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-40 left-1/3 w-64 h-64 bg-indigo-600/5 rounded-full filter blur-3xl"></div>
      </div>
      
      {/* Welcome screen */}
      <AnimatePresence>
        {showWelcome && (
          <WelcomeScreen onStart={() => setShowWelcome(false)} />
        )}
      </AnimatePresence>
      
      {/* Main content */}
      {!showWelcome && (
        <>
          <div className="flex-1 overflow-y-auto p-8 z-10">
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-purple-500/10 shadow-lg shadow-purple-500/5">
                      <RocketLaunchIcon className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Social Launchpad</h2>
                      <p className="text-sm text-gray-400">AI-Powered Token Creation & Deployment</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={resetLaunchpad}
                    className="px-3 py-1.5 text-sm text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <ArrowPathIcon className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
              
              {/* Token preview when available */}
              {tokenInfo && !showSuccess && <TokenPreview tokenInfo={tokenInfo} />}
              
              {/* Success screen */}
              {showSuccess && <SuccessScreen 
                tokenInfo={tokenInfo} 
                contractAddress={contractAddress} 
                onReset={resetLaunchpad} 
              />}
              
              {/* Chat messages */}
              <div className="space-y-2 mb-32">
                {messages.length === 0 && !showSuccess && (
                  <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 text-center">
                    <p className="text-gray-300 mb-3">Describe your token to launch it</p>
                    <p className="text-gray-500 text-sm">Example: "Create a token named Rocket with symbol RKT and supply of 100,000"</p>
                  </div>
                )}
                
                {messages.map((message, index) => (
                  <MessageBubble key={index} message={message} />
                ))}
              </div>
              
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Steps indicator if process is ongoing */}
          {currentStep && (
            <StepIndicator
              currentStep={currentStep}
              completedSteps={completedSteps}
            />
          )}
          
          {/* Input area */}
          <EnhancedInput 
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isProcessing={isProcessing}
          />
        </>
      )}
    </div>
  );
};

export default SocialLaunchpad;