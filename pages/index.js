import { useMemo, useState } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UploadDropzone from "../components/UploadDropzone";

const MIN_RESUME_LENGTH = 200;

function parseRoast(roast) {
  const text = (roast || "").trim();
  if (!text) {
    return { body: "", suggestions: [] };
  }

  const headerSplit = text.split(
    /\n+(?:(?:here are |and (?:here are )?)?(?:three |3 )?(?:concrete )?(?:suggestions|improvements|recommendations)[^:\n]*:?\s*\n+)/i
  );

  if (headerSplit.length >= 2) {
    const body = headerSplit[0].trim();
    const remainder = headerSplit.slice(1).join("\n").trim();
    const items = remainder
      .split(/\n+(?:\d+[.)]\s+|[-*•]\s+)/)
      .map((item) => item.replace(/^\d+[.)]\s+/, "").trim())
      .filter(Boolean)
      .slice(0, 3);

    if (items.length) {
      return { body, suggestions: items };
    }
  }

  const lines = text.split("\n");
  const numbered = [];

  lines.forEach((line, index) => {
    const match = line.match(/^\s*(?:\d+[.)]|[-*•])\s+(.+)/);
    if (match) {
      numbered.push({ index, text: match[1].trim() });
    }
  });

  if (numbered.length >= 3) {
    const lastThree = numbered.slice(-3);
    const body = lines.slice(0, lastThree[0].index).join("\n").trim();
    return {
      body: body || text,
      suggestions: lastThree.map((item) => item.text),
    };
  }

  return { body: text, suggestions: [] };
}

export default function App() {
  const [resumeText, setResumeText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [roast, setRoast] = useState("");
  const [showValidation, setShowValidation] = useState(false);

  const characterCount = resumeText.trim().length;
  const remaining = Math.max(0, MIN_RESUME_LENGTH - characterCount);
  const isReady = characterCount >= MIN_RESUME_LENGTH;
  const parsed = useMemo(() => parseRoast(roast), [roast]);

  function handleTextExtracted(text) {
    setResumeText(text);
    setError("");
    setShowValidation(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setShowValidation(true);
    setError("");

    if (!isReady) {
      setRoast("");
      setError(
        remaining === MIN_RESUME_LENGTH
          ? "Paste your resume first. A little context goes a long way."
          : `Add ${remaining} more character${remaining === 1 ? "" : "s"} so the review has enough to work with.`
      );
      return;
    }

    setIsLoading(true);
    setRoast("");

    try {
      const response = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong while roasting your resume.");
      }

      if (!data.roast || !String(data.roast).trim()) {
        throw new Error("The review came back empty. Please try again in a moment.");
      }

      setRoast(String(data.roast).trim());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate the roast. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rrc-app">
      <Head>
        <title>Next Chapter — AI Resume Roaster & Reviewer</title>
        <meta
          name="description"
          content="Next Chapter is an AI-powered resume reviewer that roasts your resume, spots weaknesses, and helps you turn it into a stronger application."
        />
      </Head>

      <div className="rrc-shell">
        <Navbar />

        <main>
          <section className="rrc-hero" aria-labelledby="hero-title">
            <div>
              <p className="rrc-badge">
                <span className="rrc-badge-dot" aria-hidden="true" />
                <span>Next Chapter AI</span>
              </p>
              <p className="rrc-kicker">Turn honest critique into your next big milestone</p>
              <h1 id="hero-title" className="rrc-title">
                Your resume deserves an honest review.
              </h1>
              <p className="rrc-lead">
                An AI-powered resume reviewer that roasts your resume, spots weaknesses, and helps you turn it into a stronger application.
              </p>
              <p className="rrc-supporting">
                Upload your resume, get honest feedback, discover improvement opportunities, and make your next application stronger.
              </p>
              <div className="rrc-hero-pills">
                <span className="rrc-hero-pill">
                  <span className="rrc-sparkle">✦</span> Fast PDF text extraction
                </span>
                <span className="rrc-hero-pill">
                  <span className="rrc-sparkle">✦</span> Witty, constructive roast
                </span>
                <span className="rrc-hero-pill">
                  <span className="rrc-sparkle">✦</span> 3 concrete action points
                </span>
              </div>
            </div>

            <div className="rrc-hero-art" aria-hidden="true">
              <div className="rrc-accent-blob" />
              <svg className="rrc-sticker" viewBox="0 0 220 240" fill="none">
                <rect
                  x="42"
                  y="22"
                  width="128"
                  height="176"
                  rx="18"
                  fill="var(--bg-card)"
                  stroke="var(--text-primary)"
                  strokeWidth="2"
                />
                <rect x="58" y="46" width="72" height="8" rx="4" fill="var(--badge-bg)" />
                <rect x="58" y="64" width="96" height="6" rx="3" fill="var(--border-line)" />
                <rect x="58" y="80" width="88" height="6" rx="3" fill="var(--border-line)" />
                <rect x="58" y="96" width="76" height="6" rx="3" fill="var(--accent-blush)" />
                <circle cx="86" cy="148" r="5" fill="var(--text-primary)" />
                <circle cx="126" cy="148" r="5" fill="var(--text-primary)" />
                <path
                  d="M92 166c8 8 20 8 28 0"
                  fill="none"
                  stroke="var(--text-primary)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <circle cx="78" cy="156" r="5" fill="var(--accent-blush)" />
                <circle cx="134" cy="156" r="5" fill="var(--accent-blush)" />
              </svg>
              <svg className="rrc-pencil" viewBox="0 0 72 72" fill="none">
                <rect
                  x="18"
                  y="10"
                  width="16"
                  height="42"
                  rx="6"
                  transform="rotate(18 26 31)"
                  fill="var(--bg-card-subtle)"
                  stroke="var(--text-primary)"
                  strokeWidth="1.6"
                />
                <path
                  d="M47 50l10 4-6 8z"
                  fill="var(--accent-rose)"
                  stroke="var(--text-primary)"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
                <circle cx="28" cy="24" r="2.1" fill="var(--text-primary)" />
                <circle cx="36" cy="26" r="2.1" fill="var(--text-primary)" />
                <path
                  d="M29 32c3 2 7 2 10 0"
                  fill="none"
                  stroke="var(--text-primary)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </section>

          <div className="rrc-panel">
            <div className="rrc-upload-section">
              <UploadDropzone onTextExtracted={handleTextExtracted} />
              <div className="rrc-divider">
                <span>or edit / paste resume text below</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="rrc-label-row">
                <label className="rrc-label" htmlFor="resume-text">
                  Resume text
                </label>
                <span className={`rrc-counter${isReady ? " is-ready" : ""}`}>
                  {characterCount} / {MIN_RESUME_LENGTH} characters
                </span>
              </div>
              <textarea
                id="resume-text"
                className={`rrc-textarea${showValidation && !isReady ? " is-invalid" : ""}`}
                value={resumeText}
                onChange={(event) => {
                  setResumeText(event.target.value);
                  if (error) setError("");
                }}
                placeholder="Paste your resume text here…"
                aria-invalid={showValidation && !isReady}
                aria-describedby="resume-status"
                disabled={isLoading}
              />
              <div className="rrc-actions">
                <button className="rrc-button" type="submit" disabled={isLoading}>
                  <span className="rrc-button-inner">
                    {isLoading ? <span className="rrc-spinner" aria-hidden="true" /> : null}
                    {isLoading ? "Roasting your resume…" : "Roast my resume"}
                  </span>
                </button>
                <p
                  id="resume-status"
                  className={error ? "rrc-error" : "rrc-hint"}
                  role={error ? "alert" : undefined}
                >
                  {error ||
                    (isReady
                      ? "Ready when you are. Expect candor with a little charm."
                      : "Please paste at least 200 characters for a thoughtful review.")}
                </p>
              </div>
            </form>
          </div>

          {parsed.body ? (
            <section className="rrc-results" aria-live="polite">
              <article className="rrc-card">
                <div className="rrc-card-head">
                  <h2 className="rrc-card-title">
                    <span className="rrc-card-title-icon">☕</span> The Roast
                  </h2>
                  <svg className="rrc-coffee" viewBox="0 0 72 72" fill="none" aria-hidden="true">
                    <path
                      d="M16 28h34v18a12 12 0 0 1-12 12H28A12 12 0 0 1 16 46z"
                      fill="var(--bg-card)"
                      stroke="var(--text-primary)"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M50 32h6a8 8 0 0 1 0 16h-6"
                      fill="none"
                      stroke="var(--text-primary)"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M28 16c0 6 4 6 4 12M38 16c0 6 4 6 4 12"
                      fill="none"
                      stroke="var(--accent-rose)"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                    <circle cx="28" cy="40" r="1.8" fill="var(--text-primary)" />
                    <circle cx="38" cy="40" r="1.8" fill="var(--text-primary)" />
                    <path
                      d="M29 46c3 2.4 7 2.4 10 0"
                      fill="none"
                      stroke="var(--text-primary)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <p className="rrc-roast">{parsed.body}</p>
              </article>

              {parsed.suggestions.length ? (
                <article className="rrc-card">
                  <div className="rrc-card-head">
                    <h2 className="rrc-card-title">
                      <span className="rrc-card-title-icon">✦</span> Three Ways to Improve
                    </h2>
                  </div>
                  <div className="rrc-suggestions">
                    {parsed.suggestions.map((suggestion, index) => (
                      <div className="rrc-suggestion" key={`${index}-${suggestion.slice(0, 24)}`}>
                        <span className="rrc-num">{String(index + 1).padStart(2, "0")}</span>
                        <p>{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </article>
              ) : null}
            </section>
          ) : null}
        </main>

        <Footer />
      </div>
    </div>
  );
}
