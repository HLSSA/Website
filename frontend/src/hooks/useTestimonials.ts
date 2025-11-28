// src/hooks/useTestimonials.ts

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Testimonial } from '../types/testimonials.type';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL;

const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const headers = {
    Authorization: `Bearer ${Cookies.get('adminToken')}`,
  };

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}/testimonials`, { headers });
      setTestimonials(response.data);
    } catch (err: any) {
      console.error('Error fetching testimonials:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return { testimonials, loading, error, fetchTestimonials, setTestimonials };
};

export default useTestimonials;
