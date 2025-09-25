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
import FooterCard from "./components/FooterCard";
import NavBar from "./components/NavBar";
import ComingSoon from "./pages/ComingSoon";
import ElementQuizComprehensive from "./pages/ElementQuizComprehensive";
import ElementQuizResults from "./pages/ElementQuizResults";
import WhatIsChineseMedicine from "./pages/WhatIsChineseMedicine";
import TCMGameLanding from "./pages/TCMGameLanding";
import FormulaIngredientsRoutes from "./pages/FormulaIngredientsRoutes";
import HerbMemoryGame from "./pages/HerbMemoryRoutes";

// Add your new import for the games page here if/when you implement it, e.g.:
// import TCMGamesPage from "./pages/TCMGamesPage";

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
    route: "/formulabuilder",
  },
  {
    title: "Formulas Listed by Category",
    description:
      "Explore classic formulas grouped by their TCM function and type.",
    icon: "⛩️",
    color: COLORS.backgroundGold,
    textColor: COLORS.backgroundRed,
    route: "/formulacategorylist",
  },
  {
    title: "Herbs Listed by Category",
    description:
      "Browse all Chinese herbs organized by their traditional categories.",
    icon: "🌱",
    color: COLORS.accentEmerald,
    textColor: COLORS.accentIvory,
    route: "/herbcategorylist",
  },
  {
    title: "Common Herb Combinations",
    description: "Explore herbs grouped by similar functions and properties.",
    icon: "🍃",
    color: COLORS.accentGold,
    textColor: COLORS.accentBlack,
    route: "/herbgroups",
  },
  {
    title: "Five Element Personality Quiz",
    description: "Rank your top three TCM personality elements with 100 comprehensive questions.",
    icon: "🌟",
    color: COLORS.accentBlue,
    textColor: COLORS.accentIvory,
    route: "/elementquiz",
  },
  {
    title: "What is Chinese medicine?",
    description: "Learn about the foundations, history, and principles of TCM.",
    icon: "❓",
    color: COLORS.accentGray,
    textColor: COLORS.backgroundRed,
    route: "/whatischinesemedicine",
  },
  // --- NEW CARD: TCM Games ---
  {
    title: "TCM Games",
    description: "Play games based on herbs and formulas to reinforce learning and have fun.",
    icon: "🎲",
    color: COLORS.accentBlue,
    textColor: COLORS.accentIvory,
    route: "/tcmgames",
  },
];

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
      .navbar-fixed {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        z-index: 100;
        background: ${COLORS.backgroundRed};
        box-shadow: 0 2px 16px -6px ${COLORS.shadowStrong};
        height: 84px;
        min-height: 84px;
      }
      .navbar-spacer {
        width: 100vw;
        min-width: 100vw;
        height: 84px;
      }
      @media (max-width: 700px) {
        .navbar-fixed {
          height: 74px !important;
          min-height: 74px !important;
        }
        .navbar-spacer { height: 74px !important; }
      }
      @media (max-width: 500px) {
        .navbar-fixed {
          height: 74px !important;
          min-height: 74px !important;
        }
        .navbar-spacer { height: 74px !important; }
      }
      .main-content {
        position: relative;
        z-index: 1;
        width: 100vw;
        background: ${COLORS.backgroundGold};
      }
      .hero-section {
        width: 100vw;
        min-height: 220px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        position: relative;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        border-bottom: 5px double ${COLORS.accentGold};
        box-sizing: border-box;
        margin-top: 0 !important;
      }
      @media (min-width: 700px) {
        .hero-section { min-height: 330px; }
      }
      .hero-content {
        width: 100%;
        max-width: 720px;
        margin: 0 auto;
        z-index: 2;
        padding: 24px 1vw;
        position: relative;
      }
      @media (max-width: 500px) {
        .hero-content { padding: 8px 2vw; }
      }
      .home-cards {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 28px;
        margin-top: 24px;
        padding: 0 8px 32px 8px;
      }
      @media (max-width: 700px) {
        .home-cards { gap: 14px; margin-top: 10px; padding-bottom: 18px; }
      }
      @media (max-width: 500px) {
        .home-cards { gap: 8px; }
      }
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
        .card-shadow {
          min-width: 98vw !important;
          max-width: 99vw !important;
          padding: 24px 6px 16px 6px !important;
          font-size: 1em !important;
        }
      }
      @media (max-width: 600px) {
        .card-shadow {
          min-width: 99vw !important;
        }
      }
      @media (max-width: 500px) {
        .card-shadow { min-width: 100vw !important; max-width: 100vw !important; padding: 20px 2px 12px 2px !important; }
      }
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
      @keyframes iconBounce {
        0% { transform: scale(1) translateY(0);}
        30% { transform: scale(1.15) translateY(-8px);}
        50% { transform: scale(0.96) translateY(5px);}
        80% { transform: scale(1.08) translateY(-3px);}
        100% { transform: scale(1) translateY(0);}
      }
      @keyframes cardTextFade {
        0% { opacity: 0; }
        100% { opacity: 1; }
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
        letter-spacing: -0.01em;
        display: inline-flex;
        align-items: center;
        gap: 0.7em;
        user-select: none;
        font-family: "Noto Serif SC", "Songti SC", "KaiTi", serif;
        outline: none;
        z-index: 2;
      }
      .tutorial-btn:hover, .tutorial-btn:focus {
        background: linear-gradient(92deg, #B38E3F 0%, #D4AF37 100%);
        color: #FCF5E5;
        transform: scale(1.04) translateY(-2px);
        box-shadow: 0 12px 32px -10px #B38E3FCC;
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
    <div
      style={{
        position: "fixed",
        zIndex: 9999,
        top: 0, left: 0, width: "100vw", height: "100vh",
        background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      tabIndex={-1}
      onClick={onClose}
    >
      <div
        style={{
          background: COLORS.accentIvory,
          borderRadius: "1.4em",
          boxShadow: `0 8px 32px -10px ${COLORS.shadowStrong}`,
          border: `2px solid ${COLORS.accentGold}`,
          padding: "22px 22px 14px 22px",
          maxWidth: 440,
          width: "90vw",
          position: "relative"
        }}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          aria-label="Close tutorial"
          title="Close"
          style={{
            position: "absolute",
            top: 8,
            right: 16,
            background: "none",
            border: "none",
            fontSize: "1.7em",
            color: COLORS.accentGold,
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          ×
        </button>
        <div style={{fontSize: "1.3em", fontWeight: 700, marginBottom: 10, color: COLORS.backgroundRed}}>Site Tutorial</div>
        <div style={{marginBottom: 8, fontWeight: 500}}>
          Watch this walkthrough to learn how to use the TCM Atlas website.<br />
          <span style={{ fontSize: "0.95em", color: COLORS.accentGold }}>
            (You can pause, adjust volume, or scrub the timeline.)
          </span>
        </div>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, width: "100%" }}>
            <iframe
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
      style={{
        minHeight: "40px",
        padding: "10px 0",
        textAlign: "center",
        width: "100%",
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
          display: "inline-block",
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
        textAlign: "center",
        background: `linear-gradient(90deg, ${COLORS.accentGold}, ${COLORS.backgroundRed}, ${COLORS.accentEmerald}, ${COLORS.backgroundGold})`,
        backgroundSize: "400% 400%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        textFillColor: "transparent",
        animation: "shimmerText 3.2s ease-in-out infinite",
      }}
    >
      Build · Learn · Practice
    </div>
  );
}

function Home() {
  const navigate = useNavigate();
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

      <div className="navbar-fixed">
        <NavBar
          showReportError={true}
          showAbout={true}
          showAdminButtons={true}
          showLogo={true}
          fixed={true}
        />
      </div>
      <div className="navbar-spacer"></div>
      <div className="main-content">
        <TutorialModal open={tutorialOpen} onClose={() => setTutorialOpen(false)} />
        <div
          className="hero-section"
          style={{
            backgroundImage: `url('${bgImage}')`
          }}
        >
          <div className="hero-content">
            <HomePageSearchBar />
          </div>
          <div
            className="animate-fadeInScaleUp"
            style={{
              width: "100%",
              maxWidth: "700px",
              margin: "0 auto",
              position: "relative",
              zIndex: 2,
              padding: window.innerWidth < 500 ? "0 2vw" : "0",
            }}
          >
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
                paddingTop: "32px"
              }}
            >
              <button
                onClick={() => setTutorialOpen(true)}
                className="tutorial-btn"
                aria-label="Open site tutorial"
              >
                <span
                  style={{
                    fontSize: "1.8em",
                    filter: "drop-shadow(0 2px 8px #44210A)",
                    animation: "iconBounce 1.7s infinite",
                  }}
                  aria-hidden="true"
                >
                  📺
                </span>
                <span
                  style={{
                    fontSize: "1.08em",
                    fontWeight: 900,
                    background: "linear-gradient(90deg, #D4AF37 20%, #9A2D1F 80%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    textFillColor: "transparent",
                    textShadow: "0 1px 6px #B38E3F44",
                    letterSpacing: "-0.01em",
                    fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
                  }}
                >
                  Watch Tutorial
                </span>
              </button>
              <AnimatedBuildLearnPractice />
              <VisitorCounter />
              <p
                style={{
                  color: COLORS.accentBlack,
                  fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
                  fontWeight: 500,
                  marginTop: 12,
                  fontSize: "1.25em",
                  marginBottom: "1em"
                }}
              >
                Interactive clinical and educational tool for Chinese Medicine
              </p>
            </section>
          </div>
        </div>
        <section className="home-cards">
          {CARD_DATA.map((card, idx) => (
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
                cursor: "pointer",
                position: "relative",
                boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
                textAlign: "center",
                transition: "box-shadow 0.2s, transform 0.2s",
              }}
              onClick={() => {
                if (card.route) {
                  navigate(card.route);
                }
              }}
            >
              <span
                style={{
                  fontSize: "2.5em",
                  marginBottom: "0.13em",
                  textShadow: `0 2px 7px ${COLORS.accentGold}, 0 0 10px ${COLORS.backgroundRed}`,
                  display: "block",
                  animation: "iconBounce 1.7s infinite",
                }}
              >
                {card.icon}
              </span>
              <span
                style={{
                  fontSize: "1.22em",
                  fontWeight: 900,
                  letterSpacing: "-.01em",
                  marginBottom: 7,
                  color: card.textColor,
                  textShadow: `0 1px 0 ${COLORS.backgroundGold}, 0 1.5px 8px ${COLORS.accentGold}18`,
                  fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
                  animation: "cardTextFade 0.9s cubic-bezier(.36,1.29,.45,1.01)",
                }}
              >
                {card.title}
              </span>
              <span
                style={{
                  fontWeight: 500,
                  fontSize: "1.03em",
                  color: card.textColor,
                  opacity: 0.93,
                  textShadow: `0 1px 0 ${COLORS.backgroundGold}`,
                  marginBottom: 2,
                  fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
                  animation: "cardTextFade 0.9s cubic-bezier(.36,1.29,.45,1.01)",
                }}
              >
                {card.description}
              </span>
            </button>
          ))}
          <button
            className="card-shadow animate-fadeInScaleUp transition hover:scale-105 flex flex-col items-center"
            style={{
              background: COLORS.backgroundRed,
              color: COLORS.accentIvory,
              borderRadius: "1.2em",
              minWidth: 270,
              maxWidth: 340,
              width: "100%",
              padding: window.innerWidth < 600 ? "30px 10px 20px 10px" : "40px 24px 30px 24px",
              fontWeight: 900,
              fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
              fontSize: "1.15rem",
              border: `2.5px solid ${COLORS.accentGold}`,
              marginBottom: 10,
              cursor: "pointer",
              position: "relative",
              boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
              textAlign: "center",
              transition: "box-shadow 0.2s, transform 0.2s",
            }}
            onClick={() => navigate('/comingsoon')}
            aria-label="View coming soon features"
          >
            <span
              style={{
                fontSize: "2.5em",
                marginBottom: "0.13em",
                textShadow: `0 2px 7px ${COLORS.accentGold}, 0 0 10px ${COLORS.backgroundRed}`,
                display: "block",
                animation: "iconBounce 1.7s infinite",
              }}
              aria-hidden="true"
            >
              🚧
            </span>
            <span
              style={{
                fontSize: "1.22em",
                fontWeight: 900,
                letterSpacing: "-.01em",
                marginBottom: 7,
                color: COLORS.accentIvory,
                textShadow: `0 1px 0 ${COLORS.backgroundGold}, 0 1.5px 8px ${COLORS.accentGold}18`,
                fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
                animation: "cardTextFade 0.9s cubic-bezier(.36,1.29,.45,1.01)",
              }}
            >
              Coming Soon
            </span>
            <span
              style={{
                fontWeight: 500,
                fontSize: "1.03em",
                color: COLORS.accentIvory,
                opacity: 0.98,
                textShadow: `0 1px 0 ${COLORS.backgroundGold}`,
                marginBottom: 2,
                fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
                animation: "cardTextFade 0.9s cubic-bezier(.36,1.29,.45,1.01)",
              }}
            >
              Click to see all future features planned for TCM Atlas!
            </span>
          </button>
        </section>
        <FooterCard />
      </div>
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
          <Route path="/formulabuilder" element={<FormulaBuilder />} />
          <Route path="/herb/:id" element={<HerbCard />} />
          <Route path="/herbCard" element={<HerbCard />} />
          <Route path="/formulacard/:id" element={<FormulaCard />} />
          <Route path="/formulaCard" element={<FormulaCard />} />
          <Route path="/formulacategorylist" element={<FormulaCategoryList />} />
          <Route path="/herbcategorylist" element={<HerbCategoryList />} />
          <Route path="/herbgroups" element={<HerbGroupsPage />} />
          <Route path="/report" element={<ReportBug />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/comingsoon" element={<ComingSoon />} />
          <Route path="/elementquiz" element={<ElementQuizComprehensive />} />
          <Route path="/elementquizresults" element={<ElementQuizResults />} />
          <Route path="/whatischinesemedicine" element={<WhatIsChineseMedicine />} />
          <Route path="/tcmgames" element={<TCMGameLanding />} />
          <Route path="/game/formula-ingredients/*" element={<FormulaIngredientsRoutes />} />
          <Route path="/game/herbs/*" element={<HerbMemoryGame />} />
        </Routes>
      </Router>
    </HerbCartProvider>
  );
}