import React from "react";
import { Link } from "react-router-dom";

// --- Color scheme (copied from App.js) ---
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

// --- Animations copied from App.js ---
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
      @keyframes pulseGlow {
        0% { box-shadow: 0 0 0 0 ${COLORS.violet}33; }
        50% { box-shadow: 0 0 16px 8px ${COLORS.violet}88; }
        100% { box-shadow: 0 0 0 0 ${COLORS.violet}33; }
      }
      /* Only animate the message oval, not the container */
      .animate-pulseGlow-message { animation: pulseGlow 2s infinite; }
      @keyframes bounceIn {
        0% { opacity: 0; transform: scale(0.7);}
        70% { opacity: 1; transform: scale(1.05);}
        100% { opacity: 1; transform: scale(1);}
      }
      .animate-bounceIn { animation: bounceIn 0.7s cubic-bezier(.36,1.29,.45,1.01); }
    `}
  </style>
);

// --- TCMPARTYZONE Logo ---
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
        margin: "0.8em auto 0.3em auto",
        padding: "0.14em 0",
        textShadow: `0 3px 16px ${COLORS.shadowStrong}`,
        borderRadius: "1em",
        maxWidth: 660,
      }}
    >
      TCM Party Palace (BETA) 🎉
    </div>
  );
}

// --- Back to Home Button (copied from HerbCard.js/About.js) ---
function BackToHomeButton() {
  return (
    <div className="fixed top-8 right-10 z-40">
      <Link
        to="/"
        className="px-5 py-2 rounded-full font-bold shadow-xl transition-all duration-200 hover:scale-105 animate-bounceIn"
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

export default function ReportBug() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background: `linear-gradient(120deg, ${COLORS.vanilla} 0%, ${COLORS.carolina} 55%, ${COLORS.violet} 100%)`,
        minHeight: "100vh"
      }}
    >
      <GlobalAnimations />
      <TcmPartyZoneHeader />
      {/* Back to Home Button */}
      <BackToHomeButton />
      <div
        className="rounded-2xl p-8 flex flex-col items-center shadow-2xl animate-fadeInScaleUp card-shadow"
        style={{
          background: `linear-gradient(120deg, ${COLORS.vanilla} 80%, ${COLORS.carolina} 100%)`,
          border: `2.5px solid ${COLORS.violet}`,
          maxWidth: "520px",
          width: "100%",
          textAlign: "center",
          boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
          marginTop: "32px",
        }}
      >
        <div className="flex items-center mb-4 animate-bounceIn">
          <span className="text-4xl mr-3">🐞</span>
          <h2 className="font-bold text-3xl" style={{ color: COLORS.claret, textAlign: "center" }}>
            Report a Bug or Error
          </h2>
        </div>
        <p className="mb-2" style={{ color: COLORS.seal, fontSize: "1.24em", fontWeight: 600 }}>
          If you find an error or bug on this website,<br />
          please contact me at:
        </p>
        <a
          href="mailto:seannavery@gmail.com"
          style={{
            color: COLORS.violet,
            background: COLORS.highlight,
            padding: "8px 22px",
            borderRadius: "2em",
            fontWeight: 700,
            fontSize: "1.18em",
            marginBottom: "1em",
            textShadow: `0 1px 0 ${COLORS.vanilla}`,
            boxShadow: `0 2px 16px -8px ${COLORS.shadowStrong}`,
            transition: "background 0.17s, color 0.19s"
          }}
        >
          seannavery@gmail.com
        </a>
        <p style={{ color: COLORS.seal, fontSize: "1.01em", marginTop: "1em" }}>
          Please include details about what happened and which page you found the issue on.
        </p>
        <div className="mt-7">
          <span
            className="animate-pulseGlow-message"
            style={{
              display: "inline-block",
              background: COLORS.violet,
              color: COLORS.vanilla,
              padding: "12px 24px",
              borderRadius: "2em",
              fontWeight: 600,
              fontSize: "1.1em",
              boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
              border: `2px solid ${COLORS.carolina}`,
              marginTop: "2em",
              marginBottom: "0.8em"
            }}
          >
            Thank you for helping improve The TCM Atlas!
          </span>
        </div>
      </div>
    </div>
  );
}