import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('devtrack-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Sync authorization header if user exists on reload
  useEffect(() => {
    if (user) {
      localStorage.setItem('devtrack-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('devtrack-user');
    }
  }, [user]);

  // Login User
  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await API.post('/auth/login', { email, password });
      setUser(response.data);
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      const errMsg = error.response?.data?.message || 'Login failed. Please try again.';
      setAuthError(errMsg);
      throw new Error(errMsg);
    }
  };

  // Register User
  const register = async (username, email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await API.post('/auth/register', { username, email, password });
      setUser(response.data);
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      const errMsg = error.response?.data?.message || 'Registration failed.';
      setAuthError(errMsg);
      throw new Error(errMsg);
    }
  };

  // Logout User
  const logout = () => {
    setUser(null);
    localStorage.removeItem('devtrack-user');
  };

  // Update profile textual details
  const updateProfile = async (profileData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await API.put('/auth/profile', profileData);
      setUser(response.data);
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      const errMsg = error.response?.data?.message || 'Failed to update profile.';
      setAuthError(errMsg);
      throw new Error(errMsg);
    }
  };

  // Upload profile photo
  const updateProfilePic = async (file) => {
    setLoading(true);
    setAuthError(null);
    try {
      const formData = new FormData();
      formData.append('profilePic', file);
      
      const response = await API.put('/auth/profile-pic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const updatedUser = { ...user, profilePic: response.data.profilePic };
      setUser(updatedUser);
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      const errMsg = error.response?.data?.message || 'Failed to upload profile photo.';
      setAuthError(errMsg);
      throw new Error(errMsg);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        login,
        register,
        logout,
        updateProfile,
        updateProfilePic,
        setAuthError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
