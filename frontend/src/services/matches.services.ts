import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

const getHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Authorization': `Bearer ${token}`
  };
};

export const fetchMatches = async () => {
  try {
    const response = await axios.get(`${API_URL}/matches`, { headers: getHeaders() });
    return response.data;
  } catch (err: any) {
    throw err.response?.data?.error || err.message || 'Failed to load matches';
  }
};

export const fetchUpcomingMatches = async () => {
  try {
    const response = await axios.get(`${API_URL}/matches/upcoming`, { headers: getHeaders() });
    return response.data;
  } catch (err: any) {
    throw err.response?.data?.error || err.message || 'Failed to load upcoming matches';
  }
};

export const saveMatch = async (formData: FormData, editingId: string | null) => {
  try {
    if (editingId !== null) {
      const response = await axios.put(`${API_URL}/matches/${editingId}`, formData, { headers: getHeaders() });
      return response.data;
    } else {
      const response = await axios.post(`${API_URL}/matches`, formData, { headers: getHeaders() });
      return response.data;
    }
  } catch (err: any) {
    throw err.response?.data?.error || err.message || 'An error occurred while saving the match';
  }
};

export const deleteMatch = async (id: string) => {
  try {
    await axios.delete(`${API_URL}/matches/${id}`, { headers: getHeaders() });
  } catch (err: any) {
    throw err.response?.data?.error || err.message || 'An error occurred while deleting the match';
  }
};
