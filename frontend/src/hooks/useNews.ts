// src/hooks/useNews.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import { NewsArticle } from '../types/news.type';

const API_URL = 'http://localhost:5000/api/admin';

const useNews = (token: string | null) => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const headers = {
    'Authorization': `Bearer ${token}`
  };

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/news`, { headers });
      setNews(response.data || []);
    } catch (err: any) {
      console.error('Error fetching news:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load news articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchNews();
    }
  }, [token]);

  return {
    news,
    loading,
    error,
    fetchNews,
    setNews
  };
};

export default useNews;