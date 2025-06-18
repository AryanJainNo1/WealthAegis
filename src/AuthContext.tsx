import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { apiService } from '@/lib/api';
import { sign, verify } from 'jsonwebtoken';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  guest?: boolean;
  error?: string;
}

// Create a type for user state with optional fields
interface UserState {
  user: User | null;
  error?: string;
}

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  loginAsGuest: () => void;
  logout: () => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login(email, password);
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await apiService.signup(name, email, password);
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      // Extract the error message from the response
      const errorMessage = error.response?.data?.error || 'Failed to create account';
      // Create a temporary user object with empty values
      const tempUser: User = {
        id: crypto.randomUUID(),
        name: '',
        email: '',
        error: errorMessage
      };
      setUser(tempUser);
      return false;
    }
  };

  const loginAsGuest = () => {
    const guestUser = {
      id: 'guest',
      name: 'Guest User',
      email: 'guest@example.com',
      guest: true
    };
    setUser(guestUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const getToken = () => localStorage.getItem('token');

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        loginAsGuest,
        logout,
        getToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};