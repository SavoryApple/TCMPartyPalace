import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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

const NAVBAR_HEIGHT = 84;

// UPDATED GAME_CARDS: 
// - Remove Formula Categories card
// - Combine Herb Categories and Herb Functions into Herbs card
const GAME_CARDS = [
  {
    title: "Formulas",
    description:
      "Match formulas to their ingredients, actions, or category. Select your preferred challenge!",
    icon: "🧪",
    color: COLORS.accentGold,
    textColor: COLORS.accentBlack,
    route: "/game/formula-ingredients",
  },
  {
    title: "Herbs",
    description:
      "Match herbs to their category, actions, or groups. Choose your matching mode!",
    icon: "🌿",
    color: COLORS.accentEmerald,
    textColor: COLORS.accentIvory,
    route: "/game/herbs",
  },
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);
  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth < 700);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
}

function ReturnToHomeButton() {
  return (
    <div
      className="back-to-home-btn"
      style={{
        position: "fixed",
        top: `${NAVBAR_HEIGHT + 12}px`,
        right: 32,
        zIndex: 101,
        display: "flex",
        justifyContent: "flex-end",
      }}
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
}

const GlobalAnimations = () => (
  <style>
    {`
      @keyframes fadeInScaleUp {
        0% { opacity: 0; transform: scale(0.97) translateY(14px);}
        50% { opacity: 0.7; transform: scale(1.03) translateY(-6px);}
        100% { opacity: 1; transform: scale(1) translateY(0);}
      }
      .animate-fadeInScaleUp { animation: fadeInScaleUp 0.7s cubic-bezier(.36,1.29,.45,1.01); }
      @keyframes iconBounce {
        0% { transform: scale(1) translateY(0);}
        30% { transform: scale(1.15) translateY(-8px);}
        50% { transform: scale(0.96) translateY(5px);}
        80% { transform: scale(1.08) translateY(-3px);}
        100% { transform: scale(1) translateY(0);}
      }
    `}
  </style>
);

export default function TCMGameLanding() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: COLORS.backgroundGold,
        overflowX: "hidden",
        position: "relative",
        fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
        display: "flex",
        flexDirection: "column",
      }}
    >
      <GlobalAnimations />
      <NavBar
        showReportError={true}
        showAbout={true}
        showAdminButtons={true}
        showLogo={true}
        fixed={true}
      />
      <div style={{ height: NAVBAR_HEIGHT }} />
      <ReturnToHomeButton />
      <BackToTopButton right={75} />
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          width: "100%",
          padding: isMobile ? "20px 6px 8px 6px" : "38px 12px 12px 12px",
          flex: 1,
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontWeight: 900,
            fontSize: isMobile ? "1.7em" : "2.3em",
            color: COLORS.backgroundRed,
            marginBottom: "0.18em",
            marginTop: "0.14em",
            letterSpacing: "-0.01em",
            textShadow: `0 2px 12px ${COLORS.accentGold}44, 0 1px 0 ${COLORS.backgroundGold}`,
          }}
        >
          TCM Games
        </h1>
        <p
          style={{
            fontSize: isMobile ? "1em" : "1.14em",
            textAlign: "center",
            color: COLORS.accentBlack,
            marginBottom: isMobile ? "0.9em" : "1.1em",
            marginTop: "0.2em",
            fontWeight: 500,
            maxWidth: isMobile ? "98vw" : 700,
            margin: "0 auto 2.2em auto",
          }}
        >
          Select a game below to test and grow your knowledge of Chinese herbs and formulas. Practice, play, and learn!
        </p>
        <div
          className="game-cards"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: isMobile ? "14px" : "24px",
            justifyContent: "center",
            margin: "0 auto",
            maxWidth: isMobile ? "99vw" : "950px",
            width: "100%",
          }}
        >
          {GAME_CARDS.map((card) => (
            <button
              key={card.title}
              className="game-card animate-fadeInScaleUp"
              style={{
                background: card.color,
                color: card.textColor,
                borderRadius: "1.2em",
                minWidth: isMobile ? 160 : 210,
                maxWidth: isMobile ? 280 : 330,
                width: isMobile ? "97vw" : "100%",
                padding: isMobile ? "24px 9px 18px 9px" : "38px 18px 26px 18px",
                fontWeight: 700,
                fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
                fontSize: isMobile ? "1em" : "1.09rem",
                border: `2.5px solid ${COLORS.accentGold}`,
                marginBottom: 10,
                cursor: "pointer",
                position: "relative",
                boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
                textAlign: "center",
                transition: "box-shadow 0.2s, transform 0.2s",
                outline: "none",
              }}
              onClick={() => {
                navigate(card.route);
              }}
            >
              <span
                style={{
                  fontSize: isMobile ? "1.5em" : "2em",
                  marginBottom: "0.16em",
                  textShadow: `0 2px 7px ${COLORS.accentGold}, 0 0 10px ${COLORS.backgroundRed}`,
                  display: "block",
                  animation: "iconBounce 1.7s infinite",
                }}
              >
                {card.icon}
              </span>
              <span
                style={{
                  fontSize: isMobile ? "1.09em" : "1.19em",
                  fontWeight: 900,
                  letterSpacing: "-.01em",
                  marginBottom: "0.7em",
                  color: card.textColor,
                  textShadow: `0 1px 0 ${COLORS.backgroundGold}, 0 1.5px 8px ${COLORS.accentGold}18`,
                  fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
                  display: "block",
                }}
              >
                {card.title}
              </span>
              <span
                style={{
                  fontWeight: 500,
                  fontSize: isMobile ? "0.97em" : "1.03em",
                  color: card.textColor,
                  opacity: 0.93,
                  textShadow: `0 1px 0 ${COLORS.backgroundGold}`,
                  marginTop: "0.2em",
                  marginBottom: 2,
                  fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
                  display: "block",
                }}
              >
                {card.description}
              </span>
            </button>
          ))}
        </div>
      </div>
      <FooterCard />
    </div>
  );
}