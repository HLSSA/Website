// Updated testimonials.tsx React component with improved error handling and UX
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import styled from 'styled-components';
import axios from 'axios';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  feedback: string;
  image?: string;
}

interface FormData {
  name: string;
  role: string;
  feedback: string;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    role: '',
    feedback: ''
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

  // Fetch testimonials data on component mount
  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Function to fetch testimonials from API
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/testimonials`, { headers });
      setTestimonials(response.data);
    } catch (err: any) {
      console.error('Error fetching testimonials:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load testimonials');
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
    setFormData({ name: '', role: '', feedback: '' });
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
      form.append('feedback', formData.feedback);
      
      if (imageFile) {
        form.append('image', imageFile);
      }

      let response;
      
      if (editingId !== null) {
        // Update existing testimonial
        response = await axios.put(`${API_URL}/testimonials/${editingId}`, form, { headers });
        setSubmitSuccess('Testimonial updated successfully!');
      } else {
        // Create new testimonial
        response = await axios.post(`${API_URL}/testimonials`, form, { headers });
        setSubmitSuccess('New testimonial added successfully!');
      }

      // Format the response data to match our Testimonial interface
      const responseData = response.data;
      const updatedTestimonial: Testimonial = {
        id: responseData.id,
        name: responseData.name,
        role: responseData.role,
        feedback: responseData.feedback,
        image: responseData.image
      };

      // Update testimonials state
      if (editingId !== null) {
        setTestimonials(prev => prev.map(testimonial => 
          testimonial.id === editingId ? updatedTestimonial : testimonial
        ));
      } else {
        setTestimonials(prev => [...prev, updatedTestimonial]);
      }

      // Reset form after successful submission
      resetForm();
      
      // Refresh testimonials list to ensure we have latest data
      fetchTestimonials();
    } catch (err: any) {
      console.error('Error saving testimonial:', err);
      setSubmitError(err.response?.data?.error || err.message || 'An error occurred while saving the testimonial');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle deletion of a testimonial
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
      
      // Remove testimonial from state
      setTestimonials(prev => prev.filter(testimonial => testimonial.id !== id));
      setSubmitSuccess('Testimonial deleted successfully!');
      
      // Reset delete confirmation
      setDeleteConfirm(null);
    } catch (err: any) {
      console.error('Error deleting testimonial:', err);
      setSubmitError(err.response?.data?.error || err.message || 'An error occurred while deleting the testimonial');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Set up form for editing a testimonial
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
          <h1 className="title">{editingId !== null ? 'Edit Testimonial' : 'Add Testimonial'}</h1>
          
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
              className="input feedback"
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
                : editingId !== null ? 'Update Testimonial' : 'Add Testimonial'}
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

        <div className="testimonials-list">
          <h2>Testimonials List</h2>
          
          {loading ? (
            <div className="loading">Loading testimonials...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : testimonials.length === 0 ? (
            <div className="empty-message">No testimonials available</div>
          ) : (
            <ul className="testimonials">
              {testimonials.map(testimonial => (
                <li key={testimonial.id} className="testimonial-item">
                  <div className="testimonial-info">
                    {testimonial.image && (
                      <div className="testimonial-image">
                        <img src={testimonial.image} alt={testimonial.name} />
                      </div>
                    )}
                    <div className="testimonial-details">
                      <h3 className="testimonial-name">{testimonial.name}</h3>
                      <div className="testimonial-role"><strong>Role:</strong> {testimonial.role}</div>
                      <div className="testimonial-feedback">
                        <strong>Feedback:</strong> 
                        <p>"{testimonial.feedback}"</p>
                      </div>
                    </div>
                  </div>
                  <div className="action-buttons">
                    <button 
                      className="edit-btn" 
                      onClick={() => handleEdit(testimonial)} 
                      disabled={submitLoading}
                    >
                      Edit
                    </button>
                    
                    {deleteConfirm === testimonial.id ? (
                      <div className="delete-confirm">
                        <span>Are you sure?</span>
                        <button 
                          className="confirm-yes" 
                          onClick={() => handleDelete(testimonial.id)}
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
                        onClick={() => setDeleteConfirm(testimonial.id)} 
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

  .feedback {
    resize: vertical;
    min-height: 8rem;
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

  .testimonials-list {
    background-color: #fff;
    padding: 2rem;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .testimonials-list h2 {
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

  .testimonials {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .testimonial-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1.5rem;
    border-bottom: 1px solid #f1f1f1;
    transition: background-color 0.2s ease;
  }

  .testimonial-item:last-child {
    border-bottom: none;
  }

  .testimonial-item:hover {
    background-color: #f9f9f9;
  }

  .testimonial-info {
    display: flex;
    gap: 1.5rem;
    flex: 1;
  }

  .testimonial-image {
    flex-shrink: 0;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    background-color: #f1f1f1;
  }

  .testimonial-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .testimonial-details {
    flex: 1;
  }

  .testimonial-name {
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
    margin: 0 0 0.5rem;
  }

  .testimonial-role {
    margin-bottom: 0.75rem;
    line-height: 1.5;
    color: #666;
  }

  .testimonial-feedback {
    line-height: 1.5;
  }

  .testimonial-feedback p {
    margin: 0.5rem 0 0;
    font-style: italic;
    color: #555;
    padding: 0.75rem;
    background-color: #f8f9fa;
    border-radius: 0.5rem;
    border-left: 4px solid #4a90e2;
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

    .testimonial-info {
      flex-direction: column;
      gap: 1rem;
    }

    .testimonial-image {
      width: 100%;
      height: auto;
      max-width: 120px;
      align-self: center;
    }

    .testimonial-item {
      flex-direction: column;
      gap: 1rem;
    }

    .action-buttons {
      flex-direction: row;
      width: 100%;
    }
  }
`;

export default Testimonials;