"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleNextButtonClick = () => {
    router.push("/interview");
  };

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
          <input type="text" style={{ marginLeft: "10px" }} />
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
