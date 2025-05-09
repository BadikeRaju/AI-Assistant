import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  name: string;
  username: string;
  avatar: string;
  coverPhoto: string;
  bio: string;
  location: string;
  website: string;
  email: string;
  github: string;
  twitter: string;
  joinedDate: string;
  skills: string[];
}

interface UserContextType {
  user: User;
  updateUser: (newUser: Partial<User>) => void;
}

const defaultUser: User = {
  name: 'Name',
  username: 'Name',
  avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff',
  coverPhoto: '',
  bio: 'Full-stack developer passionate about creating intuitive user experiences and solving complex problems.',
  location: 'Location',
  website: 'https://johndoe.dev',
  email: 'john@example.com',
  github: 'johndoe@github.com',
  twitter: 'johndoe@twitter.com',
  joinedDate: 'Joined January 2022',
  skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python', 'CSS', 'HTML', 'GraphQL']
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(() => {
    const savedUser = localStorage.getItem('userProfile');
    return savedUser ? JSON.parse(savedUser) : defaultUser;
  });

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(user));
  }, [user]);

  const updateUser = (newUser: Partial<User>) => {
    setUser(prev => ({ ...prev, ...newUser }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 