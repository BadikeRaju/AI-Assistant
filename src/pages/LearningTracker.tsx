import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';
import { motion } from 'framer-motion';
import { BookCopy, Plus, Trash } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

type Topic = {
  id: string;
  name: string;
  category: 'dataStructures' | 'algorithms' | 'systemDesign';
  progress: number;
};

const INITIAL_TOPICS: Topic[] = [
  { id: '1', name: 'Arrays & Strings', category: 'dataStructures', progress: 70 },
  { id: '2', name: 'Linked Lists', category: 'dataStructures', progress: 50 },
  { id: '3', name: 'Trees & Graphs', category: 'dataStructures', progress: 30 },
  { id: '4', name: 'Sorting Algorithms', category: 'algorithms', progress: 65 },
  { id: '5', name: 'Dynamic Programming', category: 'algorithms', progress: 25 },
  { id: '6', name: 'Database Design', category: 'systemDesign', progress: 45 },
  { id: '7', name: 'API Design', category: 'systemDesign', progress: 60 },
];

const CATEGORIES = {
  dataStructures: 'Data Structures',
  algorithms: 'Algorithms',
  systemDesign: 'System Design',
};

type Category = keyof typeof CATEGORIES;

const LearningTracker = () => {
  const [topics, setTopics] = useState<Topic[]>(INITIAL_TOPICS);
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [newTopic, setNewTopic] = useState({ name: '', category: 'dataStructures' as Category });
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredTopics = activeCategory === 'all' 
    ? topics 
    : topics.filter(topic => topic.category === activeCategory);

  const updateProgress = (id: string, progress: number) => {
    setTopics(topics.map(topic => 
      topic.id === id ? { ...topic, progress: Math.min(100, Math.max(0, progress)) } : topic
    ));
  };

  const deleteTopic = (id: string) => {
    setTopics(topics.filter(topic => topic.id !== id));
  };

  const addTopic = () => {
    if (newTopic.name.trim()) {
      const newId = (Math.max(...topics.map(t => parseInt(t.id)), 0) + 1).toString();
      setTopics([...topics, { 
        id: newId, 
        name: newTopic.name.trim(), 
        category: newTopic.category, 
        progress: 0 
      }]);
      setNewTopic({ name: '', category: 'dataStructures' });
      setShowAddForm(false);
    }
  };

  // Calculate category progress
  const getCategoryProgress = (category: Category) => {
    const categoryTopics = topics.filter(topic => topic.category === category);
    if (categoryTopics.length === 0) return 0;
    return Math.round(categoryTopics.reduce((sum, topic) => sum + topic.progress, 0) / categoryTopics.length);
  };

  // Prepare data for the doughnut chart
  const chartData = {
    labels: Object.values(CATEGORIES),
    datasets: [
      {
        data: [
          getCategoryProgress('dataStructures'),
          getCategoryProgress('algorithms'),
          getCategoryProgress('systemDesign'),
        ],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',  // primary
          'rgba(20, 184, 166, 0.8)',  // secondary
          'rgba(245, 158, 11, 0.8)',  // accent
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(20, 184, 166, 1)',
          'rgba(245, 158, 11, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: document.documentElement.classList.contains('dark') 
            ? 'rgba(255, 255, 255, 0.8)' 
            : 'rgba(0, 0, 0, 0.8)',
          font: {
            size: 12,
          },
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.raw}% complete`;
          }
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Learning Tracker
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Track your progress in data structures, algorithms, and system design
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Overall Progress Chart */}
        <motion.div 
          className="col-span-1 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Overall Progress</h2>
          <div className="mt-4 h-60">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
          <div className="mt-4 flex justify-center">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Completion</p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {Math.round(
                  (getCategoryProgress('dataStructures') + 
                  getCategoryProgress('algorithms') + 
                  getCategoryProgress('systemDesign')) / 3
                )}%
              </p>
            </div>
          </div>
        </motion.div>

        {/* Topics List */}
        <motion.div 
          className="col-span-1 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 md:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="border-b border-gray-200 p-6 dark:border-gray-800">
            <div className="flex flex-wrap items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Learning Topics</h2>
              <button
                className="mt-2 flex items-center rounded-md bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 sm:mt-0"
                onClick={() => setShowAddForm(true)}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Topic
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Category Filter */}
            <div className="mb-6 flex flex-wrap gap-2">
              <button
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  activeCategory === 'all'
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveCategory('all')}
              >
                All
              </button>
              {(Object.entries(CATEGORIES) as [Category, string][]).map(([key, value]) => (
                <button
                  key={key}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                    activeCategory === key
                      ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveCategory(key)}
                >
                  {value}
                </button>
              ))}
            </div>

            {/* Add Topic Form */}
            {showAddForm && (
              <motion.div 
                className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">Add New Topic</h3>
                <div className="flex flex-col space-y-3">
                  <input
                    type="text"
                    placeholder="Topic name"
                    value={newTopic.name}
                    onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                  />
                  <select
                    value={newTopic.category}
                    onChange={(e) => setNewTopic({ ...newTopic, category: e.target.value as Category })}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                  >
                    {(Object.entries(CATEGORIES) as [Category, string][]).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                  <div className="flex space-x-2">
                    <button
                      className="flex-1 rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600"
                      onClick={addTopic}
                    >
                      Add Topic
                    </button>
                    <button
                      className="rounded-md bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Topics List */}
            {filteredTopics.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-10 dark:border-gray-700">
                <BookCopy className="h-12 w-12 text-gray-400 dark:text-gray-600" />
                <p className="mt-2 text-center text-gray-500 dark:text-gray-400">
                  {activeCategory === 'all' 
                    ? 'No topics added yet. Add a topic to get started.' 
                    : `No topics in ${CATEGORIES[activeCategory as Category]} category.`}
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {filteredTopics.map((topic) => (
                  <motion.li 
                    key={topic.id}
                    className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            {topic.name}
                          </h3>
                          <button
                            className="ml-2 rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                            onClick={() => deleteTopic(topic.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {CATEGORIES[topic.category]}
                        </p>
                        <div className="mt-2 flex items-center">
                          <div className="w-full flex-1">
                            <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                              <div
                                className="h-2 rounded-full bg-primary-600 dark:bg-primary-500"
                                style={{ width: `${topic.progress}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="ml-2 w-10 text-xs font-medium text-gray-700 dark:text-gray-300">
                            {topic.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between space-x-2">
                      <button
                        className="flex-1 rounded-md bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        onClick={() => updateProgress(topic.id, topic.progress - 10)}
                      >
                        -10%
                      </button>
                      <button
                        className="flex-1 rounded-md bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        onClick={() => updateProgress(topic.id, topic.progress - 5)}
                      >
                        -5%
                      </button>
                      <button
                        className="flex-1 rounded-md bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        onClick={() => updateProgress(topic.id, topic.progress + 5)}
                      >
                        +5%
                      </button>
                      <button
                        className="flex-1 rounded-md bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        onClick={() => updateProgress(topic.id, topic.progress + 10)}
                      >
                        +10%
                      </button>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LearningTracker;