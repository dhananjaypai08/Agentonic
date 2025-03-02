import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  ArrowUpCircleIcon, 
  TrashIcon, 
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  LightBulbIcon,
  ArrowPathIcon,
  SparklesIcon,
  ClockIcon
} from '@heroicons/react/24/solid';
import { 
  ChevronRightIcon,
  LinkIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { LoaderIcon } from 'react-hot-toast';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const LOADING_STEPS = [
  "Initializing AI agents...",
  "Processing your request...",
  "Thinking...",
  "Consulting DeFi protocols...",
  "Preparing response..."
];

// Add balance formatting helper with improved precision
const formatBalance = (balance) => {
  if (typeof balance !== 'number') return '0.0000';
  
  // Show more decimal places for small amounts
  if (balance < 0.01) return balance.toFixed(6);
  if (balance < 1) return balance.toFixed(5);
  return balance.toFixed(4);
};

// Enhanced balance messages with emoji variety
const BALANCE_MESSAGES = [
  "Your wallet is looking healthy! 🌟",
  "Here's what you're holding! 💰",
  "Behold, your crypto treasury! ✨",
  "Portfolio snapshot ready! 🎯",
  "Your digital assets, visualized! 📊",
];

// Add protocol response handling with enhanced styling
const ProtocolResponse = ({ protocol }) => {
  if (!protocol || typeof protocol !== 'object') return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600/30 to-blue-600/30 flex items-center justify-center">
          <SparklesIcon className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {protocol.protocol_name}
          </h3>
          {protocol.protocol_link && (
            <a
              href={protocol.protocol_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 mt-1 group"
            >
              <LinkIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              <span>Visit Protocol</span>
            </a>
          )}
        </div>
      </div>

      <p className="text-gray-300 leading-relaxed">{protocol.protocol_description}</p>

      {protocol.protocol_steps && (
        <div className="space-y-4 mt-6">
          <h4 className="text-lg font-medium text-white flex items-center gap-2">
            <ChevronRightIcon className="w-5 h-5 text-purple-400" />
            Steps to Follow
          </h4>
          <div className="space-y-3 relative">
            {/* Vertical timeline line */}
            <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/70 via-blue-500/50 to-purple-500/20 rounded-full"></div>
            
            {protocol.protocol_steps.map((step, index) => (
              <div
                key={index}
                className="relative ml-4 pl-8 py-4"
              >
                {/* Timeline dot */}
                <div className="absolute left-[-17px] top-5 w-6 h-6 rounded-full bg-gray-800 border-2 border-purple-500 flex items-center justify-center z-10">
                  <span className="text-purple-400 text-xs font-medium">{step.step_number}</span>
                </div>
                
                {/* Content card */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/70 shadow-lg hover:shadow-purple-900/5 hover:border-purple-500/30 transition-all duration-300">
                  <div className="space-y-3">
                    <p className="text-white">{step.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm pt-2">
                      {step.estimated_time && (
                        <span className="text-gray-400 flex items-center gap-1.5">
                          <ClockIcon className="w-4 h-4 text-blue-400" />
                          Est. Time: {step.estimated_time}
                        </span>
                      )}
                      {step.potential_fees && (
                        <span className="text-gray-400 flex items-center gap-1.5">
                          <CurrencyDollarIcon className="w-4 h-4 text-green-400" />
                          Est. Fees: {step.potential_fees}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {protocol["slippage insights"] && (
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50 shadow-lg hover:shadow-purple-900/5 hover:border-purple-500/30 transition-all duration-300">
            <h4 className="text-white font-medium mb-2 flex items-center gap-2">
              <LightBulbIcon className="w-4 h-4 text-yellow-400" />
              Slippage Insights
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed">{protocol["slippage insights"]}</p>
            <div className="mt-3 px-3 py-1.5 bg-purple-500/10 rounded-lg inline-block">
              <p className="text-purple-300 text-sm font-medium">
                Estimated Slippage: {protocol.estimated_slippage}
              </p>
            </div>
          </div>
        )}
        
        {protocol.overall_benefit && (
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50 shadow-lg hover:shadow-purple-900/5 hover:border-purple-500/30 transition-all duration-300">
            <h4 className="text-white font-medium mb-2 flex items-center gap-2">
              <ShieldCheckIcon className="w-4 h-4 text-green-400" />
              Overall Benefit
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed">{protocol.overall_benefit}</p>
          </div>
        )}
      </div>

      {protocol.risks && protocol.risks.length > 0 && (
        <div className="bg-red-950/30 backdrop-blur-sm rounded-xl p-5 border border-red-800/30 shadow-lg hover:shadow-red-900/10 transition-all duration-300 mt-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
              <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />
            </div>
            <h4 className="text-white font-medium">Risk Factors</h4>
          </div>
          <ul className="space-y-2">
            {protocol.risks.map((risk, index) => (
              <li key={index} className="text-gray-300 text-sm pl-6 relative">
                <span className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-red-500/50"></span>
                {risk}
              </li>
            ))}
          </ul>
        </div>
      )}

      {protocol.alternative_protocols && protocol.alternative_protocols.length > 0 && (
        <div className="mt-6">
          <h4 className="text-white font-medium mb-3 flex items-center gap-2">
            <ArrowPathIcon className="w-4 h-4 text-blue-400" />
            Alternative Protocols
          </h4>
          <div className="flex flex-wrap gap-2">
            {protocol.alternative_protocols.map((alt, index) => (
              <span
                key={index}
                className="px-3.5 py-1.5 bg-gray-800/70 border border-gray-700/50 rounded-full text-sm text-blue-300 hover:bg-gray-700/70 hover:border-blue-500/30 cursor-pointer transition-all duration-200"
              >
                {alt}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MessageBubble = ({ message }) => {
  const isUser = message.type === 'user';
  const isProtocol = !isUser && message.content && typeof message.content === 'object';

  const renderContent = () => {
    if (isUser) {
      return <p className="text-white text-lg">{message.content}</p>;
    }

    if (message.isBalance) {
      return (
        <div className="space-y-4">
          <p className="text-lg font-medium flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-purple-400" />
            <span>{message.content}</span>
          </p>
          <div className="p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/70 flex flex-col space-y-2">
            <div className="flex items-baseline space-x-3">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {formatBalance(message.balance)} ETH
              </span>
              <span className="text-gray-400">≈ ${(message.balance * 3500).toFixed(2)} USD</span>
            </div>
            <div className="h-2 bg-gray-700/70 rounded-full overflow-hidden w-full mt-1">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                style={{ width: `${Math.min(message.balance * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      );
    }

    if (isProtocol) {
      return <ProtocolResponse protocol={message.content} />;
    }

    return (
      <div className="prose prose-invert max-w-none prose-headings:text-purple-300 prose-a:text-blue-400 prose-strong:text-white prose-code:bg-gray-800 prose-code:text-purple-300 prose-code:px-1 prose-code:py-0.5 prose-code:rounded-md prose-code:before:hidden prose-code:after:hidden">
        {typeof message.content === 'string' ? (
          <ReactMarkdown>{message.content}</ReactMarkdown>
        ) : (
          <p className="text-gray-300">Unable to display message content</p>
        )}
      </div>
    );
  };

  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 animate-fade-in`}
    >
      {/* Avatar for bot message */}
      {!isUser && (
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mr-3 mt-1 flex-shrink-0 shadow-lg shadow-purple-900/20">
          <ChatBubbleLeftRightIcon className="h-5 w-5 text-white" />
        </div>
      )}
      
      <div
        className={`max-w-[85%] rounded-2xl px-6 py-5 shadow-xl transition-all duration-300 ${
          isUser
            ? 'bg-gradient-to-br from-purple-600 to-blue-700 text-white ml-3 hover:shadow-purple-900/30'
            : 'bg-gray-800/90 backdrop-blur-sm text-gray-100 border border-gray-700/50 hover:border-gray-600/70 hover:shadow-purple-900/5'
        }`}
      >
        {renderContent()}
        
        {message.links && message.links.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {message.links.map((link, index) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-br from-purple-500/90 to-blue-600/90 rounded-lg text-white hover:from-purple-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-purple-900/20 hover:shadow-purple-800/30 group"
              >
                <span className="mr-1.5">{
                  link.includes('etherscan') ? "View on Etherscan" :
                  link.includes('sonicscan') ? "View on Sonicscan" :
                  "View Transaction"
                }</span>
                <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            ))}
          </div>
        )}
      </div>
      
      {/* Avatar for user message */}
      {isUser && (
        <div className="h-10 w-10 rounded-full bg-purple-700/80 flex items-center justify-center ml-3 mt-1 flex-shrink-0 shadow-lg shadow-purple-900/20">
          <span className="text-white font-medium text-sm">YOU</span>
        </div>
      )}
    </div>
  );
};

// Loading indicator component
const LoadingIndicator = ({ currentStep }) => (
  <div className="flex flex-col items-start mb-6">
    <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl px-6 py-5 border border-gray-700/50 shadow-lg max-w-md flex items-center space-x-4">
      <div className="relative h-6 w-6">
        <div className="absolute inset-0 bg-purple-500/30 rounded-full animate-ping opacity-75"></div>
        <LoaderIcon className="h-6 w-6 text-purple-500 animate-spin relative z-10" />
      </div>
      <span className="text-gray-300">{currentStep}</span>
    </div>
  </div>
);

// Empty state component
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center mb-6">
      <ChatBubbleLeftRightIcon className="w-10 h-10 text-purple-400" />
    </div>
    <h3 className="text-xl font-medium text-white mb-3">Start a Conversation</h3>
    <p className="text-gray-400 max-w-md mb-8">
      Ask about wallet management, DeFi protocols, token swaps, bridging assets, or any Sonic-related questions.
    </p>
    <div className="grid grid-cols-2 gap-3 max-w-lg">
      <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-200 cursor-pointer group">
        <p className="text-gray-300 text-sm group-hover:text-white transition-colors">
          "What's the current ETH gas price?"
        </p>
      </div>
      <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-200 cursor-pointer group">
        <p className="text-gray-300 text-sm group-hover:text-white transition-colors">
          "How do I bridge tokens to Sonic?"
        </p>
      </div>
      <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-200 cursor-pointer group">
        <p className="text-gray-300 text-sm group-hover:text-white transition-colors">
          "Check my wallet balance"
        </p>
      </div>
      <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-200 cursor-pointer group">
        <p className="text-gray-300 text-sm group-hover:text-white transition-colors">
          "What's the best way to stake ETH?"
        </p>
      </div>
    </div>
  </div>
);

const Query = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const clearChat = () => {
    setMessages([]);
    setInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setLoadingStep(0);

    try {
      const response = await fetch('http://localhost:5001/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      let botMessage = {
        type: 'bot',
        content: '',
        links: [],
        isBalance: false,
        balance: null
      };

      if (data.status === 'success') {
        // Check if the response is a pure number (balance)
        const numericResult = parseFloat(data.result);
        if (!isNaN(numericResult) && data.result.toString().match(/^\d*\.?\d*$/)) {
          const balance = numericResult;
          const randomMessage = BALANCE_MESSAGES[Math.floor(Math.random() * BALANCE_MESSAGES.length)];
          botMessage.isBalance = true;
          botMessage.balance = balance;
          botMessage.content = randomMessage;
        }
        // Check if response is a protocol object
        else if (data.result && typeof data.result === 'object' && data.result.protocol_name) {
          botMessage.content = data.result;
        }
        // Check if response is a transaction with URL
        else if (data.tx_url) {
          botMessage.content = data.result;
          botMessage.links = [data.tx_url];
        }
        // Handle markdown/text response
        else {
          try {
            // Try to parse if it's a stringified object
            const parsedResult = typeof data.result === 'string' ? 
              (data.result.startsWith('{') ? JSON.parse(data.result) : data.result) : 
              data.result;

            if (typeof parsedResult === 'object' && parsedResult.protocol_name) {
              botMessage.content = parsedResult;
            } else {
              botMessage.content = data.result;
            }
          } catch (e) {
            // If parsing fails, treat as regular text
            botMessage.content = data.result;
          }
        }
      } else {
        botMessage.content = "I apologize, but I couldn't process your request properly. Please try again.";
      }

      // Extract any URLs from text content if they exist
      if (typeof botMessage.content === 'string') {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const matches = botMessage.content.match(urlRegex);
        if (matches) {
          botMessage.links = [...new Set([...botMessage.links, ...matches])];
          // Remove links from content to avoid duplication
          botMessage.content = botMessage.content.replace(urlRegex, '');
        }
      }

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        content: 'Sorry, there was an error processing your request. Please try again later.',
        links: []
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ml-64 h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex flex-col relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full filter blur-3xl"></div>
      <div className="absolute top-1/4 right-1/3 w-80 h-80 bg-blue-600/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-600/5 rounded-full filter blur-3xl"></div>
      
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="sticky top-0 z-10 bg-gradient-to-b from-gray-900 via-gray-900 to-transparent pb-4">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Chat with AI Agent</h2>
                <p className="text-gray-400 mt-1">Powered by Sonic intelligence</p>
              </div>
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="flex items-center px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-700/50 hover:border-red-500/30 transition-all duration-200 shadow-lg"
                >
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Clear Chat
                </button>
              )}
            </div>
          </div>
          
          <div className="space-y-2 pb-4">
            {messages.length === 0 ? (
              <EmptyState />
            ) : (
              messages.map((message, index) => (
                <MessageBubble key={index} message={message} />
              ))
            )}
            
            {isLoading && (
              <LoadingIndicator currentStep={LOADING_STEPS[loadingStep]} />
            )}
          </div>
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      <div className="border-t border-gray-800/50 bg-gray-900/80 backdrop-blur-sm p-6">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl opacity-50 blur-md"></div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about DeFi, wallet management, or sonic interactions..."
              className="w-full bg-gray-800/70 backdrop-blur-sm text-white rounded-xl px-6 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-purple-500/70 text-lg shadow-lg border border-gray-700/50 focus:border-purple-500/50 transition-all duration-200"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                input.trim() 
                  ? 'text-purple-400 hover:text-purple-300' 
                  : 'text-gray-500'
              } transition-colors disabled:opacity-50`}
            >
              <ArrowUpCircleIcon className="w-8 h-8 transition-transform hover:translate-y-[-2px]" />
            </button>
          </form>
          
          {/* Input suggestions */}
          <div className="mt-3 flex flex-wrap gap-2 justify-center">
            <button 
              onClick={() => setInput("What's the current ETH price?")}
              className="px-3 py-1.5 bg-gray-800/40 backdrop-blur-sm text-gray-400 rounded-full text-xs hover:bg-gray-700/40 transition-colors hover:text-white"
            >
              ETH Price
            </button>
            <button 
              onClick={() => setInput("How do I bridge tokens to Sonic?")}
              className="px-3 py-1.5 bg-gray-800/40 backdrop-blur-sm text-gray-400 rounded-full text-xs hover:bg-gray-700/40 transition-colors hover:text-white"
            >
              Bridge to Sonic
            </button>
            <button 
              onClick={() => setInput("Best protocols for ETH staking?")}
              className="px-3 py-1.5 bg-gray-800/40 backdrop-blur-sm text-gray-400 rounded-full text-xs hover:bg-gray-700/40 transition-colors hover:text-white"
            >
              ETH Staking
            </button>
            <button 
              onClick={() => setInput("What's my wallet balance?")}
              className="px-3 py-1.5 bg-gray-800/40 backdrop-blur-sm text-gray-400 rounded-full text-xs hover:bg-gray-700/40 transition-colors hover:text-white"
            >
              Check Balance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Query;