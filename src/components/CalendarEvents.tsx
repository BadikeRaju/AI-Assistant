import React from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useCalendar } from '../contexts/CalendarContext';

const CalendarEvents = () => {
  const { events, isAuthenticated, signIn } = useCalendar();

  if (!isAuthenticated) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="text-center">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            Calendar Not Connected
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Connect your Google Calendar to see your upcoming events
          </p>
          <div className="mt-6">
            <button
              onClick={signIn}
              className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600"
            >
              Connect Calendar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Upcoming Events</h3>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {events.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
            No upcoming events
          </div>
        ) : (
          events.map((event: any, index: number) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                    <Clock className="h-5 w-5" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {event.summary}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(event.start.dateTime), 'PPp')}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default CalendarEvents;