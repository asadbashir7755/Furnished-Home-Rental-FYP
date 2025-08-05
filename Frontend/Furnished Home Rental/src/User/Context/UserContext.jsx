import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/apiconfig';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUserProfile = async () => {
    try {
      const url = `${API_BASE_URL}/users/profile`;
      console.log('Fetching user profile from:', url); // Console log to check URL
      const response = await axios.get(url, { withCredentials: true });
      console.log('User profile response:', response.data); // Console log to check data
      setUser(response.data.user);
      console.log("fetched user is : ",response.data.user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};