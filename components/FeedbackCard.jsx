import React from "react";

export default function FeedbackCard({
  title = "Editorial Feedback",
  feedback = "Your resume has solid foundational experience, but could benefit from more quantified achievements and sharper action verbs.",
  category = "Impact & Clarity",
}) {
  return (
    <article className="feedback-card">
      <div className="rrc-card-head">
        <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "1.25rem" }}>
          {title}
        </h3>
        {category && <span className="rrc-counter">{category}</span>}
      </div>
      <p style={{ margin: 0, color: "var(--text-primary)", lineHeight: 1.7 }}>
        {feedback}
      </p>
    </article>
  );
}
