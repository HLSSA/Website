// src/components/admin/Matches.tsx

import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import useMatches from '../../hooks/useMatches';
import './admin.css';
import { Match, MatchFormData } from '../../types/matches.type';
import Cookies from 'js-cookie';

const Matches = () => {
  const token = Cookies.get('adminToken');
  const { matches, upcomingMatches, pastMatches, loading, error } = useMatches();

  const [formData, setFormData] = useState<MatchFormData>({
    opponent_name: '',
    datetime: '',
    location: '',
    result: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'upcoming' | 'past'>('all');

  const API_URL = import.meta.env.VITE_API_URL;

  const headers = {
    'Authorization': `Bearer ${token}`
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const resetForm = () => {
    setFormData({ opponent_name: '', datetime: '', location: '', result: '' });
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    setSubmitError(null);
    setSubmitSuccess(null);
  };

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

      if (editingId !== null) {
        await axios.put(`${API_URL}/matches/${editingId}`, form, { headers });
        setSubmitSuccess('Match updated successfully!');
      } else {
        await axios.post(`${API_URL}/matches`, form, { headers });
        setSubmitSuccess('New match added successfully!');
      }

      resetForm();
      setEditingId(null);
    } catch (err: any) {
      console.error('Error saving match:', err);
      setSubmitError(err.response?.data?.error || err.message || 'An error occurred while saving the match');
    } finally {
      setSubmitLoading(false);
    }
  };

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
    
      setSubmitSuccess('Match deleted successfully!');
      setDeleteConfirm(null);
    } catch (err: any) {
      console.error('Error deleting match:', err);
      setSubmitError(err.response?.data?.error || err.message || 'An error occurred while deleting the match');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (match: Match) => {
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

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    resetForm();
  };

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

  const currentMatches = viewMode === 'upcoming' 
    ? upcomingMatches 
    : viewMode === 'past' 
      ? pastMatches 
      : matches;

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h1 className="title">{editingId !== null ? 'Edit Match' : 'Add Match'}</h1>

        {submitSuccess && (
          <div className="success-message">
            {submitSuccess}
          </div>
        )}

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

          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>

        <div className="button-group">
          <button className="submit" type="submit" disabled={submitLoading}>
            {submitLoading ? (editingId !== null ? 'Updating...' : 'Submitting...') : (editingId !== null ? 'Update Match' : 'Add Match')}
          </button>

          {editingId !== null && (
            <button className="cancel" type="button" onClick={handleCancel} disabled={submitLoading}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="list-container">
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
              Upcoming ({upcomingMatches.length})
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'past' ? 'active' : ''}`} 
              onClick={() => setViewMode('past')}
            >
              Past ({pastMatches.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading matches...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : currentMatches.length === 0 ? (
          <div className="empty-message">
            {viewMode === 'upcoming' 
              ? 'No upcoming matches' 
              : viewMode === 'past'
                ? 'No past matches available'
                : 'No matches available'}
          </div>
        ) : (
          <ul className="items-list">
            {currentMatches.map(match => (
              <li key={match.id} className="list-item">
                <div className="item-info">
                  {match.opponent_image && (
                    <div className="item-image">
                      <img src={match.opponent_image} alt={match.opponent_name} />
                    </div>
                  )}
                  <div className="item-details">
                    <h3 className="item-title">{match.opponent_name}</h3>
                    <div className="item-meta">
                      <strong>Date & Time:</strong> {formatDate(match.datetime)}
                    </div>
                    <div className="item-meta">
                      <strong>Location:</strong> {match.location}
                    </div>
                  </div>
                </div>
                <div className="action-buttons">
                  <button className="edit-btn" onClick={() => handleEdit(match)} disabled={submitLoading}>
                    Edit
                  </button>

                  {deleteConfirm === match.id ? (
                    <div className="delete-confirm">
                      <span>Are you sure?</span>
                      <button className="confirm-yes" onClick={() => handleDelete(match.id)} disabled={submitLoading}>
                        Yes
                      </button>
                      <button className="confirm-no" onClick={() => setDeleteConfirm(null)} disabled={submitLoading}>
                        No
                      </button>
                    </div>
                  ) : (
                    <button className="delete-btn" onClick={() => setDeleteConfirm(match.id)} disabled={submitLoading}>
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
  );
};

export default Matches;
