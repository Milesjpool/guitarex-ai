import React from 'react';
import './AIBanner.css';

const AIBanner: React.FC = () => {
  return (
    <div className="banner-container">
      <div className="ai-banner">
        <a href="https://github.com/Milesjpool/guitarex-ai" target="_blank" rel="noopener noreferrer" className="ai-banner-link">
          <span className="ai-banner-text">
            🤖 <span className="ai-banner-highlight">AI</span> Coded, Human Approved
          </span>
        </a>
      </div>
      <a href="https://www.milesjpool.com" target="_blank" rel="noopener noreferrer" className="alien-link">
        👾
      </a>
    </div>
  );
};

export default AIBanner; 