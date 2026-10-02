import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types/index.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: (defaultMode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('luna_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('luna_token');
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('luna_user', JSON.stringify(data.user));
        localStorage.setItem('luna_token', data.token);
        setIsAuthModalOpen(false);
        return { success: true };
      }
      if (res.status !== 404) {
        const data = await res.json();
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch {
      // Fall through to static fallback below
    }

    // Static fallback for GitHub Pages (no Express server available)
    const normalized = email.toLowerCase().trim();
    if (normalized === 'admin@lunaboutique.com' && password === 'admin123') {
      const adminUser: User = {
        id: 'usr-admin-1',
        name: 'Aditi Sharma',
        email: 'admin@lunaboutique.com',
        role: 'admin',
        phone: '+91 98200 45890',
        createdAt: '2026-09-01T00:00:00Z',
      };
      setUser(adminUser);
      setToken('tok-admin-static');
      localStorage.setItem('luna_user', JSON.stringify(adminUser));
      localStorage.setItem('luna_token', 'tok-admin-static');
      setIsAuthModalOpen(false);
      return { success: true };
    }

    if (normalized === 'customer@example.com' && password === 'password123') {
      const custUser: User = {
        id: 'usr-cust-1',
        name: 'Priyanka Kapoor',
        email: 'customer@example.com',
        role: 'customer',
        phone: '+91 98765 12340',
        createdAt: '2026-09-10T00:00:00Z',
      };
      setUser(custUser);
      setToken('tok-cust-static');
      localStorage.setItem('luna_user', JSON.stringify(custUser));
      localStorage.setItem('luna_token', 'tok-cust-static');
      setIsAuthModalOpen(false);
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password.' };
  };

  const register = async (email: string, password: string, name: string, phone?: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('luna_user', JSON.stringify(data.user));
      localStorage.setItem('luna_token', data.token);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('luna_user');
    localStorage.removeItem('luna_token');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin,
        login,
        register,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode,
        setAuthModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
