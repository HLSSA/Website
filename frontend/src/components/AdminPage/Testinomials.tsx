// src/components/admin/Testimonials.tsx

import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import useTestimonials from '../../hooks/useTestimonials';
import './admin.css';
import { Testimonial, TestimonialFormData } from '../../types/testimonials.type';
import Cookies from 'js-cookie';

const Testimonials = () => {
  const token = Cookies.get('adminToken');
  const { testimonials, loading, error, fetchTestimonials, setTestimonials } = useTestimonials();

  const [formData, setFormData] = useState<TestimonialFormData>({
    name: '',
    role: '',
    feedback: ''
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
    setFormData({ name: '', role: '', feedback: '' });
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
      form.append('feedback', formData.feedback);

      if (imageFile) {
        form.append('image', imageFile);
      }

      let response;

      if (editingId !== null) {
        response = await axios.put(`${API_URL}/testimonials/${editingId}`, form, { headers });
        setSubmitSuccess('Testimonial updated successfully!');
      } else {
        response = await axios.post(`${API_URL}/testimonials`, form, { headers });
        setSubmitSuccess('New testimonial added successfully!');
      }

      const responseData = response.data;
      const updatedTestimonial: Testimonial = {
        id: responseData.id,
        name: responseData.name,
        role: responseData.role,
        feedback: responseData.feedback,
        image: responseData.image
      };

      if (editingId !== null) {
        setTestimonials(prev => prev.map(testimonial => testimonial.id === editingId ? updatedTestimonial : testimonial));
      } else {
        setTestimonials(prev => [...prev, updatedTestimonial]);
      }

      resetForm();
      fetchTestimonials();
    } catch (err: any) {
      console.error('Error saving testimonial:', err);
      setSubmitError(err.response?.data?.error || err.message || 'An error occurred while saving the testimonial');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) {
      setSubmitError('You must be logged in to delete testimonials');
      return;
    }

    if (submitLoading) return;

    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      await axios.delete(`${API_URL}/testimonials/${id}`, { headers });

      setTestimonials(prev => prev.filter(testimonial => testimonial.id !== id));
      setSubmitSuccess('Testimonial deleted successfully!');

      setDeleteConfirm(null);
    } catch (err: any) {
      console.error('Error deleting testimonial:', err);
      setSubmitError(err.response?.data?.error || err.message || 'An error occurred while deleting the testimonial');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      feedback: testimonial.feedback
    });
    setEditingId(testimonial.id);
    setImageFile(null);
    setImagePreview(testimonial.image || null);
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
        <h1 className="title">{editingId !== null ? 'Edit Testimonial' : 'Add Testimonial'}</h1>

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
            placeholder="Enter person's name"
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
            placeholder="Enter person's role (e.g. Parent, Student, etc.)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="feedback">Feedback</label>
          <textarea
            required
            id="feedback"
            className="textarea"
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            disabled={submitLoading}
            placeholder="Enter testimonial feedback"
            rows={5}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Person's Image (Optional)</label>
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
            {submitLoading ? (editingId !== null ? 'Updating...' : 'Submitting...') : (editingId !== null ? 'Update Testimonial' : 'Add Testimonial')}
          </button>

          {editingId !== null && (
            <button className="cancel" type="button" onClick={handleCancel} disabled={submitLoading}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="list-container">
        <h2>Testimonials List</h2>

        {loading ? (
          <div className="loading">Loading testimonials...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : testimonials.length === 0 ? (
          <div className="empty-message">No testimonials available</div>
        ) : (
          <ul className="items-list">
            {testimonials.map(testimonial => (
              <li key={testimonial.id} className="list-item">
                <div className="item-info">
                  {testimonial.image && (
                    <div className="item-image">
                      <img src={testimonial.image} alt={testimonial.name} />
                    </div>
                  )}
                  <div className="item-details">
                    <h3 className="item-title">{testimonial.name}</h3>
                    <div className="item-meta"><strong>Role:</strong> {testimonial.role}</div>
                    <div className="item-description">
                      <strong>Feedback:</strong>
                      <p>"{testimonial.feedback}"</p>
                    </div>
                  </div>
                </div>
                <div className="action-buttons">
                  <button className="edit-btn" onClick={() => handleEdit(testimonial)} disabled={submitLoading}>
                    Edit
                  </button>

                  {deleteConfirm === testimonial.id ? (
                    <div className="delete-confirm">
                      <span>Are you sure?</span>
                      <button className="confirm-yes" onClick={() => handleDelete(testimonial.id)} disabled={submitLoading}>
                        Yes
                      </button>
                      <button className="confirm-no" onClick={() => setDeleteConfirm(null)} disabled={submitLoading}>
                        No
                      </button>
                    </div>
                  ) : (
                    <button className="delete-btn" onClick={() => setDeleteConfirm(testimonial.id)} disabled={submitLoading}>
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

export default Testimonials;
