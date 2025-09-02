import React from "react";

// Uses the public/logo512.png image for the logo graphic
// and displays "The TCM Atlas" text with the same shimmer and fade-in animation as before
// To use: <Logo size={56} />

// Use App.js color scheme:
const COLORS = {
  backgroundRed: "#9A2D1F",
  backgroundGold: "#F9E8C2",
  accentGold: "#D4AF37",
  accentDarkGold: "#B38E3F",
  accentBlack: "#44210A",
  accentCrimson: "#C0392B",
  accentIvory: "#FCF5E5",
  accentEmerald: "#438C3B",
  accentBlue: "#2176AE",
  accentGray: "#D9C8B4",
  shadowStrong: "#B38E3FCC",
};

export default function Logo({
  size = 48,
  showBeta = false,
  style = {},
  className = "",
  onClick,
}) {
  return (
    <div
      className={`logo-hero animate-shimmerText animate-fadeInScaleUp ${className}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1em",
        fontWeight: 900,
        fontSize: size * 0.7,
        letterSpacing: "-2px",
        textAlign: "center",
        fontFamily: "inherit",
        lineHeight: 1.18,
        userSelect: "none",
        padding: "0.14em 0",
        textShadow: `0 3px 16px ${COLORS.shadowStrong}`,
        borderRadius: "1em",
        transition: "font-size 0.2s",
        cursor: onClick ? "pointer" : undefined,
        ...style,
      }}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
    >
      <img
        src="/logo512.png"
        alt="The TCM Atlas Logo"
        width={size}
        height={size}
        style={{
          display: "inline-block",
          verticalAlign: "middle",
          marginRight: "0.2em",
          boxShadow: `0 2px 10px -2px ${COLORS.accentGold}44`,
          borderRadius: "20%",
        }}
        draggable={false}
      />
      <span>
        The TCM Atlas
        {showBeta && (
          <span style={{ fontSize: "0.55em", marginLeft: "0.5em", fontWeight: 700 }}>
            (v1.0)
          </span>
        )}
      </span>
      {/* Inline styles for animation (copy from App.js) */}
      <style>
        {`
          @keyframes fadeInScaleUp {
            0% { opacity: 0; transform: scale(0.97) translateY(14px);}
            50% { opacity: 0.7; transform: scale(1.03) translateY(-6px);}
            100% { opacity: 1; transform: scale(1) translateY(0);}
          }
          .animate-fadeInScaleUp { animation: fadeInScaleUp 0.7s cubic-bezier(.36,1.29,.45,1.01); }
          @keyframes shimmerText {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-shimmerText {
            background: linear-gradient(90deg, ${COLORS.accentGold}, ${COLORS.backgroundRed}, ${COLORS.accentEmerald}, ${COLORS.backgroundGold});
            background-size: 400% 400%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
            animation: shimmerText 3.2s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
}