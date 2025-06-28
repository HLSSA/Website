// src/components/admin/Partners.tsx

import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import usePartners from '../../hooks/usePartners';
import './admin.css';
import { Partner, PartnerFormData } from '../../types/partners.type';
import Cookies from 'js-cookie';

const Partners = () => {
  const token = Cookies.get('adminToken');
  const { partners, loading, error, fetchPartners, setPartners } = usePartners(token || null);

  const [formData, setFormData] = useState<PartnerFormData>({
    name: '',
    description: '',
    website: ''
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
    setFormData({ name: '', description: '', website: '' });
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
      form.append('website', formData.website);

      if (imageFile) {
        form.append('image', imageFile);
      }

      let response;

      if (editingId !== null) {
        response = await axios.put(`${API_URL}/partners/${editingId}`, form, { headers });
        setSubmitSuccess('Partner updated successfully!');
      } else {
        response = await axios.post(`${API_URL}/partners`, form, { headers });
        setSubmitSuccess('New partner added successfully!');
      }

      if (editingId !== null) {
        setPartners(prev => prev.map(partner => partner.id === editingId ? response.data : partner));
      } else {
        setPartners(prev => [...prev, response.data]);
      }

      resetForm();
      fetchPartners();
    } catch (err: any) {
      console.error('Error saving partner:', err);
      setSubmitError(err.response?.data?.error || err.message || 'An error occurred while saving the partner');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) {
      setSubmitError('You must be logged in to delete partners');
      return;
    }

    if (submitLoading) return;

    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      await axios.delete(`${API_URL}/partners/${id}`, { headers });

      setPartners(prev => prev.filter(partner => partner.id !== id));
      setSubmitSuccess('Partner deleted successfully!');

      setDeleteConfirm(null);
    } catch (err: any) {
      console.error('Error deleting partner:', err);
      setSubmitError(err.response?.data?.error || err.message || 'An error occurred while deleting the partner');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (partner: Partner) => {
    setFormData({
      name: partner.name,
      description: partner.description,
      website: partner.website_link
    });
    setEditingId(partner.id);
    setImageFile(null);
    setImagePreview(partner.image || null);
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
        <h1 className="title">{editingId !== null ? 'Edit Partner' : 'Add Partner'}</h1>

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
          <label htmlFor="name">Partner Name</label>
          <input
            required
            type="text"
            id="name"
            className="input"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={submitLoading}
            placeholder="Enter partner name"
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
            placeholder="Enter partner description"
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="website">Website URL</label>
          <input
            type="url"
            id="website"
            className="input"
            name="website"
            value={formData.website}
            onChange={handleChange}
            disabled={submitLoading}
            placeholder="https://example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Partner Logo/Image</label>
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
            {submitLoading ? (editingId !== null ? 'Updating...' : 'Submitting...') : (editingId !== null ? 'Update Partner' : 'Add Partner')}
          </button>

          {editingId !== null && (
            <button className="cancel" type="button" onClick={handleCancel} disabled={submitLoading}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="list-container">
        <h2>Partners List</h2>

        {loading ? (
          <div className="loading">Loading partners...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : partners.length === 0 ? (
          <div className="empty-message">No partners available</div>
        ) : (
          <ul className="items-list">
            {partners.map(partner => (
              <li key={partner.id} className="list-item">
                <div className="item-info">
                  {partner.image && (
                    <div className="item-image">
                      <img src={partner.image} alt={partner.name} />
                    </div>
                  )}
                  <div className="item-details">
                    <h3 className="item-title">{partner.name}</h3>
                    <div className="item-description">
                      <strong>Description:</strong> {partner.description}
                    </div>
                    {partner.website_link && (
                      <div className="item-meta">
                        <strong>Website:</strong>{' '}
                        <a
                          href={partner.website_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="website-link"
                        >
                          {partner.website_link}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <div className="action-buttons">
                  <button className="edit-btn" onClick={() => handleEdit(partner)} disabled={submitLoading}>
                    Edit
                  </button>

                  {deleteConfirm === partner.id ? (
                    <div className="delete-confirm">
                      <span>Are you sure?</span>
                      <button className="confirm-yes" onClick={() => handleDelete(partner.id)} disabled={submitLoading}>
                        Yes
                      </button>
                      <button className="confirm-no" onClick={() => setDeleteConfirm(null)} disabled={submitLoading}>
                        No
                      </button>
                    </div>
                  ) : (
                    <button className="delete-btn" onClick={() => setDeleteConfirm(partner.id)} disabled={submitLoading}>
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

export default Partners;
