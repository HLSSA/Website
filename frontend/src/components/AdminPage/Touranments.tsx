// src/components/admin/Tournaments.tsx

import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import useTournaments from '../../hooks/useTournaments';
import './admin.css';
import { Tournament, TournamentFormData } from '../../types/tournaments.type';
import Cookies from 'js-cookie';

const Tournaments = () => {
  const token = Cookies.get('adminToken');
  const { tournaments, loading, error, fetchTournaments, setTournaments } = useTournaments(token || null);

  const [formData, setFormData] = useState<TournamentFormData>({
    name: '',
    description: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

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
    setFormData({ name: '', description: '' });
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
      form.append('name', formData.name);
      form.append('description', formData.description);

      if (imageFile) {
        form.append('image', imageFile);
      }

      let response;

      if (editingId !== null) {
        response = await axios.put(`${API_URL}/tournaments/${editingId}`, form, { headers });
        setSubmitSuccess('Tournament updated successfully!');
      } else {
        response = await axios.post(`${API_URL}/tournaments`, form, { headers });
        setSubmitSuccess('New tournament added successfully!');
      }

      if (editingId !== null) {
        setTournaments(prev => prev.map(tournament => tournament.id === editingId ? response.data : tournament));
      } else {
        setTournaments(prev => [...prev, response.data]);
      }

      resetForm();
      fetchTournaments();
    } catch (err: any) {
      console.error('Error saving tournament:', err);
      setSubmitError(err.response?.data?.error || err.message || 'An error occurred while saving the tournament');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) {
      setSubmitError('You must be logged in to delete tournaments');
      return;
    }

    if (submitLoading) return;

    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      await axios.delete(`${API_URL}/tournaments/${id}`, { headers });

      setTournaments(prev => prev.filter(tournament => tournament.id !== id));
      setSubmitSuccess('Tournament deleted successfully!');

      setDeleteConfirm(null);
    } catch (err: any) {
      console.error('Error deleting tournament:', err);
      setSubmitError(err.response?.data?.error || err.message || 'An error occurred while deleting the tournament');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (tournament: Tournament) => {
    setFormData({
      name: tournament.name,
      description: tournament.description
    });
    setEditingId(tournament.id);
    setImageFile(null);
    setImagePreview(tournament.image || null);
    setSubmitError(null);
    setSubmitSuccess(null);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    resetForm();
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h1 className="title">{editingId !== null ? 'Edit Tournament' : 'Add Tournament'}</h1>

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
          <label htmlFor="name">Tournament Name</label>
          <input
            required
            type="text"
            id="name"
            className="input"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={submitLoading}
            placeholder="Enter tournament name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            required
            id="description"
            className="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={submitLoading}
            placeholder="Enter tournament description"
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Tournament Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            className="file-input"
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
            {submitLoading ? (editingId !== null ? 'Updating...' : 'Submitting...') : (editingId !== null ? 'Update Tournament' : 'Add Tournament')}
          </button>

          {editingId !== null && (
            <button className="cancel" type="button" onClick={handleCancel} disabled={submitLoading}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="list-container">
        <h2>Tournaments List</h2>

        {loading ? (
          <div className="loading">Loading tournaments...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : tournaments.length === 0 ? (
          <div className="empty-message">No tournaments available</div>
        ) : (
          <ul className="items-list">
            {tournaments.map(tournament => (
              <li key={tournament.id} className="list-item">
                <div className="item-info">
                  {tournament.image && (
                    <div className="item-image">
                      <img src={tournament.image} alt={tournament.name} />
                    </div>
                  )}
                  <div className="item-details">
                    <h3 className="item-title">{tournament.name}</h3>
                    <div className="item-description">
                      <strong>Description:</strong> {tournament.description}
                    </div>
                  </div>
                </div>
                <div className="action-buttons">
                  <button className="edit-btn" onClick={() => handleEdit(tournament)} disabled={submitLoading}>
                    Edit
                  </button>

                  {deleteConfirm === tournament.id ? (
                    <div className="delete-confirm">
                      <span>Are you sure?</span>
                      <button className="confirm-yes" onClick={() => handleDelete(tournament.id)} disabled={submitLoading}>
                        Yes
                      </button>
                      <button className="confirm-no" onClick={() => setDeleteConfirm(null)} disabled={submitLoading}>
                        No
                      </button>
                    </div>
                  ) : (
                    <button className="delete-btn" onClick={() => setDeleteConfirm(tournament.id)} disabled={submitLoading}>
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

export default Tournaments;
