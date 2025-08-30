import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WavyBackground } from '../components/ui/wavy-background';
import { Upload as UploadIcon, Camera, FileImage, X, Check, Eye } from 'lucide-react';
import Tesseract from 'tesseract.js';

const Upload = () => {
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
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setProgress(0);

    try {
      // Use Tesseract.js for OCR
      const result = await Tesseract.recognize(
        file,
        'eng',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
            }
          }
        }
      );

      // Parse the text to extract golf scores
      const extractedText = result.data.text;
      const parsedScores = parseScorecard(extractedText);
      
      setOcrResults({
        rawText: extractedText,
        scores: parsedScores
      });
      
      setUploading(false);
      setUploaded(true);
      
    } catch (error) {
      console.error('OCR Error:', error);
      setUploading(false);
      // Still show as uploaded for demo purposes
      setUploaded(true);
      setOcrResults({
        rawText: "Could not read scorecard clearly. Please try with better lighting or angle.",
        scores: []
      });
    }
  };

  // Simple scorecard parser - looks for numbers that could be golf scores
  const parseScorecard = (text) => {
    const lines = text.split('\n');
    const scores = [];
    
    lines.forEach((line, index) => {
      // Look for lines with numbers 1-18 (hole numbers) and scores
      const holeMatch = line.match(/(\d+).*?(\d+)/);
      if (holeMatch) {
        const hole = parseInt(holeMatch[1]);
        const score = parseInt(holeMatch[2]);
        
        // Basic validation for golf scores
        if (hole >= 1 && hole <= 18 && score >= 1 && score <= 12) {
          scores.push({ hole, score });
        }
      }
    });
    
    return scores;
  };

  const resetUpload = () => {
    setFile(null);
    setUploaded(false);
    setUploading(false);
    setOcrResults(null);
    setProgress(0);
  };

  const calculateStats = (scores) => {
    if (scores.length === 0) return null;
    
    const total = scores.reduce((sum, s) => sum + s.score, 0);
    const average = (total / scores.length).toFixed(1);
    const best = Math.min(...scores.map(s => s.score));
    const worst = Math.max(...scores.map(s => s.score));
    
    return { total, average, best, worst, holesPlayed: scores.length };
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
              maxWidth: '700px',
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

                    {/* Progress, Success, or Results */}
                    <AnimatePresence mode="wait">
                      {uploading ? (
                        <motion.div
                          key="uploading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          style={{ textAlign: 'center' }}
                        >
                          <div style={{
                            width: '100px',
                            height: '100px',
                            border: '4px solid rgba(0, 191, 255, 0.3)',
                            borderTop: '4px solid #00bfff',
                            borderRadius: '50%',
                            margin: '0 auto 1rem auto',
                            position: 'relative'
                          }}>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              style={{ width: '100%', height: '100%' }}
                            />
                            <div style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              color: '#00bfff',
                              fontWeight: 'bold'
                            }}>
                              {progress}%
                            </div>
                          </div>
                          <p style={{ color: '#00bfff', fontSize: '1.1rem' }}>
                            Reading scorecard with AI...
                          </p>
                        </motion.div>
                      ) : uploaded && ocrResults ? (
                        <motion.div
                          key="results"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          style={{ textAlign: 'left' }}
                        >
                          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <Check 
                              size={50} 
                              style={{ 
                                color: '#66ffb2',
                                margin: '0 auto 1rem auto',
                                display: 'block'
                              }} 
                            />
                            <p style={{ color: '#66ffb2', fontSize: '1.2rem', fontWeight: 'bold' }}>
                              Scorecard Analyzed!
                            </p>
                          </div>

                          {/* Results */}
                          {ocrResults.scores.length > 0 ? (
                            <div>
                              <h4 style={{ color: '#ffffff', marginBottom: '1rem' }}>📊 Your Stats:</h4>
                              {(() => {
                                const stats = calculateStats(ocrResults.scores);
                                return (
                                  <div style={{ 
                                    background: 'rgba(0, 0, 0, 0.3)', 
                                    padding: '1rem', 
                                    borderRadius: '0.5rem',
                                    marginBottom: '1rem'
                                  }}>
                                    <p style={{ color: '#66ffb2', margin: '0.25rem 0' }}>
                                      🏌️ Holes Played: {stats.holesPlayed}
                                    </p>
                                    <p style={{ color: '#66ffb2', margin: '0.25rem 0' }}>
                                      📈 Total Score: {stats.total}
                                    </p>
                                    <p style={{ color: '#66ffb2', margin: '0.25rem 0' }}>
                                      🎯 Average: {stats.average}
                                    </p>
                                    <p style={{ color: '#66ffb2', margin: '0.25rem 0' }}>
                                      🔥 Best Hole: {stats.best}
                                    </p>
                                    <p style={{ color: '#66ffb2', margin: '0.25rem 0' }}>
                                      😅 Worst Hole: {stats.worst}
                                    </p>
                                  </div>
                                );
                              })()}
                              
                              <details style={{ marginTop: '1rem' }}>
                                <summary style={{ color: '#9ca3af', cursor: 'pointer' }}>
                                  <Eye size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                  View Raw Text
                                </summary>
                                <pre style={{ 
                                  color: '#9ca3af', 
                                  fontSize: '0.8rem', 
                                  background: 'rgba(0, 0, 0, 0.3)', 
                                  padding: '1rem', 
                                  borderRadius: '0.5rem',
                                  marginTop: '0.5rem',
                                  whiteSpace: 'pre-wrap',
                                  maxHeight: '150px',
                                  overflow: 'auto'
                                }}>
                                  {ocrResults.rawText}
                                </pre>
                              </details>
                            </div>
                          ) : (
                            <div style={{ textAlign: 'center' }}>
                              <p style={{ color: '#9ca3af' }}>
                                {ocrResults.rawText}
                              </p>
                              <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '1rem' }}>
                                💡 Tip: Make sure the scorecard is well-lit and numbers are clearly visible
                              </p>
                            </div>
                          )}
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
