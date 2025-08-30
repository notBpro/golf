import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { WavyBackground } from '../components/ui/wavy-background';
import { ArrowLeft, Brain, Target, Eye, Code, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { analyzeScorecard } from '../services/groqService';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { ocrText, imageUrl } = location.state || {};
  
  const [analyzing, setAnalyzing] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [showRawLLM, setShowRawLLM] = useState(false);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);

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
        setError(err.message);
      } finally {
        setAnalyzing(false);
      }
    };

    performAnalysis();
  }, [ocrText, navigate]);

  const calculateStats = (scores) => {
    if (!scores || scores.length === 0) return null;
    
    const total = scores.reduce((sum, score) => sum + score, 0);
    const average = total / scores.length;
    const best = Math.min(...scores);
    const worst = Math.max(...scores);
    
    return { total, average: average.toFixed(1), best, worst, holes: scores.length };
  };

  const stats = analysis?.scores ? calculateStats(analysis.scores) : null;

  return (
    <div style={{ 
      minHeight: '100vh',
      width: '100vw',
      overflow: 'auto',
      position: 'relative'
    }}>
      <WavyBackground className="min-h-screen">
        <div style={{ 
          position: 'relative', 
          zIndex: 10, 
          minHeight: '100vh',
          padding: '2rem',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}
          >
            <motion.button
              onClick={() => navigate('/upload')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '12px',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={20} />
            </motion.button>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              color: 'white',
              margin: 0
            }}>
              AI Analysis Results
            </h1>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Left Column - Analysis */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* AI Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: analyzing 
                    ? 'linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))'
                    : analysis 
                      ? 'linear-gradient(45deg, rgba(34, 197, 94, 0.2), rgba(59, 130, 246, 0.2))'
                      : 'linear-gradient(45deg, rgba(239, 68, 68, 0.2), rgba(245, 101, 101, 0.2))',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  padding: '1.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <motion.div
                    animate={analyzing ? { rotate: 360 } : {}}
                    transition={analyzing ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
                  >
                    <Brain size={24} color={analyzing ? "#60A5FA" : analysis ? "#22C55E" : "#EF4444"} />
                  </motion.div>
                  <div>
                    <h3 style={{ color: 'white', margin: 0, fontSize: '1.1rem' }}>
                      {analyzing ? "AI Analyzing..." : analysis ? "Analysis Complete" : "Analysis Failed"}
                    </h3>
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0, fontSize: '0.9rem' }}>
                      {analyzing 
                        ? "Groq AI is parsing your scorecard..." 
                        : analysis 
                          ? `Confidence: ${analysis.confidence}`
                          : error
                      }
                    </p>
                  </div>
                </div>

                {/* Debug Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setShowDetailedAnalysis(!showDetailedAnalysis)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '0.5rem 1rem',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Zap size={14} />
                    {showDetailedAnalysis ? 'Hide' : 'Show'} AI Thinking
                  </button>
                  
                  <button
                    onClick={() => setShowRawLLM(!showRawLLM)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '0.5rem 1rem',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Code size={14} />
                    {showRawLLM ? 'Hide' : 'Show'} Raw LLM
                  </button>
                </div>
              </motion.div>

              {/* Golf Stats */}
              {stats && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '16px',
                    padding: '1.5rem'
                  }}
                >
                  <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Target size={20} color="#22C55E" />
                    Final Golf Scores
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#22C55E' }}>{stats.holes}</div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>Holes</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#60A5FA' }}>{stats.total}</div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>Total</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#A78BFA' }}>{stats.average}</div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>Average</div>
                    </div>
                  </div>

                  {/* Scores */}
                  <div>
                    <h4 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Extracted Scores:</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {analysis.scores.map((score, index) => (
                        <span
                          key={index}
                          style={{
                            background: 'rgba(0, 212, 255, 0.2)',
                            border: '1px solid rgba(0, 212, 255, 0.3)',
                            borderRadius: '4px',
                            padding: '0.2rem 0.5rem',
                            color: '#00d4ff',
                            fontSize: '0.8rem'
                          }}
                        >
                          {score}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column - Debug Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Raw OCR */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '1rem'
                }}
              >
                <h4 style={{ color: '#00d4ff', marginBottom: '0.5rem', fontSize: '1rem' }}>
                  📄 Raw OCR Output
                </h4>
                <pre style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.75rem',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  margin: 0,
                  maxHeight: '200px',
                  overflow: 'auto',
                  background: 'rgba(0, 0, 0, 0.2)',
                  padding: '0.5rem',
                  borderRadius: '4px'
                }}>
                  {ocrText}
                </pre>
              </motion.div>

              {/* Detailed AI Analysis */}
              {showDetailedAnalysis && analysis?.rawAnalysis && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '1rem'
                  }}
                >
                  <h4 style={{ color: '#22c55e', marginBottom: '0.5rem', fontSize: '1rem' }}>
                    🧠 AI Detailed Analysis
                  </h4>
                  <pre style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.75rem',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    margin: 0,
                    maxHeight: '300px',
                    overflow: 'auto'
                  }}>
                    {analysis.rawAnalysis}
                  </pre>
                  
                  {analysis.identifiedElements && (
                    <div style={{ marginTop: '1rem' }}>
                      <h5 style={{ color: '#a78bfa', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        Identified Elements:
                      </h5>
                      <pre style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.7rem',
                        margin: 0
                      }}>
                        {JSON.stringify(analysis.identifiedElements, null, 2)}
                      </pre>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Raw LLM Response */}
              {showRawLLM && analysis?.fullLLMResponse && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '1rem'
                  }}
                >
                  <h4 style={{ color: '#f87171', marginBottom: '0.5rem', fontSize: '1rem' }}>
                    🤖 Complete LLM Response
                  </h4>
                  <pre style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.7rem',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    margin: 0,
                    maxHeight: '400px',
                    overflow: 'auto',
                    background: 'rgba(0, 0, 0, 0.3)',
                    padding: '0.5rem',
                    borderRadius: '4px'
                  }}>
                    {analysis.fullLLMResponse}
                  </pre>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </WavyBackground>
    </div>
  );
};

export default Results;

