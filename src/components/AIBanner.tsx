import React from 'react';
import './AIBanner.css';

const AIBanner: React.FC = () => {
  return (
    <div className="ai-banner">
      <span className="ai-banner-text">
        🤖 <span className="ai-banner-highlight">AI</span> Coded, Human Approved
      </span>
    </div>
  );
};

export default AIBanner; 