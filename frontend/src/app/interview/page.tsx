"use client";

import React, { useState, useRef } from "react";
import "regenerator-runtime/runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const SpeechToTextTranscriberComponent = () => {
  const [recording, setRecording] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser does not support speech recognition.</span>;
  }

  const handleRecordButtonClick = () => {
    if (recording) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening();
    }
    setRecording(!recording);
  };

  const buttonStyles = {
    fontSize: "16px",
    padding: "10px 20px",
    backgroundColor: listening ? "#ff4d4f" : "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  };

  return (
    <div>
      <div className="flex gap-3">
        <button style={buttonStyles} onClick={handleRecordButtonClick}>
          Start
        </button>
        <button onClick={resetTranscript}>Reset</button>
      </div>
      <div style={{ backgroundColor: "white" }}>{transcript}</div>
    </div>
  );
};

const InterviewPage = () => {
  const videoRef = useRef(null);

  const videoStyles = {
    width: "100%",
    maxWidth: "720px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    margin: "20px 0",
  };

  const containerStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    gap: "20px",
  };

  const speechToTextStyle = {
    marginTop: "20px",
    padding: "10px",
    width: "80%",
    maxWidth: "720px",
    minHeight: "100px",
    backgroundColor: "#f2f2f2",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
    color: "#333",
    textAlign: "center",
    overflowY: "auto",
  };

  return (
    <div style={containerStyles}>
      <video ref={videoRef} controls style={videoStyles} />
      <SpeechToTextTranscriberComponent />
    </div>
  );
};

export default InterviewPage;
