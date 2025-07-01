// src/components/admin/AboutForm.tsx

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import useAbout, { AboutData } from '../../hooks/useAbout';
import './admin.css';
import Cookies from 'js-cookie';

interface AboutFormData {
  name: string;
  location: string;
  email: string;
  contact: string;
  description: string[];
}

const AboutForm = () => {
  const token = Cookies.get('adminToken');
  const { aboutData, loading, error, fetchAbout } = useAbout(token || null);

  const [formData, setFormData] = useState<AboutFormData>({
    name: '',
    location: '',
    email: '',
    contact: '',
    description: [''],
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [carouselFiles, setCarouselFiles] = useState<File[]>([]);
  const [carouselPreviews, setCarouselPreviews] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const API_URL = 'http://localhost:5000/api/admin';

  const headers = {
    'Authorization': `Bearer ${token}`
  };

  // Update form data when aboutData changes
  useEffect(() => {
    if (aboutData) {
      setFormData({
        name: aboutData.name || '',
        location: aboutData.location || '',
        email: aboutData.email || '',
        contact: aboutData.contact || '',
        description: aboutData.description && aboutData.description.length > 0 ? aboutData.description : [''],
      });

      // Set logo preview if exists
      if (aboutData.logo) {
        setLogoPreview(aboutData.logo);
      }

      // Set carousel previews if exist
      if (aboutData.carousel_pics && aboutData.carousel_pics.length > 0) {
        setCarouselPreviews(aboutData.carousel_pics);
      }

      // Set editing ID if data exists
      if (aboutData.id) {
        setEditingId(aboutData.id);
      }
    }
  }, [aboutData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      description: prev.description.map((desc, i) => i === index ? value : desc)
    }));
  };

  const addDescription = () => {
    setFormData(prev => ({
      ...prev,
      description: [...prev.description, '']
    }));
  };

  const removeDescription = (index: number) => {
    if (formData.description.length > 1) {
      setFormData(prev => ({
        ...prev,
        description: prev.description.filter((_, i) => i !== index)
      }));
    }
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
  };

  const handleCarouselChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setCarouselFiles(files);
      
      const previewUrls = files.map(file => URL.createObjectURL(file));
      setCarouselPreviews(previewUrls);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      email: '',
      contact: '',
      description: [''],
    });
    setLogoFile(null);
    setLogoPreview(null);
    setCarouselFiles([]);
    setCarouselPreviews([]);
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
      form.append('location', formData.location);
      form.append('email', formData.email);
      form.append('contact', formData.contact);
      
      // Add descriptions - filter out empty descriptions
      const validDescriptions = formData.description.filter(desc => desc && desc.trim());
      validDescriptions.forEach((desc, index) => {
        form.append(`description[${index}]`, desc.trim());
      });
      
      // Add logo if new file selected
      if (logoFile) {
        form.append('logo', logoFile);
      }
      
      // Add carousel images - append all files
      carouselFiles.forEach((file) => {
        form.append('carousel_pics', file);
      });

      const config = {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data'
        }
      };

      if (editingId) {
        // Update existing about data
        await axios.put(`${API_URL}/about`, form, config);
        setSubmitSuccess('About information updated successfully!');
      } else {
        // Create new about data
        await axios.post(`${API_URL}/about`, form, config);
        setSubmitSuccess('About information created successfully!');
      }

      // Clear file inputs after successful submission
      setLogoFile(null);
      setCarouselFiles([]);
      
      // Refresh data to get updated information
      await fetchAbout();
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(null);
      }, 5000);
    } catch (err: any) {
      console.error('Error saving about information:', err);
      setSubmitError(err.response?.data?.error || err.message || 'An error occurred while saving the about information');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCancel = () => {
    if (aboutData) {
      // Reset to existing data
      setFormData({
        name: aboutData.name || '',
        location: aboutData.location || '',
        email: aboutData.email || '',
        contact: aboutData.contact || '',
        description: aboutData.description && aboutData.description.length > 0 ? aboutData.description : [''],
      });
      setLogoFile(null);
      setLogoPreview(aboutData.logo || null);
      setCarouselFiles([]);
      setCarouselPreviews(aboutData.carousel_pics || []);
    } else {
      resetForm();
    }
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h1 className="title">{editingId ? 'Edit About Information' : 'Add About Information'}</h1>

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

        {loading ? (
          <div className="loading">Loading about information...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            <div className="form-group">
              <label htmlFor="name">Company Name</label>
              <input
                required
                type="text"
                id="name"
                className="input"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={submitLoading}
                placeholder="Enter company name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                required
                type="text"
                id="location"
                className="input"
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={submitLoading}
                placeholder="Enter company location"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                required
                type="email"
                id="email"
                className="input"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={submitLoading}
                placeholder="Enter email address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact">Contact Number</label>
              <input
                required
                type="text"
                id="contact"
                className="input"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                disabled={submitLoading}
                placeholder="Enter contact number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="logo">Company Logo</label>
              <input
                type="file"
                id="logo"
                accept="image/*"
                className="input file-input"
                onChange={handleLogoChange}
                disabled={submitLoading}
              />

              {logoPreview && (
                <div className="image-preview">
                  <img src={logoPreview} alt="Logo Preview" />
                </div>
              )}
            </div>

            {/* Descriptions Section */}
            <div className="form-group">
              <div className="section-header">
                <label>Company Descriptions</label>
                <button 
                  type="button" 
                  className="add-btn" 
                  onClick={addDescription}
                  disabled={submitLoading}
                >
                  Add Description
                </button>
              </div>
              
              {formData.description.map((desc, index) => (
                <div key={index} className="dynamic-field">
                  <textarea
                    className="input description"
                    value={desc}
                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                    disabled={submitLoading}
                    placeholder={`Enter description ${index + 1}`}
                    rows={3}
                  />
                  {formData.description.length > 1 && (
                    <button 
                      type="button" 
                      className="remove-btn" 
                      onClick={() => removeDescription(index)}
                      disabled={submitLoading}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Carousel Images Section */}
            <div className="form-group">
              <label htmlFor="carousel_pics">Carousel Images</label>
              <input
                type="file"
                id="carousel_pics"
                accept="image/*"
                multiple
                className="input file-input"
                onChange={handleCarouselChange}
                disabled={submitLoading}
              />

              {carouselPreviews.length > 0 && (
                <div className="carousel-preview">
                  {carouselPreviews.map((preview, index) => (
                    <div key={index} className="carousel-image">
                      <img src={preview} alt={`Carousel ${index + 1}`} />
                    </div>
                  ))}
                </div>
              )}

              {carouselFiles.length > 0 && (
                <button 
                  type="button" 
                  className="clear-btn" 
                  onClick={() => {
                    setCarouselFiles([]);
                    setCarouselPreviews(aboutData?.carousel_pics || []);
                  }}
                  disabled={submitLoading}
                >
                  Clear Selected Images
                </button>
              )}
            </div>

            <div className="button-group">
              <button className="submit" type="submit" disabled={submitLoading}>
                {submitLoading ? (editingId ? 'Updating...' : 'Creating...') : (editingId ? 'Update Information' : 'Create Information')}
              </button>

              <button className="cancel" type="button" onClick={handleCancel} disabled={submitLoading}>
                {editingId ? 'Cancel' : 'Reset'}
              </button>
            </div>
          </>
        )}
      </form>

      {/* Preview Section */}
      {!loading && !error && (
        <div className="list-container">
          <div className="list-header">
            <h2>Company Information Preview</h2>
          </div>

          {aboutData ? (
            <div className="preview-card">
              <div className="item-info">
                {logoPreview && (
                  <div className="item-image">
                    <img src={logoPreview} alt="Company Logo" />
                  </div>
                )}
                <div className="item-details">
                  <h3 className="item-title">{formData.name || 'Company Name'}</h3>
                  <div className="item-meta">
                    <strong>Location:</strong> {formData.location || 'Not set'}
                  </div>
                  <div className="item-meta">
                    <strong>Email:</strong> {formData.email || 'Not set'}
                  </div>
                  <div className="item-meta">
                    <strong>Contact:</strong> {formData.contact || 'Not set'}
                  </div>
                  <div className="item-meta">
                    <strong>Descriptions:</strong>
                    <div className="preview-descriptions">
                      {formData.description.filter(desc => desc && desc.trim()).length > 0 ? (
                        formData.description.filter(desc => desc && desc.trim()).map((desc, index) => (
                          <div key={index} className="description-item">
                            <strong>{index + 1}.</strong> {desc}
                          </div>
                        ))
                      ) : (
                        <span>No descriptions added</span>
                      )}
                    </div>
                  </div>
                  {carouselPreviews.length > 0 && (
                    <div className="item-meta">
                      <strong>Carousel Images:</strong>
                      <div className="carousel-preview">
                        {carouselPreviews.map((pic, index) => (
                          <div key={index} className="carousel-image">
                            <img src={pic} alt={`Carousel ${index + 1}`} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-message">No company information available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AboutForm;