// src/components/admin/Coaches.tsx

import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import useCoaches from '../../hooks/useCoaches';
import './admin.css';
import { Person, PersonFormData } from '../../types/coaches.type';
import Cookies from 'js-cookie';

const Coaches = () => {
  const token = Cookies.get('adminToken');
  const { coaches, players, loading, error, fetchCoaches, fetchPlayers, setCoaches, setPlayers, fetchAllCoaches, fetchAllPlayers } = useCoaches();

  const [formData, setFormData] = useState<PersonFormData>({
    name: '',
    role: '',
    category: 'Coach',
    age: '',
    jersey_no: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingCategory, setEditingCategory] = useState<'Coach' | 'Player'>('Coach');
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; category: 'Coach' | 'Player' } | null>(null);
  const [activeTab, setActiveTab] = useState<'Coach' | 'Player'>('Coach');

  const API_URL = 'http://localhost:5000/api/admin';

  const headers = {
    'Authorization': `Bearer ${token}`
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value,
      // Reset age when switching to Coach
      ...(name === 'category' && value === 'Coach' ? { age: '' } : {})
    }));
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
    setFormData({ name: '', role: '', category: 'Coach', age: '', jersey_no: '' });
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    setEditingCategory('Coach');
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

    // Validate age for players
    if (formData.category === 'Player' && !formData.age) {
      setSubmitError('Age category is required for players');
      return;
    }

    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('role', formData.role);
      formDataToSend.append('category', formData.category);
      if (formData.category === 'Player') {
        if (formData.age) formDataToSend.append('age', formData.age);
        if (formData.jersey_no) formDataToSend.append('jersey_no', formData.jersey_no);
      }

      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      let response;
      if (editingId !== null) {
        // Update existing coach/player
        response = await axios.put(
          `${API_URL}/${editingCategory.toLowerCase()}s/${editingId}`, 
          formDataToSend,
          { headers: { ...headers, 'Content-Type': 'multipart/form-data' } }
        );
      } else {
        // Add new coach/player
        response = await axios.post(
          `${API_URL}/${formData.category.toLowerCase()}es`,
          formDataToSend,
          { headers: { ...headers, 'Content-Type': 'multipart/form-data' } }
        );
      }

      const responseData = response.data;
      const updatedPerson: Person = {
        id: responseData.id,
        name: responseData.name,
        role: responseData.role,
        category: responseData.category,
        age: responseData.age,
        jersey_no: responseData.jersey_no,
        image: responseData.image,
        is_active: responseData.is_active
      };

      if (editingId !== null) {
        if (formData.category === 'Coach') {
          setCoaches(prev => prev.map(coach => coach.id === editingId ? updatedPerson : coach));
        } else {
          setPlayers(prev => prev.map(player => player.id === editingId ? updatedPerson : player));
        }
      } else {
        if (formData.category === 'Coach') {
          setCoaches(prev => [...prev, updatedPerson]);
        } else {
          setPlayers(prev => [...prev, updatedPerson]);
        }
      }

      resetForm();
      fetchCoaches();
      fetchPlayers();
    } catch (err: any) {
      console.error('Error saving person:', err);
      setSubmitError(err.response?.data?.error || err.message || `An error occurred while saving the ${formData.category.toLowerCase()}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: number, category: 'Coach' | 'Player') => {
    if (!token) {
      setSubmitError('You must be logged in to delete');
      return;
    }

    if (submitLoading) return;

    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const endpoint = category === 'Coach' ? 'coaches' : 'players';
      await axios.delete(`${API_URL}/${endpoint}/${id}`, { headers });

      if (category === 'Coach') {
        setCoaches(prev => prev.filter(coach => coach.id !== id));
      } else {
        setPlayers(prev => prev.filter(player => player.id !== id));
      }
      
      setSubmitSuccess(`${category} deleted successfully!`);
      setDeleteConfirm(null);
    } catch (err: any) {
      console.error('Error deleting:', err);
      setSubmitError(err.response?.data?.error || err.message || `An error occurred while deleting the ${category.toLowerCase()}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (person: Person) => {
    setFormData({
      name: person.name,
      role: person.role,
      category: person.category,
      age: person.age || '',
      jersey_no: person.jersey_no || ''
    });
    setEditingId(person.id);
    setEditingCategory(person.category);
    setImageFile(null);
    setImagePreview(person.image || null);
    setSubmitError(null);
    setSubmitSuccess(null);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    resetForm();
  };

  const currentList = activeTab === 'Coach' ? coaches : players;
  const currentLoading = loading;

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h1 className="title">
          {editingId !== null ? `Edit ${editingCategory}` : `Add ${formData.category}`}
        </h1>

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
          <label htmlFor="category">Category</label>
          <select
            required
            id="category"
            className="input"
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={submitLoading || editingId !== null}
          >
            <option value="Coach">Coach</option>
            <option value="Player">Player</option>
          </select>
        </div>

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
            placeholder={`Enter ${formData.category.toLowerCase()} name`}
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
            placeholder={`Enter ${formData.category.toLowerCase()} role (e.g. ${formData.category === 'Coach' ? 'Head Coach, Assistant Coach' : 'Forward, Defender, Goalkeeper'})`}
          />
        </div>

        {formData.category === 'Player' && (
        <div className="form-group">
          <label htmlFor="jersey_no">Jersey Number</label>
          <input
            required
            type="text"
            id="jersey_no"
            className="input"
            name="jersey_no"
            value={formData.jersey_no}
            onChange={handleChange}
            disabled={submitLoading}
            placeholder="Enter player's jersey number"
          />
        </div>
        )}

        {formData.category === 'Player' && (
          <div className="form-group">
            <label htmlFor="age">Age Category</label>
            <select
              required
              id="age"
              className="input"
              name="age"
              value={formData.age}
              onChange={handleChange}
              disabled={submitLoading}
            >
              <option value="">Select age category</option>
              <option value="under 10">Under 10</option>
              <option value="under 12">Under 12</option>
              <option value="under 14">Under 14</option>
              <option value="under 16">Under 16</option>
              <option value="under 18">Under 18</option>
              <option value="under 21">Under 21</option>
            </select>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="image">{formData.category} Image</label>
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
            {submitLoading ? (editingId !== null ? 'Updating...' : 'Submitting...') : (editingId !== null ? `Update ${editingCategory}` : `Add ${formData.category}`)}
          </button>

          {editingId !== null && (
            <button className="cancel" type="button" onClick={handleCancel} disabled={submitLoading}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="coaches-list">
        <div className="tab-buttons">
          <button 
            className={`tab-button ${activeTab === 'Coach' ? 'active' : ''}`}
            onClick={() => setActiveTab('Coach')}
            type="button"
          >
            Coaches ({coaches.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'Player' ? 'active' : ''}`}
            onClick={() => setActiveTab('Player')}
            type="button"
          >
            Players ({players.length})
          </button>
        </div>

        <h2>{activeTab}s List</h2>

        {currentLoading ? (
          <div className="loading">Loading {activeTab.toLowerCase()}s...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : currentList.length === 0 ? (
          <div className="empty-message">No {activeTab.toLowerCase()}s available</div>
        ) : (
          <ul className="coaches">
            {currentList.map(person => (
              <li key={person.id} className="coach-item">
                <div className="coach-info">
                  {person.image && (
                    <div className="item-image">
                      <img src={person.image} alt={person.name}  />
                    </div>
                  )}
                  <div className="coach-details">
                    <h3 className="coach-name">{person.name}</h3>
                    <div className="coach-role"><strong>Role:</strong> {person.role}</div>
                    <div className="coach-category"><strong>Category:</strong> {person.category}</div>
                    {person.category === 'Player' && person.age && (
                      <div className="coach-age"><strong>Age Category:</strong> {person.age}</div>
                    )}
                    {person.category === 'Player' && person.jersey_no && (
                      <div className="coach-jersey"><strong>Jersey Number:</strong> {person.jersey_no}</div>
                    )}
                    <div className="coach-status">
                      <strong>Status:</strong> 
                      <span className={`status ${person.is_active ? 'active' : 'inactive'}`}>
                        {person.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="action-buttons">
                  <button className="edit-btn" onClick={() => handleEdit(person)} disabled={submitLoading}>
                    Edit
                  </button>

                  {deleteConfirm?.id === person.id && deleteConfirm?.category === person.category ? (
                    <div className="delete-confirm">
                      <span>Are you sure?</span>
                      <button 
                        className="confirm-yes" 
                        onClick={() => handleDelete(person.id, person.category)} 
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
                      onClick={() => setDeleteConfirm({ id: person.id, category: person.category })} 
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
  );
};

export default Coaches;