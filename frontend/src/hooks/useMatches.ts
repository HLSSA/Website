// src/hooks/useMatches.ts

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Match } from '../types/matches.type';

const API_URL = 'http://localhost:5000/api/admin';

const useMatches = (token: string | null) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const headers = {
    'Authorization': `Bearer ${token}`
  };

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}/matches`, { headers });
      setMatches(response.data);
    } catch (err: any) {
      console.error('Error fetching matches:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingMatches = async () => {
    try {
      const response = await axios.get(`${API_URL}/matches/upcoming`, { headers });
      setUpcomingMatches(response.data);
    } catch (err: any) {
      console.error('Error fetching upcoming matches:', err);
    }
  };

  useEffect(() => {
    fetchMatches();
    fetchUpcomingMatches();
  }, [token]);

  return { matches, upcomingMatches, loading, error, fetchMatches, fetchUpcomingMatches };
};

export default useMatches;
