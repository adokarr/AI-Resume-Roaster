import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UploadDropzone from "../components/UploadDropzone";

export default function UploadPage() {
  const [resumeText, setResumeText] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="rrc-app">
      <Head>
        <title>Upload Resume PDF — Next Chapter</title>
        <meta
          name="description"
          content="Extract readable text from your PDF resume with Next Chapter."
        />
      </Head>

      <div className="rrc-shell">
        <Navbar />

        <main>
          <div style={{ marginBottom: "2rem" }}>
            <p className="rrc-badge">
              <span className="rrc-badge-dot" aria-hidden="true" />
              <span>Next Chapter Document Parser</span>
            </p>
            <h1 className="rrc-title" style={{ fontSize: "2.4rem", maxWidth: "none" }}>
              Upload Resume PDF
            </h1>
            <p className="rrc-lead">
              Extract clean text from your PDF resume file to inspect, edit, or roast it.
            </p>
          </div>

          <div className="rrc-panel">
            <UploadDropzone
              onTextExtracted={(text) => {
                setResumeText(text);
                setError("");
              }}
            />

            {error && (
              <p className="rrc-error" role="alert" style={{ marginTop: "1rem" }}>
                {error}
              </p>
            )}

            {resumeText && (
              <section style={{ marginTop: "2rem" }}>
                <div className="rrc-label-row">
                  <h2 className="rrc-label" style={{ fontSize: "1.05rem" }}>
                    Extracted Resume Text
                  </h2>
                  <span className="rrc-counter is-ready">
                    {resumeText.length} characters extracted
                  </span>
                </div>
                <textarea
                  className="rrc-textarea"
                  value={resumeText}
                  readOnly
                  rows={12}
                  style={{ width: "100%", marginTop: "0.5rem" }}
                  aria-label="Extracted resume text"
                />
                <div className="rrc-actions" style={{ marginTop: "1.25rem" }}>
                  <Link
                    href="/"
                    className="rrc-button"
                    style={{ textDecoration: "none" }}
                  >
                    Go to Homepage to Roast Resume →
                  </Link>
                </div>
              </section>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
