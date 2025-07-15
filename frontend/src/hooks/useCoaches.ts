// src/hooks/useCoaches.ts

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Person } from '../types/coaches.type';

const API_URL = 'http://localhost:5000/api/admin';


const useCoaches = () => {
  const [coaches, setCoaches] = useState<Person[]>([]);
  const [players, setPlayers] = useState<Person[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCoaches = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/coaches/active`);
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

      const response = await axios.get(`${API_URL}/coaches`);
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

      const response = await axios.get(`${API_URL}/players/active`);
      setPlayers(response.data);
    } catch (err: any) {
      console.error('Error fetching players:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayersByAge = async (age: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}/players/age/${age}`);
      return response.data;
    } catch (err: any) {
      console.error('Error fetching players:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load players');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayersAllAges = async () => {
    try {
      setLoading(true);
      setError(null);

      const ageCategories = ['under 10', 'under 12', 'under 14', 'under 16', 'under 18', 'under 21'];
      const allPlayers: Person[] = [];

      // Fetch players for each age category
      for (const age of ageCategories) {
        try {
          const response = await axios.get(`${API_URL}/players/age/${age}`);
          allPlayers.push(...response.data);
        } catch (ageErr: any) {
          // If a specific age category fails, continue with others
          console.warn(`Failed to fetch players for age ${age}:`, ageErr);
        }
      }

      setPlayers(allPlayers);
    } catch (err: any) {
      console.error('Error fetching players by age:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPlayers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}/players`);
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

      // Fetch coaches and players concurrently
      const [coachesResponse] = await Promise.all([
        axios.get(`${API_URL}/coaches`)
      ]);

      setCoaches(coachesResponse.data);

      // Fetch players by age categories
      await fetchPlayersAllAges();
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveCoachesAndPlayers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch active coaches
      const coachesResponse = await axios.get(`${API_URL}/coaches/active`);
      setCoaches(coachesResponse.data);

      // Fetch players by age categories
      await fetchPlayersAllAges();
    } catch (err: any) {
      console.error('Error fetching active data:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load active data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveCoachesAndPlayers();
  }, []);

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
    fetchPlayersByAge,
    fetchPlayersAllAges,
    fetchAll,
    fetchActiveCoachesAndPlayers
  };
};

export default useCoaches;