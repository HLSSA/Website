// src/components/admin/Coaches.tsx

import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import useCoaches from '../../hooks/useCoaches';
import './admin.css';
import { Coach, CoachFormData } from '../../types/coaches.type';

const Coaches = () => {
  const token = localStorage.getItem('adminToken');
  const { coaches, loading, error, fetchCoaches, setCoaches, fetchAllCoaches} = useCoaches(token);

  const [formData, setFormData] = useState<CoachFormData>({
    name: '',
    role: '',
    phone: '',
    description: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const API_URL = 'http://localhost:5000/api/admin';

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
    setFormData({ name: '', role: '', phone: '', description: '' });
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
      form.append('role', formData.role);
      form.append('phone_number', formData.phone);
      form.append('description', formData.description);

      if (imageFile) {
        form.append('image', imageFile);
      }

      let response;

      if (editingId !== null) {
        response = await axios.put(`${API_URL}/coaches/${editingId}`, form, { headers });
        setSubmitSuccess('Coach updated successfully!');
      } else {
        response = await axios.post(`${API_URL}/coaches`, form, { headers });
        setSubmitSuccess('New coach added successfully!');
      }

      const responseData = response.data;
      const updatedCoach: Coach = {
        id: responseData.id,
        name: responseData.name,
        role: responseData.role,
        phone: responseData.phone || responseData.phone_number,
        description: responseData.description,
        image: responseData.image
      };

      if (editingId !== null) {
        setCoaches(prev => prev.map(coach => coach.id === editingId ? updatedCoach : coach));
      } else {
        setCoaches(prev => [...prev, updatedCoach]);
      }

      resetForm();
      fetchCoaches();
    } catch (err: any) {
      console.error('Error saving coach:', err);
      setSubmitError(err.response?.data?.error || err.message || 'An error occurred while saving the coach');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) {
      setSubmitError('You must be logged in to delete coaches');
      return;
    }

    if (submitLoading) return;

    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      await axios.delete(`${API_URL}/coaches/${id}`, { headers });

      setCoaches(prev => prev.filter(coach => coach.id !== id));
      setSubmitSuccess('Coach deleted successfully!');

      setDeleteConfirm(null);
    } catch (err: any) {
      console.error('Error deleting coach:', err);
      setSubmitError(err.response?.data?.error || err.message || 'An error occurred while deleting the coach');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (coach: Coach) => {
    setFormData({
      name: coach.name,
      role: coach.role,
      phone: coach.phone,
      description: coach.description
    });
    setEditingId(coach.id);
    setImageFile(null);
    setImagePreview(coach.image || null);
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
        <h1 className="title">{editingId !== null ? 'Edit Coach' : 'Add Coach'}</h1>

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
          <label htmlFor="name">Name</label>
          <input
            required
            type="text"
            id="name"
            className="input"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={submitLoading}
            placeholder="Enter coach name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <input
            required
            type="text"
            id="role"
            className="input"
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled={submitLoading}
            placeholder="Enter coach role (e.g. Head Coach)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            required
            type="text"
            id="phone"
            className="input"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={submitLoading}
            placeholder="Enter phone number"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            required
            id="description"
            className="input description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={submitLoading}
            placeholder="Enter coach description and qualifications"
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Coach Image</label>
          <input
            type="file"
            id="image"
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
            {submitLoading ? (editingId !== null ? 'Updating...' : 'Submitting...') : (editingId !== null ? 'Update Coach' : 'Add Coach')}
          </button>

          {editingId !== null && (
            <button className="cancel" type="button" onClick={handleCancel} disabled={submitLoading}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="coaches-list">
        <h2>Coaches List</h2>

        {loading ? (
          <div className="loading">Loading coaches...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : coaches.length === 0 ? (
          <div className="empty-message">No coaches available</div>
        ) : (
          <ul className="coaches">
            {coaches.map(coach => (
              <li key={coach.id} className="coach-item">
                <div className="coach-info">
                  {coach.image && (
                    <div className="coach-image">
                      <img src={coach.image} alt={coach.name} />
                    </div>
                  )}
                  <div className="coach-details">
                    <h3 className="coach-name">{coach.name}</h3>
                    <div className="coach-role"><strong>Role:</strong> {coach.role}</div>
                    <div className="coach-phone"><strong>Phone:</strong> {coach.phone}</div>
                    <div className="coach-description"><strong>Description:</strong> {coach.description}</div>
                  </div>
                </div>
                <div className="action-buttons">
                  <button className="edit-btn" onClick={() => handleEdit(coach)} disabled={submitLoading}>
                    Edit
                  </button>

                  {deleteConfirm === coach.id ? (
                    <div className="delete-confirm">
                      <span>Are you sure?</span>
                      <button className="confirm-yes" onClick={() => handleDelete(coach.id)} disabled={submitLoading}>
                        Yes
                      </button>
                      <button className="confirm-no" onClick={() => setDeleteConfirm(null)} disabled={submitLoading}>
                        No
                      </button>
                    </div>
                  ) : (
                    <button className="delete-btn" onClick={() => setDeleteConfirm(coach.id)} disabled={submitLoading}>
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

export default Coaches;
