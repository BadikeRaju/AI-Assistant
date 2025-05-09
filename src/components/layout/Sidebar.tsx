import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BrainCircuit, 
  Calendar, 
  Clock, 
  Code2, 
  Cog, 
  Home, 
  LineChart, 
  X,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

type SidebarProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
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
  { name: 'Settings', href: '/settings', icon: Cog },
];

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  return (
    <>
      {/* Mobile sidebar overlay */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-gray-900/80 lg:hidden',
          open ? 'block' : 'hidden'
        )}
        onClick={() => setOpen(false)}
      />

      {/* Mobile sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-white px-4 pb-4 pt-5 dark:bg-gray-900',
          open ? 'translate-x-0' : '-translate-x-full',
          'transform transition-transform duration-300 ease-in-out'
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BrainCircuit className="h-8 w-8 text-primary-600 dark:text-primary-500" />
            <span className="text-xl font-semibold text-gray-900 dark:text-white">DevAssist</span>
          </div>
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            onClick={() => setOpen(false)}
          >
            <span className="sr-only">Close sidebar</span>
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-8 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'group flex items-center rounded-md px-3 py-2 text-sm font-medium',
                  isActive
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50'
                )
              }
              onClick={() => setOpen(false)}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;