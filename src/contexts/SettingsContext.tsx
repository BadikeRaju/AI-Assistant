import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the settings interface
export interface Settings {
  notifications: boolean;
  sound: boolean;
  selectedSound: string;
  pomodoroWork: number;
  pomodoroShortBreak: number;
  pomodoroLongBreak: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
}

// Default settings
const DEFAULT_SETTINGS: Settings = {
  notifications: true,
  sound: true,
  selectedSound: 'beep', // default sound
  pomodoroWork: 25,
  pomodoroShortBreak: 5,
  pomodoroLongBreak: 15,
  autoStartBreaks: false,
  autoStartPomodoros: false,
};

// Context type
interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  toggleSetting: (key: keyof Settings) => void;
}

// Create the context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Provider component
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    // Load settings from localStorage if available
    const savedSettings = localStorage.getItem('timerSettings');
    return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('timerSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const toggleSetting = (key: keyof Settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, toggleSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}

// Custom hook to use the settings context
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
} 