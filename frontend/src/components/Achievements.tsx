import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import styled from 'styled-components';
import axios from 'axios';

interface Achievement {
  id: number;
  title: string;
  description: string;
  category: string;
  image?: string;
  video?: string;
}

interface FormData {
  title: string;
  description: string;
  category: string;
}

const Achievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const API_URL = 'http://localhost:5000/api/admin';
  const token = localStorage.getItem('adminToken');

  // API headers with authorization
  const headers = {
    'Authorization': `Bearer ${token}`
  };

  // Fetch achievements data on component mount
  useEffect(() => {
    fetchAchievements();
  }, []);

  // Function to fetch achievements from API
  const fetchAchievements = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/achievements`, { headers });
      setAchievements(response.data);
    } catch (err: any) {
      console.error('Error fetching achievements:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle image file selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      setVideoFile(null); // Clear video when image is selected
      setVideoPreview(null);
      
      // Create preview URL for selected image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Handle video file selection
  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setVideoFile(file);
      setImageFile(null); // Clear image when video is selected
      setImagePreview(null);
      
      // Create preview URL for selected video
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
    }
  };

  // Clear form and reset states
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

  // Handle form submission (create or update)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setSubmitError('You must be logged in to perform this action');
      return;
    }

    if (submitLoading) return;

    // Validate that either image or video is provided for new achievements
    if (editingId === null && !imageFile && !videoFile) {
      setSubmitError('Please upload either an image or video file');
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
        // Update existing achievement
        response = await axios.put(`${API_URL}/achievements/${editingId}`, form, { headers });
        setSubmitSuccess('Achievement updated successfully!');
      } else {
        // Create new achievement
        response = await axios.post(`${API_URL}/achievements`, form, { headers });
        setSubmitSuccess('New achievement added successfully!');
      }

      // Update achievements state
      if (editingId !== null) {
        setAchievements(prev => prev.map(achievement => 
          achievement.id === editingId ? response.data : achievement
        ));
      } else {
        setAchievements(prev => [...prev, response.data]);
      }

      // Reset form after successful submission
      resetForm();
      
      // Refresh achievements list to ensure we have latest data
      fetchAchievements();
    } catch (err: any) {
      console.error('Error saving achievement:', err);
      setSubmitError(err.response?.data?.error || err.message || 'An error occurred while saving the achievement');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle deletion of an achievement
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
      
      // Remove achievement from state
      setAchievements(prev => prev.filter(achievement => achievement.id !== id));
      setSubmitSuccess('Achievement deleted successfully!');
      
      // Reset delete confirmation
      setDeleteConfirm(null);
    } catch (err: any) {
      console.error('Error deleting achievement:', err);
      setSubmitError(err.response?.data?.error || err.message || 'An error occurred while deleting the achievement');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Set up form for editing an achievement
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
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel editing
  const handleCancel = () => {
    resetForm();
  };

  return (
    <StyledWrapper>
      <div className="container">
        <form className="form" onSubmit={handleSubmit}>
          <h1 className="title">{editingId !== null ? 'Edit Achievement' : 'Add Achievement'}</h1>
          
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
              className="input"
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
              className="input description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={submitLoading}
              placeholder="Enter achievement description"
              rows={4}
            />
          </div>

          <div className="media-upload-section">
            <p className="media-info">Upload either an image OR a video (not both)</p>
            
            <div className="form-group">
              <label htmlFor="image">Achievement Image</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                className="input file-input"
                onChange={handleImageChange}
                disabled={submitLoading || videoFile !== null}
              />
              
              {/* Image preview */}
              {imagePreview && (
                <div className="media-preview">
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
                className="input file-input"
                onChange={handleVideoChange}
                disabled={submitLoading || imageFile !== null}
              />
              
              {/* Video preview */}
              {videoPreview && (
                <div className="media-preview">
                  <video controls>
                    <source src={videoPreview} />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
          </div>

          <div className="button-group">
            <button 
              className="submit" 
              type="submit" 
              disabled={submitLoading}
            >
              {submitLoading
                ? editingId !== null ? 'Updating...' : 'Submitting...'
                : editingId !== null ? 'Update Achievement' : 'Add Achievement'}
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

        <div className="achievements-list">
          <h2>Achievements List</h2>
          
          {loading ? (
            <div className="loading">Loading achievements...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : achievements.length === 0 ? (
            <div className="empty-message">No achievements available</div>
          ) : (
            <ul className="achievements">
              {achievements.map(achievement => (
                <li key={achievement.id} className="achievement-item">
                  <div className="achievement-info">
                    {(achievement.image || achievement.video) && (
                      <div className="achievement-media">
                        {achievement.image ? (
                          <img src={achievement.image} alt={achievement.title} />
                        ) : achievement.video ? (
                          <video controls>
                            <source src={achievement.video} />
                            Your browser does not support the video tag.
                          </video>
                        ) : null}
                      </div>
                    )}
                    <div className="achievement-details">
                      <h3 className="achievement-title">{achievement.title}</h3>
                      <div className="achievement-category"><strong>Category:</strong> {achievement.category}</div>
                      <div className="achievement-description"><strong>Description:</strong> {achievement.description}</div>
                    </div>
                  </div>
                  <div className="action-buttons">
                    <button 
                      className="edit-btn" 
                      onClick={() => handleEdit(achievement)} 
                      disabled={submitLoading}
                    >
                      Edit
                    </button>
                    
                    {deleteConfirm === achievement.id ? (
                      <div className="delete-confirm">
                        <span>Are you sure?</span>
                        <button 
                          className="confirm-yes" 
                          onClick={() => handleDelete(achievement.id)}
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
                        onClick={() => setDeleteConfirm(achievement.id)} 
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

export default Achievements;

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

  .input:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }

  .description {
    resize: vertical;
    min-height: 6rem;
  }

  .file-input {
    padding: 0.5rem 0;
    border: none;
  }

  .media-upload-section {
    border: 2px dashed #ddd;
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-bottom: 1.25rem;
    background-color: #f9f9f9;
  }

  .media-info {
    text-align: center;
    color: #666;
    font-style: italic;
    margin-bottom: 1rem;
    padding: 0.5rem;
    background-color: #e3f2fd;
    border-radius: 0.25rem;
  }

  .media-preview {
    margin-top: 1rem;
    max-width: 300px;
    border-radius: 0.5rem;
    overflow: hidden;
    border: 1px solid #ddd;
  }

  .media-preview img,
  .media-preview video {
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

  .achievements-list {
    background-color: #fff;
    padding: 2rem;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .achievements-list h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #f1f1f1;
  }

  .loading, .empty-message {
    padding: 1.5rem;
    text-align: center;
    color: #666;
    font-style: italic;
  }

  .achievements {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .achievement-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1.5rem;
    border-bottom: 1px solid #f1f1f1;
    transition: background-color 0.2s ease;
  }

  .achievement-item:last-child {
    border-bottom: none;
  }

  .achievement-item:hover {
    background-color: #f9f9f9;
  }

  .achievement-info {
    display: flex;
    gap: 1.5rem;
    flex: 1;
  }

  .achievement-media {
    flex-shrink: 0;
    width: 200px;
    height: 150px;
    border-radius: 0.5rem;
    overflow: hidden;
    background-color: #f1f1f1;
  }

  .achievement-media img,
  .achievement-media video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .achievement-details {
    flex: 1;
  }

  .achievement-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
    margin: 0 0 0.5rem;
  }

  .achievement-category, .achievement-description {
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }

  .achievement-description {
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

    .achievement-info {
      flex-direction: column;
      gap: 1rem;
    }

    .achievement-media {
      width: 100%;
      height: auto;
      max-width: 300px;
    }

    .achievement-item {
      flex-direction: column;
      gap: 1rem;
    }

    .action-buttons {
      flex-direction: row;
      width: 100%;
    }

    .media-preview {
      max-width: 100%;
    }
  }
`