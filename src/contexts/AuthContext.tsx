import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { apiService } from '../services/apiService';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  loginAsRole: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  users: User[];
}

const AUTH_STORAGE_KEY = 'smp_nu_auth_user_id';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const list = await apiService.getUsers();
        setUsers(list);
        
        // Restore session from localStorage if present
        const savedUserId = localStorage.getItem(AUTH_STORAGE_KEY);
        if (savedUserId) {
          const found = list.find(u => u.id === savedUserId && u.is_active);
          if (found) {
            setCurrentUser(found);
          } else {
            localStorage.removeItem(AUTH_STORAGE_KEY);
          }
        }
      } catch (err) {
        console.error('Failed to load users:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadUsers();
  }, []);

  const login = async (usernameInput: string, _password?: string): Promise<{ success: boolean; message?: string }> => {
    const cleanUsername = usernameInput.trim().toLowerCase();
    
    // Find matching user by username or email
    const matched = users.find(u => 
      (u.username.toLowerCase() === cleanUsername || u.email.toLowerCase() === cleanUsername) && u.is_active
    );

    if (matched) {
      setCurrentUser(matched);
      localStorage.setItem(AUTH_STORAGE_KEY, matched.id);
      return { success: true };
    }

    return {
      success: false,
      message: 'Username atau kata sandi tidak ditemukan dalam sistem.'
    };
  };

  const loginAsRole = (role: UserRole) => {
    const matched = users.find(u => u.role === role && u.is_active);
    if (matched) {
      setCurrentUser(matched);
      localStorage.setItem(AUTH_STORAGE_KEY, matched.id);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const switchRole = (role: UserRole) => {
    const matched = users.find(u => u.role === role);
    if (matched) {
      setCurrentUser(matched);
      localStorage.setItem(AUTH_STORAGE_KEY, matched.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        isLoading,
        login,
        loginAsRole,
        logout,
        switchRole,
        users
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

