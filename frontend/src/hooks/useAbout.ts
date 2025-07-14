// src/hooks/useAbout.ts

import { useState, useEffect } from 'react';
import axios from 'axios';

export interface AboutData {
  id?: string;
  name: string;
  location: string;
  logo: string;
  email: string;
  contact: string;
  description: string[];
  carousel_pics: string[];
}

const API_URL = 'http://localhost:5000/api/admin';

const useAbout = () => {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const headers = {};

  const fetchAbout = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}/about`, { headers });
      setAboutData(response.data);
    } catch (err: any) {
      console.error('Error fetching about data:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load about information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  return { aboutData, loading, error, fetchAbout };
};

export default useAbout;