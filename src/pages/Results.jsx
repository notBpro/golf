import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { WavyBackground } from '../components/ui/wavy-background';
import { analyzeScorecard } from '../services/groqService';

// Custom hook for outside clicks
const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      callback(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, callback]);
};

// Simple close button without SVG paths
const CloseButton = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: '#f3f4f6',
      border: 'none',
      borderRadius: '50%',
      width: '2rem',
      height: '2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '1.2rem',
      color: '#374151'
    }}
  >
    ×
  </button>
);

// Simple back button without SVG paths
const BackButton = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      padding: '12px 16px',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      fontSize: '1rem'
    }}
  >
    ← Back
  </button>
);

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { ocrText, imageUrl } = location.state || {};
  
  const [analyzing, setAnalyzing] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [active, setActive] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    if (!ocrText) {
      navigate('/upload');
      return;
    }

    const performAnalysis = async () => {
      try {
        setAnalyzing(true);
        const result = await analyzeScorecard(ocrText);
        setAnalysis(result);
      } catch (err) {
        console.error('Analysis error:', err);
        setError(err.message);
      } finally {
        setAnalyzing(false);
      }
    };

    // Add a small delay to prevent rapid API calls
    const timer = setTimeout(performAnalysis, 1000);
    return () => clearTimeout(timer);
  }, [ocrText, navigate]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const calculateStats = (scores) => {
    if (!scores || scores.length === 0) return null;
    
    const total = scores.reduce((sum, score) => sum + score, 0);
    const average = total / scores.length;
    const best = Math.min(...scores);
    const worst = Math.max(...scores);
    
    return { total, average: average.toFixed(1), best, worst, holes: scores.length };
  };

  const stats = analysis?.scores ? calculateStats(analysis.scores) : null;

  // Create cards based on analysis results
  const cards = [
    {
      id: 'scorecard',
      title: 'Original Scorecard',
      description: 'View uploaded image',
      icon: '📄',
      color: '#3b82f6',
      content: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <img 
            src={imageUrl} 
            alt="Original scorecard"
            style={{ width: '100%', height: 'auto', borderRadius: '8px', maxHeight: '400px', objectFit: 'contain' }}
          />
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            This is the original scorecard image you uploaded for analysis.
          </p>
        </div>
      )
    },
    {
      id: 'scores',
      title: 'Golf Scores',
      description: stats ? `${stats.holes} holes • Total: ${stats.total}` : analyzing ? 'Analyzing...' : 'No scores found',
      icon: '🏌️',
      color: '#22c55e',
      content: () => {
        if (analyzing) {
          return (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ 
                width: '2rem', 
                height: '2rem', 
                border: '2px solid #22c55e', 
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                margin: '0 auto',
                animation: 'spin 1s linear infinite'
              }}></div>
              <p style={{ marginTop: '0.5rem', color: '#666' }}>Analyzing scores...</p>
            </div>
          );
        }

        if (!stats) {
          return (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ color: '#666' }}>No valid golf scores were found in the analysis.</p>
              {error && (
                <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                  Error: {error}
                </p>
              )}
            </div>
          );
        }

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#22c55e' }}>{stats.holes}</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>Holes</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>{stats.total}</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>Total</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>{stats.average}</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>Average</div>
              </div>
            </div>
            
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Individual Scores:</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {analysis.scores.map((score, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '0.25rem 0.5rem',
                      background: '#e0f2fe',
                      color: '#0369a1',
                      borderRadius: '4px',
                      fontSize: '0.8rem'
                    }}
                  >
                    Hole {index + 1}: {score}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      id: 'ocr',
      title: 'OCR Output',
      description: 'Raw text extracted from image',
      icon: '🔍',
      color: '#f59e0b',
      content: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Raw OCR Text:</h4>
            <pre style={{
              background: '#f5f5f5',
              padding: '0.75rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              overflow: 'auto',
              maxHeight: '15rem',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.4'
            }}>
              {ocrText}
            </pre>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            This is the raw text that Tesseract OCR extracted from your scorecard image.
          </p>
        </div>
      )
    }
  ];

  // Only add AI analysis card if we have analysis results
  if (analysis) {
    cards.push({
      id: 'ai-analysis',
      title: 'AI Analysis',
      description: `Confidence: ${analysis.confidence}`,
      icon: '🤖',
      color: '#8b5cf6',
      content: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>
              {analysis.confidence === 'high' ? '✅' : analysis.confidence === 'medium' ? '⚠️' : '❌'}
            </span>
            <span style={{ fontWeight: '600' }}>Confidence: {analysis.confidence}</span>
          </div>

          {analysis.rawAnalysis && (
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>AI Reasoning:</h4>
              <div style={{
                background: '#f5f5f5',
                padding: '0.75rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                maxHeight: '10rem',
                overflow: 'auto',
                lineHeight: '1.4'
              }}>
                {analysis.rawAnalysis}
              </div>
            </div>
          )}

          {analysis.reasoning && (
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Analysis Summary:</h4>
              <p style={{ fontSize: '0.9rem', color: '#333', lineHeight: '1.5' }}>
                {analysis.reasoning}
              </p>
            </div>
          )}

          {analysis.identifiedElements && (
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Identified Elements:</h4>
              <pre style={{
                background: '#f5f5f5',
                padding: '0.75rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                overflow: 'auto',
                maxHeight: '8rem',
                lineHeight: '1.3'
              }}>
                {JSON.stringify(analysis.identifiedElements, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )
    });

    // Add raw LLM response if available
    if (analysis.fullLLMResponse) {
      cards.push({
        id: 'raw-llm',
        title: 'Raw LLM Response',
        description: 'Complete AI model output',
        icon: '⚡',
        color: '#6366f1',
        content: () => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Complete LLM Response:</h4>
              <pre style={{
                background: '#f5f5f5',
                padding: '0.75rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                overflow: 'auto',
                maxHeight: '24rem',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.3'
              }}>
                {analysis.fullLLMResponse}
              </pre>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              This is the complete raw response from the Groq AI model, including all reasoning and metadata.
            </p>
          </div>
        )
      });
    }
  } else if (error && !analyzing) {
    cards.push({
      id: 'error',
      title: 'Analysis Error',
      description: 'Something went wrong',
      icon: '❌',
      color: '#ef4444',
      content: () => (
        <div style={{ padding: '1rem', textAlign: 'center' }}>
          <p style={{ color: '#ef4444', marginBottom: '1rem' }}>
            Analysis failed: {error}
          </p>
          {error.includes('429') && (
            <div style={{ background: '#fef3f2', padding: '1rem', borderRadius: '8px', border: '1px solid #fecaca' }}>
              <p style={{ color: '#991b1b', fontSize: '0.9rem', margin: 0 }}>
                <strong>Rate Limit Exceeded:</strong> You've made too many requests. Please wait a moment before trying again.
              </p>
            </div>
          )}
          {error.includes('invalid_api_key') && (
            <div style={{ background: '#fef3f2', padding: '1rem', borderRadius: '8px', border: '1px solid #fecaca' }}>
              <p style={{ color: '#991b1b', fontSize: '0.9rem', margin: 0 }}>
                <strong>Invalid API Key:</strong> Please check your Groq API key in the .env file.
              </p>
            </div>
          )}
        </div>
      )
    });
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      width: '100vw',
      overflow: 'auto',
      position: 'relative'
    }}>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      
      <WavyBackground className="min-h-screen">
        <div style={{ 
          position: 'relative', 
          zIndex: 10, 
          minHeight: '100vh',
          padding: '2rem',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <BackButton onClick={() => navigate('/upload')} />
            </motion.div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              color: 'white',
              margin: 0
            }}>
              Analysis Results
            </h1>
          </motion.div>

          {/* Modal Overlay */}
          <AnimatePresence>
            {active && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 50,
                  display: 'grid',
                  placeItems: 'center',
                  padding: '1rem'
                }}
                onClick={() => setActive(null)}
              >
                <motion.div
                  ref={ref}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: '100%',
                    maxWidth: '48rem',
                    maxHeight: '90vh',
                    background: 'white',
                    borderRadius: '1.5rem',
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    padding: '1.5rem',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                        {active.title}
                      </h3>
                      <p style={{ color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                        {active.description}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>{active.icon}</span>
                      <CloseButton onClick={() => setActive(null)} />
                    </div>
                  </div>
                  
                  <div style={{ padding: '1.5rem', overflow: 'auto', maxHeight: 'calc(90vh - 120px)' }}>
                    {typeof active.content === "function" ? active.content() : active.content}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cards Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cards.map((card) => (
              <motion.div
                key={card.id}
                onClick={() => setActive(card)}
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                whileHover={{ 
                  scale: 1.02,
                  background: 'rgba(255, 255, 255, 0.2)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    padding: '0.75rem',
                    borderRadius: '12px',
                    background: card.color,
                    fontSize: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '3rem',
                    minHeight: '3rem'
                  }}>
                    {card.icon}
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: 'white',
                      margin: 0
                    }}>
                      {card.title}
                    </h3>
                    <p style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      margin: 0,
                      fontSize: '0.9rem'
                    }}>
                      {card.description}
                    </p>
                  </div>
                </div>
                
                <button style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}>
                  View Details
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </WavyBackground>
    </div>
  );
};

export default Results;

