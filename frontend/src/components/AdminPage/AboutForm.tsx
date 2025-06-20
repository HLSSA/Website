import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import './admin.css';

interface AboutData {
  name: string;
  location: string;
  logo: string;
  email: string;
  contact: string;
  description: string[];
  carousel_pics: string[];
}

const AboutForm = () => {
  const [formData, setFormData] = useState<AboutData>({
    name: '',
    location: '',
    logo: '',
    email: '',
    contact: '',
    description: [''],
    carousel_pics: []
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [carouselFiles, setCarouselFiles] = useState<File[]>([]);
  const [carouselPreviews, setCarouselPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const API_URL = 'http://localhost:5000/api/admin';
  const token = localStorage.getItem('adminToken');

  // API headers with authorization
  const headers = {
    'Authorization': `Bearer ${token}`
  };

  // Fetch about data on component mount
  useEffect(() => {
    fetchAboutData();
  }, []);

  // Function to fetch about data from API
  const fetchAboutData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/about`);
      const data = response.data;
      
      setFormData({
        name: data.name || '',
        location: data.location || '',
        logo: data.logo || '',
        email: data.email || '',
        contact: data.contact || '',
        description: data.description && data.description.length > 0 ? data.description : [''],
        carousel_pics: data.carousel_pics || []
      });

      // Set logo preview if exists
      if (data.logo) {
        setLogoPreview(data.logo);
      }

      // Set carousel previews if exist
      if (data.carousel_pics && data.carousel_pics.length > 0) {
        setCarouselPreviews(data.carousel_pics);
      }
    } catch (err: any) {
      console.error('Error fetching about data:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load about information');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle description changes
  const handleDescriptionChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      description: prev.description.map((desc, i) => i === index ? value : desc)
    }));
  };

  // Add new description field
  const addDescription = () => {
    setFormData(prev => ({
      ...prev,
      description: [...prev.description, '']
    }));
  };

  // Remove description field
  const removeDescription = (index: number) => {
    if (formData.description.length > 1) {
      setFormData(prev => ({
        ...prev,
        description: prev.description.filter((_, i) => i !== index)
      }));
    }
  };

  // Handle logo file selection
  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Create preview URL for selected image
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
  };

  // Handle carousel image files selection (multiple files at once)
  const handleCarouselChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setCarouselFiles(files);
      
      // Create preview URLs for all selected images
      const previewUrls = files.map(file => URL.createObjectURL(file));
      setCarouselPreviews(previewUrls);
    }
  };

  // Remove individual carousel image
  const removeCarouselImage = (index: number) => {
    // Remove from existing carousel_pics if it's an existing image
    if (index < formData.carousel_pics.length) {
      setFormData(prev => ({
        ...prev,
        carousel_pics: prev.carousel_pics.filter((_, i) => i !== index)
      }));
    }
    
    // Remove from new files and previews
    const newFileIndex = index - formData.carousel_pics.length;
    if (newFileIndex >= 0) {
      setCarouselFiles(prev => prev.filter((_, i) => i !== newFileIndex));
      setCarouselPreviews(prev => {
        const existingCount = formData.carousel_pics.length;
        const newPreviews = [...prev];
        newPreviews.splice(existingCount + newFileIndex, 1);
        return newPreviews;
      });
    } else {
      // Remove existing image preview
      setCarouselPreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Reset form to original data
  const resetForm = () => {
    setLogoFile(null);
    setCarouselFiles([]);
    setCarouselPreviews([]);
    fetchAboutData();
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  // Handle form submission
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
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('contact', formData.contact);
      
      // Add descriptions - filter out empty descriptions
      const validDescriptions = formData.description.filter(desc => desc && desc.trim());
      validDescriptions.forEach((desc, index) => {
        formDataToSend.append(`description[${index}]`, desc.trim());
      });
      
      // Add logo if new file selected
      if (logoFile) {
        formDataToSend.append('logo', logoFile);
      }
      
      // Add carousel images - append all files with the same field name as expected by multer
      carouselFiles.forEach((file) => {
        formDataToSend.append('carousel_pics', file);
      });

      const response = await axios.put(`${API_URL}/about`, formDataToSend, { 
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSubmitSuccess('About information updated successfully!');
      
      // Clear file inputs after successful submission
      setLogoFile(null);
      setCarouselFiles([]);
      
      // Refresh data to get updated URLs
      await fetchAboutData();
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(null);
      }, 5000);
    } catch (err: any) {
      console.error('Error updating about information:', err);
      setSubmitError(err.response?.data?.error || err.message || 'An error occurred while updating the about information');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Get all carousel previews (existing + new)
  const getAllCarouselPreviews = () => {
    const existingPreviews = formData.carousel_pics || [];
    const newPreviews = carouselFiles.map(file => URL.createObjectURL(file));
    return [...existingPreviews, ...newPreviews];
  };

  return (
      <div className="container">
        <form className="form" onSubmit={handleSubmit}>
          <h1 className="title">About Information</h1>
          
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

          {/* Loading state */}
          {loading ? (
            <div className="loading">Loading about information...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="name">Company Name *</label>
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
                <label htmlFor="location">Location *</label>
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
                <label htmlFor="email">Email Address *</label>
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
                <label htmlFor="contact">Contact Number *</label>
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
                <small className="field-note">
                  {logoFile ? 'New logo selected' : 'Select a new logo to replace the current one'}
                </small>
                
                {/* Logo preview */}
                {logoPreview && (
                  <div className="image-preview">
                    <img src={logoPreview} alt="Logo Preview" />
                    <div className="preview-label">
                      {logoFile ? 'New Logo (Preview)' : 'Current Logo'}
                    </div>
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
                <div className="section-header">
                  <label>Carousel Images</label>
                </div>
                
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="input file-input"
                  onChange={handleCarouselChange}
                  disabled={submitLoading}
                />
                <small className="field-note">
                  {carouselFiles.length > 0 
                    ? `${carouselFiles.length} new image(s) selected. These will replace all existing carousel images.`
                    : 'Select multiple images for the carousel. This will replace all existing images.'
                  }
                </small>

                {/* Display existing carousel images */}
                {formData.carousel_pics.length > 0 && carouselFiles.length === 0 && (
                  <div className="existing-images">
                    <h4>Current Carousel Images:</h4>
                    <div className="carousel-preview">
                      {formData.carousel_pics.map((pic, index) => (
                        <div key={index} className="carousel-image">
                          <img src={pic} alt={`Current Carousel ${index + 1}`} />
                          <div className="image-label">Image {index + 1}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Display new carousel image previews */}
                {carouselFiles.length > 0 && (
                  <div className="new-images">
                    <h4>New Carousel Images (Preview):</h4>
                    <div className="carousel-preview">
                      {carouselFiles.map((file, index) => (
                        <div key={index} className="carousel-image">
                          <img src={URL.createObjectURL(file)} alt={`New Carousel ${index + 1}`} />
                          <div className="image-label">New Image {index + 1}</div>
                        </div>
                      ))}
                    </div>
                    <button 
                      type="button" 
                      className="clear-btn" 
                      onClick={() => {
                        setCarouselFiles([]);
                        setCarouselPreviews([]);
                      }}
                      disabled={submitLoading}
                    >
                      Clear Selected Images
                    </button>
                  </div>
                )}
              </div>

              <div className="button-group">
                <button 
                  className="submit" 
                  type="submit" 
                  disabled={submitLoading}
                >
                  {submitLoading ? 'Updating...' : 'Update Information'}
                </button>
                
                <button 
                  className="cancel" 
                  type="button" 
                  onClick={resetForm}
                  disabled={submitLoading}
                >
                  Reset
                </button>
              </div>
            </>
          )}
        </form>
        
        {!loading && !error && (
          <div className="preview-section">
            <h2>Company Information Preview</h2>
            <div className="preview-card">
              <div className="preview-item">
                <div className="preview-label">Company Name:</div>
                <div className="preview-value">{formData.name || 'Not set'}</div>
              </div>
              <div className="preview-item">
                <div className="preview-label">Location:</div>
                <div className="preview-value">{formData.location || 'Not set'}</div>
              </div>
              <div className="preview-item">
                <div className="preview-label">Email:</div>
                <div className="preview-value">{formData.email || 'Not set'}</div>
              </div>
              <div className="preview-item">
                <div className="preview-label">Contact:</div>
                <div className="preview-value">{formData.contact || 'Not set'}</div>
              </div>
              
              {logoPreview && (
                <div className="preview-item">
                  <div className="preview-label">Logo:</div>
                  <div className="preview-logo">
                    <img src={logoPreview} alt="Company Logo" />
                  </div>
                </div>
              )}
              
              <div className="preview-item">
                <div className="preview-label">Descriptions:</div>
                <div className="preview-descriptions">
                  {formData.description.filter(desc => desc && desc.trim()).length > 0 ? (
                    formData.description.filter(desc => desc && desc.trim()).map((desc, index) => (
                      <div key={index} className="description-item">
                        <strong>{index + 1}.</strong> {desc}
                      </div>
                    ))
                  ) : (
                    <div className="no-content">No descriptions added</div>
                  )}
                </div>
              </div>
              
              <div className="preview-item">
                <div className="preview-label">Carousel Images:</div>
                <div className="carousel-preview">
                  {carouselFiles.length > 0 ? (
                    // Show new images if selected
                    carouselFiles.map((file, index) => (
                      <div key={index} className="carousel-image">
                        <img src={URL.createObjectURL(file)} alt={`New Carousel ${index + 1}`} />
                      </div>
                    ))
                  ) : formData.carousel_pics.length > 0 ? (
                    // Show existing images
                    formData.carousel_pics.map((pic, index) => (
                      <div key={index} className="carousel-image">
                        <img src={pic} alt={`Carousel ${index + 1}`} />
                      </div>
                    ))
                  ) : (
                    <div className="no-content">No carousel images</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
  );
};

export default AboutForm;