"use client";

import { useRouter } from "next/navigation";
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [jobDescription, setJobDescription] = useState('');

  const handleNextButtonClick = async () => {
    const postData = {
      job_description: jobDescription,
    };

    console.log(postData);

    try {
      const response = await fetch('http://localhost:8000/api/create-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        console.log("Assistant created successfully.");
        const resp = await response.json()
        router.push(`/interview/${resp}`);
      } else {
        const errorData = await response.json();
        console.error('Failed to create the assistant:', errorData);
      }
    } catch (error) {
      console.error('Error creating the assistant:', error);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      if (file.type !== "application/pdf") {
        alert("Please upload a PDF file.");
        event.target.value = "";
      } else {
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await fetch('http://localhost:8000/api/upload-pdf', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            console.log("File uploaded successfully.");
          } else {
            console.log("Failed to upload the file.");
          }
        } catch (error) {
          console.error("Error uploading the file:", error);
        }
      }
    }
  }
 

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "6rem",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "0.85rem",
          maxWidth: "1100px",
          width: "100%",
          zIndex: 2,
          fontFamily:
            "ui-monospace, Menlo, Monaco, 'Cascadia Mono', 'Segoe UI Mono', 'Roboto Mono', 'Oxygen Mono', 'Ubuntu Monospace', 'Source Code Pro', 'Fira Mono', 'Droid Sans Mono', 'Courier New', monospace",
        }}
      >
        <p
          style={{
            position: "relative",
            margin: "0",
            padding: "1rem",
            backgroundColor: "rgba(238, 240, 241, 0.5)",
            border: "1px solid rgba(172, 175, 176, 0.3)",
            borderRadius: "12px",
          }}
        >
          Enter job description:
          <input type="text" 
          value={jobDescription} 
          onChange={(e) => setJobDescription(e.target.value)}
          style={{ marginLeft: "10px" }} />
        </p>
        <p
        style={{
          position: "relative",
          margin: "0",
          padding: "1rem",
          backgroundColor: "rgba(238, 240, 241, 0.5)",
          border: "1px solid rgba(172, 175, 176, 0.3)",
          borderRadius: "12px",
        }}>
         Upload PDF of resume:
         <input
         type="file"
         accept="application/pdf"
         style={{ marginLeft: "10px" }}
         onChange={handleFileChange}
         />
         </p>
        <div style={{ marginTop: "20px" }}>
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "#0071ff",
              color: "white",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
            }}
            onClick={handleNextButtonClick}
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}
