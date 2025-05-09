import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Settings as SettingsIcon } from 'lucide-react';
import { cn } from '../utils/cn';
import { useSettings } from '../contexts/SettingsContext';
import { playSound } from '../utils/sounds';

// Timer states
const TIMER_STATES = {
  WORK: 'work',
  SHORT_BREAK: 'shortBreak',
  LONG_BREAK: 'longBreak',
} as const;

type TimerState = typeof TIMER_STATES[keyof typeof TIMER_STATES];

const PomodoroTimer = () => {
  const { settings } = useSettings();
  
  // Calculate default times from settings (converting minutes to seconds)
  const getTimesFromSettings = () => ({
    work: settings.pomodoroWork * 60,
    shortBreak: settings.pomodoroShortBreak * 60,
    longBreak: settings.pomodoroLongBreak * 60,
  });

  const [timerState, setTimerState] = useState<TimerState>(TIMER_STATES.WORK);
  const [timeLeft, setTimeLeft] = useState(() => getTimesFromSettings()[timerState]);
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [customTimes, setCustomTimes] = useState(() => getTimesFromSettings());
  
  const intervalRef = useRef<number | null>(null);
  
  // Update timer when settings change
  useEffect(() => {
    const newTimes = getTimesFromSettings();
    setCustomTimes(newTimes);
    
    // Only update the current timer if it's not running
    if (!isRunning) {
      setTimeLeft(newTimes[timerState]);
    }
  }, [settings.pomodoroWork, settings.pomodoroShortBreak, settings.pomodoroLongBreak]);

  // Timer effect
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current!);
            handleTimerComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  // Update timer when state changes
  useEffect(() => {
    setTimeLeft(customTimes[timerState]);
  }, [timerState, customTimes]);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return false;
  };

  const sendNotification = async () => {
    if (!settings.notifications) return;

    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      console.log("Notification permission denied");
      return;
    }

    const message = timerState === TIMER_STATES.WORK
      ? "Work session completed! Time for a break."
      : "Break time over! Ready to focus again?";
      
    const notification = new Notification("Pomodoro Timer", {
      body: message,
      icon: "/favicon.svg",
      requireInteraction: true, // Keep notification visible until user interacts
      silent: true, // Don't play system sound since we have our own
    });
    
    // Close notification after 10 seconds if not interacted with
    setTimeout(() => {
      if (notification) {
        notification.close();
      }
    }, 10000);
  };

  const handleTimerComplete = async () => {
    // Play sound if enabled in settings
    if (settings.sound) {
      playSound(settings.selectedSound);
    }
    
    // Send browser notification if enabled
    await sendNotification();
    
    // Update state based on completed timer
    if (timerState === TIMER_STATES.WORK) {
      const newCompletedPomodoros = completedPomodoros + 1;
      setCompletedPomodoros(newCompletedPomodoros);
      
      // After 4 pomodoros, take a long break
      if (newCompletedPomodoros % 4 === 0) {
        setTimerState(TIMER_STATES.LONG_BREAK);
        // Auto-start break if enabled
        if (settings.autoStartBreaks) {
          setIsRunning(true);
        } else {
          setIsRunning(false);
        }
      } else {
        setTimerState(TIMER_STATES.SHORT_BREAK);
        // Auto-start break if enabled
        if (settings.autoStartBreaks) {
          setIsRunning(true);
        } else {
          setIsRunning(false);
        }
      }
    } else {
      // After any break, go back to work
      setTimerState(TIMER_STATES.WORK);
      // Auto-start pomodoro if enabled
      if (settings.autoStartPomodoros) {
        setIsRunning(true);
      } else {
        setIsRunning(false);
      }
    }
  };

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(false);
    setTimeLeft(customTimes[timerState]);
  };

  const changeTimerState = (state: TimerState) => {
    if (isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setIsRunning(false);
    }
    setTimerState(state);
    setTimeLeft(customTimes[state]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const total = customTimes[timerState];
    return ((total - timeLeft) / total) * 100;
  };

  const handleTimeChange = (type: TimerState, minutes: number) => {
    setCustomTimes(prev => ({
      ...prev,
      [type]: minutes * 60
    }));
    
    if (type === timerState) {
      setTimeLeft(minutes * 60);
    }
  };

  const getTimerColor = () => {
    switch (timerState) {
      case TIMER_STATES.WORK:
        return 'text-primary-600 dark:text-primary-400';
      case TIMER_STATES.SHORT_BREAK:
        return 'text-secondary-600 dark:text-secondary-400';
      case TIMER_STATES.LONG_BREAK:
        return 'text-accent-600 dark:text-accent-400';
      default:
        return 'text-gray-900 dark:text-white';
    }
  };

  const getProgressColor = () => {
    switch (timerState) {
      case TIMER_STATES.WORK:
        return 'bg-primary-600 dark:bg-primary-500';
      case TIMER_STATES.SHORT_BREAK:
        return 'bg-secondary-600 dark:bg-secondary-500';
      case TIMER_STATES.LONG_BREAK:
        return 'bg-accent-600 dark:bg-accent-500';
      default:
        return 'bg-gray-600 dark:bg-gray-500';
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Pomodoro Timer
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Stay focused with timed work sessions and breaks
        </p>
      </div>
      
      <motion.div 
        className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="p-6">
          {/* Timer tabs */}
          <div className="flex justify-center space-x-2 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
            <button
              className={cn(
                'rounded-md px-4 py-2 text-sm font-medium transition-colors',
                timerState === TIMER_STATES.WORK
                  ? 'bg-white text-primary-700 shadow-sm dark:bg-gray-700 dark:text-primary-400'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              )}
              onClick={() => changeTimerState(TIMER_STATES.WORK)}
            >
              Work
            </button>
            <button
              className={cn(
                'rounded-md px-4 py-2 text-sm font-medium transition-colors',
                timerState === TIMER_STATES.SHORT_BREAK
                  ? 'bg-white text-secondary-700 shadow-sm dark:bg-gray-700 dark:text-secondary-400'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              )}
              onClick={() => changeTimerState(TIMER_STATES.SHORT_BREAK)}
            >
              Short Break
            </button>
            <button
              className={cn(
                'rounded-md px-4 py-2 text-sm font-medium transition-colors',
                timerState === TIMER_STATES.LONG_BREAK
                  ? 'bg-white text-accent-700 shadow-sm dark:bg-gray-700 dark:text-accent-400'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              )}
              onClick={() => changeTimerState(TIMER_STATES.LONG_BREAK)}
            >
              Long Break
            </button>
          </div>

          {/* Timer display */}
          <div className="mt-8 flex flex-col items-center">
            {/* Progress ring */}
            <div className="relative flex h-64 w-64 items-center justify-center">
              <svg className="absolute h-full w-full" viewBox="0 0 100 100">
                {/* Background ring */}
                <circle
                  className="stroke-gray-200 dark:stroke-gray-700"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Progress ring */}
                <circle
                  className={getProgressColor()}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * getProgressPercentage()) / 100}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              
              <div className="z-10">
                <div className={cn("text-6xl font-bold", getTimerColor())}>
                  {formatTime(timeLeft)}
                </div>
                <div className="mt-2 text-center text-sm font-medium capitalize text-gray-500 dark:text-gray-400">
                  {timerState.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-8 flex items-center justify-center space-x-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-md hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600"
                onClick={toggleTimer}
              >
                {isRunning ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 pl-1" />
                )}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                onClick={resetTimer}
              >
                <RotateCcw className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                onClick={() => setShowSettings(!showSettings)}
              >
                <SettingsIcon className="h-5 w-5" />
              </motion.button>
            </div>
          </div>

          {/* Settings panel */}
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-8 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Timer Settings</h3>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                      Work Minutes
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={Math.floor(customTimes.work / 60)}
                      onChange={(e) => handleTimeChange('work', parseInt(e.target.value))}
                      className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                      Short Break Minutes
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={Math.floor(customTimes.shortBreak / 60)}
                      onChange={(e) => handleTimeChange('shortBreak', parseInt(e.target.value))}
                      className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                      Long Break Minutes
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={Math.floor(customTimes.longBreak / 60)}
                      onChange={(e) => handleTimeChange('longBreak', parseInt(e.target.value))}
                      className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Session count */}
        <div className="border-t border-gray-200 p-4 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Completed Pomodoros:
            </div>
            <div className="rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-800 dark:bg-primary-900/30 dark:text-primary-400">
              {completedPomodoros}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PomodoroTimer;