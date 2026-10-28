import React from "react";

export default function ScoreCircle({ score = 85, label = "Resume Score" }) {
  return (
    <div className="score-circle-wrapper">
      <div className="score-circle" role="progressbar" aria-valuenow={score} aria-valuemin="0" aria-valuemax="100">
        <span>{score}</span>
      </div>
      {label && <span className="rrc-counter">{label}</span>}
    </div>
  );
}
