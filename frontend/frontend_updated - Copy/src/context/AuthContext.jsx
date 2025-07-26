import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

// Inactivity timeout in milliseconds (30 minutes)
const INACTIVITY_TIMEOUT = 30 * 60 * 1000;

// Key for storing last activity timestamp
const LAST_ACTIVITY_KEY = 'lastActivityTime';

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [inactivityTimer, setInactivityTimer] = useState(null);

  // Reset the inactivity timer
  const resetInactivityTimer = () => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }

    // Only set timer if authenticated
    if (isAuthenticated) {
      const newTimer = setTimeout(() => {
        logout();
      }, INACTIVITY_TIMEOUT);
      setInactivityTimer(newTimer);
      
      // Update last activity time
      localStorage.setItem(LAST_ACTIVITY_KEY, new Date().getTime().toString());
    }
  };

  // Check for inactivity on mount and when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      const lastActivity = parseInt(localStorage.getItem(LAST_ACTIVITY_KEY) || '0');
      const currentTime = new Date().getTime();
      
      if (currentTime - lastActivity > INACTIVITY_TIMEOUT) {
        // Logout if inactive for too long
        logout();
      } else {
        // Reset timer if still within timeout
        resetInactivityTimer();
      }

      // Add event listeners for user activity
      const handleActivity = () => {
        resetInactivityTimer();
      };

      window.addEventListener('mousemove', handleActivity);
      window.addEventListener('keydown', handleActivity);
      window.addEventListener('click', handleActivity);
      window.addEventListener('scroll', handleActivity);

      return () => {
        // Cleanup event listeners
        window.removeEventListener('mousemove', handleActivity);
        window.removeEventListener('keydown', handleActivity);
        window.removeEventListener('click', handleActivity);
        window.removeEventListener('scroll', handleActivity);
        
        if (inactivityTimer) {
          clearTimeout(inactivityTimer);
        }
      };
    }
  }, [isAuthenticated]);

  const login = async (username, password) => {
    // Simple authentication logic (replace with your actual authentication)
    if (username === 'chef' && password === 'password') {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem(LAST_ACTIVITY_KEY, new Date().getTime().toString());
      resetInactivityTimer();
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem(LAST_ACTIVITY_KEY);
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
      setInactivityTimer(null);
    }
  };

  const value = {
    isAuthenticated,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
