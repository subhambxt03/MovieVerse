import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      console.log('🔍 AuthProvider: Initializing auth...');
      const token = localStorage.getItem('access_token');
      console.log('🔍 AuthProvider: Token found?', !!token);
      
      if (token) {
        try {
          console.log('🔍 AuthProvider: Fetching user profile...');
          const userData = await authService.getProfile();
          console.log('🔍 AuthProvider: User data received:', userData);
          setUser(userData);
          setIsAuthenticated(true);
          console.log('✅ AuthProvider: User authenticated successfully');
        } catch (error) {
          console.error('❌ Auth initialization error:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        console.log('🔍 AuthProvider: No token found, user not authenticated');
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
      console.log('🔍 AuthProvider: Loading complete, isAuthenticated:', isAuthenticated);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔐 AuthContext: Attempting login...');
      const response = await authService.login(email, password);
      console.log('🔐 AuthContext: Login response:', response);
      
      const { access_token, refresh_token, user } = response;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      setUser(user);
      setIsAuthenticated(true);
      console.log('✅ AuthContext: Login successful');
      return { success: true, user };
    } catch (error) {
      console.error('❌ AuthContext: Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed. Please try again.' 
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      console.log('📝 AuthContext: Attempting registration...');
      const response = await authService.register(name, email, password);
      console.log('📝 AuthContext: Registration response:', response);
      return { success: true, user: response.user };
    } catch (error) {
      console.error('❌ AuthContext: Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    console.log('🚪 AuthContext: Logging out...');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
    console.log('✅ AuthContext: Logged out successfully');
  };

  const updateProfile = async (data) => {
    try {
      console.log('🔄 AuthContext: Updating profile...');
      const response = await authService.updateProfile(data);
      console.log('🔄 AuthContext: Update response:', response);
      
      // ✅ Update the user state with the new data
      if (response.user) {
        setUser(response.user);
        console.log('✅ AuthContext: User updated successfully');
        return { success: true, user: response.user };
      }
      return { success: true };
    } catch (error) {
      console.error('❌ AuthContext: Update profile error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Update failed' 
      };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await authService.changePassword(currentPassword, newPassword);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Password change failed' 
      };
    }
  };

  // ✅ Function to refresh user data
  const refreshUser = async () => {
    try {
      console.log('🔄 AuthContext: Refreshing user data...');
      const userData = await authService.getProfile();
      setUser(userData);
      console.log('✅ AuthContext: User data refreshed');
      return userData;
    } catch (error) {
      console.error('❌ AuthContext: Refresh user error:', error);
      return null;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshUser,  // ✅ Add refreshUser to context
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};