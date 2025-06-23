// src/hooks/useCoaches.ts

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Coach } from '../types/coaches.type';

const API_URL = 'http://localhost:5000/api/admin';

const useCoaches = (token: string | null) => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const headers = {
    'Authorization': `Bearer ${token}`
  };

  const fetchCoaches = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}/coaches/active`, { headers });
      setCoaches(response.data);
    } catch (err: any) {
      console.error('Error fetching coaches:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load coaches');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCoaches = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}/coaches`, { headers });
      setCoaches(response.data);
    } catch (err: any) {
      console.error('Error fetching coaches:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load coaches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCoaches();
  }, [token]);

  return { coaches, loading, error, fetchCoaches, setCoaches, fetchAllCoaches };
};

export default useCoaches;
