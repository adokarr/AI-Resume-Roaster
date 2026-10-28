import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const router = useRouter();

  return (
    <header className="rrc-nav" role="banner">
      <Link href="/" className="rrc-mark" aria-label="Next Chapter Home">
        {/* Editorial Book / Chapter Emblem */}
        <div className="rrc-mark-symbol" aria-hidden="true">
          <svg
            className="rrc-mark-icon"
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Open book pages */}
            <rect
              x="5"
              y="6"
              width="34"
              height="32"
              rx="6"
              className="rrc-svg-card"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            {/* Spine divider */}
            <path
              d="M22 8v28"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeDasharray="2 2"
              className="rrc-svg-line"
            />
            {/* Left page lines */}
            <path
              d="M10 14h7M10 19h7M10 24h5"
              stroke="var(--accent-rose)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            {/* Right page lines */}
            <path
              d="M27 14h7M27 19h7M27 24h4"
              stroke="var(--text-muted)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            {/* Sparkle badge */}
            <circle
              cx="33"
              cy="31"
              r="7.5"
              fill="var(--accent-blush)"
              stroke="var(--border-line)"
              strokeWidth="1.2"
            />
            <path
              d="M33 27v8M29 31h8"
              stroke="var(--text-primary)"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="rrc-mark-text">
          <span className="rrc-mark-name">Next Chapter</span>
          <span className="rrc-mark-tagline">Where critique turns into your next big break</span>
        </div>
      </Link>

      <div className="rrc-nav-right">
        <nav className="rrc-nav-links" aria-label="Main Navigation">
          <Link
            href="/"
            className={`rrc-nav-link ${router.pathname === "/" ? "is-active" : ""}`}
          >
            Roaster
          </Link>
          <Link
            href="/upload"
            className={`rrc-nav-link ${router.pathname === "/upload" ? "is-active" : ""}`}
          >
            PDF Parser
          </Link>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
