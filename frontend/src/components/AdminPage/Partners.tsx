import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import styled from 'styled-components';
import axios from 'axios';

interface Partner {
  id: number;
  name: string;
  description: string;
  website_link: string;
  image?: string;
}

interface FormData {
  name: string;
  description: string;
  website: string;
}

const Partners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    website: ''
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

  // Fetch partners data on component mount
  useEffect(() => {
    fetchPartners();
  }, []);

  // Function to fetch partners from API
  const fetchPartners = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/partners`, { headers });
      setPartners(response.data);
    } catch (err: any) {
      console.error('Error fetching partners:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load partners');
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
    setFormData({ name: '', description: '', website: '' });
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
      form.append('description', formData.description);
      form.append('website', formData.website);
      
      if (imageFile) {
        form.append('image', imageFile);
      }

      let response;
      
      if (editingId !== null) {
        // Update existing partner
        response = await axios.put(`${API_URL}/partners/${editingId}`, form, { headers });
        setSubmitSuccess('Partner updated successfully!');
      } else {
        // Create new partner
        response = await axios.post(`${API_URL}/partners`, form, { headers });
        setSubmitSuccess('New partner added successfully!');
      }

      // Update partners state
      if (editingId !== null) {
        setPartners(prev => prev.map(partner => 
          partner.id === editingId ? response.data : partner
        ));
      } else {
        setPartners(prev => [...prev, response.data]);
      }

      // Reset form after successful submission
      resetForm();
      
      // Refresh partners list to ensure we have latest data
      fetchPartners();
    } catch (err: any) {
      console.error('Error saving partner:', err);
      setSubmitError(err.response?.data?.error || err.message || 'An error occurred while saving the partner');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle deletion of a partner
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
      
      // Remove partner from state
      setPartners(prev => prev.filter(partner => partner.id !== id));
      setSubmitSuccess('Partner deleted successfully!');
      
      // Reset delete confirmation
      setDeleteConfirm(null);
    } catch (err: any) {
      console.error('Error deleting partner:', err);
      setSubmitError(err.response?.data?.error || err.message || 'An error occurred while deleting the partner');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Set up form for editing a partner
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
          <h1 className="title">{editingId !== null ? 'Edit Partner' : 'Add Partner'}</h1>
          
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
              className="input description"
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
                : editingId !== null ? 'Update Partner' : 'Add Partner'}
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

        <div className="partners-list">
          <h2>Partners List</h2>
          
          {loading ? (
            <div className="loading">Loading partners...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : partners.length === 0 ? (
            <div className="empty-message">No partners available</div>
          ) : (
            <ul className="partners">
              {partners.map(partner => (
                <li key={partner.id} className="partner-item">
                  <div className="partner-info">
                    {partner.image && (
                      <div className="partner-image">
                        <img src={partner.image} alt={partner.name} />
                      </div>
                    )}
                    <div className="partner-details">
                      <h3 className="partner-name">{partner.name}</h3>
                      <div className="partner-description">
                        <strong>Description:</strong> {partner.description}
                      </div>
                      {partner.website_link && (
                        <div className="partner-website">
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
                    <button 
                      className="edit-btn" 
                      onClick={() => handleEdit(partner)} 
                      disabled={submitLoading}
                    >
                      Edit
                    </button>
                    
                    {deleteConfirm === partner.id ? (
                      <div className="delete-confirm">
                        <span>Are you sure?</span>
                        <button 
                          className="confirm-yes" 
                          onClick={() => handleDelete(partner.id)}
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
                        onClick={() => setDeleteConfirm(partner.id)} 
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

  .partners-list {
    background-color: #fff;
    padding: 2rem;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .partners-list h2 {
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

  .partners {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .partner-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1.5rem;
    border-bottom: 1px solid #f1f1f1;
    transition: background-color 0.2s ease;
  }

  .partner-item:last-child {
    border-bottom: none;
  }

  .partner-item:hover {
    background-color: #f9f9f9;
  }

  .partner-info {
    display: flex;
    gap: 1.5rem;
    flex: 1;
  }

  .partner-image {
    flex-shrink: 0;
    width: 120px;
    height: 120px;
    border-radius: 0.5rem;
    overflow: hidden;
    background-color: #f1f1f1;
  }

  .partner-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .partner-details {
    flex: 1;
  }

  .partner-name {
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
    margin: 0 0 0.5rem;
  }

  .partner-description, .partner-website {
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }

  .partner-description {
    max-width: 500px;
  }

  .website-link {
    color: #4a90e2;
    text-decoration: none;
    word-break: break-all;
  }

  .website-link:hover {
    text-decoration: underline;
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

    .partner-info {
      flex-direction: column;
      gap: 1rem;
    }

    .partner-image {
      width: 100%;
      height: auto;
      max-width: 200px;
    }

    .partner-item {
      flex-direction: column;
      gap: 1rem;
    }

    .action-buttons {
      flex-direction: row;
      width: 100%;
    }
  }
`;

export default Partners;