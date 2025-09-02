import React, { useRef, useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import FooterCard from "../components/FooterCard";
import BackToTopButton from "../components/BackToTopButton";

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
  shadow: "#B38E3F88",
  shadowStrong: "#B38E3FCC",
};

const NAVBAR_HEIGHT = 74;

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
        background: linear-gradient(90deg, ${COLORS.accentGold}, ${COLORS.backgroundRed}, ${COLORS.accentEmerald}, ${COLORS.backgroundGold}, ${COLORS.accentGold});
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

export default function About() {
  const navBarRef = useRef();
  const [navBarHeight, setNavBarHeight] = useState(NAVBAR_HEIGHT);

  useLayoutEffect(() => {
    function updateHeight() {
      if (navBarRef.current) {
        setNavBarHeight(navBarRef.current.offsetHeight || NAVBAR_HEIGHT);
      }
    }
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // Move button further down by increasing top offset (e.g., +12px)
  const backToHomeButton = (
    <div
      style={{
        position: "fixed",
        top: navBarHeight + 12,  // Moved down by 12px for clear separation
        right: 32,
        zIndex: 101,
        display: "flex",
        justifyContent: "flex-end",
      }}
      className="back-to-home-btn"
    >
      <Link
        to="/"
        className="px-5 py-2 rounded-full font-bold shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-accentEmerald"
        style={{
          background: COLORS.accentGold,
          color: COLORS.backgroundRed,
          border: `2px solid ${COLORS.accentBlack}`,
          textShadow: `0 1px 0 ${COLORS.backgroundGold}`,
        }}
        tabIndex={0}
      >
        Back to Home
      </Link>
    </div>
  );

  const reservedTopHeight = navBarHeight;

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: `linear-gradient(120deg, ${COLORS.backgroundGold} 0%, ${COLORS.accentGold} 50%, ${COLORS.backgroundRed} 100%)`,
        position: "relative",
        overflow: "hidden",
        fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
        display: "flex",
        flexDirection: "column"
      }}
    >
      <GlobalAnimations />
      {/* Fixed NavBar */}
      <div
        ref={navBarRef}
        style={{
          width: "100%",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 99,
        }}
      >
        <NavBar
          showBackToHome={false} // hide in-menu button, use fixed instead
          showLogo={true}
          fixed={true}
          showReportError={true}
          showAbout={false}
          showAdminButtons={true}
        />
      </div>
      {backToHomeButton}
      {/* Spacer to avoid content under navbar */}
      <div style={{ height: reservedTopHeight, minHeight: reservedTopHeight }} />
      {/* Main content and footer in a flex column */}
      <div
        style={{
          flex: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <BackToTopButton />
        <div
          className="about-main-card rounded-2xl p-8 flex flex-col items-center shadow-2xl animate-fadeInScaleUp card-shadow"
          style={{
            background: `linear-gradient(120deg, ${COLORS.backgroundGold} 80%, ${COLORS.accentGold} 100%)`,
            border: `2.5px solid ${COLORS.accentGold}`,
            textAlign: "center",
            boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
            margin: "32px auto",
            maxWidth: "720px",
            width: "100%",
          }}
        >
          <div className="flex items-center mb-4 animate-fadeInScaleUp">
            <span className="text-4xl mr-3">🗺️</span>
            <h2 className="font-bold text-3xl animate-shimmerText" style={{
              color: COLORS.backgroundRed,
              textAlign: "center",
              fontWeight: 900,
              letterSpacing: "-2px",
            }}>
              About
            </h2>
          </div>
          <p
            style={{
              fontSize: "1.18rem",
              lineHeight: 1.66,
              marginBottom: "1.2em",
              fontWeight: 500,
              color: COLORS.accentBlack,
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
              color: COLORS.accentBlack,
              textAlign: "left",
              width: "100%",
              maxWidth: "650px",
              margin: "0 auto 1.2em auto"
            }}
          >
            This site lets you:
            <ul style={{ marginTop: ".7em", marginBottom: ".7em", paddingLeft: "1.3em" }}>
              <li>🔍 <strong>Look up formulas and herbs</strong> in seconds</li>
              <li>📋 <strong>Copy and paste herbs & dosages</strong> to third-party platforms like Jane</li>
              <li>🟰 <strong>Compare formula ingredients side by side</strong></li>
              <li>🌱 <strong>Find all formulas containing specific herbs</strong></li>
              <li>🏫 <strong>See which formulas, patents, and herbs Yo San University carries</strong></li>
            </ul>
          </div>
          <p
            style={{
              fontSize: "1.18rem",
              lineHeight: 1.66,
              marginBottom: "1.2em",
              fontWeight: 500,
              color: COLORS.accentBlack,
            }}
          >
            I'm genuinely thrilled to share this resource with you, and I truly hope it serves you in your clinical practice or studies. If it saves you a little time, helps you make a better herbal recommendation, or just makes your clinic workflow easier, then it's done its job!
          </p>
          <p
            style={{
              fontSize: "1.1rem",
              color: COLORS.accentCrimson,
              background: COLORS.accentGold,
              borderRadius: "1.2em",
              padding: "0.7em 1.2em",
              fontWeight: 700,
              textAlign: "center",
              boxShadow: `0 2px 12px -6px ${COLORS.accentCrimson}44`,
              marginBottom: "1.2em",
              marginTop: "0.2em"
            }}
          >
            Thank you for visiting, and enjoy exploring!
          </p>
        </div>
        {/* Footer always at bottom for all screen sizes */}
        <div
          style={{
            width: "100vw",
            marginTop: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <FooterCard />
        </div>
      </div>
    </div>
  );
}