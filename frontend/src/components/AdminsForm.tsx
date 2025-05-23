import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import styled from 'styled-components';
import axios from 'axios';

interface Admin {
  id: string;
  username: string;
  password?: string;
}

interface FormData {
  username: string;
  password: string;
}

const Admins = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [formData, setFormData] = useState<FormData>({
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
    <StyledWrapper>
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

        <div className="admins-list">
          <h2>Admins List</h2>
          
          {loading ? (
            <div className="loading">Loading admins...</div>
          ) : error ? (
            <div className="error-message">
              {error}
              {error.includes('logged in') && (
                <button 
                  className="retry-btn" 
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
            <ul className="admins">
              {admins.map(admin => (
                <li key={admin.id} className="admin-item">
                  <div className="admin-info">
                    <div className="admin-details">
                      <h3 className="admin-username">{admin.username}</h3>
                      <div className="admin-id">
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
    box-sizing: border-box;
  }

  .input:focus {
    border-color: #4a90e2;
    outline: none;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
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
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .success-message {
    background-color: #e6f7ed;
    color: #2e7d32;
    padding: 0.75rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    border-left: 4px solid #2e7d32;
  }

  .retry-btn {
    background-color: #d32f2f;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }

  .retry-btn:hover {
    background-color: #b71c1c;
  }

  .admins-list {
    background-color: #fff;
    padding: 2rem;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .admins-list h2 {
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

  .admins {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .admin-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1.5rem;
    border-bottom: 1px solid #f1f1f1;
    transition: background-color 0.2s ease;
  }

  .admin-item:last-child {
    border-bottom: none;
  }

  .admin-item:hover {
    background-color: #f9f9f9;
  }

  .admin-info {
    display: flex;
    gap: 1.5rem;
    flex: 1;
  }

  .admin-details {
    flex: 1;
  }

  .admin-username {
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
    margin: 0 0 0.5rem;
  }

  .admin-id {
    margin-bottom: 0.5rem;
    line-height: 1.5;
    color: #666;
    font-size: 0.9rem;
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

  .edit-btn:disabled, .delete-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    .admin-info {
      flex-direction: column;
      gap: 1rem;
    }

    .admin-item {
      flex-direction: column;
      gap: 1rem;
    }

    .action-buttons {
      flex-direction: row;
      width: 100%;
    }
  }
`;

export default Admins;