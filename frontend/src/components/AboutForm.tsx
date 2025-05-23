import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import styled from 'styled-components';
import axios from 'axios';

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
    carousel_pics: ['']
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [carouselFiles, setCarouselFiles] = useState<(File | null)[]>([null]);
  const [carouselPreviews, setCarouselPreviews] = useState<(string | null)[]>([null]);
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
      
      const response = await axios.get(`${API_URL}/about`, { headers });
      const data = response.data;
      
      setFormData({
        name: data.name || '',
        location: data.location || '',
        logo: data.logo || '',
        email: data.email || '',
        contact: data.contact || '',
        description: data.description && data.description.length > 0 ? data.description : [''],
        carousel_pics: data.carousel_pics && data.carousel_pics.length > 0 ? data.carousel_pics : ['']
      });

      // Set logo preview if exists
      if (data.logo) {
        setLogoPreview(data.logo);
      }

      // Set carousel previews if exist
      if (data.carousel_pics && data.carousel_pics.length > 0) {
        setCarouselPreviews(data.carousel_pics.map((pic: string) => pic || null));
        setCarouselFiles(new Array(data.carousel_pics.length).fill(null));
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

  // Handle carousel image file selection
  const handleCarouselChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Update carousel files array
      const newCarouselFiles = [...carouselFiles];
      newCarouselFiles[index] = file;
      setCarouselFiles(newCarouselFiles);
      
      // Create preview URL and update previews array
      const previewUrl = URL.createObjectURL(file);
      const newCarouselPreviews = [...carouselPreviews];
      newCarouselPreviews[index] = previewUrl;
      setCarouselPreviews(newCarouselPreviews);
    }
  };

  // Add new carousel image field
  const addCarouselImage = () => {
    setCarouselFiles(prev => [...prev, null]);
    setCarouselPreviews(prev => [...prev, null]);
    setFormData(prev => ({
      ...prev,
      carousel_pics: [...prev.carousel_pics, '']
    }));
  };

  // Remove carousel image field
  const removeCarouselImage = (index: number) => {
    if (carouselFiles.length > 1) {
      setCarouselFiles(prev => prev.filter((_, i) => i !== index));
      setCarouselPreviews(prev => prev.filter((_, i) => i !== index));
      setFormData(prev => ({
        ...prev,
        carousel_pics: prev.carousel_pics.filter((_, i) => i !== index)
      }));
    }
  };

  // Reset form to original data
  const resetForm = () => {
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
      const form = new FormData();
      form.append('name', formData.name);
      form.append('location', formData.location);
      form.append('email', formData.email);
      form.append('contact', formData.contact);
      
      // Add descriptions array
      formData.description.forEach((desc, index) => {
        if (desc.trim()) {
          form.append(`description[${index}]`, desc);
        }
      });
      
      // Add logo if new file selected
      if (logoFile) {
        form.append('logo', logoFile);
      }
      
      // Add carousel images
      carouselFiles.forEach((file, index) => {
        if (file) {
          form.append(`carousel_pics[${index}]`, file);
        }
      });

      const response = await axios.put(`${API_URL}/about`, form, { 
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSubmitSuccess('About information updated successfully!');
      
      // Refresh data to get updated URLs
      fetchAboutData();
    } catch (err: any) {
      console.error('Error updating about information:', err);
      setSubmitError(err.response?.data?.error || err.message || 'An error occurred while updating the about information');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <StyledWrapper>
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
                
                {/* Logo preview */}
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
                <div className="section-header">
                  <label>Carousel Images</label>
                  <button 
                    type="button" 
                    className="add-btn" 
                    onClick={addCarouselImage}
                    disabled={submitLoading}
                  >
                    Add Image
                  </button>
                </div>
                
                {carouselFiles.map((file, index) => (
                  <div key={index} className="dynamic-field">
                    <input
                      type="file"
                      accept="image/*"
                      className="input file-input"
                      onChange={(e) => handleCarouselChange(index, e)}
                      disabled={submitLoading}
                    />
                    
                    {/* Carousel image preview */}
                    {carouselPreviews[index] && (
                      <div className="image-preview">
                        <img src={carouselPreviews[index]} alt={`Carousel Preview ${index + 1}`} />
                      </div>
                    )}
                    
                    {carouselFiles.length > 1 && (
                      <button 
                        type="button" 
                        className="remove-btn" 
                        onClick={() => removeCarouselImage(index)}
                        disabled={submitLoading}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
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
                <div className="preview-value">{formData.name}</div>
              </div>
              <div className="preview-item">
                <div className="preview-label">Location:</div>
                <div className="preview-value">{formData.location}</div>
              </div>
              <div className="preview-item">
                <div className="preview-label">Email:</div>
                <div className="preview-value">{formData.email}</div>
              </div>
              <div className="preview-item">
                <div className="preview-label">Contact:</div>
                <div className="preview-value">{formData.contact}</div>
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
                  {formData.description.filter(desc => desc.trim()).map((desc, index) => (
                    <div key={index} className="description-item">
                      <strong>{index + 1}.</strong> {desc}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="preview-item">
                <div className="preview-label">Carousel Images:</div>
                <div className="carousel-preview">
                  {carouselPreviews.filter(preview => preview).map((preview, index) => (
                    <div key={index} className="carousel-image">
                      <img src={preview} alt={`Carousel ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
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

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .section-header label {
    margin-bottom: 0;
    font-weight: 600;
    font-size: 1.1rem;
    color: #333;
  }

  .add-btn {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.35rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .add-btn:hover:not(:disabled) {
    background-color: #218838;
  }

  .dynamic-field {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    margin-bottom: 1rem;
    padding: 1rem;
    border: 1px solid #e9ecef;
    border-radius: 0.5rem;
    background-color: #f8f9fa;
  }

  .dynamic-field .input {
    flex: 1;
    margin-bottom: 0;
  }

  .remove-btn {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.35rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
    flex-shrink: 0;
    align-self: flex-start;
  }

  .remove-btn:hover:not(:disabled) {
    background-color: #c82333;
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
    min-height: 4rem;
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

  .submit:disabled, .cancel:disabled, .add-btn:disabled, .remove-btn:disabled {
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

  .loading {
    padding: 1.5rem;
    text-align: center;
    color: #666;
    font-style: italic;
  }

  .preview-section {
    background-color: #fff;
    padding: 2rem;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .preview-section h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #f1f1f1;
  }

  .preview-card {
    background-color: #f9f9f9;
    border-radius: 0.5rem;
    padding: 1.5rem;
    border: 1px solid #eee;
  }

  .preview-item {
    display: flex;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eee;
  }

  .preview-item:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }

  .preview-label {
    font-weight: 600;
    color: #555;
    width: 150px;
    flex-shrink: 0;
  }

  .preview-value {
    flex: 1;
    color: #333;
  }

  .preview-logo {
    max-width: 150px;
  }

  .preview-logo img {
    width: 100%;
    height: auto;
    border-radius: 0.35rem;
  }

  .preview-descriptions {
    flex: 1;
  }

  .description-item {
    margin-bottom: 0.75rem;
    line-height: 1.5;
  }

  .description-item:last-child {
    margin-bottom: 0;
  }

  .carousel-preview {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    flex: 1;
  }

  .carousel-image {
    width: 150px;
    height: 100px;
    border-radius: 0.35rem;
    overflow: hidden;
    border: 1px solid #ddd;
  }

  .carousel-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    .dynamic-field {
      flex-direction: column;
      align-items: stretch;
    }

    .remove-btn {
      align-self: flex-start;
      margin-top: 0.5rem;
    }

    .preview-item {
      flex-direction: column;
    }

    .preview-label {
      width: 100%;
      margin-bottom: 0.25rem;
    }

    .section-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .carousel-preview {
      flex-direction: column;
    }

    .carousel-image {
      width: 100%;
      max-width: 300px;
    }
  }
`;

export default AboutForm;