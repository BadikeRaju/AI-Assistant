import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import { VoiceProvider } from './contexts/VoiceContext';
import { CalendarProvider } from './contexts/CalendarContext';
import { AIProvider } from './contexts/AIContext';
import { SettingsProvider } from './contexts/SettingsContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <SettingsProvider>
          <AIProvider>
            <VoiceProvider>
              <CalendarProvider>
                <App />
              </CalendarProvider>
            </VoiceProvider>
          </AIProvider>
        </SettingsProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);