// src/hooks/useCoaches.ts

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Person } from '../types/coaches.type';

const API_URL = 'http://localhost:5000/api/admin';

const useCoaches = (token: string | null) => {
  const [coaches, setCoaches] = useState<Person[]>([]);
  const [players, setPlayers] = useState<Person[]>([]);
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

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}/players/active`, { headers });
      setPlayers(response.data);
    } catch (err: any) {
      console.error('Error fetching players:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPlayers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}/players`, { headers });
      setPlayers(response.data);
    } catch (err: any) {
      console.error('Error fetching players:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);

      const [coachesResponse, playersResponse] = await Promise.all([
        axios.get(`${API_URL}/coaches`, { headers }),
        axios.get(`${API_URL}/players`, { headers })
      ]);

      setCoaches(coachesResponse.data);
      setPlayers(playersResponse.data);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAll();
    }
  }, [token]);

  return { 
    coaches, 
    players, 
    loading, 
    error, 
    fetchCoaches, 
    fetchPlayers, 
    setCoaches, 
    setPlayers, 
    fetchAllCoaches, 
    fetchAllPlayers,
    fetchAll 
  };
};

export default useCoaches;