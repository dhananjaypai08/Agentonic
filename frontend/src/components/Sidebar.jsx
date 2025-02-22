import { Link } from 'react-router-dom';

const Sidebar = () => {
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
          Agents
        </Link>
        <Link 
          to="/settings" 
          className="text-gray-300 hover:text-white hover:bg-gray-800 p-3 rounded-lg transition-all duration-200"
        >
          Settings
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;