import { Link } from 'react-router-dom';
import { ChatBubbleLeftRightIcon, CodeBracketSquareIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

const Sidebar = () => {
  const menuItems = [
    {
      name: 'Query Agent',
      icon: ChatBubbleLeftRightIcon,
      path: '/query'
    }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-40 bg-black border-r border-gray-800 p-4">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold text-white mb-8 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          Agentonic
        </h1>
        <Link 
          to="/agents" 
          className="text-gray-300 hover:text-white hover:bg-gray-800 p-3 rounded-lg transition-all duration-200"
        >
          <CodeBracketSquareIcon className="w-6 h-6 mr-2" />
          Agents
        </Link>
        <Link 
          to="/query" 
          className="text-gray-300 hover:text-white hover:bg-gray-800 p-3 rounded-lg transition-all duration-200"
        >
          <ChatBubbleLeftRightIcon className="w-6 h-6 mr-2" />
          Query Agent
        </Link>
        <Link 
          to="/settings" 
          className="text-gray-300 hover:text-white hover:bg-gray-800 p-3 rounded-lg transition-all duration-200"
        >
          <Cog6ToothIcon className="w-6 h-6 mr-2" />
          Settings
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;