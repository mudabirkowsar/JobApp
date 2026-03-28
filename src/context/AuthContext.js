import React, { createContext, useState, useEffect } from 'react';
import apiClient from '../api/client';
import { Storage } from '../utils/storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState(null); // Added for SQLite filtering
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Function to fetch profile data and extract the unique ID
  const fetchProfile = async (token) => {
    try {
      const res = await apiClient.get('/api/v1/auth/myProfile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const profileData = res.data.data || res.data;
      setUser(profileData);

      // Extract the unique user ID (check your API structure: profileData.id or profileData._id)
      const id = profileData.id || profileData._id || profileData.user_id;

      if (id) {
        setUserId(id.toString());
        await Storage.save('userId', id.toString()); // Persist ID for offline re-launch
      }
    } catch (error) {
      console.error("Profile Fetch Error:", error.response?.data || error.message);
      if (error.response?.status === 401) await logout();
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = await Storage.get('token');
        const storedId = await Storage.get('userId');

        if (storedToken) {
          setUserToken(storedToken);
          setUserId(storedId); // Set ID from storage for immediate offline use

          // Refresh profile in background if online
          fetchProfile(storedToken);
        }
      } catch (e) {
        console.error("Auth initialization error", e);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const interceptor = apiClient.interceptors.response.use(
      (res) => res,
      async (err) => {
        if (err.response?.status === 401) await logout();
        return Promise.reject(err);
      }
    );
    return () => apiClient.interceptors.response.eject(interceptor);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await apiClient.post('/api/v1/auth/login', { email, password });
      const token = res.data.token || res.data.data?.token;

      if (token) {
        await Storage.save('token', token);
        setUserToken(token);
        // fetchProfile will set the userId and save it to Storage
        await fetchProfile(token);
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const res = await apiClient.post('/api/v1/auth/register', { name, email, password });
      const token = res.data.token || res.data.data?.token;

      if (token) {
        await Storage.save('token', token);
        setUserToken(token);
        await fetchProfile(token);
      } else {
        throw new Error("Account created, but no token provided.");
      }
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      throw error;
    }
  };

  const logout = async () => {
    setUserToken(null);
    setUser(null);
    setUserId(null); // Clear ID
    await Storage.remove('token');
    await Storage.remove('userId'); // Remove ID from storage
  };

  return (
    <AuthContext.Provider value={{ userToken, userId, user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};