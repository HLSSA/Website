// src/hooks/useNews.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import { NewsArticle } from '../types/news.type';

const API_URL = import.meta.env.VITE_API_URL;

const useNews = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [featuredNews, setFeaturedNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const headers = {};

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/news`, { headers });
      const allNews = response.data;
      setNews(allNews);
      
      // Separate featured news
      const featured = allNews.filter((item: NewsArticle) => item.featured);
      setFeaturedNews(featured);
      
    } catch (err: any) {
      console.error('Error fetching news:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return {
    news,
    featuredNews,
    loading,
    error,
    fetchNews,
    setNews
  };
};

export default useNews;