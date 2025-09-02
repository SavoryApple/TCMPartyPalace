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

export default function ReportBug() {
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
        background: `linear-gradient(120deg, ${COLORS.backgroundGold} 0%, ${COLORS.accentGold} 55%, ${COLORS.backgroundRed} 100%)`,
        minHeight: "100vh",
        width: "100vw",
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
          showReportError={false}
          showAbout={true}
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
          className="report-bug-main-card rounded-2xl p-8 flex flex-col items-center shadow-2xl animate-fadeInScaleUp card-shadow"
          style={{
            background: `linear-gradient(120deg, ${COLORS.backgroundGold} 80%, ${COLORS.accentGold} 100%)`,
            border: `2.5px solid ${COLORS.accentGold}`,
            textAlign: "center",
            boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
            margin: "32px auto",
            maxWidth: "520px",
            width: "100%",
          }}
        >
          <div className="flex items-center mb-4 animate-bounceIn">
            <span className="text-4xl mr-3">🐞</span>
            <h2 className="font-bold text-3xl animate-shimmerText" style={{ color: COLORS.backgroundRed, textAlign: "center" }}>
              Report a Bug or Error
            </h2>
          </div>
          <p className="mb-2" style={{ color: COLORS.accentBlack, fontSize: "1.24em", fontWeight: 600 }}>
            If you find an error or bug on this website,<br />
            please contact me at:
          </p>
          <a
            href="mailto:seannavery@gmail.com"
            style={{
              color: COLORS.backgroundRed,
              background: COLORS.accentGold,
              padding: "8px 22px",
              borderRadius: "2em",
              fontWeight: 700,
              fontSize: "1.18em",
              marginBottom: "1em",
              textShadow: `0 1px 0 ${COLORS.backgroundGold}`,
              boxShadow: `0 2px 16px -8px ${COLORS.shadowStrong}`,
              transition: "background 0.17s, color 0.19s"
            }}
          >
            seannavery@gmail.com
          </a>
          <p style={{ color: COLORS.accentBlack, fontSize: "1.01em", marginTop: "1em" }}>
            Please include details about what happened and which page you found the issue on.
          </p>
          <div className="mt-7">
            <span
              className="animate-pulseGlow-message"
              style={{
                display: "inline-block",
                background: COLORS.backgroundRed,
                color: COLORS.backgroundGold,
                padding: "12px 24px",
                borderRadius: "2em",
                fontWeight: 600,
                fontSize: "1.1em",
                boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
                border: `2px solid ${COLORS.accentGold}`,
                marginTop: "2em",
                marginBottom: "0.8em"
              }}
            >
              Thank you for helping improve The TCM Atlas!
            </span>
          </div>
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