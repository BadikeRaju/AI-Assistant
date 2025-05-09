import React, { useState } from 'react';
import { Bell, BellOff, Calendar, Check, Moon, Save, Sun, Volume2, VolumeX, Play, Square } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { SOUNDS, playSound, stopAllSounds } from '../utils/sounds';
import { cn } from '../utils/cn';

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { settings, updateSettings, toggleSetting } = useSettings();
  
  const [saved, setSaved] = useState(false);
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [soundError, setSoundError] = useState<string | null>(null);

  const handleChange = (key: keyof typeof settings, value: any) => {
    updateSettings({ [key]: value });
  };

  const saveSettings = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePreviewSound = async (soundId: string) => {
    setPlayingSound(soundId);
    setSoundError(null);
    
    try {
      await playSound(soundId);
    } catch (error) {
      setSoundError('Failed to play sound. Please try again.');
      console.error('Error playing sound:', error);
    } finally {
      setTimeout(() => setPlayingSound(null), 1000);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Customize your experience
        </p>
      </div>

      <motion.div 
        className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="border-b border-gray-200 p-6 dark:border-gray-800">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Appearance
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Customize how DevAssist looks
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Theme</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Choose between light and dark mode
              </p>
              <div className="mt-3 flex space-x-4">
                <button
                  className={cn(
                    "flex items-center space-x-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700",
                    theme === 'light' 
                      ? "bg-primary-50 text-primary-700 ring-2 ring-primary-600 dark:bg-primary-900/20 dark:text-primary-400 dark:ring-primary-500" 
                      : "bg-white text-gray-900 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                  )}
                  onClick={() => setTheme('light')}
                >
                  <Sun className="h-5 w-5" />
                  <span>Light</span>
                </button>
                <button
                  className={cn(
                    "flex items-center space-x-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700",
                    theme === 'dark' 
                      ? "bg-primary-50 text-primary-700 ring-2 ring-primary-600 dark:bg-primary-900/20 dark:text-primary-400 dark:ring-primary-500" 
                      : "bg-white text-gray-900 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                  )}
                  onClick={() => setTheme('dark')}
                >
                  <Moon className="h-5 w-5" />
                  <span>Dark</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="border-b border-gray-200 p-6 dark:border-gray-800">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Notifications
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Configure how you want to be notified
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Enable Notifications</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Get notified about timer completions and reminders
                </p>
              </div>
              <div className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none dark:bg-gray-700">
                <span
                  className={`${
                    settings.notifications ? 'translate-x-5 bg-primary-600' : 'translate-x-1 bg-white'
                  } inline-block h-4 w-4 transform rounded-full transition duration-200 ease-in-out`}
                  onClick={() => toggleSetting('notifications')}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Sound Effects</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Play sounds for notifications and timer events
                </p>
              </div>
              <div className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none dark:bg-gray-700">
                <span
                  className={`${
                    settings.sound ? 'translate-x-5 bg-primary-600' : 'translate-x-1 bg-white'
                  } inline-block h-4 w-4 transform rounded-full transition duration-200 ease-in-out`}
                  onClick={() => toggleSetting('sound')}
                />
              </div>
            </div>

            {settings.sound && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Notification Sound</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Choose which sound to play for notifications
                </p>
                {soundError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {soundError}
                  </p>
                )}
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {SOUNDS.map((sound) => (
                    <div
                      key={sound.id}
                      className={cn(
                        "flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700",
                        settings.selectedSound === sound.id
                          ? "bg-primary-50 text-primary-700 ring-2 ring-primary-600 dark:bg-primary-900/20 dark:text-primary-400 dark:ring-primary-500"
                          : "bg-white text-gray-900 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                      )}
                    >
                      <button
                        className="flex-1 text-left"
                        onClick={() => handleChange('selectedSound', sound.id)}
                      >
                        {sound.name}
                      </button>
                      {sound.id !== 'none' && (
                        <div className="ml-2 flex space-x-1">
                          <button
                            className={cn(
                              "rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700",
                              playingSound === sound.id && "animate-pulse"
                            )}
                            onClick={() => handlePreviewSound(sound.id)}
                            disabled={playingSound !== null}
                            title="Preview sound"
                          >
                            {playingSound === sound.id ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </button>
                          {playingSound === sound.id && (
                            <button
                              className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => {
                                stopAllSounds();
                                setPlayingSound(null);
                              }}
                              title="Stop sound"
                            >
                              <Square className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="border-b border-gray-200 p-6 dark:border-gray-800">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Pomodoro Timer Settings
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Customize your pomodoro timer intervals
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Work Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.pomodoroWork}
                onChange={(e) => handleChange('pomodoroWork', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Short Break Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={settings.pomodoroShortBreak}
                onChange={(e) => handleChange('pomodoroShortBreak', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Long Break Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.pomodoroLongBreak}
                onChange={(e) => handleChange('pomodoroLongBreak', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Auto-start Breaks</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Automatically start break timers when work sessions end
                </p>
              </div>
              <div className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none dark:bg-gray-700">
                <span
                  className={`${
                    settings.autoStartBreaks ? 'translate-x-5 bg-primary-600' : 'translate-x-1 bg-white'
                  } inline-block h-4 w-4 transform rounded-full transition duration-200 ease-in-out`}
                  onClick={() => toggleSetting('autoStartBreaks')}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Auto-start Pomodoros</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Automatically start work sessions when breaks end
                </p>
              </div>
              <div className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none dark:bg-gray-700">
                <span
                  className={`${
                    settings.autoStartPomodoros ? 'translate-x-5 bg-primary-600' : 'translate-x-1 bg-white'
                  } inline-block h-4 w-4 transform rounded-full transition duration-200 ease-in-out`}
                  onClick={() => toggleSetting('autoStartPomodoros')}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="mt-8 flex justify-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <button
          className="group relative flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-700 dark:hover:bg-primary-600"
          onClick={saveSettings}
        >
          {saved ? (
            <>
              <Check className="mr-2 h-5 w-5" />
              Saved
            </>
          ) : (
            <>
              <Save className="mr-2 h-5 w-5" />
              Save Settings
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default Settings;