import React from "react";

// This Badge component displays all badge types: NCCAOM/CALE, NCCAOM, CALE, Extra, and future badges
// Usage: <Badge badge={{ label: "CALE", color: "#D4AF37", textColor: "#44210A", borderColor: "#B38E3F" }} />

const BADGE_STYLES = {
  "NCCAOM/CALE": {
    background: "#a8f5c9",
    color: "#217a39",
    borderColor: "#52c97a"
  },
  "NCCAOM": {
    background: "#c7deff",
    color: "#2176ae",
    borderColor: "#2176ae"
  },
  "Extra": {
    background: "#e6e6e6",
    color: "#7a6c46",
    borderColor: "#b38e3f"
  },
  "CALE": {
    // GOLD BADGE for CALE
    background: "#D4AF37",
    color: "#44210A",
    borderColor: "#B38E3F"
  }
  // Add more badge types here as needed
};

function Badge({ badge, style = {} }) {
  if (!badge || !badge.label) return null;

  // Prefer custom props from badge object, else known style, else fallback
  const baseStyle = {
    background:
      badge.color ||
      BADGE_STYLES[badge.label]?.background ||
      "#e0e0e0",
    color:
      badge.textColor ||
      BADGE_STYLES[badge.label]?.color ||
      "#333",
    borderColor:
      badge.borderColor ||
      BADGE_STYLES[badge.label]?.borderColor ||
      "#ccc"
  };

  return (
    <span
      className="inline-block ml-2 px-2 py-1 rounded text-xs font-semibold align-middle transition-all duration-200"
      style={{
        background: baseStyle.background,
        color: baseStyle.color,
        border: `1.5px solid ${baseStyle.borderColor}`,
        boxShadow: "0 1px 4px 0 #ddd",
        ...style
      }}
    >
      {badge.label}
    </span>
  );
}

export default Badge;