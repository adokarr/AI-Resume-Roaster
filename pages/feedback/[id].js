import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ScoreCircle from "../../components/ScoreCircle";
import FeedbackCard from "../../components/FeedbackCard";

export default function FeedbackPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="rrc-app">
      <Head>
        <title>Resume Analysis #{id || "1"} — Next Chapter</title>
        <meta
          name="description"
          content="Resume review and scores from Next Chapter."
        />
      </Head>

      <div className="rrc-shell">
        <Navbar />

        <main>
          <div style={{ marginBottom: "2rem" }}>
            <p className="rrc-badge">
              <span className="rrc-badge-dot" aria-hidden="true" />
              <span>Resume Review #{id || "1"}</span>
            </p>
            <h1 className="rrc-title" style={{ fontSize: "2.4rem", maxWidth: "none" }}>
              Detailed Resume Feedback
            </h1>
            <p className="rrc-lead">
              Review your overall application score and curated feedback cards.
            </p>
          </div>

          <div className="rrc-panel" style={{ display: "grid", gap: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
              <ScoreCircle score={84} label="Application Strength" />
              <div style={{ flex: 1, minWidth: "240px" }}>
                <h2 style={{ margin: "0 0 0.5rem", fontFamily: "var(--font-display)", fontSize: "1.35rem" }}>
                  Strong foundation, needs sharper metrics
                </h2>
                <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  Your experience stands out, but your bullet points could better quantify the business outcomes of your projects.
                </p>
              </div>
            </div>

            <div style={{ display: "grid", gap: "1rem" }}>
              <FeedbackCard
                title="Clarity & Impact"
                category="High Priority"
                feedback="Lead with numbers. Instead of 'Helped improve page speed', say 'Decreased average page load time by 38% through bundle splitting'."
              />
              <FeedbackCard
                title="Skills & Keywords"
                category="ATS Alignment"
                feedback="Ensure role-specific keywords are naturally incorporated in both your experience section and skills summary."
              />
            </div>

            <div className="rrc-actions">
              <Link href="/" className="rrc-button" style={{ textDecoration: "none" }}>
                ← Roast Another Resume
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
