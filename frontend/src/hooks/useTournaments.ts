// src/hooks/useTournaments.ts

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Tournament } from '../types/tournaments.type';

const API_URL = 'http://localhost:5000/api/admin';

const useTournaments = (token: string | null) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const headers = {
    'Authorization': `Bearer ${token}`
  };

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}/tournaments`, { headers });
      setTournaments(response.data);
    } catch (err: any) {
      console.error('Error fetching tournaments:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, [token]);

  return { tournaments, loading, error, fetchTournaments, setTournaments };
};

export default useTournaments;
