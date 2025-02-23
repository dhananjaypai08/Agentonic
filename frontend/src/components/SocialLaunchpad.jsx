import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { LoaderIcon } from 'react-hot-toast';
import { toast } from 'react-hot-toast';

const STEPS = [
  { id: 'analyze', title: 'Analyzing Market Sentiment' },
  { id: 'deploy', title: 'Deploying Token Contract' },
  { id: 'mint', title: 'Minting Initial Supply' },
  { id: 'tweet', title: 'Announcing on Twitter' }
];

const MessageBubble = ({ message }) => {
  const isUser = message.type === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 fade-in`}>
      <div
        className={`max-w-[80%] rounded-2xl px-6 py-4 ${
          isUser
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
            : 'bg-gray-800 text-gray-100'
        }`}
      >
        <p className="text-lg">{message.content}</p>
        {message.links && message.links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-3 px-4 py-2 bg-gray-700 text-blue-400 rounded-lg hover:bg-gray-600 transition-all duration-200 text-center"
          >
            {link.text} →
          </a>
        ))}
      </div>
    </div>
  );
};

const StepIndicator = ({ currentStep, completedSteps }) => {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-gray-800 rounded-xl p-4 border border-gray-700">
      <div className="flex justify-between">
        {STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          
          return (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                <div className={`flex-1 h-1 ${index === 0 ? 'hidden' : ''} ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-600'
                }`} />
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-600 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircleIcon className="w-6 h-6" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className={`flex-1 h-1 ${index === STEPS.length - 1 ? 'hidden' : ''} ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-600'
                }`} />
              </div>
              <span className={`mt-2 text-sm ${
                isCurrent ? 'text-white' : 'text-gray-400'
              }`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SocialLaunchpad = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const completeStep = (stepId) => {
    setCompletedSteps(prev => [...prev, stepId]);
  };

  const addMessage = (content, type = 'bot', links = []) => {
    setMessages(prev => [...prev, { type, content, links }]);
  };

//   const extractTokenInfo = (prompt) => {
//     const nameMatch = prompt.match(/name (\w+)/i);
//     const symbolMatch = prompt.match(/symbol (\w+)/i);
//     const supplyMatch = prompt.match(/supply of (\d+)/i);

//     return {
//       name: nameMatch?.[1] || '',
//       symbol: symbolMatch?.[1] || '',
//       initialSupply: parseInt(supplyMatch?.[1]) || 0,
//       maxSupply: parseInt(supplyMatch?.[1]) * 2 || 0
//     };
//   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userPrompt = input;
    setInput('');
    addMessage(userPrompt, 'user');
    setIsProcessing(true);

    try {
      // Extract token information
    //   const tokenInfo = extractTokenInfo(userPrompt);
      
      // Step 1: Sentiment Analysis
      setCurrentStep('analyze');
      const sentimentResponse = await fetch('http://localhost:5001/sentimentAnalysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt })
      });
      const sentimentData = await sentimentResponse.json();

      const tokenInfo = await fetch('http://localhost:5001/launchpadChat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt })
      });
      const tokenInfoData = await tokenInfo.json();
      console.log(tokenInfoData);
      
      if (!sentimentData.sentiment) {
        addMessage("I'm sorry, but the market sentiment doesn't seem favorable right now. Maybe we should try again later.");
        return;
      }
      
      completeStep('analyze');
      addMessage("Market sentiment looks positive! Let's proceed with the launch. 🚀");
      // Step 2: Deploy Contract
      setCurrentStep('deploy');
      const deployResponse = await fetch('http://localhost:5001/deployContract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tokenInfoData)
      });
      const deployData = await deployResponse.json();
      console.log(deployData);
      completeStep('deploy');
      
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
      console.log(mintData);
      completeStep('mint');

      // Step 4: Post Tweet
      setCurrentStep('tweet');
      const tweetContent = `I deployed my own token named $${tokenInfoData.symbol} and here is the contract address: ${deployData} on the sonic testnet`;
      const data = await fetch('http://localhost:5001/postTweet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: tweetContent })
      });
      const tweetData = await tweetResponse.json();
      console.log(tweetData);
      completeStep('tweet');

      // Final success message
      addMessage(
        "🎉 Congratulations! Your token has been successfully launched!",
        'bot',
        [
          {
            url: `https://testnet.sonicscan.org/address/${deployData}`,
            text: "View Token on Explorer"
          }
        ]
      );
      addMessage(
        `✅ Initial supply of ${mintAmount} tokens has been minted\n` +
        `✅ Market sentiment was positive\n` +
        `✅ Launch announcement has been tweeted`
      );

    } catch (error) {
      console.error('Error:', error);
      addMessage("I'm sorry, but there was an error processing your request. Please try again.");
    } finally {
      setIsProcessing(false);
      setCurrentStep(null);
    }
  };

  return (
    <div className="ml-40 h-screen bg-gray-900 flex flex-col">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="sticky top-0 z-10 bg-gray-900 pb-4">
            <h2 className="text-3xl font-bold text-white mb-8">Social Launchpad</h2>
          </div>
          
          <div className="space-y-4 mb-24">
            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))}
          </div>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {currentStep && (
        <StepIndicator
          currentStep={currentStep}
          completedSteps={completedSteps}
        />
      )}

      <div className="border-t border-gray-800 bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your token launch (e.g., Create a token with name Rocket, symbol RKT, and supply of 100000)"
              className="w-full bg-gray-800 text-white rounded-xl px-6 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
              disabled={isProcessing}
            />
            <button
              type="submit"
              disabled={isProcessing}
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

export default SocialLaunchpad; 