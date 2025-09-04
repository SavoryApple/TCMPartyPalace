import React, { useEffect, useState, useRef } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import elementIndex from "../data/elementinfo/elementindex.js";
import NavBar from "../components/NavBar";
import FooterCard from "../components/FooterCard";

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

function ModalConfirm({ visible, message, onConfirm, onCancel }) {
  if (!visible) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.32)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        animation: "fadeInModal 0.24s",
      }}
    >
      <div
        style={{
          background: COLORS.backgroundGold,
          color: COLORS.accentBlack,
          border: `3px solid ${COLORS.accentGold}`,
          borderRadius: "1.5em",
          padding: "2em 2.3em",
          minWidth: "320px",
          maxWidth: "95vw",
          boxShadow: `0 8px 32px -4px ${COLORS.shadowStrong}`,
          fontWeight: 700,
          fontSize: "1.18em",
          textAlign: "center",
        }}
      >
        {message}
        <div style={{ marginTop: "1.7em", display: "flex", justifyContent: "center", gap: "2.5em" }}>
          <button
            style={{
              background: COLORS.accentGold,
              color: COLORS.backgroundRed,
              fontWeight: 900,
              fontSize: "1em",
              border: "none",
              borderRadius: "1em",
              padding: "0.6em 2em",
              cursor: "pointer",
              boxShadow: `0 2px 8px -3px ${COLORS.shadowStrong}`,
            }}
            onClick={onConfirm}
            autoFocus
          >
            Confirm
          </button>
          <button
            style={{
              background: COLORS.accentDarkGold,
              color: COLORS.accentIvory,
              fontWeight: 900,
              fontSize: "1em",
              border: "none",
              borderRadius: "1em",
              padding: "0.6em 2em",
              cursor: "pointer",
              boxShadow: `0 2px 8px -3px ${COLORS.shadowStrong}`,
            }}
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeInModal {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 650);
  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth < 650);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
}

// Helper function to get Yin/Yang aspect label from score
function getAspectLabel(score) {
  if (score <= 49) return "Yin";
  if (score >= 51) return "Yang";
  return "Balanced";
}

// Beautify key names for section headers
function beautifyKey(key) {
  const custom = {
    archetype: "Archetype",
    description: "Description",
    strengths: "Strengths",
    weaknesses: "Weaknesses",
    bestLifestyle: "Best Lifestyle",
    bestFoods: "Best Foods",
    bestClothing: "Best Clothing",
    emotionalBalance: "How to Emotionally Balance",
    bestMusic: "Best Music to Listen To",
    health: "Health Tips",
    relationships: "Relationships",
    stress: "Stress Patterns & Remedies",
    values: "Core Values",
    learningStyle: "Learning Style",
    childhood: "Childhood Patterns",
    socialStyle: "Social Style",
    bestEnvironment: "Best Environment",
    spiritualPath: "Spiritual Path",
    growthPath: "Personal Growth Path",
    shadow: "Shadow Side",
    personalMantra: "Personal Mantra",
    challenges: "Challenges",
    tips: "Tips for Success",
    idealCareer: "Ideal Careers",
    differentiation: "What Sets This Element Apart"
  };
  if (custom[key]) return custom[key];
  return key.replace(/([A-Z])/g, ' $1').replace(/_|-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).trim();
}

function isDisplayKey(key) {
  const exclude = [
    "element", "score", "aspectLabel", "key", "aspect", "name", "Element Name"
  ];
  return !exclude.includes(key);
}
function isComboDisplayKey(key) {
  const exclude = [
    "element", "score", "aspectLabel", "key", "aspect", "name", "Element Name", "keys"
  ];
  return !exclude.includes(key);
}

// KEY PROP FIX: Use parent key + item index for all list children
function renderArraySection(key, items, isMobile, keyFn = isDisplayKey) {
  if (!keyFn(key) || !items || !Array.isArray(items) || items.length === 0) return null;
  return (
    <div style={{ marginBottom: "1.2em", marginTop: "0.6em" }}>
      <b style={{
        fontSize: isMobile ? "1.05em" : "1.13em",
        color: COLORS.accentBlack,
        background: COLORS.accentGray,
        padding: "0.18em 0.9em",
        borderRadius: "0.6em",
        fontWeight: 700,
        letterSpacing: "0.02em",
        boxShadow: `0 1px 6px -3px ${COLORS.shadow}`,
        display: "inline-block"
      }}>{beautifyKey(key)}:</b>
      <ul style={{
        paddingLeft: isMobile ? "1.4em" : "2em",
        margin: "0.4em 0 0 0",
        fontSize: isMobile ? "1em" : "1.14em",
        lineHeight: "1.7",
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif"
      }}>
        {items.map((item, idx) => (
          <li key={`${key}-item-${idx}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function renderBlockSection(key, value, isMobile, blockColor, keyFn = isDisplayKey) {
  if (!keyFn(key) || !value) return null;
  return (
    <div style={{ marginBottom: "1.2em", marginTop: "0.6em" }}>
      <b style={{
        fontSize: isMobile ? "1.05em" : "1.13em",
        color: COLORS.accentBlack,
        background: COLORS.accentGray,
        padding: "0.18em 0.9em",
        borderRadius: "0.6em",
        fontWeight: 700,
        letterSpacing: "0.02em",
        boxShadow: `0 1px 6px -3px ${COLORS.shadow}`,
        display: "inline-block"
      }}>{beautifyKey(key)}:</b>
      <div style={{
        color: blockColor || COLORS.accentBlue,
        fontWeight: 600,
        whiteSpace: "pre-line",
        fontSize: isMobile ? "1.02em" : "1.12em",
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        marginTop: "0.45em",
        lineHeight: "1.7"
      }}>
        {value}
      </div>
    </div>
  );
}

function renderOtherSection(key, value, isMobile, keyFn = isDisplayKey) {
  if (!keyFn(key) || value === undefined || value === null) return null;
  if (typeof value === "object") return null;
  return (
    <div style={{ marginBottom: "1.1em", marginTop: "0.6em" }}>
      <b style={{
        fontSize: isMobile ? "1em" : "1.08em",
        color: COLORS.accentBlack,
        background: COLORS.accentGray,
        padding: "0.12em 0.7em",
        borderRadius: "0.5em",
        fontWeight: 700,
        letterSpacing: "0.01em",
        boxShadow: `0 1px 6px -3px ${COLORS.shadow}`,
        display: "inline-block"
      }}>{beautifyKey(key)}:</b>
      <span style={{
        fontSize: isMobile ? "1em" : "1.12em",
        color: COLORS.accentBlack,
        fontWeight: 600,
        marginLeft: "0.5em"
      }}>
        {String(value)}
      </span>
    </div>
  );
}

export default function ElementQuizResults() {
  const location = useLocation();
  const { topElements } = location.state || {};
  const [backToHomeModal, setBackToHomeModal] = useState(false);
  const [navBarHeight, setNavBarHeight] = useState(NAVBAR_HEIGHT);
  const navBarRef = useRef();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    function updateHeight() {
      if (navBarRef.current) {
        setNavBarHeight(navBarRef.current.offsetHeight || NAVBAR_HEIGHT);
      }
    }
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue =
        "All data will be erased if you leave the page. Are you sure?";
      return e.returnValue;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  if (
    !topElements ||
    !Array.isArray(topElements) ||
    topElements.length < 2
  ) {
    return (
      <div style={{
        padding: "2em",
        maxWidth: 700,
        margin: "0 auto",
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        color: COLORS.accentBlack,
        background: COLORS.accentIvory,
        borderRadius: "1.25em",
        marginTop: "2.5em",
        boxShadow: `0 4px 24px -8px ${COLORS.shadowStrong}`,
      }}>
        <h2 style={{ fontWeight: 900, color: COLORS.accentCrimson, marginBottom: "0.7em", fontSize: "2em" }}>No results found.</h2>
        <p style={{ fontWeight: 600, fontSize: "1.1em" }}>Please take the quiz first.</p>
      </div>
    );
  }

  // Get top 2 elements with scores
  const topTwo = topElements.slice(0, 2);

  // Use element + aspect for lookup, so we get the full element metadata
  const topMeta = topTwo.map((el) => {
    const aspectLabel = getAspectLabel(el.score);
    const key = `${el.element}-${aspectLabel}`;
    const meta = elementIndex[key];
    return {
      ...el,
      aspectLabel,
      ...(meta || {}),
    };
  });

  // Ordered 2-element combo key for lookup (sort alphabetically for lookup)
  const comboKey = [topMeta[0].element, topMeta[1].element].sort().join("-");
  const topCombo = elementIndex[comboKey];

  const backToHomeButton = (
    <div
      style={{
        position: "fixed",
        top: navBarHeight + 12,
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
          fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        }}
        tabIndex={0}
        onClick={e => {
          e.preventDefault();
          setBackToHomeModal(true);
        }}
      >
        Back to Home
      </Link>
    </div>
  );

  function handleBackToHomeConfirm() {
    setBackToHomeModal(false);
    navigate("/");
  }
  function handleBackToHomeCancel() {
    setBackToHomeModal(false);
  }

  // Render all properties of an element object, beautified
  function renderFullMeta(meta, isMobile, specialColor) {
    if (!meta) return null;
    const preferredKeys = [
      "archetype", "description", "strengths", "weaknesses", "bestLifestyle", "bestFoods", "bestClothing",
      "emotionalBalance", "bestMusic", "health", "relationships", "stress", "values", "learningStyle",
      "childhood", "socialStyle", "bestEnvironment", "spiritualPath", "growthPath", "shadow", "personalMantra",
      "challenges", "tips", "idealCareer", "differentiation"
    ];
    let keys = Object.keys(meta);
    let shown = new Set();
    let sections = [];
    if (meta.name || meta.element) {
      sections.push(
        <h2 key="name" style={{
          color: specialColor || COLORS.accentEmerald,
          marginBottom: "0.6em",
          fontSize: isMobile ? "1.25em" : "1.55em",
          textAlign: "center",
          fontWeight: 800
        }}>
          {meta.name ? meta.name : beautifyKey(meta.element)}
        </h2>
      );
    }
    preferredKeys.forEach(key => {
      if (keys.includes(key) && isDisplayKey(key)) {
        if (Array.isArray(meta[key])) {
          sections.push(renderArraySection(key, meta[key], isMobile, isDisplayKey));
        } else if (typeof meta[key] === "string") {
          sections.push(renderBlockSection(key, meta[key], isMobile, (key === "differentiation" ? COLORS.accentCrimson : undefined), isDisplayKey));
        }
        shown.add(key);
      }
    });
    keys.forEach(key => {
      if (shown.has(key) || !isDisplayKey(key)) return;
      const val = meta[key];
      if (Array.isArray(val)) {
        sections.push(renderArraySection(key, val, isMobile, isDisplayKey));
      } else if (typeof val === "string") {
        sections.push(renderBlockSection(key, val, isMobile, undefined, isDisplayKey));
      } else {
        sections.push(renderOtherSection(key, val, isMobile, isDisplayKey));
      }
    });
    return sections.length > 0 ? <>{sections.map((section, idx) => React.cloneElement(section, { key: "meta-section-" + idx }))}</> : null;
  }

  function renderComboMeta(meta, isMobile) {
    if (!meta) return null;
    const preferredKeys = ["name", "description", "strengths", "challenges", "bestLifestyle"];
    let keys = Object.keys(meta);
    let shown = new Set();
    let sections = [];
    if (meta.name) {
      sections.push(
        <h3 key="comboName" style={{
          color: COLORS.accentEmerald,
          marginBottom: "0.6em",
          textAlign: "center",
          fontWeight: 800,
          fontSize: isMobile ? "1.14em" : "1.3em"
        }}>
          {meta.name}
        </h3>
      );
      shown.add("name");
    }
    preferredKeys.forEach(key => {
      if (keys.includes(key) && key !== "name" && key !== "keys" && isComboDisplayKey(key)) {
        if (Array.isArray(meta[key])) {
          sections.push(renderArraySection(key, meta[key], isMobile, isComboDisplayKey));
        } else if (typeof meta[key] === "string") {
          sections.push(renderBlockSection(key, meta[key], isMobile, undefined, isComboDisplayKey));
        }
        shown.add(key);
      }
    });
    keys.forEach(key => {
      if (shown.has(key) || key === "keys" || !isComboDisplayKey(key)) return;
      const val = meta[key];
      if (Array.isArray(val)) {
        sections.push(renderArraySection(key, val, isMobile, isComboDisplayKey));
      } else if (typeof val === "string") {
        sections.push(renderBlockSection(key, val, isMobile, undefined, isComboDisplayKey));
      } else {
        sections.push(renderOtherSection(key, val, isMobile, isComboDisplayKey));
      }
    });
    return sections.length > 0 ? <>{sections.map((section, idx) => React.cloneElement(section, { key: "combo-section-" + idx }))}</> : null;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: COLORS.backgroundGold,
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        position: "relative",
        display: "flex",
        flexDirection: "column"
      }}
      className="flex flex-col"
    >
      <ModalConfirm
        visible={backToHomeModal}
        message="All data will be erased if you leave the page. Are you sure you want to return home?"
        onConfirm={handleBackToHomeConfirm}
        onCancel={handleBackToHomeCancel}
      />
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
          showBackToHome={false}
          showLogo={true}
          fixed={true}
          showReportError={true}
          showAbout={true}
          showAdminButtons={true}
          backToHomeOutsideMenu={false}
        />
      </div>
      {backToHomeButton}
      <div style={{ height: navBarHeight + 24, minHeight: navBarHeight + 24 }} />

      <div
        style={{
          padding: isMobile ? "1.3em 2vw" : "2.6em 0.5em",
          maxWidth: isMobile ? "99vw" : 980,
          margin: "0 auto",
          width: "100%",
          background: COLORS.accentIvory,
          borderRadius: "1.25em",
          boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
          marginBottom: "2em"
        }}
      >
        <h1 style={{
          fontSize: isMobile ? "1.65em" : "2.6em",
          textAlign: "center",
          color: COLORS.accentBlue,
          fontWeight: 900,
          marginBottom: "1.6em",
          letterSpacing: "0.01em"
        }}>
          Your Two Dominant Five Element Personality Results
        </h1>

        {/* Show scores for ALL elements */}
        <div
          style={{
            fontWeight: 600,
            fontSize: isMobile ? "1em" : "1.18em",
            color: COLORS.accentBlack,
            background: COLORS.accentIvory,
            borderRadius: "0.8em",
            boxShadow: `0 1px 8px -3px ${COLORS.shadow}`,
            margin: "0 auto 1.4em auto",
            padding: isMobile ? "0.7em 1vw" : "0.9em 2em",
            maxWidth: "96vw",
            display: "flex",
            flexWrap: "wrap",
            gap: "1.5em",
            justifyContent: "center"
          }}
        >
          {topElements.map((el, idx) => (
            <span key={`score-${el.element}-${el.score}-${idx}`} style={{
              background: COLORS.accentGray,
              borderRadius: "0.5em",
              padding: "0.22em 1em",
              margin: "0.15em 0",
              color: COLORS.accentEmerald,
              fontWeight: 700,
              fontSize: isMobile ? "0.98em" : "1.08em",
            }}>
              {el.element} – {el.score}
            </span>
          ))}
        </div>

        {/* Display summary at the top */}
        <div
          style={{
            fontWeight: 800,
            fontSize: isMobile ? "1.19em" : "1.28em",
            margin: "0 0 2em 0",
            color: COLORS.accentEmerald,
            textAlign: "center",
            letterSpacing: "0.01em"
          }}
        >
          {topMeta.map((el, idx) => (
            <span key={`summary-${el.element}-${el.score}-${idx}`}>
              {(el.name ? el.name : el.element)} ({el.score} points)
              {idx === 0 ? ", " : ""}
            </span>
          ))}
        </div>

        {/* Dominant Element Card */}
        {renderFullMeta(topMeta[0], isMobile, COLORS.accentEmerald) &&
          <div key={`card-dominant-${topMeta[0].element}-${topMeta[0].aspectLabel}`} style={{
            marginBottom: "2.3em",
            background: COLORS.backgroundGold,
            padding: isMobile ? "1.3em" : "2em 2.3em",
            borderRadius: "1.1em",
            border: `2.5px solid ${COLORS.accentGold}`,
            boxShadow: `0 2px 18px 0 ${COLORS.shadowStrong}`,
          }}>
            {renderFullMeta(topMeta[0], isMobile, COLORS.accentEmerald)}
          </div>
        }

        {/* Secondary Element Card */}
        {renderFullMeta(topMeta[1], isMobile, COLORS.accentBlue) &&
          <div key={`card-secondary-${topMeta[1].element}-${topMeta[1].aspectLabel}`} style={{
            marginBottom: "2.3em",
            background: COLORS.accentIvory,
            padding: isMobile ? "1.3em" : "2em 2.3em",
            borderRadius: "1.1em",
            border: `2.5px solid ${COLORS.accentDarkGold}`,
            boxShadow: `0 2px 18px 0 ${COLORS.shadowStrong}`,
          }}>
            {renderFullMeta(topMeta[1], isMobile, COLORS.accentBlue)}
          </div>
        }

        {/* Combo Card */}
        <hr style={{ margin: "3em 0", border: "none", borderTop: `2px solid ${COLORS.accentGray}` }} />
        <h2 style={{
          textAlign: "center",
          fontSize: isMobile ? "1.19em" : "1.38em",
          color: COLORS.accentBlue,
          fontWeight: 800,
          marginBottom: "1em",
          letterSpacing: "0.01em"
        }}>
          Your Element Combination
        </h2>
        {topCombo ? (
          <div key={`comboCard-${comboKey}`} style={{
            background: COLORS.accentIvory,
            padding: isMobile ? "1.15em" : "2em 2.3em",
            borderRadius: "1.1em",
            border: `2.5px solid ${COLORS.accentDarkGold}`,
            boxShadow: `0 2px 18px 0 ${COLORS.shadowStrong}`,
            marginBottom: "2em"
          }}>
            {renderComboMeta(topCombo, isMobile)}
          </div>
        ) : (
          <div style={{
            background: COLORS.backgroundGold,
            borderRadius: "1.1em",
            border: `2px solid ${COLORS.accentGray}`,
            boxShadow: `0 2px 12px -4px ${COLORS.shadow}`,
            padding: isMobile ? "1.1em" : "2em",
            marginBottom: "2em",
            fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
            fontSize: isMobile ? "1.05em" : "1.15em",
            color: COLORS.accentBlack,
            textAlign: "center"
          }}>
            <p>
              You have a unique combination of elements. Reflect on how your
              dominant and supporting elements work together, balancing strengths
              and challenges. Consider how your lifestyle, choices, values, and
              relationships are shaped by this mix.<br /><br />
              Try blending advice and best practices from your two elements above
              for a truly holistic life approach!
            </p>
          </div>
        )}
      </div>
      <FooterCard />
    </div>
  );
}