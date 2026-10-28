
import React, { useState } from "react";

export default function UploadDropzone({ onTextExtracted }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload() {
    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed.");
      }

      onTextExtracted?.(data.resumeText);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="upload-dropzone">
      <h2>Upload your resume</h2>
      <p>Select a PDF file to get started.</p>

      <input
        type="file"
        accept=".pdf,application/pdf"
        onChange={(event) => {
          setFile(event.target.files?.[0] || null);
          setError("");
        }}
      />

      {file && <p>Selected: {file.name}</p>}

      <button
        type="button"
        onClick={handleUpload}
        disabled={loading || !file}
      >
        {loading ? "Reading PDF..." : "Upload and Extract Text"}
      </button>

      {error && <p role="alert">{error}</p>}
    </div>
  );
}
