"use client";

import React, { useState, useRef } from "react";
import VideoStream from "../video_stream";

const InterviewPage = () => {
  const [recording, setRecording] = useState(false);
  const videoRef = useRef(null);

  const handleRecordButtonClick = () => {
    setRecording(!recording);
    // Logic for toggling recording audio
  };

  const videoStyles = {
    width: '100%',
    maxWidth: '720px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    margin: '20px 0'
  };

  const buttonStyles = {
    fontSize: '16px',
    padding: '10px 20px',
    backgroundColor: recording ? '#ff4d4f' : '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
  };

  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    gap: '20px'
  };

  return (
    <div style={containerStyles}>
      <VideoStream />
      <button onClick={handleRecordButtonClick} style={buttonStyles}>
        {recording ? 'Stop Recording' : 'Record Audio'}
      </button>
    </div>
  );
};

export default InterviewPage;

