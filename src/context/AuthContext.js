import React, { createContext, useState, useEffect } from 'react';
import apiClient from '../api/client';
import { Storage } from '../utils/storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null); // Stores actual profile data (name, email, etc.)
  const [loading, setLoading] = useState(true);

  // 1. Function to fetch profile data
  const fetchProfile = async (token) => {
    try {
      // We pass the token in headers (or rely on the interceptor below)
      const res = await apiClient.get('/api/v1/auth/myProfile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Adjust based on your API's response structure (e.g., res.data.data)
      setUser(res.data.data || res.data);
    } catch (error) {
      console.error("Profile Fetch Error:", error.response?.data || error.message);
      // If profile fails (token expired), log them out
      if (error.response?.status === 401) logout();
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = await Storage.get('token');
      if (storedToken) {
        setUserToken(storedToken);
        // 2. Fetch profile immediately if token exists
        await fetchProfile(storedToken);
      }
      setLoading(false);
    };

    checkAuth();

    // Response Interceptor to handle global 401s
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
        // 3. Fetch profile right after logging in
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
        // 4. Fetch profile right after signup
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
    setUser(null); // Clear profile data
    await Storage.remove('token');
  };

  return (
    <AuthContext.Provider value={{ userToken, user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};