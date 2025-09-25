import React from "react";

// Props:
// - cards: array of card objects [{ id, value, type, pairId }]
// - flipped: array of indices of currently flipped cards
// - matched: array of indices of matched cards
// - onCardClick: function(idx) for when a card is clicked
// - moves: number of moves
// - gameFinished: boolean
// - onRestart: function() to restart game (optional)

export default function FormulaIngredientsBoard({
  cards,
  flipped,
  matched,
  onCardClick,
  moves,
  gameFinished,
  onRestart,
}) {
  if (!cards || cards.length === 0) return null;

  return (
    <div
      style={{
        maxWidth: 910,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ marginBottom: 16, fontWeight: 700, color: "#C0392B" }}>
        Moves: {moves}
        {gameFinished && (
          <span style={{ marginLeft: 24, color: "#438C3B", fontWeight: 900 }}>
            🎉 Completed!
          </span>
        )}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            cards.length > 12
              ? "repeat(4, minmax(180px, 1fr))"
              : "repeat(3, minmax(220px, 1fr))",
          gap: "22px 18px",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 18,
          width: "100%",
          maxWidth: "880px",
        }}
      >
        {cards.map((card, idx) => {
          const isFlipped = flipped.includes(idx) || matched.includes(idx);
          return (
            <button
              key={card.id}
              onClick={() => onCardClick(idx)}
              disabled={isFlipped}
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
                cursor: isFlipped ? "default" : "pointer",
                outline: "none",
                transition: "background 0.2s, color 0.2s",
                wordBreak: "break-word",
                opacity: matched.includes(idx) ? 0.7 : 1,
              }}
              aria-label={isFlipped ? card.value : "Hidden card"}
            >
              {isFlipped ? (
                <span>
                  {card.type === "name" && (
                    <span style={{ fontWeight: 900, color: "#2176AE" }}>
                      {card.value}
                    </span>
                  )}
                  {card.type === "explanation" && (
                    <span style={{ fontStyle: "italic", color: "#C0392B" }}>
                      {card.value}
                    </span>
                  )}
                  {card.type === "ingredients" && (
                    <span style={{ color: "#438C3B" }}>
                      {card.value}
                    </span>
                  )}
                </span>
              ) : (
                <span style={{ fontSize: "1.2em", opacity: 0.7 }}>?</span>
              )}
            </button>
          );
        })}
      </div>
      {gameFinished && onRestart && (
        <button
          style={{
            background: "#C0392B",
            color: "#FCF5E5",
            fontWeight: 900,
            fontSize: "1.09em",
            border: "none",
            borderRadius: "2em",
            padding: "12px 32px",
            boxShadow: "0 2px 8px #B38E3FCC",
            marginTop: "1.2em",
            cursor: "pointer",
          }}
          onClick={onRestart}
        >
          Play Again
        </button>
      )}
    </div>
  );
}