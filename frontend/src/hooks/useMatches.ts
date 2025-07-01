import { useState, useEffect } from 'react';
import axios from 'axios';
import { Match } from '../types/matches.type';

const API_URL = 'http://localhost:5000/api/admin';

const useMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [pastMatches, setPastMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const headers = {};

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}/matches`, { headers });
      const allMatches = response.data;
      setMatches(allMatches);

      // Separate matches based on current date
      const now = new Date();
      const upcoming: Match[] = [];
      const past: Match[] = [];

      allMatches.forEach((match: Match) => {
        const matchDate = new Date(match.datetime);
        if (matchDate > now) {
          upcoming.push(match);
        } else {
          past.push(match);
        }
      });

      // Sort upcoming matches by date (ascending)
      upcoming.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
      
      // Sort past matches by date (descending)
      past.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());

      setUpcomingMatches(upcoming);
      setPastMatches(past);
    } catch (err: any) {
      console.error('Error fetching matches:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return { 
    matches, 
    upcomingMatches, 
    pastMatches, 
    loading, 
    error,
    refresh: fetchMatches
  };
};

export default useMatches;