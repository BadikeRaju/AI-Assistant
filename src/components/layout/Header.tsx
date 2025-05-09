import React, { useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { 
  BrainCircuit, 
  Calendar, 
  Clock, 
  Code2, 
  Cog, 
  Home, 
  LineChart,
} from 'lucide-react';
import { cn } from '../../utils/cn';

type HeaderProps = {
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
};

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Pomodoro Timer', href: '/pomodoro', icon: Clock },
  { name: 'Learning Tracker', href: '/learning', icon: LineChart },
  { name: 'Job Tracker', href: '/jobs', icon: Calendar },
  { name: 'Coding Challenges', href: '/challenges', icon: Code2 },
];

const Header = ({ setSidebarOpen, sidebarOpen }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useUser();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900 md:px-6">
      {/* Mobile menu button */}
      <button
        type="button"
        className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <span className="sr-only">Toggle sidebar</span>
        <Menu className="h-6 w-6" />
      </button>
      
      {/* Logo */}
      <div className="flex items-center">
        <BrainCircuit className="h-8 w-8 text-primary-600 dark:text-primary-500 mr-2" />
        <span className="text-xl font-semibold text-gray-900 dark:text-white">DevAssist</span>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-4 ml-10">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md',
                  isActive
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50'
                )
              }
            >
              <item.icon className="mr-1.5 h-5 w-5 flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
        >
          <span className="sr-only">
            {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          </span>
          
          {theme === 'dark' ? (
            <motion.div
              initial={{ rotate: -30, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ rotate: 30, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="h-5 w-5" />
            </motion.div>
          )}
        </button>
        
        {/* Settings Button - Directly Visible */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50',
              isActive && 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50'
            )
          }
        >
          <Cog className="h-5 w-5" />
        </NavLink>
        
        {/* User Profile */}
        <div className="relative">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary-100 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <span className="sr-only">User menu</span>
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{user.name.charAt(0)}</span>
            )}
          </button>
          
          {/* User Menu Dropdown */}
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800">
              <div className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
                <div className="font-semibold">{user.name}</div>
                <div className="text-gray-500 dark:text-gray-400 text-xs">@{user.username}</div>
              </div>
              <NavLink
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                onClick={() => setUserMenuOpen(false)}
              >
                Your Account
              </NavLink>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                onClick={(e) => {
                  e.preventDefault();
                  setUserMenuOpen(false);
                }}
              >
                Sign out
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;