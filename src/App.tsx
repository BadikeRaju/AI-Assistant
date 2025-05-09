import React, { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import PomodoroTimer from './pages/PomodoroTimer';
import LearningTracker from './pages/LearningTracker';
import JobTracker from './pages/JobTracker';
import CodingChallenges from './pages/CodingChallenges';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { UserProvider } from './contexts/UserContext';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import VoiceAssistant from './components/VoiceAssistant';
import ChatAssistant from './components/ChatAssistant';
import { MessageSquare, Mic } from 'lucide-react';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // Optional: handle recognized commands
  const handleVoiceCommand = (transcript: string) => {
    if (transcript.toLowerCase().includes('start timer')) {
      // Example: navigate to Pomodoro or trigger timer logic
    }
  };

  return (
    <AuthProvider>
      <UserProvider>
        {/* Floating action button group */}
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
          {/* Chat Assistant Button */}
          <button
            className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400"
            onClick={() => setChatOpen(true)}
            aria-label="Open Chat Assistant"
          >
            <MessageSquare className="h-8 w-8" />
          </button>
          {/* Voice Assistant Button */}
          <button
            className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400"
            onClick={() => setAssistantOpen(true)}
            aria-label="Open Voice Assistant"
          >
            <Mic className="h-8 w-8" />
          </button>
        </div>
        {/* Modals for assistants */}
        <VoiceAssistant
          open={assistantOpen}
          onClose={() => setAssistantOpen(false)}
          onCommand={handleVoiceCommand}
        />
        <ChatAssistant open={chatOpen} onClose={() => setChatOpen(false)} />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="pomodoro" element={<PomodoroTimer />} />
            <Route path="learning" element={<LearningTracker />} />
            <Route path="jobs" element={<JobTracker />} />
            <Route path="challenges" element={<CodingChallenges />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;