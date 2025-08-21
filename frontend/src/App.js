import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
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
import About from "./pages/About"; // <-- import your new About page here

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

const CARD_DATA = [
  {
    title: "Create Formula",
    description: "Build, compare, and save your own herbal formulas.",
    icon: "🛠️",
    color: COLORS.highlight,
    textColor: COLORS.claret,
    route: "/formulabuilder",
    comingSoon: false,
  },
  {
    title: "Formulas Listed by Category",
    description:
      "Explore classic formulas grouped by their TCM function and type.",
    icon: "⚗️",
    color: COLORS.carolina,
    textColor: COLORS.seal,
    route: "/formulacategorylist",
    comingSoon: false,
  },
  {
    title: "Herbs Listed by Category",
    description:
      "Browse all Chinese herbs organized by their traditional categories.",
    icon: "🌿",
    color: COLORS.violet,
    textColor: COLORS.vanilla,
    route: "/herbcategorylist",
    comingSoon: false,
  },
  {
    title: "Common Herb Combinations",
    description: "Explore herbs grouped by similar functions and properties.",
    icon: "🧩",
    color: COLORS.claret,
    textColor: COLORS.vanilla,
    route: "/herbgroups",
    comingSoon: false,
  },
  {
    title: "Dui Yao Herb Pairs (coming soon)",
    description: "Classic synergistic herb pairs used in Chinese medicine.",
    icon: "👯‍♂️",
    color: COLORS.violet,
    textColor: COLORS.vanilla,
    route: "",
    comingSoon: true,
  },
  {
    title: "Wen Bing Formulas (coming soon)",
    description: "Formulas from the Wen Bing (Warm Disease) school.",
    icon: "🔥",
    color: COLORS.highlight,
    textColor: COLORS.claret,
    route: "",
    comingSoon: true,
  },
  {
    title: "Shang Han Lun Formulas (coming soon)",
    description: "Formulas from the Shang Han Lun (Cold Damage) school.",
    icon: "❄️",
    color: COLORS.carolina,
    textColor: COLORS.seal,
    route: "",
    comingSoon: true,
  },
  {
    title: "Formulas Listed by Symptom (coming soon)",
    description: "Find formulas based on presenting symptoms .",
    icon: "🤒",
    color: COLORS.claret,
    textColor: COLORS.vanilla,
    route: "",
    comingSoon: true,
  },
  {
    title: "Formulas Listed by TCM Syndrome (coming soon)",
    description: "Browse formulas by TCM syndrome or pattern.",
    icon: "🩺",
    color: COLORS.seal,
    textColor: COLORS.vanilla,
    route: "",
    comingSoon: true,
  },
  {
    title: "Formulas by TCM Diagnosis (coming soon)",
    description: "Find formulas based on TCM patterns and diagnoses.",
    icon: "📋",
    color: COLORS.vanilla,
    textColor: COLORS.claret,
    route: "",
    comingSoon: true,
  },
  {
    title: "Acupuncture Points (coming soon)",
    description:
      "Look up acupuncture point locations, functions, and indications.",
    icon: "🧷",
    color: COLORS.seal,
    textColor: COLORS.vanilla,
    route: "",
    comingSoon: true,
  },
  {
    title: "Treatment Plans by Syndrome (coming soon)",
    description: "Treatment strategies based on TCM syndromes and patterns.",
    icon: "🩺",
    color: COLORS.carolina,
    textColor: COLORS.seal,
    route: "",
    comingSoon: true,
  },
  {
    title: "TCM Games (coming soon)",
    description:
      "Test your skills and knowledge with interactive learning games.",
    icon: "🎮",
    color: COLORS.violet,
    textColor: COLORS.vanilla,
    route: "",
    comingSoon: true,
  },
];

const GlobalAnimations = () => (
  <style>
    {`
      @keyframes fadeInScaleUp {
        0% { opacity: 0; transform: scale(0.97) translateY(14px);}
        50% { opacity: 0.7; transform: scale(1.03) translateY(-6px);}
        100% { opacity: 1; transform: scale(1) translateY(0);}
      }
      .animate-fadeInScaleUp { animation: fadeInScaleUp 0.7s cubic-bezier(.36,1.29,.45,1.01); }
      @keyframes cardPulse {
        0% { box-shadow: 0 6px 40px -8px ${COLORS.shadowStrong}; border-color: ${COLORS.violet}; }
        50% { box-shadow: 0 12px 48px -8px ${COLORS.shadowStrong}; border-color: ${COLORS.carolina}; }
        100% { box-shadow: 0 6px 40px -8px ${COLORS.shadowStrong}; border-color: ${COLORS.violet}; }
      }
      .animate-cardPulse:hover { animation: cardPulse 1.2s cubic-bezier(.36,1.29,.45,1.01) infinite; }
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
      @keyframes funWiggle {
        0% { transform: rotate(-2deg) scale(0.98);}
        20% { transform: rotate(3deg) scale(1.08);}
        50% { transform: rotate(-2deg) scale(1.05);}
        80% { transform: rotate(2deg) scale(1.03);}
        100% { transform: rotate(-2deg) scale(0.98);}
      }
      .animate-funWiggle { animation: funWiggle 1.8s infinite; }
      @keyframes heroSubPop {
        0% { opacity: 0; transform: scale(0.92);}
        100% { opacity: 1; transform: scale(1);}
      }
      .animate-heroSubPop { animation: heroSubPop 1.3s cubic-bezier(.36,1.29,.45,1.01); }
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
      }
      @keyframes arrowBounce {
        0% { transform: translateY(0);}
        50% { transform: translateY(-16px);}
        100% { transform: translateY(0);}
      }
      .animate-arrowBounce { animation: arrowBounce 1.1s infinite; }
    `}
  </style>
);

// ScrollToTop component for route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AnimatedHeroTitle() {
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
      }}
    >
      TCM Party Palace (BETA) 🎉
    </div>
  );
}

function AnimatedBuildLearnPractice() {
  return (
    <div
      style={{
        fontWeight: 900,
        fontSize: "3.6rem",
        letterSpacing: "-.02em",
        marginBottom: "0.21em",
        marginTop: "0.21em",
        textShadow: `
          0 4px 16px ${COLORS.violet},
          0 1px 0 ${COLORS.vanilla},
          0 0 16px ${COLORS.carolina},
          0 0 0 #000
        `,
        userSelect: "none",
        borderRadius: "1em",
        WebkitFontSmoothing: "antialiased",
        filter: "drop-shadow(0 3px 1px rgba(124,92,211,0.20))",
      }}
    >
      Build, Learn, Practice!
      <span
        style={{
          marginLeft: "0.28em",
          fontSize: "1.2em",
          verticalAlign: "middle",
        }}
      >
        🧑‍🎓🧨
      </span>
    </div>
  );
}

function VisitorCounter() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    // Only increment for unique visitors (per browser/device)
    if (!localStorage.getItem("hasVisitedTCMPartyPalace")) {
      fetch("http://localhost:5000/api/visit", { method: "POST" })
        .then((res) => res.json())
        .then((data) => setCount(data.count))
        .catch(() => setCount("..."));
      localStorage.setItem("hasVisitedTCMPartyPalace", "true");
    } else {
      // Just GET the count, don't increment
      fetch("http://localhost:5000/api/visit")
        .then((res) => res.json())
        .then((data) => setCount(data.count))
        .catch(() => setCount("..."));
    }
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center w-full"
      style={{
        minHeight: "50px",
        padding: "12px 0",
      }}
    >
      <div
        style={{
          background: COLORS.vanilla,
          color: COLORS.claret,
          border: `2px solid ${COLORS.violet}`,
          borderRadius: "2em",
          padding: "12px 32px",
          fontSize: "1.25em",
          fontWeight: 700,
          boxShadow: `0 4px 28px -8px ${COLORS.shadowStrong}`,
          marginBottom: "0.25em",
        }}
      >
        You are visitor number{" "}
        <span
          style={{ color: COLORS.carolina, fontWeight: 900, fontSize: "1.3em" }}
        >
          {count !== null ? count : "..."}
        </span>
        !
      </div>
    </div>
  );
}

// --- ScrollDownHint instructions ---
function ScrollDownHint() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    // Only show if not previously dismissed
    const hasDismissed = document.cookie
      .split("; ")
      .find((row) => row.startsWith("tcmpartypalace_scrollhint="));
    if (!hasDismissed) setVisible(true);

    function onScroll() {
      // Hide and persist in cookie if scrolled down 50px or more
      if (window.scrollY > 50 && visible) {
        setVisible(false);
        // Set cookie to persist for ~1 year
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
        bottom: 24,
        zIndex: 9999,
        padding: "16px 36px 16px 36px",
        background: COLORS.violet,
        color: COLORS.vanilla,
        borderRadius: "2em",
        fontWeight: 700,
        fontSize: "1.21em",
        boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
        border: `2px solid ${COLORS.carolina}`,
        display: "flex",
        alignItems: "center",
        gap: "1em",
        pointerEvents: "none",
        opacity: 0.95,
        userSelect: "none",
        transition: "opacity 0.2s",
      }}
      className="animate-fadeInScaleUp"
    >
      <span>Scroll down for more!</span>
      <span
        style={{
          fontSize: "2.2em",
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
  const isAdmin =
    localStorage.getItem("role") === "admin" && localStorage.getItem("token");
  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(120deg, ${COLORS.vanilla} 0%, ${COLORS.carolina} 50%, ${COLORS.violet} 100%)`,
      }}
      className="flex flex-col"
    >
      <GlobalAnimations />
      <ScrollDownHint />
      <header
        className="py-6 px-8 flex justify-between items-center shadow-lg animate-fadeInScaleUp"
        style={{
          background: COLORS.carolina,
          borderBottom: `4px solid ${COLORS.violet}`,
        }}
      >
        <AnimatedHeroTitle />
        <nav style={{ display: "flex", alignItems: "center", gap: "2em" }}>
          <ul
            className="flex gap-6 font-semibold"
            style={{ margin: 0, padding: 0 }}
          >
            <li>
              <button
                className="hover:text-seal transition"
                style={{
                  color: COLORS.violet,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  font: "inherit",
                  padding: 0,
                }}
                onClick={() => navigate("/report")}
              >
                Report an Error
              </button>
            </li>
            <li>
              <button
                className="hover:text-seal transition"
                style={{
                  color: COLORS.violet,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  font: "inherit",
                  padding: 0,
                }}
                onClick={() => navigate("/about")}
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
                  background: COLORS.violet,
                  color: COLORS.vanilla,
                  border: "none",
                  borderRadius: "1.3em",
                  fontWeight: 700,
                  fontSize: "1em",
                  padding: "8px 26px",
                  cursor: "pointer",
                  boxShadow: `0 3px 8px -2px ${COLORS.shadowStrong}`,
                  transition: "background 0.2s",
                }}
                className="hover:bg-carolina"
                onClick={() => navigate("/login")}
              >
                Admin Login
              </button>
              <button
                style={{
                  marginLeft: "0.5em",
                  background: COLORS.seal,
                  color: COLORS.vanilla,
                  border: "none",
                  borderRadius: "1.3em",
                  fontWeight: 700,
                  fontSize: "1em",
                  padding: "8px 26px",
                  cursor: "pointer",
                  boxShadow: `0 3px 8px -2px ${COLORS.shadowStrong}`,
                  transition: "background 0.2s",
                }}
                className="hover:bg-violet"
                onClick={() => navigate("/register")}
              >
                Register Admin
              </button>
            </>
          ) : (
            <button
              style={{
                marginLeft: "2em",
                background: COLORS.carolina,
                color: COLORS.violet,
                border: "none",
                borderRadius: "1.3em",
                fontWeight: 700,
                fontSize: "1em",
                padding: "8px 26px",
                cursor: "pointer",
                boxShadow: `0 3px 8px -2px ${COLORS.shadowStrong}`,
                transition: "background 0.2s",
              }}
              className="hover:bg-violet"
              onClick={() => navigate("/admin")}
            >
              Admin Dashboard
            </button>
          )}
        </nav>
      </header>
      <div className="animate-fadeInScaleUp">
        <HomePageSearchBar />
      </div>
      <section className="flex-grow flex flex-col justify-center items-center text-center px-4 animate-fadeInScaleUp">
        <div className="max-w-2xl mx-auto py-10 relative">
          <AnimatedBuildLearnPractice />
          <VisitorCounter />
          <p
            className="text-xl mb-8 animate-cardTextFade"
            style={{ color: COLORS.seal }}
          >
            Interactive clinical and educational tool
          </p>
        </div>
      </section>
      <section className="w-full flex flex-wrap justify-center gap-10 px-8 pb-12 mt-2">
        {CARD_DATA.map((card, i) => (
          <button
            key={card.title}
            className="card-shadow animate-fadeInScaleUp animate-cardPulse transition hover:scale-105 flex flex-col items-center"
            style={{
              background: card.color,
              color: card.textColor,
              borderRadius: "2.2em",
              minWidth: 300,
              maxWidth: 360,
              width: "100%",
              padding: "46px 32px 38px 32px",
              fontWeight: 700,
              fontFamily: "inherit",
              fontSize: "1.18rem",
              border: `2.5px solid ${COLORS.violet}`,
              marginBottom: 10,
              cursor: card.comingSoon ? "not-allowed" : "pointer",
              position: "relative",
              boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
              transition: "box-shadow 0.25s, border-color 0.3s",
              opacity: card.comingSoon ? 0.55 : 1,
              filter: card.comingSoon ? "grayscale(0.35)" : "none",
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
                fontSize: "2.9em",
                marginBottom: "0.18em",
                textShadow: `0 3px 11px ${COLORS.seal}33, 0 0 16px ${COLORS.violet}`,
                display: "block",
              }}
            >
              {card.icon}
            </span>
            <span
              className="animate-cardTextFade"
              style={{
                fontSize: "1.32em",
                fontWeight: 900,
                letterSpacing: "-.01em",
                marginBottom: 8,
                color: card.textColor,
                textShadow: `0 1px 0 ${COLORS.vanilla}, 0 1.5px 8px ${COLORS.violet}18`,
              }}
            >
              {card.title}
            </span>
            <span
              className="animate-cardTextFade"
              style={{
                fontWeight: 500,
                fontSize: "1.05em",
                color: card.textColor,
                opacity: 0.93,
                textShadow: `0 1px 0 ${COLORS.vanilla}`,
                marginBottom: 2,
              }}
            >
              {card.description}
            </span>
          </button>
        ))}
      </section>
      <footer
        className="p-6 text-center animate-cardTextFade"
        style={{
          background: COLORS.seal,
          color: COLORS.vanilla,
        }}
      >
        <p>
          &copy; {new Date().getFullYear()} TCM Party Palace · Made with passion
          for Chinese Medicine
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <HerbCartProvider>
      <Router basename="/TCMPartyPalace">
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
          <Route
            path="/formulacategorylist"
            element={<FormulaCategoryList />}
          />
          <Route path="/herbcategorylist" element={<HerbCategoryList />} />
          <Route path="/herbgroups" element={<HerbGroupsPage />} />
          <Route path="/report" element={<ReportBug />} />
          {/* Login Route */}
          <Route path="/login" element={<LoginPage />} />
          {/* Register Route for admin account */}
          <Route path="/register" element={<RegisterPage />} />
          {/* Admin Dashboard Route */}
          <Route path="/admin" element={<AdminDashboard />} />
          {/* About Route */}
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
    </HerbCartProvider>
  );
}
