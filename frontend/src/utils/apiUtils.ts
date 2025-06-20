// src/utils/apiUtils.ts

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

export const getToken = (): string | null => {
  return localStorage.getItem('adminToken');
};

export const getHeaders = (): { Authorization: string } => {
  const token = getToken();
  return {
    Authorization: `Bearer ${token}`
  };
};

export const handleApiError = (err: any): string => {
  console.error(err);
  return err.response?.data?.error || err.message || 'An error occurred';
};

export const createFormData = (data: Record<string, any>, imageFile: File | null = null): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });

  if (imageFile) {
    formData.append('image', imageFile);
  }

  return formData;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};
