
import React, { useState } from "react";
import UploadDropzone from "../components/UploadDropzone";

export default function UploadPage() {
  const [resumeText, setResumeText] = useState("");
  const [error, setError] = useState("");

  return (
    <main style={{ maxWidth: 700, margin: "40px auto", padding: 20 }}>
      <h1>AI Resume Roaster</h1>
      <p>Upload your resume PDF to extract its text.</p>

      <UploadDropzone
        onTextExtracted={(text) => {
          setResumeText(text);
          setError("");
        }}
      />

      {error && <p role="alert">{error}</p>}

      {resumeText && (
        <section style={{ marginTop: 24 }}>
          <h2>Extracted Resume Text</h2>
          <textarea
            value={resumeText}
            readOnly
            rows={12}
            style={{ width: "100%", padding: 12 }}
          />
          <p>PDF text extracted successfully!</p>
        </section>
      )}
    </main>
  );
}
