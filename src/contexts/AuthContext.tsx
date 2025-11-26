import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockApi } from '@/api/mockClient';

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  highScore: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateHighScore: (score: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('snakeGameUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await mockApi.login(email, password);
      if (result.success && result.user) {
        setUser(result.user);
        localStorage.setItem('snakeGameUser', JSON.stringify(result.user));
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      const result = await mockApi.signup(username, email, password);
      if (result.success && result.user) {
        setUser(result.user);
        localStorage.setItem('snakeGameUser', JSON.stringify(result.user));
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: 'An error occurred during signup' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('snakeGameUser');
  };

  const updateHighScore = (score: number) => {
    if (user && score > user.highScore) {
      const updatedUser = { ...user, highScore: score };
      setUser(updatedUser);
      localStorage.setItem('snakeGameUser', JSON.stringify(updatedUser));
      mockApi.updateHighScore(user.id, score);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateHighScore,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
