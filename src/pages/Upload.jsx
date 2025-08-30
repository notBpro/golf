import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WavyBackground } from '../components/ui/wavy-background';
import { Upload as UploadIcon, Camera, FileImage, X, Check } from 'lucide-react';

const Upload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    
    setUploading(true);
    // Simulate upload
    setTimeout(() => {
      setUploading(false);
      setUploaded(true);
    }, 2000);
  };

  const resetUpload = () => {
    setFile(null);
    setUploaded(false);
    setUploading(false);
  };

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0
    }}>
      <WavyBackground>
        <div style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          boxSizing: 'border-box'
        }}>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              maxWidth: '600px',
              width: '100%',
              textAlign: 'center'
            }}
          >
            
            {/* Header */}
            <motion.h1
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '1rem'
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Upload Scorecard
            </motion.h1>
            
            <motion.p
              style={{
                color: '#e5e7eb',
                fontSize: '1.25rem',
                marginBottom: '3rem'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Drop your golf scorecard photo to get instant analytics
            </motion.p>

            {/* Upload Area */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <AnimatePresence mode="wait">
                {!file ? (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      border: `3px dashed ${dragActive ? '#00bfff' : '#66ffb2'}`,
                      borderRadius: '1rem',
                      padding: '4rem 2rem',
                      background: dragActive ? 'rgba(0, 191, 255, 0.1)' : 'rgba(102, 255, 178, 0.05)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      animate={{
                        y: dragActive ? -10 : 0,
                        scale: dragActive ? 1.1 : 1
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <UploadIcon 
                        size={64} 
                        style={{ 
                          color: dragActive ? '#00bfff' : '#66ffb2',
                          margin: '0 auto 1rem auto',
                          display: 'block'
                        }} 
                      />
                      <h3 style={{ color: '#ffffff', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                        Drop your scorecard here
                      </h3>
                      <p style={{ color: '#9ca3af', fontSize: '1rem' }}>
                        or click to browse files
                      </p>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '1rem',
                      padding: '2rem',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <FileImage size={32} style={{ color: '#66ffb2' }} />
                        <div style={{ textAlign: 'left' }}>
                          <h4 style={{ color: '#ffffff', margin: 0, fontSize: '1.1rem' }}>
                            {file.name}
                          </h4>
                          <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.9rem' }}>
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <motion.button
                        onClick={resetUpload}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#9ca3af',
                          cursor: 'pointer',
                          padding: '0.5rem'
                        }}
                        whileHover={{ color: '#ffffff', scale: 1.1 }}
                      >
                        <X size={24} />
                      </motion.button>
                    </div>

                    {/* Progress or Success */}
                    <AnimatePresence mode="wait">
                      {uploading ? (
                        <motion.div
                          key="uploading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          style={{ textAlign: 'center' }}
                        >
                          <motion.div
                            style={{
                              width: '50px',
                              height: '50px',
                              border: '3px solid rgba(0, 191, 255, 0.3)',
                              borderTop: '3px solid #00bfff',
                              borderRadius: '50%',
                              margin: '0 auto 1rem auto'
                            }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          <p style={{ color: '#00bfff', fontSize: '1.1rem' }}>
                            Processing your scorecard...
                          </p>
                        </motion.div>
                      ) : uploaded ? (
                        <motion.div
                          key="uploaded"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          style={{ textAlign: 'center' }}
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                          >
                            <Check 
                              size={50} 
                              style={{ 
                                color: '#66ffb2',
                                margin: '0 auto 1rem auto',
                                display: 'block'
                              }} 
                            />
                          </motion.div>
                          <p style={{ color: '#66ffb2', fontSize: '1.1rem' }}>
                            Scorecard processed successfully!
                          </p>
                        </motion.div>
                      ) : (
                        <motion.button
                          key="upload-btn"
                          onClick={handleUpload}
                          style={{
                            background: 'linear-gradient(135deg, #00bfff, #66ffb2)',
                            color: '#000000',
                            padding: '1rem 2rem',
                            borderRadius: '2rem',
                            border: 'none',
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            width: '100%',
                            boxShadow: '0 10px 25px rgba(0, 191, 255, 0.3)'
                          }}
                          whileHover={{
                            scale: 1.02,
                            boxShadow: '0 15px 35px rgba(102, 255, 178, 0.4)'
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Camera size={20} style={{ marginRight: '0.5rem', display: 'inline' }} />
                          Analyze Scorecard
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                style={{ display: 'none' }}
              />
            </motion.div>

          </motion.div>
        </div>
      </WavyBackground>
    </div>
  );
};

export default Upload;
