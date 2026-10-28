import { useMemo, useState } from "react";

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
      <div className="rrc-shell">
        <header className="rrc-nav">
          <a className="rrc-mark" href="/">
            <svg className="rrc-mark-icon" viewBox="0 0 48 48" aria-hidden="true">
              <rect x="8" y="6" width="28" height="36" rx="6" fill="#fffaf3" stroke="#2b2927" strokeWidth="1.6" />
              <path d="M16 16h12M16 22h12M16 28h8" stroke="#b7a8c9" strokeWidth="1.7" strokeLinecap="round" />
              <circle cx="34" cy="34" r="8" fill="#e8cfcb" stroke="#2b2927" strokeWidth="1.4" />
            </svg>
            <span className="rrc-mark-name">Resume Roast Club</span>
          </a>
          <p className="rrc-nav-note">Editorial reviews</p>
        </header>

        <main>
          <section className="rrc-hero" aria-labelledby="hero-title">
            <div>
              <p className="rrc-badge">
                <span className="rrc-badge-dot" aria-hidden="true" />
                Your career, refined.
              </p>
              <p className="rrc-kicker">Resume Roast Club</p>
              <h1 id="hero-title" className="rrc-title">
                Your resume deserves an honest review.
              </h1>
              <p className="rrc-lead">
                Get a witty, AI-powered resume critique with practical suggestions to help you stand out.
              </p>
            </div>

            <div className="rrc-hero-art" aria-hidden="true">
              <div className="rrc-accent-blob" />
              <svg className="rrc-sticker" viewBox="0 0 220 240">
                <rect x="42" y="22" width="128" height="176" rx="18" fill="#fffaf3" stroke="#2b2927" strokeWidth="2" />
                <rect x="58" y="46" width="72" height="8" rx="4" fill="#d5ddd0" />
                <rect x="58" y="64" width="96" height="6" rx="3" fill="#ddd4e8" />
                <rect x="58" y="80" width="88" height="6" rx="3" fill="#ddd4e8" />
                <rect x="58" y="96" width="76" height="6" rx="3" fill="#e8cfcb" />
                <circle cx="86" cy="148" r="5" fill="#2b2927" />
                <circle cx="126" cy="148" r="5" fill="#2b2927" />
                <path d="M92 166c8 8 20 8 28 0" fill="none" stroke="#2b2927" strokeWidth="2.2" strokeLinecap="round" />
                <circle cx="78" cy="156" r="5" fill="#e8cfcb" />
                <circle cx="134" cy="156" r="5" fill="#e8cfcb" />
              </svg>
              <svg className="rrc-pencil" viewBox="0 0 72 72">
                <rect x="18" y="10" width="16" height="42" rx="6" transform="rotate(18 26 31)" fill="#d5ddd0" stroke="#2b2927" strokeWidth="1.6" />
                <path d="M47 50l10 4-6 8z" fill="#c98b8b" stroke="#2b2927" strokeWidth="1.4" strokeLinejoin="round" />
                <circle cx="28" cy="24" r="2.1" fill="#2b2927" />
                <circle cx="36" cy="26" r="2.1" fill="#2b2927" />
                <path d="M29 32c3 2 7 2 10 0" fill="none" stroke="#2b2927" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </div>
          </section>

          <form className="rrc-panel" onSubmit={handleSubmit}>
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
              <p id="resume-status" className={error ? "rrc-error" : "rrc-hint"} role={error ? "alert" : undefined}>
                {error ||
                  (isReady
                    ? "Ready when you are. Expect candor with a little charm."
                    : "Please paste at least 200 characters for a thoughtful review.")}
              </p>
            </div>
          </form>

          {parsed.body ? (
            <section className="rrc-results" aria-live="polite">
              <article className="rrc-card">
                <div className="rrc-card-head">
                  <h2 className="rrc-card-title">The roast</h2>
                  <svg className="rrc-coffee" viewBox="0 0 72 72" aria-hidden="true">
                    <path d="M16 28h34v18a12 12 0 0 1-12 12H28A12 12 0 0 1 16 46z" fill="#fffaf3" stroke="#2b2927" strokeWidth="1.8" />
                    <path d="M50 32h6a8 8 0 0 1 0 16h-6" fill="none" stroke="#2b2927" strokeWidth="1.8" />
                    <path d="M28 16c0 6 4 6 4 12M38 16c0 6 4 6 4 12" fill="none" stroke="#8fa086" strokeWidth="1.7" strokeLinecap="round" />
                    <circle cx="28" cy="40" r="1.8" fill="#2b2927" />
                    <circle cx="38" cy="40" r="1.8" fill="#2b2927" />
                    <path d="M29 46c3 2.4 7 2.4 10 0" fill="none" stroke="#2b2927" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="rrc-roast">{parsed.body}</p>
              </article>

              {parsed.suggestions.length ? (
                <article className="rrc-card">
                  <h2 className="rrc-card-title">Three ways to improve</h2>
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

        <p className="rrc-footer">Quietly sharp feedback for people who take their work seriously.</p>
      </div>
    </div>
  );
}
