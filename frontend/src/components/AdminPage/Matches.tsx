import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import { Match, MatchFormData } from '../../types/matches.types';

const Matches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [formData, setFormData] = useState<MatchFormData>({
    opponent_name: '',
    datetime: '',
    location: '',
    result: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'upcoming'>('all');

  const API_URL = 'http://localhost:5000/api/admin';
  const token = localStorage.getItem('adminToken');

  // API headers with authorization
  const headers = {
    'Authorization': `Bearer ${token}`
  };

  // Fetch matches data on component mount
  useEffect(() => {
    fetchMatches();
    fetchUpcomingMatches();
  }, []);

  // Function to fetch all matches from API
  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/matches`, { headers });
      setMatches(response.data);
    } catch (err: any) {
      console.error('Error fetching matches:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch upcoming matches from API
  const fetchUpcomingMatches = async () => {
    try {
      const response = await axios.get(`${API_URL}/matches/upcoming`, { headers });
      setUpcomingMatches(response.data);
    } catch (err: any) {
      console.error('Error fetching upcoming matches:', err);
    }
  };

  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle image file selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview URL for selected image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Clear form and reset states
  const resetForm = () => {
    setFormData({ opponent_name: '', datetime: '', location: '', result: '' });
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setSubmitError('You must be logged in to perform this action');
      return;
    }

    if (submitLoading) return;

    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const form = new FormData();
      form.append('opponent_name', formData.opponent_name);
      form.append('datetime', formData.datetime);
      form.append('location', formData.location);
      form.append('result', formData.result);
      
      if (imageFile) {  
        form.append('opponent_image', imageFile);
      }

      let response;
      
      if (editingId !== null) {
        // Update existing match
        response = await axios.put(`${API_URL}/matches/${editingId}`, form, {
          headers: headers
        });
        setSubmitSuccess('Match updated successfully!');
      } else {
        // Create new match
        response = await axios.post(`${API_URL}/matches`, form, { headers });
        setSubmitSuccess('New match added successfully!');
      }

      // Update matches state
      if (editingId !== null) {
        setMatches(prev => prev.map(match => 
          match.id === editingId ? response.data : match
        ));
      } else {
        setMatches(prev => [...prev, response.data]);
      }

      // Reset form after successful submission
      resetForm();
      
      // Refresh matches list to ensure we have latest data
      fetchMatches();
      fetchUpcomingMatches();
    } catch (err: any) {
      console.error('Error saving match:', err);
      setSubmitError(err.response?.data?.error || err.message || 'An error occurred while saving the match');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle deletion of a match
  const handleDelete = async (id: string) => {
    if (!token) {
      setSubmitError('You must be logged in to delete matches');
      return;
    }

    if (submitLoading) return;

    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      await axios.delete(`${API_URL}/matches/${id}`, { headers });
      
      // Remove match from state
      setMatches(prev => prev.filter(match => match.id !== id));
      setUpcomingMatches(prev => prev.filter(match => match.id !== id));
      setSubmitSuccess('Match deleted successfully!');
      
      // Reset delete confirmation
      setDeleteConfirm(null);
    } catch (err: any) {
      console.error('Error deleting match:', err);
      setSubmitError(err.response?.data?.error || err.message || 'An error occurred while deleting the match');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Set up form for editing a match
  const handleEdit = (match: Match) => {
    // Format datetime for input field
    const formattedDatetime = new Date(match.datetime).toISOString().slice(0, 16);
    
    setFormData({
      opponent_name: match.opponent_name,
      datetime: formattedDatetime,
      location: match.location,
      result: match.result || ""
    });
    setEditingId(match.id);
    setImageFile(null);
    setImagePreview(match.opponent_image || null);
    setSubmitError(null);
    setSubmitSuccess(null);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel editing
  const handleCancel = () => {
    resetForm();
  };

  // Format date for display
  const formatDate = (dateString: string) => {
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

  const currentMatches = viewMode === 'upcoming' ? upcomingMatches : matches;

  return (
    <StyledWrapper>
      <div className="container">
        <form className="form" onSubmit={handleSubmit}>
          <h1 className="title">{editingId !== null ? 'Edit Match' : 'Add Match'}</h1>
          
          {/* Success message */}
          {submitSuccess && (
            <div className="success-message">
              {submitSuccess}
            </div>
          )}
          
          {/* Error message */}
          {submitError && (
            <div className="error-message">
              {submitError}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="opponent_name">Opponent Name</label>
            <input
              required
              type="text"
              id="opponent_name"
              className="input"
              name="opponent_name"
              value={formData.opponent_name}
              onChange={handleChange}
              disabled={submitLoading}
              placeholder="Enter opponent name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="datetime">Match Date & Time</label>
            <input
              required
              type="datetime-local"
              id="datetime"
              className="input"
              name="datetime"
              value={formData.datetime}
              onChange={handleChange}
              disabled={submitLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              required
              type="text"
              id="location"
              className="input"
              name="location"
              value={formData.location}
              onChange={handleChange}
              disabled={submitLoading}
              placeholder="Enter match location"
            />
          </div>

          <div className="form-group">
            <label htmlFor="result">Match Result</label>
            <input
              type="text"
              id="result"
              className="input"
              name="result"
              value={formData.result}
              onChange={handleChange}
              disabled={submitLoading}
              placeholder="Enter match result"
            />
          </div>

          <div className="form-group">
            <label htmlFor="opponent_image">Opponent Image</label>
            <input
              type="file"
              id="opponent_image"
              accept="image/*"
              className="input file-input"
              onChange={handleImageChange}
              disabled={submitLoading}
            />
            
            {/* Image preview */}
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>

          <div className="button-group">
            <button 
              className="submit" 
              type="submit" 
              disabled={submitLoading}
            >
              {submitLoading
                ? editingId !== null ? 'Updating...' : 'Submitting...'
                : editingId !== null ? 'Update Match' : 'Add Match'}
            </button>
            
            {editingId !== null && (
              <button 
                className="cancel" 
                type="button" 
                onClick={handleCancel}
                disabled={submitLoading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="matches-list">
          <div className="list-header">
            <h2>Matches List</h2>
            <div className="view-toggle">
              <button 
                className={`toggle-btn ${viewMode === 'all' ? 'active' : ''}`}
                onClick={() => setViewMode('all')}
              >
                All Matches ({matches.length})
              </button>
              <button 
                className={`toggle-btn ${viewMode === 'upcoming' ? 'active' : ''}`}
                onClick={() => setViewMode('upcoming')}
              >
                Upcoming (60 days) ({upcomingMatches.length})
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="loading">Loading matches...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : currentMatches.length === 0 ? (
            <div className="empty-message">
              {viewMode === 'upcoming' ? 'No upcoming matches in the next 60 days' : 'No matches available'}
            </div>
          ) : (
            <ul className="matches">
              {currentMatches.map(match => (
                <li key={match.id} className="match-item">
                  <div className="match-info">
                    {match.opponent_image && (
                      <div className="match-image">
                        <img src={match.opponent_image} alt={match.opponent_name} />
                      </div>
                    )}
                    <div className="match-details">
                      <h3 className="match-opponent">{match.opponent_name}</h3>
                      <div className="match-datetime">
                        <strong>Date & Time:</strong> {formatDate(match.datetime)}
                      </div>
                      <div className="match-location">
                        <strong>Location:</strong> {match.location}
                      </div>
                    </div>
                  </div>
                  <div className="action-buttons">
                    <button 
                      className="edit-btn" 
                      onClick={() => handleEdit(match)} 
                      disabled={submitLoading}
                    >
                      Edit
                    </button>
                    
                    {deleteConfirm === match.id ? (
                      <div className="delete-confirm">
                        <span>Are you sure?</span>
                        <button 
                          className="confirm-yes" 
                          onClick={() => handleDelete(match.id)}
                          disabled={submitLoading}
                        >
                          Yes
                        </button>
                        <button 
                          className="confirm-no" 
                          onClick={() => setDeleteConfirm(null)}
                          disabled={submitLoading}
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="delete-btn" 
                        onClick={() => setDeleteConfirm(match.id)} 
                        disabled={submitLoading}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .container {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    gap: 2rem;
  }

  .form {
    background-color: #fff;
    padding: 2rem;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .title {
    font-size: 1.75rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 1.5rem;
    position: relative;
    padding-left: 1.5rem;
  }

  .title::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 0.75rem;
    height: 0.75rem;
    background-color: #4a90e2;
    border-radius: 50%;
  }

  .form-group {
    margin-bottom: 1.25rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #555;
  }

  .input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: border-color 0.2s ease;
  }

  .input:focus {
    border-color: #4a90e2;
    outline: none;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }

  .file-input {
    padding: 0.5rem 0;
    border: none;
  }

  .image-preview {
    margin-top: 1rem;
    max-width: 200px;
    border-radius: 0.5rem;
    overflow: hidden;
    border: 1px solid #ddd;
  }

  .image-preview img {
    width: 100%;
    height: auto;
    display: block;
  }

  .button-group {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .submit, .cancel {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .submit {
    background-color: #4a90e2;
    color: white;
  }

  .submit:hover:not(:disabled) {
    background-color: #3a7bc8;
  }

  .cancel {
    background-color: #f1f1f1;
    color: #555;
  }

  .cancel:hover:not(:disabled) {
    background-color: #e1e1e1;
  }

  .submit:disabled, .cancel:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .error-message {
    background-color: #fee;
    color: #d32f2f;
    padding: 0.75rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    border-left: 4px solid #d32f2f;
  }

  .success-message {
    background-color: #e6f7ed;
    color: #2e7d32;
    padding: 0.75rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    border-left: 4px solid #2e7d32;
  }

  .matches-list {
    background-color: #fff;
    padding: 2rem;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #f1f1f1;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .list-header h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin: 0;
  }

  .view-toggle {
    display: flex;
    gap: 0.5rem;
  }

  .toggle-btn {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    background-color: #fff;
    color: #666;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
  }

  .toggle-btn:hover {
    background-color: #f9f9f9;
  }

  .toggle-btn.active {
    background-color: #4a90e2;
    color: white;
    border-color: #4a90e2;
  }

  .loading, .empty-message {
    padding: 1.5rem;
    text-align: center;
    color: #666;
    font-style: italic;
  }

  .matches {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .match-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1.5rem;
    border-bottom: 1px solid #f1f1f1;
    transition: background-color 0.2s ease;
  }

  .match-item:last-child {
    border-bottom: none;
  }

  .match-item:hover {
    background-color: #f9f9f9;
  }

  .match-info {
    display: flex;
    gap: 1.5rem;
    flex: 1;
  }

  .match-image {
    flex-shrink: 0;
    width: 120px;
    height: 120px;
    border-radius: 0.5rem;
    overflow: hidden;
    background-color: #f1f1f1;
  }

  .match-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .match-details {
    flex: 1;
  }

  .match-opponent {
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
    margin: 0 0 0.5rem;
  }

  .match-datetime, .match-location {
    margin-bottom: 0.5rem;
    line-height: 1.5;
    max-width: 500px;
  }

  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    min-width: 100px;
  }

  .edit-btn, .delete-btn, .confirm-yes, .confirm-no {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.35rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
    width: 100%;
  }

  .edit-btn {
    background-color: #4a90e2;
    color: white;
  }

  .edit-btn:hover:not(:disabled) {
    background-color: #3a7bc8;
  }

  .delete-btn {
    background-color: #e74c3c;
    color: white;
  }

  .delete-btn:hover:not(:disabled) {
    background-color: #c0392b;
  }

  .delete-confirm {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .delete-confirm span {
    font-size: 0.875rem;
    font-weight: 500;
    text-align: center;
    color: #e74c3c;
  }

  .confirm-yes {
    background-color: #e74c3c;
    color: white;
  }

  .confirm-yes:hover:not(:disabled) {
    background-color: #c0392b;
  }

  .confirm-no {
    background-color: #95a5a6;
    color: white;
  }

  .confirm-no:hover:not(:disabled) {
    background-color: #7f8c8d;
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    .list-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .view-toggle {
      width: 100%;
    }

    .toggle-btn {
      flex: 1;
      text-align: center;
    }

    .match-info {
      flex-direction: column;
      gap: 1rem;
    }

    .match-image {
      width: 100%;
      height: auto;
      max-width: 200px;
    }

    .match-item {
      flex-direction: column;
      gap: 1rem;
    }

    .action-buttons {
      flex-direction: row;
      width: 100%;
    }
  }
`;

export default Matches;