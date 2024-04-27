"use client";

import React, { useState, useRef } from "react";

const InterviewPage = () => {
  const [recording, setRecording] = useState(false);
  const videoRef = useRef(null);

  const handleRecordButtonClick = () => {
    // Logic for recording audio
  };

  return (
    <div>
      <div>
        <video ref={videoRef} controls />
      </div>
      <div>
        <button onClick={handleRecordButtonClick}>Record Audio</button>
      </div>
    </div>
  );
};

export default InterviewPage;
