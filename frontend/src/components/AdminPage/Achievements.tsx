// src/components/admin/Achievements.tsx

import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import useAchievements from '../../hooks/useAchievements';
import './admin.css';
import Cookies from 'js-cookie';

import { Achievement, AchievementFormData } from '../../types/achievement.type';

const Achievements = () => {
  const token = Cookies.get('adminToken');
  const { achievements, loading, error, fetchAchievements, setAchievements } = useAchievements(token || null);

  const [formData, setFormData] = useState<AchievementFormData>({
    title: '',
    description: '',
    category: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const API_URL = 'http://localhost:5000/api/admin';

  const headers = {
    'Authorization': `Bearer ${token}`
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Don't clear video file when image is selected
      // Only clear video preview if we want to show only one preview at a time
      // setVideoFile(null);
      // setVideoPreview(null);

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setVideoFile(file);
      
      // Don't clear image file when video is selected
      // Image is still required for video thumbnail
      // setImageFile(null);
      // setImagePreview(null);

      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', category: '' });
    setImageFile(null);
    setVideoFile(null);
    setImagePreview(null);
    setVideoPreview(null);
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

    // Validate that image is always provided (required for both image and video uploads)
    if (editingId === null && !imageFile) {
      setSubmitError('Please upload an image (required for both images and videos)');
      return;
    }
    
    // For new achievements, either image or video must be provided
    // (image is already required above, so this is just for backward compatibility)
    if (editingId === null && !imageFile && !videoFile) {
      setSubmitError('Please upload at least an image file');
      return;
    }

    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('category', formData.category);

      if (imageFile) {
        form.append('image', imageFile);
      }
      if (videoFile) {
        form.append('video', videoFile);
      }

      let response;

      if (editingId !== null) {
        response = await axios.put(`${API_URL}/achievements/${editingId}`, form, { headers });
        setSubmitSuccess('Achievement updated successfully!');
      } else {
        response = await axios.post(`${API_URL}/achievements`, form, { headers });
        setSubmitSuccess('New achievement added successfully!');
      }

      if (editingId !== null) {
        setAchievements(prev => prev.map(achievement => achievement.id === editingId ? response.data : achievement));
      } else {
        setAchievements(prev => [...prev, response.data]);
      }

      resetForm();
      fetchAchievements();
    } catch (err: any) {
      console.error('Error saving achievement:', err);
      setSubmitError(err.response?.data?.error || err.message || 'An error occurred while saving the achievement');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) {
      setSubmitError('You must be logged in to delete achievements');
      return;
    }

    if (submitLoading) return;

    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      await axios.delete(`${API_URL}/achievements/${id}`, { headers });

      setAchievements(prev => prev.filter(achievement => achievement.id !== id));
      setSubmitSuccess('Achievement deleted successfully!');

      setDeleteConfirm(null);
    } catch (err: any) {
      console.error('Error deleting achievement:', err);
      setSubmitError(err.response?.data?.error || err.message || 'An error occurred while deleting the achievement');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (achievement: Achievement) => {
    setFormData({
      title: achievement.title,
      description: achievement.description,
      category: achievement.category
    });
    setEditingId(achievement.id);
    setImageFile(null);
    setVideoFile(null);
    setImagePreview(achievement.image || null);
    setVideoPreview(achievement.video || null);
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
        <h1 className="title">{editingId !== null ? 'Edit Achievement' : 'Add Achievement'}</h1>

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
          <label htmlFor="title">Title</label>
          <input
            required
            type="text"
            id="title"
            className="input"
            name="title"
            value={formData.title}
            onChange={handleChange}
            disabled={submitLoading}
            placeholder="Enter achievement title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            required
            id="category"
            className="select"
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={submitLoading}
          >
            <option value="">Select category</option>
            <option value="Team">Team</option>
            <option value="Individual">Individual</option>
            <option value="Community">Community</option>
            <option value="Academic">Academic</option>
          </select>
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
            placeholder="Enter achievement description"
            rows={4}
          />
        </div>

        <div className="media-upload-section">
          <p className="media-info">Upload image only OR a video with image for preview</p>

          <div className="form-group">
            <label htmlFor="image">Achievement Image</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              className="file-input"
              onChange={handleImageChange}
              disabled={submitLoading}
              required={editingId === null} // Required for new entries
            />

            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="video">Achievement Video</label>
            <input
              type="file"
              id="video"
              accept="video/*"
              className="file-input"
              onChange={handleVideoChange}
              disabled={submitLoading}
            />

            {videoPreview && (
              <div className="image-preview">
                <video controls>
                  <source src={videoPreview} />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        </div>

        <div className="button-group">
          <button className="submit" type="submit" disabled={submitLoading}>
            {submitLoading ? (editingId !== null ? 'Updating...' : 'Submitting...') : (editingId !== null ? 'Update Achievement' : 'Add Achievement')}
          </button>

          {editingId !== null && (
            <button className="cancel" type="button" onClick={handleCancel} disabled={submitLoading}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="list-container">
        <h2>Achievements List</h2>

        {loading ? (
          <div className="loading">Loading achievements...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : achievements.length === 0 ? (
          <div className="empty-message">No achievements available</div>
        ) : (
          <ul className="items-list">
            {achievements.map(achievement => (
              <li key={achievement.id} className="list-item">
                <div className="item-info">
                  {(achievement.image || achievement.video) && (
                    <div className="item-image">
                      {achievement.image ? (
                        <img src={achievement.image} alt={achievement.title} className="uploaded-media" />
                      ) : achievement.video ? (
                        <div className="video-container">
                          <video controls className="uploaded-media">
                            <source 
                              src={achievement.video} 
                              type={`video/${achievement.video.split('.').pop()?.toLowerCase() === 'mp4' ? 'mp4' : 'webm'}`} 
                            />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      ) : null}
                    </div>
                  )}
                  <div className="item-details">
                    <h3 className="item-title">{achievement.title}</h3>
                    <div className="item-meta"><strong>Category:</strong> {achievement.category}</div>
                    <div className="item-description"><strong>Description:</strong> {achievement.description}</div>
                  </div>
                </div>
                <div className="action-buttons">
                  <button className="edit-btn" onClick={() => handleEdit(achievement)} disabled={submitLoading}>
                    Edit
                  </button>

                  {deleteConfirm === achievement.id ? (
                    <div className="delete-confirm">
                      <span>Are you sure?</span>
                      <button className="confirm-yes" onClick={() => handleDelete(achievement.id)} disabled={submitLoading}>
                        Yes
                      </button>
                      <button className="confirm-no" onClick={() => setDeleteConfirm(null)} disabled={submitLoading}>
                        No
                      </button>
                    </div>
                  ) : (
                    <button className="delete-btn" onClick={() => setDeleteConfirm(achievement.id)} disabled={submitLoading}>
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

export default Achievements;
