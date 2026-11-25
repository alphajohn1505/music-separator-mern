import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [file, setFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState('wav'); // <-- NEW: Default is lossless wav
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stems, setStems] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileChange = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith('audio/')) {
      setFile(selectedFile);
      setAudioPreview(URL.createObjectURL(selectedFile));
      setStems(null);
    }
  };

  // Handle drag and drop
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
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Upload and process audio
  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('audio', file);
    formData.append('outputFormat', outputFormat); // <-- NEW: Send format choice to backend

    try {
      setUploading(true);
      const response = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setJobId(response.data.jobId);
      setUploading(false);
      setProcessing(true);
      
      // Start polling for progress
      pollProgress(response.data.jobId);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
      setUploading(false);
    }
  };

  // Poll for processing progress
  const pollProgress = async (id) => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`${API_URL}/api/progress/${id}`);
        const { progress, status, stems } = response.data;

        setProgress(progress);

        if (status === 'completed') {
          clearInterval(interval);
          setProcessing(false);
          setStems(stems);
        } else if (status === 'failed') {
          clearInterval(interval);
          setProcessing(false);
          alert('Processing failed. Please try again.');
        }
      } catch (error) {
        console.error('Progress check failed:', error);
      }
    }, 1000);
  };

  // Download stem
  const downloadStem = (stemName) => {
    window.open(`${API_URL}/api/download/${jobId}/${stemName}`, '_blank');
  };

  // Download all stems
  const downloadAllStems = () => {
    window.open(`${API_URL}/api/download/${jobId}/all`, '_blank');
  };

  return (
    <div className="app">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🎵</span>
          <h1>AI Music Separator</h1>
        </div>
        <p className="tagline">Separate any song into individual stems using AI</p>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {!processing && !stems && (
          <div className="upload-section">
            {/* File Upload Area */}
            <div
              className={`upload-area ${dragActive ? 'drag-active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={(e) => handleFileChange(e.target.files[0])}
                style={{ display: 'none' }}
              />
              
              <div className="upload-content">
                <div className="upload-icon">📁</div>
                <h2>Drop your audio file here</h2>
                <p>or click to browse</p>
                <span className="file-types">MP3, WAV, FLAC, OGG, M4A</span>
              </div>
            </div>

            {/* File Preview */}
            {file && (
              <div className="file-preview glass">
                <div className="file-info">
                  <span className="file-icon">🎵</span>
                  <div className="file-details">
                    <h3>{file.name}</h3>
                    <p>{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>

                {audioPreview && (
                  <audio controls className="audio-player">
                    <source src={audioPreview} type={file.type} />
                  </audio>
                )}

                {/* NEW: Format Selector UI */}
                <div style={{ margin: '15px 0', textAlign: 'left' }}>
                  <label style={{ display: 'block', fontSize: '14px', color: '#e2e8f0', marginBottom: '8px', fontWeight: 'bold' }}>
                    Select Output Format:
                  </label>
                  <select 
                    value={outputFormat} 
                    onChange={(e) => setOutputFormat(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '10px 15px', 
                      borderRadius: '8px', 
                      background: 'rgba(255, 255, 255, 0.1)', 
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="wav" style={{color: 'black'}}>WAV (Lossless - Fastest)</option>
                    <option value="mp3" style={{color: 'black'}}>MP3 (320kbps - Best for Mobile)</option>
                    <option value="flac" style={{color: 'black'}}>FLAC (Lossless Compressed)</option>
                    <option value="m4a" style={{color: 'black'}}>M4A (Apple Devices)</option>
                  </select>
                </div>

                <button
                  className="btn btn-primary"
                  onClick={handleUpload}
                  disabled={uploading}
                  style={{ marginTop: '10px' }}
                >
                  {uploading ? (
                    <>
                      <span className="spinner"></span> Uploading...
                    </>
                  ) : (
                    <>🚀 Separate Audio</>
                  )}
                </button>
              </div>
            )}

            {/* Features */}
            <div className="features">
              <div className="feature glass">
                <span className="feature-icon">⚡</span>
                <h3>Fast Processing</h3>
                <p>AI-powered separation in 2-3 minutes</p>
              </div>
              <div className="feature glass">
                <span className="feature-icon">🎯</span>
                <h3>High Quality</h3>
                <p>State-of-the-art Demucs model</p>
              </div>
              <div className="feature glass">
                <span className="feature-icon">🎸</span>
                <h3>Stems Extraction</h3>
                <p>Vocals, Drums, Bass, and Other</p>
              </div>
            </div>
          </div>
        )}

        {/* Processing Animation */}
        {processing && (
          <div className="processing-section">
            <div className="processing-card glass">
              <h2>🎵 Separating Your Audio</h2>
              <p>Using AI to extract individual instruments...</p>

              <div className="progress-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="progress-text">{progress}%</span>
              </div>

              <div className="processing-animation">
                <div className="sound-wave">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>

              <div className="stem-indicators">
                <div className={`stem-indicator ${progress > 15 ? 'active' : ''}`}>
                  <span>🎤</span> Vocals
                </div>
                <div className={`stem-indicator ${progress > 30 ? 'active' : ''}`}>
                  <span>🥁</span> Drums
                </div>
                <div className={`stem-indicator ${progress > 50 ? 'active' : ''}`}>
                  <span>🎸</span> Bass
                </div>
                <div className={`stem-indicator ${progress > 65 ? 'active' : ''}`}>
                  <span>🎺</span> Other
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {stems && (
          <div className="results-section">
            <div className="results-header">
              <h2>✨ Separation Complete!</h2>
              <button className="btn btn-secondary" onClick={downloadAllStems}>
                📦 Download All (ZIP)
              </button>
            </div>

            <div className="stems-grid">
              {Object.entries(stems).map(([stemName, stemPath]) => (
                <div key={stemName} className="stem-card glass">
                  <div className="stem-header">
                    <span className="stem-emoji">
                      {stemName === 'vocals' ? '🎤' :
                       stemName === 'drums' ? '🥁' :
                       stemName === 'bass' ? '🎸' :
                       stemName === 'guitar' ? '🎹' :
                       stemName === 'piano' ? '🎹' : '🎺'}
                    </span>
                    <h3>{stemName.charAt(0).toUpperCase() + stemName.slice(1)}</h3>
                  </div>

                  <audio controls className="stem-player">
                    {/* NEW: Dynamically set the mime type based on outputFormat */}
                    <source src={`${API_URL}${stemPath}`} type={`audio/${outputFormat === 'mp3' ? 'mpeg' : outputFormat}`} />
                  </audio>

                  <button
                    className="btn btn-download"
                    onClick={() => downloadStem(stemName)}
                  >
                    ⬇️ Download
                  </button>
                </div>
              ))}
            </div>

            <button
              className="btn btn-primary btn-new"
              onClick={() => {
                setFile(null);
                setStems(null);
                setProgress(0);
                setAudioPreview(null);
              }}
            >
              🎵 Separate Another Song
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Powered by Meta's Demucs AI • Built with React & Node.js</p>
        <p>Academic Project 2026 • Free & Open Source</p>
      </footer>
    </div>
  );
}

export default App;