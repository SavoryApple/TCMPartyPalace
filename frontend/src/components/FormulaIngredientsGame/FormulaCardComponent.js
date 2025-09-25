import React from "react";

// Props:
// - card: { id, value, type, pairId }
// - isFlipped: boolean
// - isMatched: boolean
// - onClick: function() (for click event)

export default function FormulaCardComponent({
  card,
  isFlipped,
  isMatched,
  onClick,
}) {
  let cardContent;
  if (isFlipped) {
    if (card.type === "name") {
      cardContent = (
        <span style={{ fontWeight: 900, color: "#2176AE" }}>{card.value}</span>
      );
    } else if (card.type === "explanation") {
      cardContent = (
        <span style={{ fontStyle: "italic", color: "#C0392B" }}>
          {card.value}
        </span>
      );
    } else if (card.type === "ingredients") {
      cardContent = (
        <span style={{ color: "#438C3B" }}>{card.value}</span>
      );
    } else {
      cardContent = <span>{card.value}</span>;
    }
  } else {
    cardContent = <span style={{ fontSize: "1.2em", opacity: 0.7 }}>?</span>;
  }

  return (
    <button
      onClick={onClick}
      disabled={isFlipped || isMatched}
      style={{
        background: isFlipped ? "#D4AF37" : "#44210A",
        color: isFlipped ? "#44210A" : "#FCF5E5",
        minHeight: "72px",
        borderRadius: "1em",
        boxShadow: isFlipped
          ? "0 3px 18px -6px #438C3BCC"
          : "0 3px 12px -7px #B38E3FCC",
        fontWeight: 700,
        fontSize: "1.06em",
        border: `2px solid #D4AF37`,
        padding: "13px 8px",
        margin: "2px",
        cursor: isFlipped || isMatched ? "default" : "pointer",
        outline: "none",
        transition: "background 0.2s, color 0.2s",
        wordBreak: "break-word",
        opacity: isMatched ? 0.7 : 1,
      }}
      aria-label={isFlipped ? card.value : "Hidden card"}
    >
      {cardContent}
    </button>
  );
}