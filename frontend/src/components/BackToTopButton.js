import React, { useState, useEffect } from "react";

const COLORS = {
  accentGold: "#D4AF37",
  accentBlack: "#3B4461",
  shadowStrong: "#7C5CD399",
};

// Pulse animation keyframes
const pulseKeyframes = `
@keyframes pulseGlow {
  0% { box-shadow: 0 0 0 0 ${COLORS.accentGold}33; }
  50% { box-shadow: 0 0 16px 8px ${COLORS.accentGold}88; }
  100% { box-shadow: 0 0 0 0 ${COLORS.accentGold}33; }
}
`;

export default function BackToTopButton({ right = 75, bottom = 28, zIndex = 120 }) {
  const [show, setShow] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    // Show button after scrolling down a bit
    const handleScroll = () => setShow(window.scrollY > 220);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleClick() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <style>{pulseKeyframes}</style>
      <button
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "fixed",
          right: right,
          bottom: bottom,
          zIndex: zIndex,
          background: COLORS.accentGold,
          color: COLORS.accentBlack,
          borderRadius: "50%",
          width: 44,
          height: 44,
          border: `2.5px solid ${COLORS.accentBlack}`,
          boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
          fontWeight: 900,
          fontSize: "1.2rem",
          display: show ? "flex" : "none",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.2s, transform 0.13s",
          cursor: "pointer",
          outline: "none",
          animation: "pulseGlow 2s infinite",
          transform: hovered ? "scale(1.09)" : "scale(1)",
        }}
        aria-label="Scroll to top"
        title="Scroll to top"
      >
        ↑
      </button>
    </>
  );
}