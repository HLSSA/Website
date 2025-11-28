// src/hooks/usePartners.ts

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Partner } from '../types/partners.type';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL;

const usePartners = (token: string | null) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const headers = {
    Authorization: `Bearer ${Cookies.get('adminToken')}`,
  };

  const fetchPartners = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}/partners`, { headers });
      setPartners(response.data);
    } catch (err: any) {
      console.error('Error fetching partners:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load partners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [token]);

  return { partners, setPartners, loading, error, fetchPartners };
};

export default usePartners;
