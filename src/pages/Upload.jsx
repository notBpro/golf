import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { WavyBackground } from '../components/ui/wavy-background';
import { Upload as UploadIcon, Camera, FileImage, X, Check, ArrowRight } from 'lucide-react';
import Tesseract from 'tesseract.js';

const Upload = () => {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [ocrResults, setOcrResults] = useState(null);
  const [progress, setProgress] = useState(0);
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
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('image/')) {
        setFile(droppedFile);
        setUploaded(false);
        setOcrResults(null);
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type.startsWith('image/')) {
        setFile(selectedFile);
        setUploaded(false);
        setOcrResults(null);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploaded(false);
    setOcrResults(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const performOCR = async () => {
    if (!file) return;
    
    setUploading(true);
    setProgress(0);
    
    try {
      const result = await Tesseract.recognize(file, 'eng', {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });
      
      setOcrResults(result.data.text);
      setUploaded(true);
    } catch (error) {
      console.error('OCR Error:', error);
    } finally {
      setUploading(false);
    }
  };

  const goToResults = () => {
    navigate('/results', {
      state: {
        ocrText: ocrResults,
        imageUrl: URL.createObjectURL(file)
      }
    });
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      width: '100vw',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0
    }}>
      <WavyBackground className="min-h-screen">
        <div style={{ 
          position: 'relative', 
          zIndex: 10, 
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
          overflow: 'hidden'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              maxWidth: '600px',
              width: '100%',
              textAlign: 'center'
            }}
          >
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #00d4ff, #00ff88)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '1rem'
              }}
            >
              Upload Scorecard
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '1.1rem',
                marginBottom: '2rem'
              }}
            >
              Take a photo or upload an image of your golf scorecard
            </motion.p>

            {/* Upload Area */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${dragActive ? '#00ff88' : 'rgba(255, 255, 255, 0.3)'}`,
                borderRadius: '16px',
                padding: '3rem 2rem',
                marginBottom: '2rem',
                background: dragActive ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />

              <AnimatePresence mode="wait">
                {file ? (
                  <motion.div
                    key="file-preview"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <div style={{
                      position: 'relative',
                      display: 'inline-block'
                    }}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        style={{
                          maxWidth: '200px',
                          maxHeight: '150px',
                          borderRadius: '8px',
                          objectFit: 'cover'
                        }}
                      />
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile();
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          background: '#ff4444',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <X size={12} color="white" />
                      </motion.button>
                    </div>
                    <p style={{ color: 'white', marginTop: '1rem', fontSize: '0.9rem' }}>
                      {file.name}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload-prompt"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <UploadIcon size={48} color="rgba(255, 255, 255, 0.5)" style={{ marginBottom: '1rem' }} />
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                      Drag & drop your scorecard here, or click to browse
                    </p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '1rem',
                      marginTop: '1rem'
                    }}>
                      <Camera size={20} color="rgba(255, 255, 255, 0.5)" />
                      <FileImage size={20} color="rgba(255, 255, 255, 0.5)" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Analyze Button */}
            {file && !uploaded && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={performOCR}
                disabled={uploading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: 'linear-gradient(45deg, #00d4ff, #00ff88)',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '1rem 2rem',
                  color: 'black',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  opacity: uploading ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  justifyContent: 'center'
                }}
              >
                {uploading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      style={{ 
                        width: '20px', 
                        height: '20px', 
                        border: '2px solid black', 
                        borderTop: '2px solid transparent', 
                        borderRadius: '50%' 
                      }}
                    />
                    Analyzing... {progress}%
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    Analyze Scorecard
                  </>
                )}
              </motion.button>
            )}

            {/* Done Button */}
            {uploaded && ocrResults && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={goToResults}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'linear-gradient(45deg, #22c55e, #16a34a)',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '1rem 2rem',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  justifyContent: 'center'
                }}
              >
                <Check size={20} />
                View AI Analysis
                <ArrowRight size={20} />
              </motion.button>
            )}
          </motion.div>
        </div>
      </WavyBackground>
    </div>
  );
};

export default Upload;

