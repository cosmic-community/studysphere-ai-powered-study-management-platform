'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { AuthUser, AuthContextType } from '@/types'
import { authenticateStudent, authenticateParent, generateToken, validateToken } from '@/lib/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('studysphere-token');
    if (token) {
      const validatedUser = validateToken(token);
      if (validatedUser) {
        setUser(validatedUser);
      } else {
        localStorage.removeItem('studysphere-token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (
    email: string, 
    password: string, 
    role: 'student' | 'parent',
    masterPassword?: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      
      let authenticatedUser: AuthUser | null = null;
      
      if (role === 'student') {
        authenticatedUser = await authenticateStudent(email, password);
      } else if (role === 'parent' && masterPassword) {
        authenticatedUser = await authenticateParent(email, password, masterPassword);
      }
      
      if (authenticatedUser) {
        const token = generateToken(authenticatedUser);
        localStorage.setItem('studysphere-token', token);
        setUser(authenticatedUser);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('studysphere-token');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}