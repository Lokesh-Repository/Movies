import { useState } from 'react';
import { useBreakpoint } from '../hooks/useResponsive';
import { type EntryFormData, type Entry } from '../lib/api';

interface SimpleEntryFormProps {
  entry?: Entry;
  onSubmit: (data: EntryFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function SimpleEntryForm({ entry, onSubmit, onCancel, isLoading = false }: SimpleEntryFormProps) {
  const { isMobile } = useBreakpoint();
  
  const [formData, setFormData] = useState<EntryFormData>({
    title: entry?.title || '',
    type: entry?.type || 'MOVIE',
    director: entry?.director || '',
    budget: entry?.budget || '',
    location: entry?.location || '',
    duration: entry?.duration || '',
    year: entry?.year || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EntryFormData, string>>>({});

  // const validateForm = (): boolean => {
  //   const newErrors: Partial<Record<keyof EntryFormData, string>> = {};

  //   if (!formData.title.trim()) newErrors.title = 'Title is required';
  //   if (!formData.director.trim()) newErrors.director = 'Director is required';
  //   if (!formData.budget.trim()) newErrors.budget = 'Budget is required';
  //   if (!formData.location.trim()) newErrors.location = 'Location is required';
  //   if (!formData.duration.trim()) newErrors.duration = 'Duration is required';
  //   if (!formData.year.trim()) {
  //     newErrors.year = 'Year is required';
  //   } else if (!/^\d{4}$/.test(formData.year)) {
  //     newErrors.year = 'Year must be a 4-digit number';
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  // Enhanced Validations:
    const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EntryFormData, string>> = {};

    const isOnlyLetters = (value: string) => /^[A-Za-z\s]+$/.test(value);
    const isNumeric = (value: string) => /^\d+(\.\d+)?$/.test(value);

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 2) {
      newErrors.title = "Title must be at least 2 characters long";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title cannot exceed 100 characters";
    }

    if (!formData.director.trim()) {
      newErrors.director = "Director is required";
    } else if (!isOnlyLetters(formData.director)) {
      newErrors.director = "Director name can only contain alphabets and spaces";
    } else if (formData.director.length > 60) {
      newErrors.director = "Director name cannot exceed 60 characters";
    }

    if (!formData.budget.trim()) {
      newErrors.budget = "Budget is required";
    } else if (!isNumeric(formData.budget)) {
      newErrors.budget = "Budget must be a numeric value";
    } else if (parseFloat(formData.budget) <= 0) {
      newErrors.budget = "Budget must be greater than 0";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    } else if (!/^[A-Za-z\s,.-]+$/.test(formData.location)) {
      newErrors.location = "Location contains invalid characters";
    } else if (formData.location.length > 100) {
      newErrors.location = "Location name is too long";
    }

    if (!formData.duration.trim()) {
      newErrors.duration = "Duration is required";
    } else if (!isNumeric(formData.duration)) {
      newErrors.duration = "Duration must be a numeric value";
    } else if (parseInt(formData.duration) <= 0) {
      newErrors.duration = "Duration must be greater than 0";
    } else if (parseInt(formData.duration) > 600) {
      newErrors.duration = "Duration seems too long (max 600 mins)";
    }

    if (!formData.year.trim()) {
      newErrors.year = "Year is required";
    } else if (!/^\d{4}$/.test(formData.year)) {
      newErrors.year = "Year must be a 4-digit number";
    } else {
      const yearNum = parseInt(formData.year);
      const currentYear = new Date().getFullYear();
      if (yearNum < 1900 || yearNum > currentYear + 1) {
        newErrors.year = `Year must be between 1900 and ${currentYear + 1}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleChange = (field: keyof EntryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="title">
          Title *
        </label>
        <input
          id="title"
          type="text"
          className="form-input"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter movie or TV show title"
          disabled={isLoading}
          style={{
            fontSize: '16px', 
            padding: isMobile ? '14px 16px' : '12px 16px'
          }}
        />
        {errors.title && (
          <div style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px' }}>
            {errors.title}
          </div>
        )}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
        gap: isMobile ? '0' : '20px' 
      }}>
        <div className="form-group">
          <label className="form-label" htmlFor="type">
            Type *
          </label>
          <select
            id="type"
            className="form-select"
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value as 'MOVIE' | 'TV_SHOW')}
            disabled={isLoading}
            style={{
              fontSize: '16px',
              padding: isMobile ? '14px 16px' : '12px 16px'
            }}
          >
            <option value="MOVIE">🎬 Movie</option>
            <option value="TV_SHOW">📺 TV Show</option>
          </select>
          {errors.type && (
            <div style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px' }}>
              {errors.type}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="year">
            Year *
          </label>
          <input
            id="year"
            type="number"
            className="form-input"
            value={formData.year}
            onChange={(e) => handleChange('year', e.target.value)}
            placeholder="e.g., 2024"
            disabled={isLoading}
            inputMode="numeric"
            pattern="[0-9]*"
            style={{
              fontSize: '16px',
              padding: isMobile ? '14px 16px' : '12px 16px'
            }}
          />
          {errors.year && (
            <div style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px' }}>
              {errors.year}
            </div>
          )}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="director">
          Director *
        </label>
        <input
          id="director"
          type="text"
          className="form-input"
          value={formData.director}
          onChange={(e) => handleChange('director', e.target.value)}
          placeholder="Enter director's name"
          disabled={isLoading}
          autoComplete="name"
          style={{
            fontSize: '16px', 
            padding: isMobile ? '14px 16px' : '12px 16px'
          }}
        />
        {errors.director && (
          <div style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px' }}>
            {errors.director}
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="location">
          Filming Location *
        </label>
        <input
          id="location"
          type="text"
          className="form-input"
          value={formData.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="Enter filming location or country"
          disabled={isLoading}
          style={{
            fontSize: '16px', 
            padding: isMobile ? '14px 16px' : '12px 16px'
          }}
        />
        {errors.location && (
          <div style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px' }}>
            {errors.location}
          </div>
        )}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
        gap: isMobile ? '0' : '20px' 
      }}>
        <div className="form-group">
          <label className="form-label" htmlFor="budget">
            Budget (in Lakhs INR) *
          </label>
          <input
            id="budget"
            type="text"
            className="form-input"
            value={formData.budget}
            onChange={(e) => handleChange('budget', e.target.value)}
            placeholder="e.g., 150.75"
            disabled={isLoading}
            style={{
              fontSize: '16px', 
              padding: isMobile ? '14px 16px' : '12px 16px'
            }}
          />
          {errors.budget && (
            <div style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px' }}>
              {errors.budget}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="duration">
            Duration (in minutes) *
          </label>
          <input
            id="duration"
            type="number"
            className="form-input"
            value={formData.duration}
            onChange={(e) => handleChange('duration', e.target.value)}
            placeholder="e.g., 120"
            disabled={isLoading}
            style={{
              fontSize: '16px', 
              padding: isMobile ? '14px 16px' : '12px 16px'
            }}
          />
          {errors.duration && (
            <div style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px' }}>
              {errors.duration}
            </div>
          )}
        </div>
      </div>

      <div style={{
        paddingTop: isMobile ? '20px' : '24px',
        borderTop: '2px solid #f3f4f6',
        display: 'flex',
        flexDirection: isMobile ? 'column-reverse' : 'row',
        gap: '12px',
        justifyContent: isMobile ? 'stretch' : 'flex-end'
      }}>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobile ? '14px 24px' : '12px 24px',
            background: '#f8f9fa',
            color: '#6c757d',
            border: '2px solid #e9ecef',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            textDecoration: 'none',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#e9ecef';
            e.currentTarget.style.borderColor = '#dee2e6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#f8f9fa';
            e.currentTarget.style.borderColor = '#e9ecef';
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobile ? '14px 24px' : '12px 24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            textDecoration: 'none',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
          }}
        >
          {isLoading ? (
            <>⏳ {entry ? 'Updating...' : 'Creating...'}</>
          ) : (
            entry ? 'Update Entry' : 'Create Entry'
          )}
        </button>
      </div>
    </form>
  );
}