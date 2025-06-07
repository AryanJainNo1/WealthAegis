import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { prisma } from '@/lib/db';
import { genSalt, hash, compare } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';

interface User {
  id: string;
  name: string;
  email: string;
  guest?: boolean;
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

  // On mount, load user from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };
        const userData = localStorage.getItem("user");
        if (userData) {
          const storedUser = JSON.parse(userData);
          if (storedUser.id === decoded.userId) {
            setUser(storedUser);
          } else {
            throw new Error('User ID mismatch');
          }
        }
      } catch (error) {
        logout();
      }
    }
  }, []);

  // Keep localStorage in sync with user state
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (!existingUser) return false;

      const isPasswordValid = await compare(password, existingUser.password);
      if (!isPasswordValid) return false;

      const token = sign({ userId: existingUser.id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '24h'
      });

      localStorage.setItem("token", token);
      setUser({ id: existingUser.id, name: existingUser.email.split('@')[0], email: existingUser.email });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) return false;

      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        }
      });

      const token = sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '24h'
      });

      localStorage.setItem("token", token);
      setUser({ id: user.id, name, email });
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const loginAsGuest = () => {
    setUser({
      id: 'guest',
      name: 'Guest',
      email: 'guest@example.com',
      guest: true
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const value = {
    user,
    login,
    signup,
    loginAsGuest,
    logout,
    getToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};