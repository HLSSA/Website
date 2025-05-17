import React, { useState } from 'react';
import axios from 'axios';

// Styled components for better type safety
import styled from 'styled-components';

// Type definition for form data
interface PartnerFormData {
  name: string;
  description: string;
  image: File | null;
}

const PartnerForm: React.FC = () => {
  // State management with type safety
  const [formData, setFormData] = useState<PartnerFormData>({
    name: '',
    description: '',
    image: null
  });

  // Image preview state
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Error state for form submission
  const [error, setError] = useState<string | null>(null);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Handle file input separately
    if (name === 'image') {
      const fileInput = e.target as HTMLInputElement;
      const file = fileInput.files?.[0] || null;
      
      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create image preview
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      // Handle text inputs
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validate form data
    if (!formData.name || !formData.description || !formData.image) {
      setError('Please fill in all fields and upload an image.');
      setIsLoading(false);
      return;
    }

    try {
      // Prepare form data for multipart/form-data
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      if (formData.image) {
        data.append('image', formData.image);
      }

      // Hard-coded token (replace with actual token retrieval in production)
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzQ3MDQ5NzY1LCJleHAiOjE3NDcwNTY5NjV9.phchfaj3Xa3kOzsuqYwXDISNNBivKu-HbMebxEyUvBE";

      // Submission to backend
      const response = await axios.post(
        'http://localhost:5000/api/admin/partners', 
        data, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
          // Add timeout to handle potential network issues
          timeout: 10000
        }
      );

      // Success handling
      console.log('Upload success:', response.data);
      alert('Partner added successfully!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        image: null
      });
      setImagePreview(null);

    } catch (error) {
      // Comprehensive error handling
      if (axios.isAxiosError(error)) {
        // Network error or server responded with an error status
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const errorMsg = error.response.data?.message || 
                           error.response.data?.error || 
                           'Failed to add partner.';
          
          console.error('Server Error:', {
            status: error.response.status,
            data: error.response.data
          });
          
          setError(errorMsg);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received:', error.request);
          setError('No response from server. Please check your network connection.');
        } else {
          // Something happened in setting up the request
          console.error('Error setting up request:', error.message);
          setError('An error occurred while preparing the request.');
        }
      } else {
        // Handle non-Axios errors
        console.error('Unexpected error:', error);
        setError('An unexpected error occurred.');
      }
    } finally {
      // Ensure loading state is reset
      setIsLoading(false);
    }
  };

  return (
    <StyledWrapper>
      <section className="container">
        <header>Add Partners</header>
        {error && <div className="error-message">{error}</div>}
        <form className="form" onSubmit={handleSubmit}>
          <div className="input-box">
            <label>Partner Name</label>
            <input
              required
              placeholder="Enter partner name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <div className="input-box">
            <label>Description</label>
            <textarea
              required
              placeholder="Enter description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isLoading}
            ></textarea>
          </div>
          <div className="input-box">
            <label>Upload Image</label>
            <input
              required
              type="file"
              accept="image/*"
              name="image"
              onChange={handleChange}
              disabled={isLoading}
            />
            {imagePreview && (
              <div className="image-preview">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="preview-image" 
                />
              </div>
            )}
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </section>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .container {
    position: relative;
    max-width: 500px;
    width: 100%;
    background: #FCEDDA;
    padding: 25px;
    border-radius: 8px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  }

  .error-message {
    color: red;
    background: #ffeeee;
    padding: 10px;
    margin-bottom: 15px;
    border-radius: 4px;
    text-align: center;
  }

  .container header {
    font-size: 1.4rem;
    color: #000;
    font-weight: 600;
    text-align: center;
    margin-bottom: 15px;
  }

  .form .input-box {
    width: 100%;
    margin-top: 15px;
  }

  .input-box label {
    color: #000;
    font-weight: 500;
  }

  .input-box input,
  .input-box textarea {
    position: relative;
    width: 100%;
    outline: none;
    font-size: 1rem;
    color: #333;
    margin-top: 8px;
    border: 1px solid #EE4E34;
    border-radius: 6px;
    padding: 10px 15px;
    background: #fff;
    transition: opacity 0.3s;
  }

  .input-box input:disabled,
  .input-box textarea:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .input-box textarea {
    resize: vertical;
    min-height: 100px;
  }

  .image-preview {
    margin-top: 10px;
    text-align: center;
  }

  .preview-image {
    max-width: 100%;
    max-height: 300px;
    border-radius: 6px;
    object-fit: cover;
  }

  .form button {
    height: 40px;
    width: 100%;
    color: #fff;
    font-size: 1rem;
    font-weight: 500;
    margin-top: 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    background: #EE4E34;
    transition: background 0.3s;
  }

  .form button:disabled {
    background: #d43d28;
    opacity: 0.6;
    cursor: not-allowed;
  }

  .form button:hover:not(:disabled) {
    background: #d43d28;
  }
`;

export default PartnerForm;