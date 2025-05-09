import React, { useState } from 'react';
import { Briefcase, Calendar, Check, FileText, MoreHorizontal, PenLine, Plus, Star, Trash, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

type Job = {
  id: string;
  company: string;
  position: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected';
  dateApplied: string;
  notes: string;
  favorite: boolean;
};

const INITIAL_JOBS: Job[] = [
  {
    id: '1',
    company: 'TechCorp',
    position: 'Frontend Developer',
    status: 'interview',
    dateApplied: '2025-02-15',
    notes: 'Technical interview scheduled for next week.',
    favorite: true,
  },
  {
    id: '2',
    company: 'Innovative Systems',
    position: 'Full Stack Engineer',
    status: 'applied',
    dateApplied: '2025-02-10',
    notes: 'Applied through company website.',
    favorite: false,
  },
  {
    id: '3',
    company: 'DataViz Inc',
    position: 'React Developer',
    status: 'rejected',
    dateApplied: '2025-01-05',
    notes: 'Received rejection email after final interview.',
    favorite: false,
  },
];

const JobTracker = () => {
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [filter, setFilter] = useState<Job['status'] | 'all'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newJob, setNewJob] = useState<Omit<Job, 'id'>>({
    company: '',
    position: '',
    status: 'applied',
    dateApplied: new Date().toISOString().split('T')[0],
    notes: '',
    favorite: false,
  });

  const filteredJobs = filter === 'all' 
    ? jobs 
    : jobs.filter(job => job.status === filter);

  const handleStatusChange = (id: string, status: Job['status']) => {
    setJobs(jobs.map(job => (job.id === id ? { ...job, status } : job)));
  };

  const toggleFavorite = (id: string) => {
    setJobs(jobs.map(job => (job.id === id ? { ...job, favorite: !job.favorite } : job)));
  };

  const deleteJob = (id: string) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  const startEditing = (job: Job) => {
    setEditingJob(job);
  };

  const saveEdit = () => {
    if (editingJob) {
      setJobs(jobs.map(job => (job.id === editingJob.id ? editingJob : job)));
      setEditingJob(null);
    }
  };

  const addJob = () => {
    if (newJob.company.trim() && newJob.position.trim()) {
      const newId = (Math.max(...jobs.map(j => parseInt(j.id)), 0) + 1).toString();
      setJobs([...jobs, { ...newJob, id: newId }]);
      setNewJob({
        company: '',
        position: '',
        status: 'applied',
        dateApplied: new Date().toISOString().split('T')[0],
        notes: '',
        favorite: false,
      });
      setShowAddForm(false);
    }
  };

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'applied':
        return 'bg-accent-500 dark:bg-accent-600';
      case 'interview':
        return 'bg-primary-500 dark:bg-primary-600';
      case 'offer':
        return 'bg-success-500 dark:bg-success-600';
      case 'rejected':
        return 'bg-error-500 dark:bg-error-600';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Job['status']) => {
    switch (status) {
      case 'applied':
        return 'Applied';
      case 'interview':
        return 'Interview';
      case 'offer':
        return 'Offer';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Job Application Tracker
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Track and manage your job applications in one place
        </p>
      </div>

      <motion.div 
        className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="p-6 sm:flex sm:items-center sm:justify-between">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Job Applications</h2>
          <div className="mt-3 flex items-center sm:mt-0">
            <div className="mr-4 flex space-x-2">
              <button
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  filter === 'all'
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  filter === 'applied'
                    ? 'bg-accent-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
                onClick={() => setFilter('applied')}
              >
                Applied
              </button>
              <button
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  filter === 'interview'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
                onClick={() => setFilter('interview')}
              >
                Interview
              </button>
              <button
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  filter === 'offer'
                    ? 'bg-success-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
                onClick={() => setFilter('offer')}
              >
                Offer
              </button>
              <button
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  filter === 'rejected'
                    ? 'bg-error-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
                onClick={() => setFilter('rejected')}
              >
                Rejected
              </button>
            </div>
            <button
              className="flex items-center rounded-md bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Job
            </button>
          </div>
        </div>

        {/* Add Job Form */}
        {showAddForm && (
          <motion.div 
            className="border-t border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/50"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">Add New Job Application</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Company
                </label>
                <input
                  type="text"
                  value={newJob.company}
                  onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                  placeholder="Company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Position
                </label>
                <input
                  type="text"
                  value={newJob.position}
                  onChange={(e) => setNewJob({ ...newJob, position: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                  placeholder="Job position"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date Applied
                </label>
                <input
                  type="date"
                  value={newJob.dateApplied}
                  onChange={(e) => setNewJob({ ...newJob, dateApplied: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <select
                  value={newJob.status}
                  onChange={(e) => setNewJob({ ...newJob, status: e.target.value as Job['status'] })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  <option value="applied">Applied</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notes
                </label>
                <textarea
                  value={newJob.notes}
                  onChange={(e) => setNewJob({ ...newJob, notes: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                  placeholder="Add any notes about this application"
                ></textarea>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600"
                onClick={addJob}
              >
                Add Job
              </button>
            </div>
          </motion.div>
        )}

        {/* Jobs List */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-400">
                <th className="px-6 py-3">Company</th>
                <th className="px-6 py-3">Position</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date Applied</th>
                <th className="px-6 py-3">Notes</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    <Briefcase className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
                    <p className="mt-2">
                      {filter === 'all' 
                        ? 'No job applications found. Add one to get started!' 
                        : `No ${filter} applications found.`}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <motion.tr 
                    key={job.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800"
                  >
                    {editingJob && editingJob.id === job.id ? (
                      // Editing row
                      <>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={editingJob.company}
                            onChange={(e) => setEditingJob({ ...editingJob, company: e.target.value })}
                            className="block w-full rounded-md border border-gray-300 px-3 py-1 text-sm dark:border-gray-700 dark:bg-gray-800"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={editingJob.position}
                            onChange={(e) => setEditingJob({ ...editingJob, position: e.target.value })}
                            className="block w-full rounded-md border border-gray-300 px-3 py-1 text-sm dark:border-gray-700 dark:bg-gray-800"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={editingJob.status}
                            onChange={(e) => setEditingJob({ ...editingJob, status: e.target.value as Job['status'] })}
                            className="block w-full rounded-md border border-gray-300 px-3 py-1 text-sm dark:border-gray-700 dark:bg-gray-800"
                          >
                            <option value="applied">Applied</option>
                            <option value="interview">Interview</option>
                            <option value="offer">Offer</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="date"
                            value={editingJob.dateApplied}
                            onChange={(e) => setEditingJob({ ...editingJob, dateApplied: e.target.value })}
                            className="block w-full rounded-md border border-gray-300 px-3 py-1 text-sm dark:border-gray-700 dark:bg-gray-800"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <textarea
                            value={editingJob.notes}
                            onChange={(e) => setEditingJob({ ...editingJob, notes: e.target.value })}
                            className="block w-full rounded-md border border-gray-300 px-3 py-1 text-sm dark:border-gray-700 dark:bg-gray-800"
                            rows={2}
                          ></textarea>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <button
                              className="rounded-md bg-primary-100 p-1.5 text-primary-600 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50"
                              onClick={saveEdit}
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              className="rounded-md bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                              onClick={() => setEditingJob(null)}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      // Normal row
                      <>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center">
                            <button
                              className={cn(
                                "mr-2 rounded-full p-1",
                                job.favorite 
                                  ? "text-accent-500 hover:text-accent-600 dark:text-accent-400 dark:hover:text-accent-300" 
                                  : "text-gray-400 hover:text-accent-500 dark:text-gray-600 dark:hover:text-accent-400"
                              )}
                              onClick={() => toggleFavorite(job.id)}
                            >
                              <Star className="h-4 w-4" fill={job.favorite ? "currentColor" : "none"} />
                            </button>
                            <span className="font-medium text-gray-900 dark:text-white">{job.company}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {job.position}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${getStatusColor(job.status)}`}>
                            {getStatusText(job.status)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4" />
                            {new Date(job.dateApplied).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-start">
                            <FileText className="mr-1 mt-0.5 h-4 w-4 flex-shrink-0" />
                            <span className="line-clamp-2">{job.notes || "No notes"}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              className="rounded-md bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                              onClick={() => startEditing(job)}
                            >
                              <PenLine className="h-4 w-4" />
                            </button>
                            <button
                              className="rounded-md bg-error-100 p-1.5 text-error-600 hover:bg-error-200 dark:bg-error-900/30 dark:text-error-400 dark:hover:bg-error-900/50"
                              onClick={() => deleteJob(job.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                            <div className="relative">
                              <button className="rounded-md bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </td>
                      </>
                    )}
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default JobTracker;