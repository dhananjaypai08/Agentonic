import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ArrowUpCircleIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { LoaderIcon } from 'react-hot-toast';

const LOADING_STEPS = [
  "Initializing AI agents...",
  "Processing your request...",
  "Analyzing blockchain data...",
  "Consulting DeFi protocols...",
  "Preparing response..."
];

// Add balance formatting helper
const formatBalance = (balance) => {
  return typeof balance === 'number' ? balance.toFixed(4) : '0.0000';
};

// Add fun balance messages
const BALANCE_MESSAGES = [
  "Wow! Your wallet is looking healthy! 🌟",
  "Ka-ching! Here's what you're holding! 💰",
  "Behold, your crypto treasure! ✨",
  "Looking good! Here's your balance! 🎯",
  "Your wallet is speaking to us! 📢",
];

// Add protocol response handling
const ProtocolResponse = ({ protocol }) => {
  if (!protocol || typeof protocol !== 'object') return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          {protocol.protocol_name}
        </h3>
        {protocol.protocol_link && (
          <a
            href={protocol.protocol_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            Visit Protocol →
          </a>
        )}
      </div>

      <p className="text-gray-300">{protocol.protocol_description}</p>

      {protocol.protocol_steps && (
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white">Steps to Follow:</h4>
          <div className="space-y-3">
            {protocol.protocol_steps.map((step, index) => (
              <div
                key={index}
                className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex items-start">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-sm mr-3">
                    {step.step_number}
                  </span>
                  <div className="space-y-2 flex-1">
                    <p className="text-white">{step.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      {step.estimated_time && (
                        <span className="text-gray-400">
                          ⏱️ Est. Time: {step.estimated_time}
                        </span>
                      )}
                      {step.potential_fees && (
                        <span className="text-gray-400">
                          💰 Est. Fees: {step.potential_fees}
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
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-medium mb-2">Slippage Insights</h4>
            <p className="text-gray-300 text-sm">{protocol["slippage insights"]}</p>
            <p className="text-purple-400 text-sm mt-1">
              Estimated Slippage: {protocol.estimated_slippage}
            </p>
          </div>
        )}
        
        {protocol.overall_benefit && (
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-medium mb-2">Overall Benefit</h4>
            <p className="text-gray-300 text-sm">{protocol.overall_benefit}</p>
          </div>
        )}
      </div>

      {protocol.risks && protocol.risks.length > 0 && (
        <div className="bg-red-900/20 rounded-lg p-4 border border-red-800/30">
          <div className="flex items-center gap-2 mb-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
            <h4 className="text-white font-medium">Risk Factors</h4>
          </div>
          <ul className="list-disc list-inside space-y-1">
            {protocol.risks.map((risk, index) => (
              <li key={index} className="text-gray-300 text-sm">{risk}</li>
            ))}
          </ul>
        </div>
      )}

      {protocol.alternative_protocols && protocol.alternative_protocols.length > 0 && (
        <div className="mt-4">
          <h4 className="text-white font-medium mb-2">Alternative Protocols</h4>
          <div className="flex flex-wrap gap-2">
            {protocol.alternative_protocols.map((alt, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300"
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
        <div className="space-y-3">
          <p className="text-lg font-medium">{message.content}</p>
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {formatBalance(message.balance)} ETH
            </span>
            <span className="text-gray-400">≈ ${(message.balance * 3500).toFixed(2)}</span>
          </div>
        </div>
      );
    }

    if (isProtocol) {
      return <ProtocolResponse protocol={message.content} />;
    }

    return (
      <div className="prose prose-invert max-w-none">
        {typeof message.content === 'string' ? (
          <ReactMarkdown>{message.content}</ReactMarkdown>
        ) : (
          <p className="text-gray-300">Unable to display message content</p>
        )}
      </div>
    );
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 fade-in`}>
      <div
        className={`max-w-[80%] rounded-2xl px-6 py-4 ${
          isUser
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/10'
            : 'bg-gray-800 text-gray-100 shadow-lg shadow-gray-900/20'
        }`}
      >
        {renderContent()}
        {message.links && message.links.map((link, index) => (
          <div key={index} className="mt-4 flex items-center gap-2">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
            >
              {link.includes('etherscan') ? "View on Etherscan →" :
               link.includes('sonicscan') ? "View on Sonicscan →" :
               "View Transaction →"}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

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
    <div className="ml-40 h-screen bg-gray-900 flex flex-col">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="sticky top-0 z-10 bg-gray-900 pb-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white">Chat with AI Agent</h2>
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="flex items-center px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  <TrashIcon className="w-5 h-5 mr-2" />
                  Clear Chat
                </button>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))}
            {isLoading && (
              <div className="flex flex-col items-start">
                <div className="bg-gray-800 rounded-2xl px-6 py-4 flex items-center space-x-3">
                  <LoaderIcon className="w-5 h-5 text-purple-500 animate-spin" />
                  <span className="text-gray-300">{LOADING_STEPS[loadingStep]}</span>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      <div className="border-t border-gray-800 bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about DeFi, bridges, or transfers..."
              className="w-full bg-gray-800 text-white rounded-xl px-6 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-500 hover:text-purple-400 transition-colors disabled:opacity-50"
            >
              <ArrowUpCircleIcon className="w-8 h-8" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Query; 