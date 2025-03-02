import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChatBubbleLeftRightIcon, 
  CodeBracketSquareIcon, 
  Cog6ToothIcon, 
  RocketLaunchIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [animating, setAnimating] = useState(false);

  const menuItems = [
    {
      name: 'Agents',
      icon: CodeBracketSquareIcon,
      path: '/agents',
      description: 'Manage your AI agents'
    },
    {
      name: 'Query Agent',
      icon: ChatBubbleLeftRightIcon,
      path: '/query',
      description: 'Chat with your agents'
    },
    {
      name: 'Launchpad',
      icon: RocketLaunchIcon,
      path: '/launchpad',
      description: 'Deploy new projects'
    },
    {
      name: 'Settings',
      icon: Cog6ToothIcon,
      path: '/settings',
      description: 'Configure your environment'
    }
  ];

  const toggleSidebar = () => {
    setAnimating(true);
    setIsCollapsed(!isCollapsed);
    
    // Reset animating state after animation completes
    setTimeout(() => {
      setAnimating(false);
    }, 300);
  };

  return (
    <div 
      className={`fixed left-0 top-0 h-full z-20 bg-black border-r border-zinc-800/30 shadow-xl shadow-purple-950/5 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      } ${animating ? 'overflow-hidden' : ''}`}
    >
      <div className="relative h-full flex flex-col">
        {/* Collapse toggle button */}
        <button 
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 bg-black border border-zinc-800 rounded-full p-1.5 shadow-lg shadow-black/50 hover:shadow-purple-950/20 z-20 transition-all duration-200"
        >
          {isCollapsed ? (
            <ChevronDoubleRightIcon className="w-3.5 h-3.5 text-purple-400" />
          ) : (
            <ChevronDoubleLeftIcon className="w-3.5 h-3.5 text-purple-400" />
          )}
        </button>

        {/* Logo section */}
        <div className={`
          py-8 px-4 flex items-center justify-center 
          transition-all duration-300 
          ${isCollapsed ? 'h-20' : 'h-28'}
        `}>
          <div className="relative overflow-hidden">
            <h1 className={`
              font-extrabold transition-all duration-300 flex items-center
              ${isCollapsed ? 'text-xl' : 'text-2xl'}
            `}>
              <span className="bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
                {isCollapsed ? 'A' : 'Agentonic'}
              </span>
            </h1>
            <div className="absolute -bottom-3 left-0 right-0 h-0.5 bg-zinc-800 rounded-full"></div>
          </div>
        </div>

        {/* Menu items */}
        <div className="px-3 flex-1 space-y-1.5 overflow-y-auto scrollbar-hidden">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link 
                key={item.path}
                to={item.path} 
                className={`
                  group flex items-center gap-3 p-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-zinc-900 text-white border border-zinc-800' 
                    : 'text-gray-400 hover:bg-zinc-900/50 hover:text-white'}
                `}
              >
                <div className={`
                  flex items-center justify-center transition-all duration-200
                  ${isActive ? 'text-purple-400' : 'text-gray-500 group-hover:text-purple-400'}
                `}>
                  <item.icon className={`
                    transition-all duration-200
                    ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'}
                  `} />
                </div>
                
                <div className={`
                  flex flex-col transition-all duration-200 overflow-hidden
                  ${isCollapsed ? 'w-0 opacity-0' : 'w-full opacity-100'}
                `}>
                  <span className="font-medium">{item.name}</span>
                  {!isCollapsed && (
                    <span className="text-xs text-zinc-500">{item.description}</span>
                  )}
                </div>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute right-0 w-1 h-8 bg-purple-500 rounded-l-full"></div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer section */}
        <div className={`
          p-4 mt-auto border-t border-zinc-900
          transition-all duration-300
          ${isCollapsed ? 'opacity-0 h-0 p-0 invisible' : 'opacity-100 visible'}
        `}>
          <div className="flex items-center justify-center p-3 rounded-xl bg-zinc-900/70 hover:bg-zinc-800/50 transition-all duration-200 cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-black border border-zinc-800 flex items-center justify-center">
                <span className="text-purple-400 text-xs font-bold">AG</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">Agentonic</span>
                <span className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">v1.2.4</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;