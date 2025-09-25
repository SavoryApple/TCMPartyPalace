import React from "react";

// Props:
// - cards: array of card objects [{ id, value, type, pairId, herbObj }]
// - flipped: array of indices of currently flipped cards
// - matched: array of indices of matched cards
// - onCardClick: function(idx) for when a card is clicked
// - moves: number of moves
// - gameFinished: boolean
// - onRestart: function() to restart game (optional)
// - showDetails: boolean (optional) -- show herb details popover or below cards

export default function HerbMemoryBoard({
  cards,
  flipped,
  matched,
  onCardClick,
  moves,
  gameFinished,
  onRestart,
  showDetails = false
}) {
  if (!cards || cards.length === 0) return null;

  // Optionally: show details for flipped cards below grid
  const detailHerbs = flipped
    .map(idx => cards[idx]?.herbObj)
    .filter((h, i, arr) => h && arr.indexOf(h) === i);

  return (
    <div
      style={{
        maxWidth: 910,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
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
          maxWidth: "880px"
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
                opacity: matched.includes(idx) ? 0.7 : 1
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
                  {card.type === "keyActions" && (
                    <span style={{ fontStyle: "italic", color: "#C0392B" }}>
                      {card.value}
                    </span>
                  )}
                  {card.type === "category" && (
                    <span style={{ color: "#B38E3F" }}>
                      {card.value}
                    </span>
                  )}
                  {card.type === "group" && (
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
            cursor: "pointer"
          }}
          onClick={onRestart}
        >
          Play Again
        </button>
      )}
      {showDetails && detailHerbs.length > 0 && (
        <div style={{
          marginTop: "2em",
          background: "#FCF5E5",
          borderRadius: "1em",
          padding: "1em",
          boxShadow: "0 2px 12px #D4AF3788",
          width: "100%",
          maxWidth: 650
        }}>
          <h3 style={{fontWeight:700, fontSize:"1.1em", color:"#9A2D1F", marginBottom:"0.7em"}}>
            Details for Current Herb(s):
          </h3>
          {detailHerbs.map((herb, i) => (
            <div key={i} style={{
              marginBottom: "1.8em",
              border: "1px solid #eee",
              borderRadius: "0.7em",
              padding: "0.7em 1em",
              background: "#fff",
              boxShadow: "0 1px 7px #D4AF3722"
            }}>
              <div style={{fontWeight:800, color:"#2176AE", fontSize:"1.06em", marginBottom:"0.3em"}}>
                {herb.pinyinName || herb.name || herb.pharmaceuticalName}
              </div>
              {herb.pharmaceuticalName && (
                <div style={{marginBottom:"0.3em", color:"#B38E3F"}}>
                  <b>Pharmaceutical:</b> {herb.pharmaceuticalName}
                </div>
              )}
              {herb.category && (
                <div style={{marginBottom:"0.3em", color:"#B38E3F"}}>
                  <b>Category:</b> {herb.category}
                </div>
              )}
              {herb.keyActions && (
                <div style={{marginBottom:"0.3em", color:"#C0392B"}}>
                  <b>Key Actions:</b> {herb.keyActions}
                </div>
              )}
              {herb.group && (
                <div style={{marginBottom:"0.3em", color:"#438C3B"}}>
                  <b>Group:</b> {herb.group}
                </div>
              )}
              {herb.notes && (
                <div>
                  <b>Notes:</b> {Array.isArray(herb.notes) ? herb.notes.join("; ") : herb.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}