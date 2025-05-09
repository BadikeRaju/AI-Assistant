import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import VoiceAssistant from '../VoiceAssistant';
import ChatAssistant from '../ChatAssistant';
import { motion } from 'framer-motion';

const Layout = () => {
  // Mobile sidebar state - sidebar only used on mobile now
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Mobile Sidebar - only appears when toggled */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="flex flex-1 flex-col">
        <Header setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
        
        <main className="flex-1 p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
      
      <VoiceAssistant />
      <ChatAssistant />
    </div>
  );
};

export default Layout;