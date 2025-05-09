import React, { createContext, useContext, useEffect, useState } from 'react';

interface CalendarContextType {
  isAuthenticated: boolean;
  events: any[];
  signIn: () => void;
  signOut: () => void;
  addEvent: (event: any) => Promise<void>;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = initializeGoogleApi;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeGoogleApi = () => {
    window.gapi.load('client:auth2', () => {
      window.gapi.client
        .init({
          apiKey: GOOGLE_API_KEY,
          clientId: GOOGLE_CLIENT_ID,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
          scope: 'https://www.googleapis.com/auth/calendar.events',
        })
        .then(() => {
          // Listen for sign-in state changes
          window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
          // Handle the initial sign-in state
          updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());
        });
    });
  };

  const updateSigninStatus = (isSignedIn: boolean) => {
    setIsAuthenticated(isSignedIn);
    if (isSignedIn) {
      listUpcomingEvents();
    }
  };

  const signIn = () => {
    window.gapi.auth2.getAuthInstance().signIn();
  };

  const signOut = () => {
    window.gapi.auth2.getAuthInstance().signOut();
  };

  const listUpcomingEvents = async () => {
    try {
      const response = await window.gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime',
      });

      setEvents(response.result.items);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    }
  };

  const addEvent = async (event: any) => {
    try {
      await window.gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });
      await listUpcomingEvents();
    } catch (error) {
      console.error('Error adding calendar event:', error);
      throw error;
    }
  };

  return (
    <CalendarContext.Provider value={{ isAuthenticated, events, signIn, signOut, addEvent }}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}