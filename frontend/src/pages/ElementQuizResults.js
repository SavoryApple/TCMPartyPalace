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

  if (!topElements || !Array.isArray(topElements) || topElements.length < 2) {
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

  // Get top 2 elements with scores and metadata.
  const topMeta = topElements.map((el) => {
    const [elementKey, aspectKey] = el.key.split("-");
    let meta = elementIndex[el.key];
    if (!meta) meta = elementIndex[elementKey];
    return {
      ...el,
      ...(meta || {}),
      __element: elementKey,
      __aspect: aspectKey,
    };
  });

  // Ordered 2-element combo key (ignore aspect for combo lookup)
  const comboKey = `${topMeta[0].__element}-${topMeta[1].__element}`;
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

  // Helper for rendering all array props
  const renderArraySection = (title, items) =>
    items && items.length > 0 ? (
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
        }}>{title}:</b>
        <ul style={{
          paddingLeft: isMobile ? "1.4em" : "2em",
          margin: "0.4em 0 0 0",
          fontSize: isMobile ? "1em" : "1.14em",
          lineHeight: "1.7",
          fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif"
        }}>
          {items.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>
      </div>
    ) : null;

  // Helper for rendering string block sections
  const renderBlockSection = (title, value, blockColor) =>
    value ? (
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
        }}>{title}:</b>
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
    ) : null;

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
      {/* Spacer for navbar height */}
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

        {/* Display both element-aspect and their scores */}
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
            <span key={el.key}>
              {el.name ? el.name : el.__element} – {el.__aspect} ({el.score} points)
              {idx === 0 ? ", " : ""}
            </span>
          ))}
        </div>

        {/* Top element-aspect card */}
        <div
          key={topMeta[0].key}
          style={{
            marginBottom: "2.3em",
            background: COLORS.backgroundGold,
            padding: isMobile ? "1.3em" : "2em 2.3em",
            borderRadius: "1.1em",
            border: `2.5px solid ${COLORS.accentGold}`,
            boxShadow: `0 2px 18px 0 ${COLORS.shadowStrong}`,
          }}
        >
          <h2 style={{
            color: COLORS.accentEmerald,
            marginBottom: "0.6em",
            fontSize: isMobile ? "1.25em" : "1.55em",
            textAlign: "center",
            fontWeight: 800
          }}>
            Dominant Element: {topMeta[0].name ? topMeta[0].name : topMeta[0].__element} – {topMeta[0].__aspect} ({topMeta[0].score} points)
          </h2>
          {renderBlockSection("Archetype", topMeta[0].archetype)}
          {renderBlockSection("Description", topMeta[0].description)}
          {renderArraySection("Strengths", topMeta[0].strengths)}
          {renderArraySection("Weaknesses", topMeta[0].weaknesses)}
          {renderArraySection("Best Lifestyle", topMeta[0].bestLifestyle)}
          {renderArraySection("Best Foods", topMeta[0].bestFoods)}
          {renderArraySection("Best Clothing", topMeta[0].bestClothing)}
          {renderArraySection("How to Emotionally Balance", topMeta[0].emotionalBalance)}
          {renderArraySection("Best Music to Listen To", topMeta[0].bestMusic)}
          {renderArraySection("Health Tips", topMeta[0].health)}
          {renderArraySection("Relationships", topMeta[0].relationships)}
          {renderArraySection("Stress Patterns & Remedies", topMeta[0].stress)}
          {renderArraySection("Core Values", topMeta[0].values)}
          {renderArraySection("Learning Style", topMeta[0].learningStyle)}
          {renderArraySection("Childhood Patterns", topMeta[0].childhood)}
          {renderArraySection("Social Style", topMeta[0].socialStyle)}
          {renderArraySection("Best Environment", topMeta[0].bestEnvironment)}
          {renderArraySection("Spiritual Path", topMeta[0].spiritualPath)}
          {renderArraySection("Personal Growth Path", topMeta[0].growthPath)}
          {renderArraySection("Shadow Side", topMeta[0].shadow)}
          {renderBlockSection("Personal Mantra", topMeta[0].personalMantra)}
          {renderArraySection("Challenges", topMeta[0].challenges)}
          {renderArraySection("Tips for Success", topMeta[0].tips)}
          {renderArraySection("Ideal Careers", topMeta[0].idealCareer)}
          {renderBlockSection("What Sets This Element Apart", topMeta[0].differentiation, COLORS.accentCrimson)}
        </div>

        {/* #2 element-aspect card (Supporting) */}
        <div
          key={topMeta[1].key}
          style={{
            marginBottom: "2.3em",
            background: COLORS.accentIvory,
            padding: isMobile ? "1.3em" : "2em 2.3em",
            borderRadius: "1.1em",
            border: `2.5px solid ${COLORS.accentDarkGold}`,
            boxShadow: `0 2px 18px 0 ${COLORS.shadowStrong}`,
          }}
        >
          <h2 style={{
            color: COLORS.accentBlue,
            marginBottom: "0.6em",
            fontSize: isMobile ? "1.25em" : "1.55em",
            textAlign: "center",
            fontWeight: 800
          }}>
            Supporting Element: {topMeta[1].name ? topMeta[1].name : topMeta[1].__element} – {topMeta[1].__aspect} ({topMeta[1].score} points)
          </h2>
          {renderBlockSection("Archetype", topMeta[1].archetype)}
          {renderBlockSection("Description", topMeta[1].description)}
          {renderArraySection("Strengths", topMeta[1].strengths)}
          {renderArraySection("Weaknesses", topMeta[1].weaknesses)}
          {renderArraySection("Best Lifestyle", topMeta[1].bestLifestyle)}
          {renderArraySection("Best Foods", topMeta[1].bestFoods)}
          {renderArraySection("Best Clothing", topMeta[1].bestClothing)}
          {renderArraySection("How to Emotionally Balance", topMeta[1].emotionalBalance)}
          {renderArraySection("Best Music to Listen To", topMeta[1].bestMusic)}
          {renderArraySection("Health Tips", topMeta[1].health)}
          {renderArraySection("Relationships", topMeta[1].relationships)}
          {renderArraySection("Stress Patterns & Remedies", topMeta[1].stress)}
          {renderArraySection("Core Values", topMeta[1].values)}
          {renderArraySection("Learning Style", topMeta[1].learningStyle)}
          {renderArraySection("Childhood Patterns", topMeta[1].childhood)}
          {renderArraySection("Social Style", topMeta[1].socialStyle)}
          {renderArraySection("Best Environment", topMeta[1].bestEnvironment)}
          {renderArraySection("Spiritual Path", topMeta[1].spiritualPath)}
          {renderArraySection("Personal Growth Path", topMeta[1].growthPath)}
          {renderArraySection("Shadow Side", topMeta[1].shadow)}
          {renderBlockSection("Personal Mantra", topMeta[1].personalMantra)}
          {renderArraySection("Challenges", topMeta[1].challenges)}
          {renderArraySection("Tips for Success", topMeta[1].tips)}
          {renderArraySection("Ideal Careers", topMeta[1].idealCareer)}
          {renderBlockSection("What Sets This Element Apart", topMeta[1].differentiation, COLORS.accentCrimson)}
        </div>

        {/* 2-element combo block */}
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
          <div
            style={{
              background: COLORS.accentIvory,
              padding: isMobile ? "1.15em" : "2em 2.3em",
              borderRadius: "1.1em",
              border: `2.5px solid ${COLORS.accentDarkGold}`,
              boxShadow: `0 2px 18px 0 ${COLORS.shadowStrong}`,
              marginBottom: "2em"
            }}
          >
            <h3 style={{
              color: COLORS.accentEmerald,
              marginBottom: "0.6em",
              textAlign: "center",
              fontWeight: 800,
              fontSize: isMobile ? "1.14em" : "1.3em"
            }}>
              {topCombo.name}
            </h3>
            <div
              style={{
                color: COLORS.accentBlack,
                fontWeight: 700,
                marginBottom: "1em",
                textAlign: "center",
                fontSize: isMobile ? "1em" : "1.13em",
                lineHeight: "1.6"
              }}
            >
              {topCombo.description}
            </div>
            {topCombo.strengths && (
              <div style={{ marginBottom: "1em" }}>
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
                }}>Synergy Strengths:</b>
                <ul style={{ paddingLeft: isMobile ? "1.2em" : "1.7em", margin: "0.4em 0 0 0", lineHeight: "1.7" }}>
                  {topCombo.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {topCombo.challenges && (
              <div style={{ marginBottom: "1em" }}>
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
                }}>Synergy Challenges:</b>
                <ul style={{ paddingLeft: isMobile ? "1.2em" : "1.7em", margin: "0.4em 0 0 0", lineHeight: "1.7" }}>
                  {topCombo.challenges.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
            {topCombo.bestLifestyle && (
              <div style={{ marginBottom: "1em" }}>
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
                }}>Best Lifestyles:</b>
                <ul style={{ paddingLeft: isMobile ? "1.2em" : "1.7em", margin: "0.4em 0 0 0", lineHeight: "1.7" }}>
                  {topCombo.bestLifestyle.map((l, i) => (
                    <li key={i}>{l}</li>
                  ))}
                </ul>
              </div>
            )}
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