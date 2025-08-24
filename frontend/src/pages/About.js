import React from "react";
import { Link } from "react-router-dom";

const COLORS = {
  vanilla: "#FFF7E3",
  violet: "#7C5CD3",
  carolina: "#68C5E6",
  claret: "#A52439",
  seal: "#3B4461",
  highlight: "#ffe066",
  shadow: "#7C5CD344",
  shadowStrong: "#7C5CD399",
  accent: "#fff0f0",
};

// --- Animations (matches herbCard.js) ---
const GlobalAnimations = () => (
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
        background: linear-gradient(90deg, ${COLORS.violet}, ${COLORS.carolina}, ${COLORS.claret}, ${COLORS.vanilla}, ${COLORS.highlight});
        background-size: 400% 400%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
        animation: shimmerText 3.2s ease-in-out infinite;
      }
    `}
  </style>
);

// --- Animated Logo Header (matches herbCard.js) ---
function TcmPartyZoneHeader() {
  return (
    <div
      className="animate-shimmerText animate-fadeInScaleUp"
      style={{
        fontWeight: 900,
        fontSize: "2.5rem",
        letterSpacing: "-2px",
        textAlign: "center",
        fontFamily: "inherit",
        lineHeight: 1.18,
        userSelect: "none",
        marginBottom: "0.3em",
        padding: "0.14em 0",
        textShadow: `0 3px 16px ${COLORS.shadowStrong}`,
        borderRadius: "1em",
        display: "inline-block"
      }}
    >
      The TCM Atlas (BETA) 🗺️
    </div>
  );
}

// --- Back to Home Button ---
function BackToHomeButton() {
  return (
    <div className="fixed top-8 right-10 z-40">
      <Link
        to="/"
        className="px-5 py-2 rounded-full font-bold shadow-xl transition-all duration-200 hover:scale-105 animate-fadeInScaleUp"
        style={{
          background: COLORS.violet,
          color: COLORS.vanilla,
          border: `2.5px solid ${COLORS.seal}`,
          boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
        }}
      >
        Back to Home
      </Link>
    </div>
  );
}

export default function About() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(120deg, ${COLORS.vanilla} 0%, ${COLORS.carolina} 50%, ${COLORS.violet} 100%)`,
        padding: "48px 0",
        fontFamily: "inherit",
      }}
    >
      <GlobalAnimations />
      {/* Back to Home Button */}
      <BackToHomeButton />
      <div
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "2.2em",
          boxShadow: `0 6px 40px -8px ${COLORS.violet}55`,
          padding: "38px 38px 28px 38px",
          color: COLORS.seal,
        }}
      >
        <h1
          style={{
            fontWeight: 900,
            fontSize: "2.6rem",
            letterSpacing: "-2px",
            textAlign: "center",
            marginBottom: "0.15em",
            color: COLORS.violet,
            textShadow: `0 1px 0 ${COLORS.vanilla}, 0 2px 12px ${COLORS.carolina}33`,
          }}
        >
          About <br />
          <TcmPartyZoneHeader />
        </h1>
        <p
          style={{
            fontSize: "1.18rem",
            lineHeight: 1.66,
            marginBottom: "1.2em",
            fontWeight: 500,
          }}
        >
          The TCM Atlas was born from a real need in the clinic: I wanted a practical tool to effortlessly and quickly look up Chinese herbal formulas and single herbs. I found myself wishing for the ability to copy and paste herbs and dosages directly into my charting platform (like Jane), rather than wasting time flipping through books or searching scattered resources. To my surprise, I couldn't find anything online that truly fit these needs—so I set out to fill that gap!
        </p>
        <div
          style={{
            fontSize: "1.18rem",
            lineHeight: 1.66,
            marginBottom: "1.2em",
            fontWeight: 500,
          }}
        >
          This site lets you:
          <ul style={{ marginTop: ".7em", marginBottom: ".7em", paddingLeft: "1.3em" }}>
            <li>🔍 <strong>Look up formulas and herbs</strong> in seconds</li>
            <li>📋 <strong>Copy and paste herbs & dosages</strong> to third-party platforms like Jane</li>
            <li>🟰 <strong>Compare formula ingredients side by side</strong></li>
            <li>🌱 <strong>Find all formulas containing specific herbs</strong></li>
            <li>🏫 <strong>See which formulas, patents, and herbs Yo San University carries</strong> (except, apparently, human placenta—which they used to sell!)</li>
          </ul>
        </div>
        <p
          style={{
            fontSize: "1.18rem",
            lineHeight: 1.66,
            marginBottom: "1.2em",
            fontWeight: 500,
          }}
        >
          I'm genuinely thrilled to share this resource with you, and I truly hope it serves you in your clinical practice or studies. If it saves you a little time, helps you make a better herbal recommendation, or just makes your clinic workflow easier, then it's done its job!
        </p>
        <p
          style={{
            fontSize: "1.1rem",
            color: COLORS.claret,
            background: COLORS.highlight,
            borderRadius: "1.2em",
            padding: "0.7em 1.2em",
            fontWeight: 700,
            textAlign: "center",
            boxShadow: `0 2px 12px -6px ${COLORS.claret}44`,
          }}
        >
          Thank you for visiting, and enjoy exploring!
        </p>
      </div>
    </div>
  );
}