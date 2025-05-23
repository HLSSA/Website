// Updated coaches.tsx React component with improved error handling and UX
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import styled from 'styled-components';
import axios from 'axios';

interface Coach {
  id: number;
  name: string;
  role: string;
  phone: string;
  description: string;
  image?: string;
}

interface FormData {
  name: string;
  role: string;
  phone: string;
  description: string;
}

const Coaches = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    role: '',
    phone: '',
    description: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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

  // Fetch coaches data on component mount
  useEffect(() => {
    fetchCoaches();
  }, []);

  // Function to fetch coaches from API
  const fetchCoaches = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/coaches`, { headers });
      setCoaches(response.data);
    } catch (err: any) {
      console.error('Error fetching coaches:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load coaches');
    } finally {
      setLoading(false);
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
    setFormData({ name: '', role: '', phone: '', description: '' });
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
      form.append('name', formData.name);
      form.append('role', formData.role);
      form.append('phone_number', formData.phone);
      form.append('description', formData.description);
      
      if (imageFile) {
        form.append('image', imageFile);
      }

      let response;
      
      if (editingId !== null) {
        // Update existing coach
        response = await axios.put(`${API_URL}/coaches/${editingId}`, form, { headers });
        setSubmitSuccess('Coach updated successfully!');
      } else {
        // Create new coach
        response = await axios.post(`${API_URL}/coaches`, form, { headers });
        setSubmitSuccess('New coach added successfully!');
      }

      // Format the response data to match our Coach interface
      const responseData = response.data;
      const updatedCoach: Coach = {
        id: responseData.id,
        name: responseData.name,
        role: responseData.role,
        phone: responseData.phone || responseData.phone_number,
        description: responseData.description,
        image: responseData.image
      };

      // Update coaches state
      if (editingId !== null) {
        setCoaches(prev => prev.map(coach => 
          coach.id === editingId ? updatedCoach : coach
        ));
      } else {
        setCoaches(prev => [...prev, updatedCoach]);
      }

      // Reset form after successful submission
      resetForm();
      
      // Refresh coaches list to ensure we have latest data
      fetchCoaches();
    } catch (err: any) {
      console.error('Error saving coach:', err);
      setSubmitError(err.response?.data?.error || err.message || 'An error occurred while saving the coach');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle deletion of a coach
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
      
      // Remove coach from state
      setCoaches(prev => prev.filter(coach => coach.id !== id));
      setSubmitSuccess('Coach deleted successfully!');
      
      // Reset delete confirmation
      setDeleteConfirm(null);
    } catch (err: any) {
      console.error('Error deleting coach:', err);
      setSubmitError(err.response?.data?.error || err.message || 'An error occurred while deleting the coach');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Set up form for editing a coach
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
          <h1 className="title">{editingId !== null ? 'Edit Coach' : 'Add Coach'}</h1>
          
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
                : editingId !== null ? 'Update Coach' : 'Add Coach'}
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
                    <button 
                      className="edit-btn" 
                      onClick={() => handleEdit(coach)} 
                      disabled={submitLoading}
                    >
                      Edit
                    </button>
                    
                    {deleteConfirm === coach.id ? (
                      <div className="delete-confirm">
                        <span>Are you sure?</span>
                        <button 
                          className="confirm-yes" 
                          onClick={() => handleDelete(coach.id)}
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
                        onClick={() => setDeleteConfirm(coach.id)} 
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

  .description {
    resize: vertical;
    min-height: 6rem;
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

  .coaches-list {
    background-color: #fff;
    padding: 2rem;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .coaches-list h2 {
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

  .coaches {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .coach-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1.5rem;
    border-bottom: 1px solid #f1f1f1;
    transition: background-color 0.2s ease;
  }

  .coach-item:last-child {
    border-bottom: none;
  }

  .coach-item:hover {
    background-color: #f9f9f9;
  }

  .coach-info {
    display: flex;
    gap: 1.5rem;
    flex: 1;
  }

  .coach-image {
    flex-shrink: 0;
    width: 120px;
    height: 120px;
    border-radius: 0.5rem;
    overflow: hidden;
    background-color: #f1f1f1;
  }

  .coach-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .coach-details {
    flex: 1;
  }

  .coach-name {
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
    margin: 0 0 0.5rem;
  }

  .coach-role, .coach-phone, .coach-description {
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }

  .coach-description {
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

    .coach-info {
      flex-direction: column;
      gap: 1rem;
    }

    .coach-image {
      width: 100%;
      height: auto;
      max-width: 200px;
    }

    .coach-item {
      flex-direction: column;
      gap: 1rem;
    }

    .action-buttons {
      flex-direction: row;
      width: 100%;
    }
  }
`;

export default Coaches;