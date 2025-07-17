import React, { useState, useEffect, useRef } from 'react';
import { Eye, Shuffle, Image, Grid3X3, ArrowRightLeft, Palette, Upload } from 'lucide-react';
import './PhotoWorkflowDemo.css';

const PhotoWorkflowDemo = () => {
  const [clientPhotos, setClientPhotos] = useState([]);
  const [mediaGalleryPhotos, setMediaGalleryPhotos] = useState([]);
  const [templatePhotos, setTemplatePhotos] = useState([]);
  const [animatingPhotos, setAnimatingPhotos] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStyleKit, setCurrentStyleKit] = useState(0);
  const fileInputRef = useRef(null);

  // Style kits for the website template
  const styleKits = [
    {
      name: 'Classic',
      backgroundColor: '#f9fafb',
      borderColor: '#e5e7eb',
      titleColor: '#1f2937',
      subtitleColor: '#6b7280',
      titleFont: 'Arial, sans-serif',
      subtitleFont: 'Arial, sans-serif'
    },
    {
      name: 'Modern',
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      titleColor: '#f1f5f9',
      subtitleColor: '#94a3b8',
      titleFont: 'Georgia, serif',
      subtitleFont: 'Georgia, serif'
    },
    {
      name: 'Vibrant',
      backgroundColor: '#fef3c7',
      borderColor: '#f59e0b',
      titleColor: '#92400e',
      subtitleColor: '#d97706',
      titleFont: 'Impact, sans-serif',
      subtitleFont: 'Verdana, sans-serif'
    },
    {
      name: 'Rad Neon',
      backgroundColor: '#2fff00ff',
      borderColor: '#ff00ff',
      titleColor: '#ff0080ff',
      subtitleColor: '#fff',
      titleFont: 'Impact, "Arial Black", sans-serif',
      subtitleFont: '"Courier New", monospace'
    }
  ];

  // Generate sample photos
  const generatePhotos = (count, prefix) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `${prefix}-${i}`,
      color: `hsl(${(i * 60) % 360}, 70%, 60%)`,
      name: `Photo ${i + 1}`,
      isUploaded: false
    }));
  };

  useEffect(() => {
    // Start with empty client gallery - no placeholder photos
    setClientPhotos([]);
  }, []);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newPhoto = {
            id: `uploaded-${Date.now()}-${Math.random()}`,
            color: null,
            name: file.name,
            imageUrl: e.target.result,
            isUploaded: true
          };
          
          setClientPhotos(prev => [...prev, newPhoto]);
        };
        reader.readAsDataURL(file);
      }
    });
    
    // Reset the input
    event.target.value = '';
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    // Create animated photos
    const animatedPhotos = clientPhotos.map((photo, index) => ({
      ...photo,
      startDelay: index * 100,
      animationClass: 'animate-import'
    }));
    
    setAnimatingPhotos(animatedPhotos);
    
    // Complete animation after delay
    setTimeout(() => {
      setMediaGalleryPhotos([...clientPhotos]);
      setAnimatingPhotos([]);
      setIsAnimating(false);
    }, 2000);
  };

  const handlePopulate = () => {
    if (isAnimating || mediaGalleryPhotos.length === 0) return;
    setIsAnimating(true);
    
    // Create animated photos from media gallery
    const animatedPhotos = mediaGalleryPhotos.map((photo, index) => ({
      ...photo,
      startDelay: index * 150,
      animationClass: 'animate-populate'
    }));
    
    setAnimatingPhotos(animatedPhotos);
    
    // Complete animation after delay
    setTimeout(() => {
      setTemplatePhotos([...mediaGalleryPhotos]);
      setAnimatingPhotos([]);
      setIsAnimating(false);
    }, 3500);
  };

  const handleShuffle = () => {
    if (templatePhotos.length === 0) return;
    const shuffled = [...templatePhotos].sort(() => Math.random() - 0.5);
    setTemplatePhotos(shuffled);
  };

  const handleStyleKit = () => {
    if (templatePhotos.length === 0) return;
    setCurrentStyleKit((prev) => (prev + 1) % styleKits.length);
  };

  const reset = () => {
    setMediaGalleryPhotos([]);
    setTemplatePhotos([]);
    setAnimatingPhotos([]);
    setIsAnimating(false);
    setCurrentStyleKit(0);
  };

  const PhotoSquare = ({ photo, className = "" }) => (
    <div
      className={`photo-square ${className}`}
      style={{ 
        backgroundColor: photo.isUploaded ? 'transparent' : photo.color,
        backgroundImage: photo.isUploaded ? `url(${photo.imageUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {!photo.isUploaded && <Image size={14} />}
    </div>
  );

  const currentStyle = styleKits[currentStyleKit];

  return (
    <div className="demo-container">
      <div className="demo-content">
        <div className="demo-header">
          <h1 className="demo-title">Photo Workflow Demo</h1>
          <p className="demo-subtitle">GD | Collections → PW | Media Library → Populated Site</p>
        </div>

        {/* Main Layout */}
        <div className="demo-grid">
          
          {/* Client Gallery */}
          <div className="demo-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 className="card-title" style={{ marginBottom: 0 }}>GD | Collections</h3>
              <button
                onClick={handleUploadClick}
                className="upload-button"
              >
                <Upload size={14} />
                Upload
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              multiple
              style={{ display: 'none' }}
            />
            <div className="photo-grid">
              {clientPhotos.map((photo) => (
                <PhotoSquare key={photo.id} photo={photo} className="photo-square-client" />
              ))}
            </div>
              <div className="empty-gallery">
                  <Grid3X3 size={20} />
                </div>
          </div>

          {/* Import Button */}
          <button
            onClick={handleImport}
            disabled={isAnimating || mediaGalleryPhotos.length > 0}
            className="workflow-button button-blue"
          >
            <ArrowRightLeft size={16} />
            Fetch photos from GD
          </button>

          {/* Media Gallery */}
          <div className="demo-card">
            <h3 className="card-title">PW | Media Library</h3>
            <div className="media-gallery-container">
              {mediaGalleryPhotos.map((photo) => (
                <PhotoSquare key={photo.id} photo={photo} className="photo-square-md" />
              ))}
              {mediaGalleryPhotos.length === 0 && (
                <div className="empty-gallery">
                  <Grid3X3 size={20} />
                </div>
              )}
            </div>
          </div>

          {/* Populate Button */}
          <button
            onClick={handlePopulate}
            disabled={isAnimating || mediaGalleryPhotos.length === 0 || templatePhotos.length > 0}
            className="workflow-button button-green"
          >
            <Eye size={16} />
            Populate Site
          </button>

          {/* Website Template */}
          <div className="demo-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 className="card-title" style={{ marginBottom: 0 }}>PW | Templates</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleShuffle}
                  disabled={templatePhotos.length === 0}
                  className="shuffle-button"
                >
                  <Shuffle size={14} />
                  Shuffle
                </button>
                <button
                  onClick={handleStyleKit}
                  disabled={templatePhotos.length === 0}
                  className="style-kit-button"
                >
                  <Palette size={14} />
                  Style Kit
                </button>
              </div>
            </div>
            <div 
              className="template-container"
              style={{
                backgroundColor: currentStyle.backgroundColor,
                borderColor: currentStyle.borderColor,
                transition: 'all 0.3s ease'
              }}
            >
              <div className="template-header">
                <h4 
                  className="template-title"
                  style={{
                    color: currentStyle.titleColor,
                    fontFamily: currentStyle.titleFont,
                    transition: 'all 0.3s ease'
                  }}
                >
                  My Portfolio
                </h4>
                <p 
                  className="template-subtitle"
                  style={{
                    color: currentStyle.subtitleColor,
                    fontFamily: currentStyle.subtitleFont,
                    transition: 'all 0.3s ease'
                  }}
                >
                  Photography - {currentStyle.name} Style
                </p>
              </div>
              <div className="photo-grid-3x3">
                {templatePhotos.slice(0, 9).map((photo) => (
                  <PhotoSquare key={photo.id} photo={photo} className="photo-square-template" />
                ))}
                {templatePhotos.length === 0 && (
                  <div className="template-preview-3x3">
                    Template Preview
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="reset-container">
          <button
            onClick={reset}
            className="demo-button button-gray"
            style={{ width: 'auto', padding: '8px 24px' }}
          >
            Reset Demo
          </button>
        </div>

        {/* Animated Photos Overlay */}
        {animatingPhotos.length > 0 && (
          <div className="animated-overlay">
            {animatingPhotos.map((photo, index) => (
              <div
                key={`${photo.id}-animated`}
                className="animated-photo"
                style={{
                  backgroundColor: photo.isUploaded ? 'transparent' : photo.color,
                  backgroundImage: photo.isUploaded ? `url(${photo.imageUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  animationDelay: `${photo.startDelay}ms`,
                  zIndex: 100 - index
                }}
              >
                {!photo.isUploaded && <Image size={14} />}
              </div>
            ))}
          </div>
        )}

        {/* Status Indicator */}
        <div className="status-indicator">
          <div className="status-label">Status:</div>
          <div className={`status-text ${
            isAnimating ? 'status-animating' : 
            templatePhotos.length > 0 ? 'status-populated' : 
            mediaGalleryPhotos.length > 0 ? 'status-ready' : 
            'status-initial'
          }`}>
            {isAnimating ? 'Animating...' :
             templatePhotos.length > 0 ? `Site Populated! (${currentStyle.name} Style)` :
             mediaGalleryPhotos.length > 0 ? 'Ready to Populate' :
             'Ready to Import'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoWorkflowDemo;