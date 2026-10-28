import React, { useState, useRef } from "react";

export default function UploadDropzone({ onTextExtracted }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);

  function handleFileSelection(selectedFile) {
    setError("");
    setUploadSuccess(false);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please select a valid PDF file (.pdf).");
      return;
    }

    // 5MB limit matching backend multer
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("PDF file is too large. Maximum size is 5MB.");
      return;
    }

    setFile(selectedFile);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer?.files;
    if (droppedFiles && droppedFiles.length > 0) {
      handleFileSelection(droppedFiles[0]);
    }
  }

  async function handleUpload() {
    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }

    setLoading(true);
    setError("");
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Failed to process PDF.");
      }

      if (!data.resumeText || !data.resumeText.trim()) {
        throw new Error("No readable text found in this PDF.");
      }

      setUploadSuccess(true);
      onTextExtracted?.(data.resumeText);
    } catch (err) {
      setError(err.message || "Something went wrong while reading the PDF.");
    } finally {
      setLoading(false);
    }
  }

  function formatFileSize(bytes) {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  function handleReset() {
    setFile(null);
    setError("");
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div
      className={`upload-dropzone ${isDragging ? "is-dragging" : ""} ${
        file ? "has-file" : ""
      }`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        id="resume-pdf-upload"
        className="upload-dropzone-input"
        accept=".pdf,application/pdf"
        onChange={(event) => {
          handleFileSelection(event.target.files?.[0] || null);
        }}
        disabled={loading}
      />

      <div className="upload-dropzone-content">
        <div className="upload-dropzone-icon" aria-hidden="true">
          <svg viewBox="0 0 48 48" className="upload-icon-svg" fill="none">
            <path
              d="M14 6h14l10 10v24a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4z"
              fill="var(--bg-card)"
              stroke="var(--text-primary)"
              strokeWidth="2"
            />
            <path
              d="M28 6v10h10"
              fill="none"
              stroke="var(--text-primary)"
              strokeWidth="2"
            />
            <path
              d="M24 34V22m-5 5l5-5 5 5"
              fill="none"
              stroke="var(--accent-rose)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {!file ? (
          <div className="upload-dropzone-prompt">
            <p className="upload-dropzone-heading">
              Upload your resume PDF
            </p>
            <p className="upload-dropzone-desc">
              Drag and drop your file here, or{" "}
              <button
                type="button"
                className="upload-browse-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                browse file
              </button>
            </p>
            <span className="upload-dropzone-note">
              PDF only up to 5MB
            </span>
          </div>
        ) : (
          <div className="upload-selected-file">
            <div className="upload-file-info">
              <span className="upload-file-name" title={file.name}>
                {file.name}
              </span>
              <span className="upload-file-size">
                {formatFileSize(file.size)}
              </span>
            </div>

            <div className="upload-actions">
              <button
                type="button"
                className="upload-submit-btn"
                onClick={handleUpload}
                disabled={loading}
              >
                {loading ? (
                  <span className="upload-btn-inner">
                    <span className="rrc-spinner" aria-hidden="true" />
                    Extracting text…
                  </span>
                ) : (
                  "Upload & Extract Text"
                )}
              </button>

              <button
                type="button"
                className="upload-clear-btn"
                onClick={handleReset}
                disabled={loading}
              >
                Change file
              </button>
            </div>
          </div>
        )}

        {error && (
          <p className="upload-dropzone-error" role="alert">
            {error}
          </p>
        )}

        {uploadSuccess && (
          <p className="upload-dropzone-success" role="status">
            ✓ PDF parsed successfully! Resume text loaded below.
          </p>
        )}
      </div>
    </div>
  );
}
