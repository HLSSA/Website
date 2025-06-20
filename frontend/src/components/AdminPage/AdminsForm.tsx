import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import './admin.css';

import { Admin, AdminFormData } from '../../types/admin.type';

const Admins = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [formData, setFormData] = useState<AdminFormData>({
    username: '',
    password: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const API_URL = 'http://localhost:5000/api/admin';
  
  // Get token from localStorage and handle potential null value
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminToken');
    }
    return null;
  };

  // API headers with authorization
  const getHeaders = () => {
    const token = getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  // Fetch admins data on component mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  // Function to fetch admins from API
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getToken();
      if (!token) {
        setError('You must be logged in to view admins');
        return;
      }

      const response = await axios.get(`${API_URL}/admins`, { 
        headers: getHeaders() 
      });
      setAdmins(response.data || []);
    } catch (err: any) {
      console.error('Error fetching admins:', err);
      if (err.response?.status === 403) {
        setError('Authentication failed. Please log in again.');
      } else {
        setError(err.response?.data?.error || err.message || 'Failed to load admins');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Clear form and reset states
  const resetForm = () => {
    setFormData({ username: '', password: '' });
    setEditingId(null);
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const token = getToken();
    if (!token) {
      setSubmitError('You must be logged in to perform this action');
      return;
    }

    if (submitLoading) return;

    // Validate form data
    if (!formData.username.trim() || !formData.password.trim()) {
      setSubmitError('Username and password are required');
      return;
    }

    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      let response;
      
      if (editingId !== null) {
        // Update existing admin
        response = await axios.put(
          `${API_URL}/admins/${editingId}`, 
          formData, 
          { headers: getHeaders() }
        );
        setSubmitSuccess('Admin updated successfully!');
      } else {
        // Create new admin
        response = await axios.post(
          `${API_URL}/admins`, 
          formData, 
          { headers: getHeaders() }
        );
        setSubmitSuccess('New admin added successfully!');
      }

      // Reset form after successful submission
      resetForm();
      
      // Refresh admins list to ensure we have latest data
      await fetchAdmins();
    } catch (err: any) {
      console.error('Error saving admin:', err);
      if (err.response?.status === 403) {
        setSubmitError('Authentication failed. Please log in again.');
      } else if (err.response?.status === 409) {
        setSubmitError('Username already exists. Please choose a different username.');
      } else {
        setSubmitError(err.response?.data?.error || err.message || 'An error occurred while saving the admin');
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle deletion of an admin
  const handleDelete = async (id: string) => {
    const token = getToken();
    if (!token) {
      setSubmitError('You must be logged in to delete admins');
      return;
    }

    if (submitLoading) return;

    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      await axios.delete(`${API_URL}/admins/${id}`, { 
        headers: getHeaders() 
      });
      
      setSubmitSuccess('Admin deleted successfully!');
      
      // Reset delete confirmation
      setDeleteConfirm(null);

      // Refresh admins list
      await fetchAdmins();
    } catch (err: any) {
      console.error('Error deleting admin:', err);
      if (err.response?.status === 403) {
        setSubmitError('Authentication failed. Please log in again.');
      } else if (err.response?.status === 400) {
        setSubmitError(err.response?.data?.error || 'Cannot delete admin');
      } else {
        setSubmitError(err.response?.data?.error || err.message || 'An error occurred while deleting the admin');
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  // Set up form for editing an admin
  const handleEdit = (admin: Admin) => {
    setFormData({
      username: admin.username,
      password: '' // Don't pre-fill password for security
    });
    setEditingId(admin.id);
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
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h1 className="title">{editingId !== null ? 'Edit Admin' : 'Add Admin'}</h1>
        
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
          <label htmlFor="username">Username</label>
          <input
            required
            type="text"
            id="username"
            className="input"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={submitLoading}
            placeholder="Enter admin username"
            minLength={3}
            maxLength={50}
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            required
            type="password"
            id="password"
            className="input"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={submitLoading}
            placeholder={editingId ? "Enter new password" : "Enter password"}
            minLength={6}
          />
        </div>
  
        <div className="button-group">
          <button 
            className="submit" 
            type="submit" 
            disabled={submitLoading || !getToken()}
          >
            {submitLoading
              ? editingId !== null ? 'Updating...' : 'Submitting...'
              : editingId !== null ? 'Update Admin' : 'Add Admin'}
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
  
      <div className="list-container">
        <h2>Admins List</h2>
        
        {loading ? (
          <div className="loading">Loading admins...</div>
        ) : error ? (
          <div className="error-message">
            {error}
            {error.includes('logged in') && (
              <button 
                className="secondary-btn" 
                onClick={() => window.location.reload()}
                style={{ marginLeft: '10px', padding: '5px 10px', fontSize: '12px' }}
              >
                Refresh
              </button>
            )}
          </div>
        ) : admins.length === 0 ? (
          <div className="empty-message">No admins available</div>
        ) : (
          <ul className="items-list">
            {admins.map(admin => (
              <li key={admin.id} className="list-item">
                <div className="item-info">
                  <div className="item-details">
                    <h3 className="item-title">{admin.username}</h3>
                    <div className="item-meta">
                      <strong>ID:</strong> {admin.id}
                    </div>
                  </div>
                </div>
                <div className="action-buttons">
                  <button 
                    className="edit-btn" 
                    onClick={() => handleEdit(admin)} 
                    disabled={submitLoading || !getToken()}
                  >
                    Edit
                  </button>
                  
                  {deleteConfirm === admin.id ? (
                    <div className="delete-confirm">
                      <span>Are you sure?</span>
                      <button 
                        className="confirm-yes" 
                        onClick={() => handleDelete(admin.id)}
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
                      onClick={() => setDeleteConfirm(admin.id)} 
                      disabled={submitLoading || !getToken()}
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
  );
};

export default Admins;