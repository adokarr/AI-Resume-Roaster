import React from "react";
import Link from "next/link";

export const CREATOR_CONFIG = {
  name: "Adiva Kar",
  githubUrl: "https://github.com/adokarr?tab=repositories",
  email: "adivakar2006@gmail.com",
};

export default function Footer({
  creatorName = CREATOR_CONFIG.name,
  githubUrl = CREATOR_CONFIG.githubUrl,
  email = CREATOR_CONFIG.email,
}) {
  return (
    <footer className="rrc-footer-wrapper" role="contentinfo">
      <div className="rrc-footer-top">
        <div className="rrc-footer-brand">
          <div className="rrc-footer-brand-title">
            <span className="rrc-sparkle-inline">✦</span> Next Chapter
          </div>
          <p className="rrc-footer-desc">
            An AI-powered resume reviewer that roasts your resume, spots weaknesses,
            and helps you turn it into a stronger application.
          </p>
        </div>

        <nav className="rrc-footer-nav" aria-label="Footer Navigation">
          <span className="rrc-footer-nav-heading">Quick Links</span>
          <Link href="/" className="rrc-footer-link">
            Resume Roaster
          </Link>
          <Link href="/upload" className="rrc-footer-link">
            PDF Text Parser
          </Link>
        </nav>
      </div>

      <div className="rrc-footer-divider" />

      <div className="rrc-footer-bottom">
        <div className="rrc-footer-credit">
          <span>Made by <strong>{creatorName}</strong></span>
        </div>

        <div className="rrc-footer-contacts">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rrc-footer-btn"
              aria-label="Adiva Kar GitHub Repositories (opens in a new tab)"
            >
              {/* GitHub SVG Icon */}
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>GitHub</span>
            </a>
          )}

          {email && (
            <a
              href={`mailto:${email}`}
              className="rrc-footer-btn"
              aria-label={`Email ${creatorName}`}
            >
              {/* Mail SVG Icon */}
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>{email}</span>
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
