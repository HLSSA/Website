// src/components/admin/News.tsx

import { useState, ChangeEvent, FormEvent, useEffect, useRef } from 'react';
import axios from 'axios';
import useNews from '../../hooks/useNews';
import './admin.css';
import { NewsArticle, NewsFormData } from '../../types/news.type';

const News = () => {
  const token = localStorage.getItem('adminToken');
  const { news, loading, error, fetchNews, setNews } = useNews(token);
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState<NewsFormData>({
    title: '',
    excerpt: '',
    author: '',
    category: '',
    fullStory: '',
    article_url: '',
    featured: false,
    isactive: true
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [contentType, setContentType] = useState<'fullStory' | 'article_url'>('fullStory');

  const API_URL = 'http://localhost:5000/api/admin';

  const headers = {
    'Authorization': `Bearer ${token}`
  };

  // Cleanup for Image Preview URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);

      // Clean up the old preview URL if it exists
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleContentTypeToggle = (type: 'fullStory' | 'article_url') => {
    setContentType(type);
    if (type === 'fullStory') {
      setFormData(prev => ({ ...prev, article_url: '' }));
    } else {
      setFormData(prev => ({ ...prev, fullStory: '' }));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      author: '',
      category: '',
      fullStory: '',
      article_url: '',
      featured: false,
      isactive: true
    });
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    setSubmitError(null);
    setSubmitSuccess(null);
    setContentType('fullStory');
    formRef.current?.reset(); // Natively reset the form, clearing the file input
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!token) {
      setSubmitError('You must be logged in to perform this action.');
      return;
    }

    // --- Added Client-Side Validation ---
    if (!formData.title.trim() || !formData.excerpt.trim() || !formData.author.trim() || !formData.category) {
        setSubmitError('Please fill out all required fields: Title, Excerpt, Author, and Category.');
        return;
    }
    if (contentType === 'article_url') {
        try {
            new URL(formData.article_url);
        } catch {
            setSubmitError('Please enter a valid URL for the external article.');
            return;
        }
    }
    // --- End Validation ---

    if (submitLoading) return;

    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const form = new FormData();
      form.append('title', formData.title.trim());
      form.append('excerpt', formData.excerpt.trim());
      form.append('author', formData.author.trim());
      form.append('category', formData.category);
      form.append('featured', String(formData.featured));
      form.append('isactive', String(formData.isactive));
      form.append('date', new Date().toTimeString().split(' ')[0]);


      if (contentType === 'fullStory') {
        form.append('fullStory', formData.fullStory.trim());
      } else {
        form.append('article_url', formData.article_url.trim());
      }

      if (imageFile) {
        form.append('image', imageFile);
      }

      let response;
      if (editingId !== null) {
        response = await axios.put(`${API_URL}/news/${editingId}`, form, { headers });
        setSubmitSuccess('News article updated successfully!');
      } else {
        response = await axios.post(`${API_URL}/news`, form, { headers });
        setSubmitSuccess('New article added successfully!');
      }

      // --- Simplified state update using direct response data ---
      const updatedArticle: NewsArticle = response.data;

      if (editingId !== null) {
        setNews(prev => prev.map(article => (article.id === editingId ? updatedArticle : article)));
      } else {
        setNews(prev => [updatedArticle, ...prev]);
      }

      resetForm();
    } catch (err: any) {
      console.error('Error saving news article:', err);
      setSubmitError(err.response?.data?.error || 'An error occurred while saving the article.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) {
      setSubmitError('You must be logged in to delete articles.');
      return;
    }

    if (submitLoading) return;

    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      await axios.delete(`${API_URL}/news/${id}`, { headers });

      setNews(prev => prev.filter(article => article.id !== id));
      setSubmitSuccess('Article deleted successfully!');
      setDeleteConfirm(null);
    } catch (err: any) {
      console.error('Error deleting news article:', err);
      setSubmitError(err.response?.data?.error || 'An error occurred while deleting the article.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (article: NewsArticle) => {
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      author: article.author,
      category: article.category,
      fullStory: article.fullStory || '',
      article_url: article.article_url || '',
      featured: article.featured,
      isactive: article.isactive
    });
    setEditingId(article.id);
    setImageFile(null);
    setImagePreview(article.image || null);
    setSubmitError(null);
    setSubmitSuccess(null);
    setContentType(article.article_url ? 'article_url' : 'fullStory');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    resetForm();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit} ref={formRef}>
        <h1 className="title">{editingId !== null ? 'Edit News Article' : 'Add News Article'}</h1>

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
          <label htmlFor="title">Title *</label>
          <input
            required
            type="text"
            id="title"
            className="input"
            name="title"
            value={formData.title}
            onChange={handleChange}
            disabled={submitLoading}
            placeholder="Enter article title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="excerpt">Short Description *</label>
          <textarea
            required
            id="excerpt"
            className="input description"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            disabled={submitLoading}
            placeholder="Enter a short description of the article"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="author">Author *</label>
          <input
            required
            type="text"
            id="author"
            className="input"
            name="author"
            value={formData.author}
            onChange={handleChange}
            disabled={submitLoading}
            placeholder="Enter author name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            required
            id="category"
            className="input"
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={submitLoading}
          >
            <option value="">Select category</option>
            <option value="Academy">Academy</option>
            <option value="Facilities">Facilities</option>
            <option value="Events">Events</option>
            <option value="Announcements">Announcements</option>
            <option value="Matches">Matches</option>
            <option value="Training">Training</option>
          </select>
        </div>

        <div className="form-group">
          <label>Content Type</label>
          <div className="toggle-buttons">
            <button
              type="button"
              className={`toggle-btn ${contentType === 'fullStory' ? 'active' : ''}`}
              onClick={() => handleContentTypeToggle('fullStory')}
              disabled={submitLoading}
            >
              Full Story
            </button>
            <button
              type="button"
              className={`toggle-btn ${contentType === 'article_url' ? 'active' : ''}`}
              onClick={() => handleContentTypeToggle('article_url')}
              disabled={submitLoading}
            >
              External URL
            </button>
          </div>
        </div>

        {contentType === 'fullStory' ? (
          <div className="form-group">
            <label htmlFor="fullStory">Full Story *</label>
            <textarea
              required
              id="fullStory"
              className="input description"
              name="fullStory"
              value={formData.fullStory}
              onChange={handleChange}
              disabled={submitLoading}
              placeholder="Enter the complete article content"
              rows={8}
            />
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="article_url">Article URL *</label>
            <input
              required
              type="url"
              id="article_url"
              className="input"
              name="article_url"
              value={formData.article_url}
              onChange={handleChange}
              disabled={submitLoading}
              placeholder="https://example.com/article"
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="image">Article Image</label>
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
              <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', marginTop: '10px' }}/>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              disabled={submitLoading}
            />
            <span className="checkbox-text">Featured Article</span>
          </label>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="isactive"
              checked={formData.isactive}
              onChange={handleChange}
              disabled={submitLoading}
            />
            <span className="checkbox-text">Active Article</span>
          </label>
        </div>

        <div className="button-group">
          <button className="submit" type="submit" disabled={submitLoading}>
            {submitLoading ? (editingId !== null ? 'Updating...' : 'Submitting...') : (editingId !== null ? 'Update Article' : 'Add Article')}
          </button>

          {editingId !== null && (
            <button className="cancel" type="button" onClick={handleCancel} disabled={submitLoading}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="list-container">
        <h2>News Articles ({news.length})</h2>

        {loading ? (
          <div className="loading">Loading articles...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : news.length === 0 ? (
          <div className="empty-message">No articles found</div>
        ) : (
          <ul className="items-list">
            {news.map(article => (
              <li key={article.id} className="list-item">
                <div className="item-info">
                  {article.image && (
                    <div className="item-image">
                      <img src={article.image} alt={article.title} />
                    </div>
                  )}
                  <div className="item-details">
                    <h3 className="item-title">
                      {article.title}
                      {article.featured && <span className="featured-badge">Featured</span>}
                      {!article.isactive && <span className="inactive-badge">Inactive</span>}
                    </h3>
                    <div className="item-description">
                      <strong>Category:</strong> {article.category}
                    </div>
                    <div className="item-description">
                      <strong>Author:</strong> {article.author}
                    </div>
                    <div className="item-description">
                      <strong>Date:</strong> {formatDate(article.created_at || article.date)}
                    </div>
                    <div className="item-description">
                      <strong>Excerpt:</strong> {article.excerpt}
                    </div>
                    {article.article_url && (
                      <div className="item-description">
                        <strong>URL:</strong>{' '}
                        <a 
                          href={article.article_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="website-link"
                        >
                          {article.article_url}
                        </a>
                      </div>
                    )}
                    {article.fullStory && (
                      <div className="item-description">
                        <strong>Full Story:</strong>{' '}
                        <span className="story-preview">
                          {article.fullStory.length > 100
                            ? `${article.fullStory.substring(0, 100)}...`
                            : article.fullStory
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="action-buttons">
                  <button 
                    className="edit-btn" 
                    onClick={() => handleEdit(article)} 
                    disabled={submitLoading}
                  >
                    Edit
                  </button>

                  {deleteConfirm === article.id ? (
                    <div className="delete-confirm">
                      <span>Are you sure?</span>
                      <button 
                        className="confirm-yes" 
                        onClick={() => handleDelete(article.id)} 
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
                    <button className="delete-btn" onClick={() => setDeleteConfirm(article.id)} disabled={submitLoading}>
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

export default News;