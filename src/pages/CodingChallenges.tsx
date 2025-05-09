import React, { useState } from 'react';
import { Check, CheckCircle, Code, ExternalLink, Filter, Plus, Timer, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

type DifficultyLevel = 'easy' | 'medium' | 'hard';

type Challenge = {
  id: string;
  title: string;
  category: string;
  difficulty: DifficultyLevel;
  completed: boolean;
  link?: string;
  notes?: string;
};

const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: '1',
    title: 'Two Sum',
    category: 'Arrays',
    difficulty: 'easy',
    completed: true,
    link: 'https://leetcode.com/problems/two-sum/',
    notes: 'Use a hash map to store visited numbers and their indices.',
  },
  {
    id: '2',
    title: 'Valid Parentheses',
    category: 'Stacks',
    difficulty: 'easy',
    completed: false,
    link: 'https://leetcode.com/problems/valid-parentheses/',
  },
  {
    id: '3',
    title: 'Merge Two Sorted Lists',
    category: 'Linked Lists',
    difficulty: 'easy',
    completed: true,
    link: 'https://leetcode.com/problems/merge-two-sorted-lists/',
  },
  {
    id: '4',
    title: 'Course Schedule',
    category: 'Graphs',
    difficulty: 'medium',
    completed: false,
    link: 'https://leetcode.com/problems/course-schedule/',
  },
  {
    id: '5',
    title: 'Merge Intervals',
    category: 'Arrays',
    difficulty: 'medium',
    completed: false,
    link: 'https://leetcode.com/problems/merge-intervals/',
  },
  {
    id: '6',
    title: 'Trapping Rain Water',
    category: 'Dynamic Programming',
    difficulty: 'hard',
    completed: false,
    link: 'https://leetcode.com/problems/trapping-rain-water/',
  },
];

const CATEGORIES = [
  'Arrays',
  'Strings',
  'Linked Lists',
  'Stacks',
  'Queues',
  'Trees',
  'Graphs',
  'Heaps',
  'Dynamic Programming',
  'Recursion',
  'Sorting',
  'Searching',
];

const CodingChallenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newChallenge, setNewChallenge] = useState<Omit<Challenge, 'id'>>({
    title: '',
    category: 'Arrays',
    difficulty: 'medium',
    completed: false,
    link: '',
    notes: '',
  });

  const filteredChallenges = challenges.filter(challenge => {
    return (
      (difficultyFilter === 'all' || challenge.difficulty === difficultyFilter) &&
      (categoryFilter === 'all' || challenge.category === categoryFilter) &&
      (statusFilter === 'all' || 
        (statusFilter === 'completed' && challenge.completed) || 
        (statusFilter === 'pending' && !challenge.completed))
    );
  });

  const toggleCompleted = (id: string) => {
    setChallenges(
      challenges.map(challenge =>
        challenge.id === id ? { ...challenge, completed: !challenge.completed } : challenge
      )
    );
  };

  const addChallenge = () => {
    if (newChallenge.title.trim()) {
      const newId = (Math.max(...challenges.map(c => parseInt(c.id)), 0) + 1).toString();
      setChallenges([...challenges, { id: newId, ...newChallenge }]);
      setNewChallenge({
        title: '',
        category: 'Arrays',
        difficulty: 'medium',
        completed: false,
        link: '',
        notes: '',
      });
      setShowAddForm(false);
    }
  };

  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case 'easy':
        return 'text-success-600 bg-success-100 dark:text-success-400 dark:bg-success-900/30';
      case 'medium':
        return 'text-accent-600 bg-accent-100 dark:text-accent-400 dark:bg-accent-900/30';
      case 'hard':
        return 'text-error-600 bg-error-100 dark:text-error-400 dark:bg-error-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Coding Challenges
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Practice with coding challenges to improve your skills
        </p>
      </div>

      <motion.div 
        className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="border-b border-gray-200 p-6 dark:border-gray-800">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Challenge Library</h2>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center rounded-md bg-gray-100 p-1 dark:bg-gray-800">
                <button
                  className={`rounded px-3 py-1 text-xs font-medium ${
                    statusFilter === 'all'
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                      : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  }`}
                  onClick={() => setStatusFilter('all')}
                >
                  All
                </button>
                <button
                  className={`rounded px-3 py-1 text-xs font-medium ${
                    statusFilter === 'pending'
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                      : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  }`}
                  onClick={() => setStatusFilter('pending')}
                >
                  Pending
                </button>
                <button
                  className={`rounded px-3 py-1 text-xs font-medium ${
                    statusFilter === 'completed'
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                      : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  }`}
                  onClick={() => setStatusFilter('completed')}
                >
                  Completed
                </button>
              </div>
              
              <div className="relative">
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value as DifficultyLevel | 'all')}
                  className="rounded-md border border-gray-300 bg-white py-1 pl-3 pr-10 text-xs font-medium dark:border-gray-700 dark:bg-gray-800"
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="rounded-md border border-gray-300 bg-white py-1 pl-3 pr-10 text-xs font-medium dark:border-gray-700 dark:bg-gray-800"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                className="flex items-center rounded-md bg-primary-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600"
                onClick={() => setShowAddForm(true)}
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                Add Challenge
              </button>
            </div>
          </div>
        </div>

        {/* Add Challenge Form */}
        {showAddForm && (
          <motion.div 
            className="border-b border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/50"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">Add New Challenge</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  value={newChallenge.title}
                  onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                  placeholder="Challenge title"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Category
                </label>
                <select
                  value={newChallenge.category}
                  onChange={(e) => setNewChallenge({ ...newChallenge, category: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Difficulty
                </label>
                <select
                  value={newChallenge.difficulty}
                  onChange={(e) => setNewChallenge({ ...newChallenge, difficulty: e.target.value as DifficultyLevel })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Link (Optional)
                </label>
                <input
                  type="text"
                  value={newChallenge.link || ''}
                  onChange={(e) => setNewChallenge({ ...newChallenge, link: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                  placeholder="URL to challenge"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Notes (Optional)
                </label>
                <textarea
                  value={newChallenge.notes || ''}
                  onChange={(e) => setNewChallenge({ ...newChallenge, notes: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                  placeholder="Add any notes or hints for this challenge"
                ></textarea>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                className="rounded-md bg-gray-200 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-primary-600 px-4 py-2 text-xs font-medium text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600"
                onClick={addChallenge}
              >
                Add Challenge
              </button>
            </div>
          </motion.div>
        )}

        {/* Challenges Grid */}
        <div className="p-6">
          {filteredChallenges.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-12 dark:border-gray-700">
              <Code className="h-12 w-12 text-gray-400 dark:text-gray-600" />
              <p className="mt-2 text-center text-gray-500 dark:text-gray-400">
                No challenges match your filters. Try adjusting your filter criteria or add a new challenge.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredChallenges.map((challenge) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900",
                    challenge.completed && "border-success-200 dark:border-success-900/50"
                  )}
                >
                  {challenge.completed && (
                    <div className="absolute right-0 top-0 rounded-bl-lg bg-success-500 p-1 text-white dark:bg-success-600">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                      </span>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {challenge.category}
                      </span>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                      {challenge.title}
                    </h3>
                    {challenge.notes && (
                      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                        {challenge.notes}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <button
                        className={`flex items-center rounded-md px-2.5 py-1.5 text-xs font-medium ${
                          challenge.completed
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                            : 'bg-success-100 text-success-700 hover:bg-success-200 dark:bg-success-900/30 dark:text-success-400 dark:hover:bg-success-900/50'
                        }`}
                        onClick={() => toggleCompleted(challenge.id)}
                      >
                        {challenge.completed ? (
                          <>
                            <X className="mr-1 h-3.5 w-3.5" />
                            Mark Incomplete
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-1 h-3.5 w-3.5" />
                            Mark Complete
                          </>
                        )}
                      </button>
                      {challenge.link && (
                        <a
                          href={challenge.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 flex items-center rounded-md bg-primary-100 px-2.5 py-1.5 text-xs font-medium text-primary-700 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50"
                        >
                          <ExternalLink className="mr-1 h-3.5 w-3.5" />
                          Solve
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Progress Summary */}
      <motion.div 
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Progress Summary</h2>
        
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {challenges.filter(c => c.completed).length}/{challenges.length}
              </p>
            </div>
          </div>
          
          <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-100 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400">
              <Timer className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round((challenges.filter(c => c.completed).length / challenges.length) * 100)}%
              </p>
            </div>
          </div>
          
          <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100 text-secondary-600 dark:bg-secondary-900/30 dark:text-secondary-400">
              <Filter className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">By Difficulty</p>
              <div className="mt-1 flex items-center space-x-2">
                <span className="rounded-full bg-success-500 p-1.5"></span>
                <span className="text-xs text-gray-700 dark:text-gray-300">
                  {challenges.filter(c => c.difficulty === 'easy').length} Easy
                </span>
              </div>
              <div className="mt-1 flex items-center space-x-2">
                <span className="rounded-full bg-accent-500 p-1.5"></span>
                <span className="text-xs text-gray-700 dark:text-gray-300">
                  {challenges.filter(c => c.difficulty === 'medium').length} Medium
                </span>
              </div>
              <div className="mt-1 flex items-center space-x-2">
                <span className="rounded-full bg-error-500 p-1.5"></span>
                <span className="text-xs text-gray-700 dark:text-gray-300">
                  {challenges.filter(c => c.difficulty === 'hard').length} Hard
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CodingChallenges;