import React, { useEffect, useState } from "react";
import {
  HashRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import FormulaBuilder from "./pages/FormulaBuilder";
import HomePageSearchBar from "./components/homePageSearchBar";
import HerbCard from "./pages/herbCard";
import FormulaCard from "./pages/formulaCard";
import FormulaCategoryList from "./pages/FormulaCategoryList";
import HerbCategoryList from "./pages/HerbCategoryList";
import HerbGroupsPage from "./pages/herbGroups";
import { HerbCartProvider } from "./context/HerbCartContext";
import ReportBug from "./pages/ReportBug";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/AdminDashboard";
import About from "./pages/About";
import Logo from "./components/Logo";

// Chinese/Oriental theme colors
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

const CARD_DATA = [
  {
    title: "Create Formula",
    description: "Build, compare, and save your own herbal formulas.",
    icon: "🪔",
    color: COLORS.accentGold,
    textColor: COLORS.accentBlack,
    route: "formulabuilder",
    comingSoon: false,
  },
  {
    title: "Formulas Listed by Category",
    description:
      "Explore classic formulas grouped by their TCM function and type.",
    icon: "⛩️",
    color: COLORS.backgroundGold,
    textColor: COLORS.backgroundRed,
    route: "formulacategorylist",
    comingSoon: false,
  },
  {
    title: "Herbs Listed by Category",
    description:
      "Browse all Chinese herbs organized by their traditional categories.",
    icon: "🌱",
    color: COLORS.accentEmerald,
    textColor: COLORS.accentIvory,
    route: "herbcategorylist",
    comingSoon: false,
  },
  {
    title: "Common Herb Combinations",
    description: "Explore herbs grouped by similar functions and properties.",
    icon: "🍃",
    color: COLORS.accentGold,
    textColor: COLORS.accentBlack,
    route: "herbgroups",
    comingSoon: false,
  },
  {
    title: "Dui Yao Herb Pairs (coming soon)",
    description: "Classic synergistic herb pairs used in Chinese medicine.",
    icon: "👬",
    color: COLORS.backgroundRed,
    textColor: COLORS.accentIvory,
    route: "",
    comingSoon: true,
  },
  {
    title: "Wen Bing Formulas (coming soon)",
    description: "Formulas from the Wen Bing (Warm Disease) school.",
    icon: "🔥",
    color: COLORS.accentCrimson,
    textColor: COLORS.accentIvory,
    route: "",
    comingSoon: true,
  },
  {
    title: "Shang Han Lun Formulas (coming soon)",
    description: "Formulas from the Shang Han Lun (Cold Damage) school.",
    icon: "❄️",
    color: COLORS.accentBlue,
    textColor: COLORS.backgroundGold,
    route: "",
    comingSoon: true,
  },
  {
    title: "Formulas Listed by Symptom (coming soon)",
    description: "Find formulas based on presenting symptoms.",
    icon: "🤒",
    color: COLORS.backgroundRed,
    textColor: COLORS.accentIvory,
    route: "",
    comingSoon: true,
  },
  {
    title: "Formulas Listed by TCM Syndrome (coming soon)",
    description: "Browse formulas by TCM syndrome or pattern.",
    icon: "🩺",
    color: COLORS.accentEmerald,
    textColor: COLORS.accentIvory,
    route: "",
    comingSoon: true,
  },
  {
    title: "Formulas by TCM Diagnosis (coming soon)",
    description: "Find formulas based on TCM patterns and diagnoses.",
    icon: "📋",
    color: COLORS.backgroundGold,
    textColor: COLORS.backgroundRed,
    route: "",
    comingSoon: true,
  },
  {
    title: "Acupuncture Points (coming soon)",
    description:
      "Look up acupuncture point locations, functions, and indications.",
    icon: "🧷",
    color: COLORS.accentBlue,
    textColor: COLORS.backgroundGold,
    route: "",
    comingSoon: true,
  },
  {
    title: "Treatment Plans by Syndrome (coming soon)",
    description: "Treatment strategies based on TCM syndromes and patterns.",
    icon: "🩺",
    color: COLORS.accentEmerald,
    textColor: COLORS.accentIvory,
    route: "",
    comingSoon: true,
  },
  {
    title: "TCM Games (coming soon)",
    description:
      "Test your skills and knowledge with interactive learning games.",
    icon: "🎮",
    color: COLORS.accentBlue,
    textColor: COLORS.backgroundGold,
    route: "",
    comingSoon: true,
  },
];

// Responsive background image hook
function useResponsiveBgImage() {
  const [bgImage, setBgImage] = useState("/images/backgroundlarger2.jpg");
  useEffect(() => {
    function updateBg() {
      if (window.innerWidth < 700) {
        setBgImage("/images/backgroundsmaller2.jpg");
      } else {
        setBgImage("/images/backgroundlarger2.jpg");
      }
    }
    updateBg();
    window.addEventListener("resize", updateBg);
    return () => window.removeEventListener("resize", updateBg);
  }, []);
  return bgImage;
}

const GlobalAnimations = () => (
  <style>
    {`
      body { margin: 0; padding: 0; }
      @keyframes fadeInScaleUp {
        0% { opacity: 0; transform: scale(0.97) translateY(14px);}
        50% { opacity: 0.7; transform: scale(1.03) translateY(-6px);}
        100% { opacity: 1; transform: scale(1) translateY(0);}
      }
      .animate-fadeInScaleUp { animation: fadeInScaleUp 0.7s cubic-bezier(.36,1.29,.45,1.01); }
      @keyframes cardPulse {
        0% { box-shadow: 0 6px 40px -8px ${COLORS.shadowStrong}; border-color: ${COLORS.accentGold}; }
        50% { box-shadow: 0 12px 48px -8px ${COLORS.shadowStrong}; border-color: ${COLORS.accentDarkGold}; }
        100% { box-shadow: 0 6px 40px -8px ${COLORS.shadowStrong}; border-color: ${COLORS.accentGold}; }
      }
      .animate-cardPulse:hover { animation: cardPulse 1.2s cubic-bezier(.36,1.29,.45,1.01) infinite; }
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
      @keyframes iconBounce {
        0% { transform: scale(1) translateY(0);}
        30% { transform: scale(1.15) translateY(-8px);}
        50% { transform: scale(0.96) translateY(5px);}
        80% { transform: scale(1.08) translateY(-3px);}
        100% { transform: scale(1) translateY(0);}
      }
      .animate-iconBounce { animation: iconBounce 1.7s infinite; }
      @keyframes cardTextFade {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
      .animate-cardTextFade { animation: cardTextFade 0.9s cubic-bezier(.36,1.29,.45,1.01); }
      .card-shadow {
        box-shadow: 0 6px 40px -8px ${COLORS.shadowStrong};
        min-width: 270px;
        max-width: 340px;
        width: 100%;
        border-radius: 1.2em;
        padding: 40px 24px 30px 24px;
        font-size: 1.12rem;
        border: 2.5px solid ${COLORS.accentGold};
      }
      @media (max-width: 900px) {
        .max-w-2xl {
          max-width: 98vw !important;
        }
        .card-shadow {
          min-width: 98vw !important;
          max-width: 99vw !important;
          padding: 24px 6px 16px 6px !important;
          font-size: 1em !important;
        }
      }
      @media (max-width: 600px) {
        .max-w-2xl {
          max-width: 99vw !important;
        }
        .card-shadow {
          min-width: 99vw !important;
        }
      }
      @media (max-width: 500px) {
        header { flex-direction: column !important; padding: 10px 2px !important; }
        .max-w-2xl { max-width: 100vw !important; }
        .card-shadow { min-width: 100vw !important; max-width: 100vw !important; padding: 20px 2px 12px 2px !important; }
        .tutorial-btn { padding: 12px 8vw !important; font-size: 1em; }
        .hero-top { padding: 8px 2vw !important; }
      }
      .tutorial-btn {
        background: linear-gradient(92deg, #D4AF37 0%, #B38E3F 100%);
        color: #44210A;
        font-weight: 900;
        font-size: 1.12em;
        border: none;
        border-radius: 2em;
        padding: 14px 30px;
        box-shadow: 0 6px 24px -8px #B38E3FCC, 0 2px 8px #E3BC6F33;
        margin-bottom: 1.1em;
        cursor: pointer;
        transition: background 0.18s, transform 0.13s, box-shadow 0.18s;
        position: relative;
        z-index: 2;
        outline: none;
        letter-spacing: -0.01em;
        display: inline-flex;
        align-items: center;
        gap: 0.7em;
        user-select: none;
        font-family: "Noto Serif SC", "Songti SC", "KaiTi", serif;
      }
      .tutorial-btn:hover, .tutorial-btn:focus {
        background: linear-gradient(92deg, #B38E3F 0%, #D4AF37 100%);
        color: #FCF5E5;
        transform: scale(1.04) translateY(-2px);
        box-shadow: 0 12px 32px -10px #B38E3FCC;
      }
      .tutorial-btn-icon {
        font-size: 1.8em;
        filter: drop-shadow(0 2px 8px #44210A);
        animation: iconBounce 1.7s infinite;
      }
      .tutorial-btn-label {
        font-size: 1.08em;
        font-weight: 900;
        background: linear-gradient(90deg, #D4AF37 20%, #9A2D1F 80%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
        text-shadow: 0 1px 6px #B38E3F44;
        letter-spacing: -0.01em;
        font-family: "Noto Serif SC", "Songti SC", "KaiTi", serif;
      }
    `}
  </style>
);

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function TutorialModal({ open, onClose }) {
  if (!open) return null;
  const youtubeVideoId = "esDYrMcjCJw";
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${youtubeVideoId}?rel=0&modestbranding=1`;

  return (
    <div className="tutorial-modal-backdrop" tabIndex={-1} onClick={onClose}>
      <div
        className="tutorial-modal-content"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          className="tutorial-modal-close-btn"
          onClick={onClose}
          aria-label="Close tutorial"
          title="Close"
        >
          ×
        </button>
        <div className="tutorial-video-title">Site Tutorial</div>
        <div className="tutorial-video-description">
          Watch this walkthrough to learn how to use the TCM Atlas website.<br />
          <span style={{ fontSize: "0.95em", color: COLORS.accentGold }}>
            (You can pause, adjust volume, or scrub the timeline.)
          </span>
        </div>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, width: "100%" }}>
            <iframe
              className="tutorial-modal-video"
              src={youtubeEmbedUrl}
              title="TCM Atlas Tutorial"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                borderRadius: "1em",
                border: `2px solid ${COLORS.accentGold}`,
                boxShadow: "0 4px 18px -6px " + COLORS.shadowStrong,
                background: COLORS.accentIvory,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function VisitorCounter() {
  const [count, setCount] = useState(null);
  useEffect(() => {
    if (!localStorage.getItem("hasVisitedTCMPartyPalace")) {
      fetch(`https://thetcmatlas.fly.dev/api/visit`, { method: "POST" })
        .then((res) => res.json())
        .then((data) => setCount(data.count))
        .catch(() => setCount("..."));
      localStorage.setItem("hasVisitedTCMPartyPalace", "true");
    } else {
      fetch(`https://thetcmatlas.fly.dev/api/visit`)
        .then((res) => res.json())
        .then((data) => setCount(data.count))
        .catch(() => setCount("..."));
    }
  }, []);
  return (
    <div
      className="flex flex-col items-center justify-center w-full"
      style={{
        minHeight: "40px",
        padding: "10px 0",
      }}
    >
      <div
        style={{
          background: COLORS.backgroundGold,
          color: COLORS.backgroundRed,
          border: `2px double ${COLORS.accentGold}`,
          borderRadius: "2em",
          padding: "10px 24px",
          fontSize: "1.09em",
          fontWeight: 800,
          boxShadow: `0 4px 18px -8px ${COLORS.shadowStrong}`,
          marginBottom: "0.2em",
          fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
        }}
      >
        You are visitor number <span style={{ color: COLORS.accentGold, fontWeight: 900, fontSize: "1.22em" }}>
          {count !== null ? count : "..."}
        </span>!
      </div>
    </div>
  );
}

function AnimatedBuildLearnPractice() {
  return (
    <div
      className="animate-shimmerText"
      style={{
        fontWeight: 900,
        fontSize: "2.2rem",
        letterSpacing: "-.02em",
        marginBottom: "0.21em",
        marginTop: "0.21em",
        textShadow: `
          0 4px 16px ${COLORS.accentGold},
          0 1px 0 ${COLORS.backgroundGold},
          0 0 16px ${COLORS.backgroundRed},
          0 0 0 #000
        `,
        userSelect: "none",
        borderRadius: "1em",
        WebkitFontSmoothing: "antialiased",
        filter: "drop-shadow(0 3px 1px rgba(179,142,63,0.18))",
        transition: "font-size 0.2s",
        fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
        position: "relative",
        zIndex: 2,
        display: "block",
        textAlign: "center"
      }}
    >
      Build · Learn · Practice
    </div>
  );
}

function ScrollDownHint() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const hasDismissed = document.cookie
      .split("; ")
      .find((row) => row.startsWith("tcmpartypalace_scrollhint="));
    if (!hasDismissed) setVisible(true);
    function onScroll() {
      if (window.scrollY > 50 && visible) {
        setVisible(false);
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);
        document.cookie = `tcmpartypalace_scrollhint=true; expires=${expires.toUTCString()}; path=/`;
      }
    }
    if (visible) {
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    return () => window.removeEventListener("scroll", onScroll);
  }, [visible]);
  if (!visible) return null;
  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        transform: "translateX(-50%)",
        bottom: 20,
        zIndex: 9999,
        padding: "13px 30px 13px 30px",
        background: COLORS.backgroundRed,
        color: COLORS.accentGold,
        borderRadius: "2em",
        fontWeight: 700,
        fontSize: "1.13em",
        boxShadow: `0 6px 28px -8px ${COLORS.shadowStrong}`,
        border: `2px double ${COLORS.accentGold}`,
        display: "flex",
        alignItems: "center",
        gap: "1em",
        pointerEvents: "none",
        opacity: 0.96,
        userSelect: "none",
        transition: "opacity 0.2s",
        fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
      }}
      className="animate-fadeInScaleUp"
    >
      <span>Scroll down for more!</span>
      <span
        style={{
          fontSize: "2em",
          lineHeight: "1em",
          display: "inline-block",
        }}
        className="animate-arrowBounce"
      >
        ↓
      </span>
    </div>
  );
}

function Home() {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("role") === "admin" && localStorage.getItem("token");
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const bgImage = useResponsiveBgImage();

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: COLORS.backgroundGold,
        overflowX: "hidden",
        fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
        position: "relative",
      }}
      className="flex flex-col"
    >
      <GlobalAnimations />
      <ScrollDownHint />
      <TutorialModal open={tutorialOpen} onClose={() => setTutorialOpen(false)} />
      {/* NAV BAR */}
      <header
        className="py-5 px-5 flex justify-between items-center shadow-lg animate-fadeInScaleUp"
        style={{
          background: "rgba(166,44,26,0.92)",
          borderBottom: `5px double ${COLORS.accentGold}`,
          display: "flex",
          flexDirection: window.innerWidth < 600 ? "column" : "row",
          flexWrap: "wrap",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Logo size={window.innerWidth < 600 ? 44 : 60} showBeta={true} style={{ marginRight: "1em", filter: "drop-shadow(0 2px 7px #C9A052)" }} />
        <nav style={{ display: "flex", alignItems: "center", gap: "2em", flexWrap: "wrap" }}>
          <ul
            className="flex gap-7 font-semibold"
            style={{ margin: 0, padding: 0, flexWrap: "wrap", fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif' }}
          >
            <li>
              <button
                style={{
                  color: COLORS.accentGold,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  font: "inherit",
                  padding: 0,
                  fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif'
                }}
                onClick={() => navigate("report")}
              >
                Report an Error
              </button>
            </li>
            <li>
              <button
                style={{
                  color: COLORS.accentGold,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  font: "inherit",
                  padding: 0,
                  fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif'
                }}
                onClick={() => navigate("about")}
              >
                About
              </button>
            </li>
          </ul>
          {!isAdmin ? (
            <>
              <button
                style={{
                  marginLeft: "2em",
                  background: COLORS.accentGold,
                  color: COLORS.backgroundRed,
                  border: "none",
                  borderRadius: "1.3em",
                  fontWeight: 700,
                  fontSize: "1em",
                  padding: "8px 26px",
                  cursor: "pointer",
                  boxShadow: `0 3px 8px -2px ${COLORS.shadowStrong}`,
                }}
                className="hover:bg-accentDarkGold"
                onClick={() => navigate("login")}
              >
                Admin Login
              </button>
              <button
                style={{
                  marginLeft: "0.5em",
                  background: COLORS.accentBlack,
                  color: COLORS.accentGold,
                  border: "none",
                  borderRadius: "1.3em",
                  fontWeight: 700,
                  fontSize: "1em",
                  padding: "8px 26px",
                  cursor: "pointer",
                  boxShadow: `0 3px 8px -2px ${COLORS.shadowStrong}`,
                }}
                className="hover:bg-backgroundRed"
                onClick={() => navigate("register")}
              >
                Register Admin
              </button>
            </>
          ) : (
            <button
              style={{
                marginLeft: "2em",
                background: COLORS.accentEmerald,
                color: COLORS.accentIvory,
                border: "none",
                borderRadius: "1.3em",
                fontWeight: 700,
                fontSize: "1em",
                padding: "8px 26px",
                cursor: "pointer",
                boxShadow: `0 3px 8px -2px ${COLORS.shadowStrong}`,
              }}
              className="hover:bg-backgroundRed"
              onClick={() => navigate("admin")}
            >
              Admin Dashboard
            </button>
          )}
        </nav>
      </header>
      {/* HERO SECTION */}
      <div
        style={{
          width: "100%",
          minHeight: window.innerWidth < 700 ? "220px" : "330px",
          background: `url('${bgImage}') center center / cover no-repeat`,
          borderBottom: `5px double ${COLORS.accentGold}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          position: "relative",
        }}
      >
        <div className="hero-top" style={{
          width: "100%",
          maxWidth: 720,
          margin: "0 auto",
          zIndex: 2,
          padding: window.innerWidth < 500 ? "8px 2vw" : "24px 1vw",
          position: "relative"
        }}>
          <HomePageSearchBar />
        </div>
        <div className="animate-fadeInScaleUp" style={{
          width: "100%",
          maxWidth: window.innerWidth < 900 ? "99vw" : "700px",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
          padding: window.innerWidth < 500 ? "0 2vw" : "0",
        }}>
          <section
            className="flex flex-col justify-center items-center text-center px-4 animate-fadeInScaleUp"
            style={{
              background: "rgba(252,245,229,0.93)",
              borderRadius: "1.4em",
              boxShadow: `0 2px 18px 0 ${COLORS.shadowStrong}`,
              border: `2px solid ${COLORS.accentGold}`,
              margin: "0 auto",
              marginBottom: window.innerWidth < 700 ? "12px" : "32px",
              pointerEvents: "all",
              paddingTop: "32px" // <--- extra padding above Watch Tutorial button
            }}
          >
            <button
              onClick={() => setTutorialOpen(true)}
              className="tutorial-btn animate-fadeInScaleUp"
              aria-label="Open site tutorial"
            >
              <span className="tutorial-btn-icon" aria-hidden="true">📺</span>
              <span className="tutorial-btn-label">Watch Tutorial</span>
            </button>
            <AnimatedBuildLearnPractice />
            <VisitorCounter />
            <p
              className="text-xl mb-7 animate-cardTextFade"
              style={{
                color: COLORS.accentBlack,
                fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
                fontWeight: 500,
                marginTop: 12
              }}
            >
              Interactive clinical and educational tool for Chinese Medicine
            </p>
          </section>
        </div>
      </div>
      {/* CARD BUTTONS */}
      <section
        className="w-full flex flex-wrap justify-center gap-10 px-8 pb-12 mt-2"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: window.innerWidth < 600 ? "14px" : "28px",
          marginTop: window.innerWidth < 700 ? "10px" : "24px"
        }}
      >
        {CARD_DATA.map((card, i) => (
          <button
            key={card.title}
            className="card-shadow animate-fadeInScaleUp animate-cardPulse transition hover:scale-105 flex flex-col items-center"
            style={{
              background: card.color,
              color: card.textColor,
              borderRadius: "1.2em",
              minWidth: 270,
              maxWidth: 340,
              width: "100%",
              padding: window.innerWidth < 600 ? "30px 10px 20px 10px" : "40px 24px 30px 24px",
              fontWeight: 700,
              fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
              fontSize: "1.12rem",
              border: `2.5px solid ${COLORS.accentGold}`,
              marginBottom: 10,
              cursor: card.comingSoon ? "not-allowed" : "pointer",
              position: "relative",
              boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
              opacity: card.comingSoon ? 0.55 : 1,
              filter: card.comingSoon ? "grayscale(0.35)" : "none",
              textAlign: "center",
            }}
            onClick={() => {
              if (!card.comingSoon && card.route) {
                navigate(card.route);
              }
            }}
            disabled={card.comingSoon}
            aria-disabled={card.comingSoon}
            title={card.comingSoon ? "Coming soon!" : ""}
          >
            <span
              className="animate-iconBounce"
              style={{
                fontSize: "2.5em",
                marginBottom: "0.13em",
                textShadow: `0 2px 7px ${COLORS.accentGold}, 0 0 10px ${COLORS.backgroundRed}`,
                display: "block",
              }}
            >
              {card.icon}
            </span>
            <span
              className="animate-cardTextFade"
              style={{
                fontSize: "1.22em",
                fontWeight: 900,
                letterSpacing: "-.01em",
                marginBottom: 7,
                color: card.textColor,
                textShadow: `0 1px 0 ${COLORS.backgroundGold}, 0 1.5px 8px ${COLORS.accentGold}18`,
                fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
              }}
            >
              {card.title}
            </span>
            <span
              className="animate-cardTextFade"
              style={{
                fontWeight: 500,
                fontSize: "1.03em",
                color: card.textColor,
                opacity: 0.93,
                textShadow: `0 1px 0 ${COLORS.backgroundGold}`,
                marginBottom: 2,
                fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
              }}
            >
              {card.description}
            </span>
          </button>
        ))}
      </section>
      {/* FOOTER */}
      <footer
        className="p-6 text-center animate-cardTextFade"
        style={{
          background: COLORS.backgroundRed,
          color: COLORS.accentGold,
          fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
          borderTop: `5px double ${COLORS.accentGold}`,
          fontWeight: 700,
          letterSpacing: "0.02em",
          marginTop: window.innerWidth < 700 ? "10px" : "24px"
        }}
      >
        <p>
          &copy; {new Date().getFullYear()} The TCM Atlas · Made with passion for Chinese Medicine
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <HerbCartProvider>
      <Router>
        <ScrollToTop />
        <GlobalAnimations />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route index element={<Home />} />
          <Route path="formulabuilder" element={<FormulaBuilder />} />
          <Route path="herb/:id" element={<HerbCard />} />
          <Route path="herbCard" element={<HerbCard />} />
          <Route path="formulacard/:id" element={<FormulaCard />} />
          <Route path="formulaCard" element={<FormulaCard />} />
          <Route path="formulacategorylist" element={<FormulaCategoryList />} />
          <Route path="herbcategorylist" element={<HerbCategoryList />} />
          <Route path="herbgroups" element={<HerbGroupsPage />} />
          <Route path="report" element={<ReportBug />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="about" element={<About />} />
        </Routes>
      </Router>
    </HerbCartProvider>
  );
}