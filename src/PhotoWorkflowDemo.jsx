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
  const [customStyle, setCustomStyle] = useState(null);
  const fileInputRef = useRef(null);

  // Style kits for the website template
  const styleKits = [
    {
      name: 'Classic',
      backgroundColor: '#f9fafb',
      borderColor: '#e5e7eb',
      titleColor: '#1f2937',
      subtitleColor: '#6b7280',
      titleFont: 'monospace, sans-serif',
      subtitleFont: 'monospace, sans-serif'
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
      backgroundColor: '#000000',
      borderColor: '#ff00ff',
      titleColor: '#00ffff',
      subtitleColor: '#ffff00',
      titleFont: 'Zen Dots, "Arial Black", sans-serif',
      subtitleFont: 'Bangers, monospace'
    },
    {
      name: 'Gradient',
      backgroundColor: 'linear-gradient(135deg, #000000ff 0%, #10bcecff 100%)',
      borderColor: '#8b5cf6',
      titleColor: '#ffffff',
      subtitleColor: '#e0e7ff',
      titleFont: 'Fascinate, monospace',
      subtitleFont: 'arial, monospace'
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
            isUploaded: true,
            isVideo: false
          };
          
          setClientPhotos(prev => [...prev, newPhoto]);
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/')) {
        const videoUrl = URL.createObjectURL(file);
        const video = document.createElement('video');
        video.src = videoUrl;
        video.currentTime = 1; // Seek to 1 second for thumbnail
        
        video.onloadeddata = () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0);
          
          const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.7);
          
          const newVideo = {
            id: `uploaded-${Date.now()}-${Math.random()}`,
            color: null,
            name: file.name,
            imageUrl: thumbnailUrl, // Thumbnail for display
            videoUrl: videoUrl, // Original video URL
            isUploaded: true,
            isVideo: true
          };
          
          setClientPhotos(prev => [...prev, newVideo]);
          
          // Clean up the video element
          video.remove();
        };
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
    }, 2000);
  };

  const handleShuffle = () => {
    if (templatePhotos.length === 0) return;
    const shuffled = [...templatePhotos].sort(() => Math.random() - 0.5);
    setTemplatePhotos(shuffled);
  };

  const handleStyleKit = () => {
    if (templatePhotos.length === 0) return;
    setCustomStyle(null); // Clear custom style when cycling through presets
    setCurrentStyleKit((prev) => (prev + 1) % styleKits.length);
  };

  const handleFeelLucky = () => {
    if (templatePhotos.length === 0) return;
    
    // Create a random style by mixing properties from all style kits
    const randomStyle = {
      name: 'Lucky Mix',
      backgroundColor: styleKits[Math.floor(Math.random() * styleKits.length)].backgroundColor,
      borderColor: styleKits[Math.floor(Math.random() * styleKits.length)].borderColor,
      titleColor: styleKits[Math.floor(Math.random() * styleKits.length)].titleColor,
      subtitleColor: styleKits[Math.floor(Math.random() * styleKits.length)].subtitleColor,
      titleFont: styleKits[Math.floor(Math.random() * styleKits.length)].titleFont,
      subtitleFont: styleKits[Math.floor(Math.random() * styleKits.length)].subtitleFont
    };
    
    setCustomStyle(randomStyle);
  };

  const reset = () => {
    setMediaGalleryPhotos([]);
    setTemplatePhotos([]);
    setAnimatingPhotos([]);
    setIsAnimating(false);
    setCurrentStyleKit(0);
    setCustomStyle(null);
  };

  const PhotoSquare = ({ photo, className = "", isInTemplate = false }) => (
    <div
      className={`photo-square ${className}`}
      style={{ 
        backgroundColor: photo.isUploaded ? 'transparent' : photo.color,
        backgroundImage: photo.isUploaded ? `url(${photo.imageUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}
    >
      {photo.isVideo && isInTemplate ? (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <video 
            src={photo.videoUrl} 
            controls
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              borderRadius: '6px'
            }}
          />
        </div>
      ) : photo.isVideo ? (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <div
            style={{
              backgroundImage: `url(${photo.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100%',
              height: '100%',
              borderRadius: '6px'
            }}
          />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            color: 'white'
          }}>
            ▶
          </div>
        </div>
      ) : !photo.isUploaded ? (
        <Image size={14} />
      ) : null}
    </div>
  );

  const currentStyle = customStyle || styleKits[currentStyleKit];

  return (
    <div className="demo-container">
      <div className="demo-content">
        <div className="demo-header">
          <h1 className="demo-title">Photo Workflow Demo</h1>
          <p className="demo-subtitle">GD | Collections → PW | Media Library → Populated Site</p>
        </div>

        {/* Main Layout */}
        <div className="demo-grid">
          
          {/* GD Collections Section */}
          <div className="section-container collections-section">
            <h3 className="section-title">GD | Collections</h3>
            <p className="section-description">Latest Collection</p>
            <div className="demo-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '12px' }}>
                <button
                  onClick={handleUploadClick}
                  className="upload-button"
                >
                  <Upload size={14} />
                  Upload Photos/Videos
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*,video/*"
                multiple
                style={{ display: 'none' }}
              />
              <div className="client-gallery-container">
                {clientPhotos.map((photo) => (
                  <PhotoSquare key={photo.id} photo={photo} className="photo-square-client" />
                ))}
                {clientPhotos.length === 0 && (
                  <div className="empty-gallery">
                    <Grid3X3 size={20} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Import Button */}
          <button
            onClick={handleImport}
            disabled={isAnimating || mediaGalleryPhotos.length > 0}
            className="workflow-button button-blue import-button"
          >
            <ArrowRightLeft size={16} />
            Fetch from Collections
          </button>

          {/* Media Library Section */}
          <div className="section-container media-library-section">
            <h3 className="section-title">PW | Media Library</h3>
            <p className="section-description">Add photos from latest collection</p>
            <div className="demo-card">
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
          </div>

          {/* Populate Button */}
          <button
            onClick={handlePopulate}
            disabled={isAnimating || mediaGalleryPhotos.length === 0 || templatePhotos.length > 0}
            className="workflow-button button-green populate-button"
          >
            <Eye size={16} />
            Populate site
          </button>

          {/* Templates Section */}
          <div className="section-container templates-section">
            <h3 className="section-title">Preview Page | Templates</h3>
            <p className="section-description">Instantly update template with your photos  <br/> Additionally, users can shuffle photos and update style kits.</p>
          
            <div className="demo-card" style={{ width: '100%', maxWidth: '600px', minHeight: '300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '12px' }}>
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
                  <button
                    onClick={handleFeelLucky}
                    disabled={templatePhotos.length === 0}
                    className="feel-lucky-button"
                  >
                    🎲 I Feel Lucky
                  </button>
                </div>
              </div>
              <div 
                className="template-container"
                style={{
                  background: currentStyle.backgroundColor,
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
                    <PhotoSquare key={photo.id} photo={photo} className="photo-square-template" isInTemplate={true} />
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
                {photo.isVideo ? (
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <div
                      style={{
                        backgroundImage: `url(${photo.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        width: '100%',
                        height: '100%',
                        borderRadius: '6px'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      borderRadius: '50%',
                      width: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '8px',
                      color: 'white'
                    }}>
                      ▶
                    </div>
                  </div>
                ) : !photo.isUploaded ? (
                  <Image size={14} />
                ) : null}
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