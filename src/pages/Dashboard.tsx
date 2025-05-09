import React from 'react';
import { ArrowRight, BrainCircuit, Calendar, Clock, Code2, LineChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Welcome to DevAssist
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Your AI-powered assistant to stay focused and improve your skills
          </p>
        </div>
        
        <motion.div 
          className="mt-4 flex items-center md:mt-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              AI Assistant
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ready to help
            </p>
          </div>
        </motion.div>
      </div>

      {/* Quick access cards */}
      <motion.div 
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants}>
          <Link
            to="/pomodoro"
            className="group block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-primary-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 hover:dark:border-primary-900"
          >
            <div className="flex justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                <Clock className="h-6 w-6" />
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary-500 dark:text-gray-500 dark:group-hover:text-primary-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              Pomodoro Timer
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Stay focused with timed work sessions and breaks
            </p>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link
            to="/learning"
            className="group block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-primary-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 hover:dark:border-primary-900"
          >
            <div className="flex justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100 text-secondary-600 dark:bg-secondary-900/30 dark:text-secondary-400">
                <LineChart className="h-6 w-6" />
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-secondary-500 dark:text-gray-500 dark:group-hover:text-secondary-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              Learning Tracker
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Track your progress in DS&A and system design
            </p>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link
            to="/jobs"
            className="group block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-primary-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 hover:dark:border-primary-900"
          >
            <div className="flex justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-100 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400">
                <Calendar className="h-6 w-6" />
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-accent-500 dark:text-gray-500 dark:group-hover:text-accent-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              Job Tracker
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Manage your job applications and interviews
            </p>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link
            to="/challenges"
            className="group block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-primary-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 hover:dark:border-primary-900"
          >
            <div className="flex justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400">
                <Code2 className="h-6 w-6" />
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-success-500 dark:text-gray-500 dark:group-hover:text-success-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              Coding Challenges
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Practice with coding challenges and exercises
            </p>
          </Link>
        </motion.div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div 
        className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
        <div className="mt-4 space-y-4">
          <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Welcome to DevAssist! Start by setting up your learning goals or trying the Pomodoro timer.
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Just now
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;