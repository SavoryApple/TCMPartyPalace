import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import FooterCard from "../components/FooterCard";

// Import updated comprehensive question sets with yin/yang aspect
import {
  WOOD_YIN_QUESTIONS,
  WOOD_YANG_QUESTIONS,
  FIRE_YIN_QUESTIONS,
  FIRE_YANG_QUESTIONS,
  EARTH_YIN_QUESTIONS,
  EARTH_YANG_QUESTIONS,
  METAL_YIN_QUESTIONS,
  METAL_YANG_QUESTIONS,
  WATER_YIN_QUESTIONS,
  WATER_YANG_QUESTIONS,
} from "../data/elementinfo/tempQuizQuestions.js";

const COLORS = {
  backgroundGold: "#F9E8C2",
  accentGold: "#D4AF37",
  accentDarkGold: "#B38E3F",
  accentBlack: "#44210A",
  accentCrimson: "#C0392B",
  accentIvory: "#FCF5E5",
  accentEmerald: "#438C3B",
  accentBlue: "#2176AE",
  accentGray: "#D9C8B4",
  backgroundRed: "#9A2D1F",
  shadow: "#B38E3F88",
  shadowStrong: "#B38E3FCC",
};
const NAVBAR_HEIGHT = 74;

const QUIZ_SIZE_OPTIONS = [
  { label: "30 Questions (Least Accurate)", value: 30 },
  { label: "90 Questions", value: 90 },
  { label: "150 Questions (Most Accurate)", value: 150 },
];

// Utility for shuffling and picking
function pickRandomQuestions(array, count) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
}

// Assemble quiz questions based on size, balancing elements/aspects
function assembleQuizQuestions(size) {
  if (!size) return [];
  // 150: 15 yin + 15 yang per element
  // 90: 9 yin + 9 yang per element
  // 30: 3 yin + 3 yang per element
  const perElement = size / 5;
  const perAspect = perElement / 2;

  const allElementAspectSets = [
    { arr: WOOD_YIN_QUESTIONS, element: "Wood", aspect: "Yin" },
    { arr: WOOD_YANG_QUESTIONS, element: "Wood", aspect: "Yang" },
    { arr: FIRE_YIN_QUESTIONS, element: "Fire", aspect: "Yin" },
    { arr: FIRE_YANG_QUESTIONS, element: "Fire", aspect: "Yang" },
    { arr: EARTH_YIN_QUESTIONS, element: "Earth", aspect: "Yin" },
    { arr: EARTH_YANG_QUESTIONS, element: "Earth", aspect: "Yang" },
    { arr: METAL_YIN_QUESTIONS, element: "Metal", aspect: "Yin" },
    { arr: METAL_YANG_QUESTIONS, element: "Metal", aspect: "Yang" },
    { arr: WATER_YIN_QUESTIONS, element: "Water", aspect: "Yin" },
    { arr: WATER_YANG_QUESTIONS, element: "Water", aspect: "Yang" },
  ];
  let questions = [];
  for (const { arr, element, aspect } of allElementAspectSets) {
    questions.push(
      ...pickRandomQuestions(arr, perAspect).map(text => ({ text, element, aspect }))
    );
  }
  // Shuffle all questions for the quiz
  return pickRandomQuestions(questions, questions.length);
}

// Tie-breaker: top two by score, then by "Always" and "Often"
// Updated to guarantee top two results are different elements (regardless of aspect)
function getElementAspectScores(answers, questions) {
  const scoreKeys = [];
  const scores = {};
  const alwaysCounts = {};
  const oftenCounts = {};

  for (const element of ["Wood", "Fire", "Earth", "Metal", "Water"]) {
    for (const aspect of ["Yin", "Yang"]) {
      const key = `${element}-${aspect}`;
      scoreKeys.push(key);
      scores[key] = 0;
      alwaysCounts[key] = 0;
      oftenCounts[key] = 0;
    }
  }

  questions.forEach((q, i) => {
    const val = answers[i] || 0;
    const key = `${q.element}-${q.aspect}`;
    scores[key] += val;
    if (val === 4) alwaysCounts[key]++;
    if (val === 3) oftenCounts[key]++;
  });

  let sorted = scoreKeys
    .map(key => ({ key, score: scores[key] }))
    .sort((a, b) => b.score - a.score);

  // Tie-break for top two
  if (sorted.length > 1 && sorted[0].score === sorted[1].score) {
    const [top0, top1] = [sorted[0].key, sorted[1].key];
    const always0 = alwaysCounts[top0];
    const always1 = alwaysCounts[top1];
    if (always0 !== always1) {
      sorted = always0 > always1
        ? [sorted[0], sorted[1]]
        : [sorted[1], sorted[0]];
    } else {
      const often0 = oftenCounts[top0];
      const often1 = oftenCounts[top1];
      if (often0 !== often1) {
        sorted = often0 > often1
          ? [sorted[0], sorted[1]]
          : [sorted[1], sorted[0]];
      } else {
        sorted = [sorted[0], sorted[1]].sort((a, b) => a.key.localeCompare(b.key));
      }
    }
  }

  // Guarantee top two have different elements
  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    const element = sorted[i].key.split('-')[0];
    if (!result.some(r => r.key.split('-')[0] === element)) {
      result.push(sorted[i]);
    }
    if (result.length === 2) break;
  }
  return result;
}

// Animated Alert Component
function AnimatedAlert({ message, visible, onClose, type = "warning", delay = 3000, showButtons = false }) {
  useEffect(() => {
    if (visible && !showButtons && delay > 0) {
      const timer = setTimeout(() => onClose(), delay);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose, delay, showButtons]);
  if (!visible) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: "18vh",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10000,
        minWidth: "320px",
        maxWidth: "95vw",
        background: type === "error"
          ? COLORS.accentCrimson
          : type === "success"
          ? COLORS.accentEmerald
          : COLORS.accentGold,
        color: COLORS.accentIvory,
        fontWeight: 700,
        fontSize: "1.15em",
        padding: "1.1em 2.3em",
        borderRadius: "1.25em",
        boxShadow: `0 8px 32px -4px ${COLORS.shadowStrong}`,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.25s, top 0.35s",
        animation: visible ? "slideDownFade 0.38s ease" : "",
        textAlign: "center"
      }}
    >
      {message}
      {!showButtons && (
        <button
          style={{
            marginLeft: "1.25em",
            background: "rgba(255,255,255,0.15)",
            color: COLORS.accentIvory,
            border: "none",
            borderRadius: "0.8em",
            fontWeight: 900,
            fontSize: "0.98em",
            padding: "0.32em 1.2em",
            cursor: "pointer",
            boxShadow: `0 2px 8px -3px ${COLORS.shadowStrong}`,
          }}
          onClick={onClose}
        >
          ×
        </button>
      )}
      <style>{`
        @keyframes slideDownFade {
          0% { opacity: 0; top: 5vh; }
          100% { opacity: 1; top: 18vh; }
        }
      `}</style>
    </div>
  );
}

// Modal Confirm for actions (Back to Home, quiz size change)
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
        <div style={{marginTop: "1.7em", display: "flex", justifyContent: "center", gap: "2.5em"}}>
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

export default function ElementQuizComprehensive() {
  const [answers, setAnswers] = useState({});
  const [quizSize, setQuizSize] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [alertState, setAlertState] = useState({ visible: false, message: "", type: "warning", delay: 3000 });

  const [quizSizeModal, setQuizSizeModal] = useState({ visible: false, newSize: null });
  const [backToHomeModal, setBackToHomeModal] = useState(false);

  const navBarRef = useRef();
  const [navBarHeight, setNavBarHeight] = useState(NAVBAR_HEIGHT);

  const isMobile = useIsMobile();
  const navigate = useNavigate();

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

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "All quiz data will be erased if you leave the page. Are you sure?";
      return e.returnValue;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (quizSize) {
      setQuizQuestions(assembleQuizQuestions(quizSize));
      setAnswers({});
      setHasAnswered(false);
    }
  }, [quizSize]);

  function showAlert(message, type = "warning", delay = 3000) {
    setAlertState({ visible: true, message, type, delay });
  }

  function handleQuizSizeChange(e) {
    const newSize = Number(e.target.value);
    if (hasAnswered && Object.keys(answers).length > 0) {
      setQuizSizeModal({ visible: true, newSize });
      return;
    }
    setQuizSize(newSize);
  }
  function handleQuizSizeModalConfirm() {
    setQuizSizeModal({ visible: false, newSize: null });
    setQuizSize(quizSizeModal.newSize);
  }
  function handleQuizSizeModalCancel() {
    setQuizSizeModal({ visible: false, newSize: null });
  }

  function handleAnswer(qIdx, value) {
    if (!hasAnswered) setHasAnswered(true);
    setAnswers(prev => ({
      ...prev,
      [qIdx]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const totalQuestions = quizQuestions.length;
    const answeredQuestions = Object.keys(answers).length;
    if (answeredQuestions < totalQuestions) {
      showAlert(`Please answer all ${totalQuestions} questions before viewing your results.`, "error", 3000);
      return;
    }
    // Use the updated yin/yang scoring, always returns two different elements
    const top = getElementAspectScores(answers, quizQuestions);
    navigate("/elementquizresults", { state: { topElements: top } });
  }

  function handleBackToHomeConfirm() {
    setBackToHomeModal(false);
    navigate("/");
  }
  function handleBackToHomeCancel() {
    setBackToHomeModal(false);
  }

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

  const reservedTopHeight = navBarHeight;

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: COLORS.backgroundGold,
        overflowX: "hidden",
        fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
        position: "relative",
        display: "flex",
        flexDirection: "column"
      }}
      className="flex flex-col"
    >
      {/* Animated Alert */}
      <AnimatedAlert
        message={alertState.message}
        visible={alertState.visible}
        type={alertState.type}
        onClose={() => setAlertState({ ...alertState, visible: false })}
        delay={alertState.delay}
        showButtons={false}
      />

      {/* Quiz size change modal */}
      <ModalConfirm
        visible={quizSizeModal.visible}
        message="Changing the quiz size will erase all current answers. Are you sure you want to change the quiz length?"
        onConfirm={handleQuizSizeModalConfirm}
        onCancel={handleQuizSizeModalCancel}
      />

      {/* Back to Home confirmation modal */}
      <ModalConfirm
        visible={backToHomeModal}
        message="All quiz data will be erased if you leave this page. Are you sure you want to return home?"
        onConfirm={handleBackToHomeConfirm}
        onCancel={handleBackToHomeCancel}
      />

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
          showBackToHome={false}
          showLogo={true}
          fixed={true}
          showReportError={true}
          showAbout={true}
          showAdminButtons={true}
        />
      </div>
      {backToHomeButton}
      <div style={{ height: reservedTopHeight, minHeight: reservedTopHeight }} />
      <div className="main-content" style={{ position: "relative", zIndex: 1 }}>
        <div style={{
          maxWidth: isMobile ? "99vw" : 800,
          margin: isMobile ? "0 auto" : "0 auto",
          marginTop: isMobile ? "8px" : "22px",
          marginBottom: isMobile ? "10px" : "22px",
          padding: isMobile ? "1em 2px 0.5em 2px" : "2em 0.5em 1em 0.5em",
          borderRadius: "1.2em",
          background: COLORS.accentIvory,
          boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
          border: `2.5px solid ${COLORS.accentGold}`,
        }}>
          <h1 style={{
            color: COLORS.accentGold,
            fontWeight: 900,
            fontSize: isMobile ? "1.25em" : "2.1em",
            textAlign: "center",
            marginBottom: "0.3em",
            textShadow: `0 1px 0 ${COLORS.backgroundGold}, 0 1.5px 8px ${COLORS.accentGold}18`
          }}>
            Five Element Personality Quiz – Comprehensive
          </h1>
          <div style={{
            color: COLORS.accentBlack,
            textAlign: "center",
            fontWeight: 700,
            fontSize: isMobile ? "1em" : "1.14em",
            marginBottom: "1.1em"
          }}>
            Discover your top two Five Element types <b>and their aspect (Yin/Yang)</b> in Traditional Chinese Medicine (TCM)! <br />
            This extremely comprehensive quiz ranks your Wood, Fire, Earth, Metal, and Water personality traits—<b>with Yin/Yang aspect</b>—based on <b>up to 150 questions</b> about your nature, preferences, and life approach.<br /><br />
            <span style={{ color: COLORS.accentEmerald }}>
              Based on TCM theory, Five Elements affect your health, relationships, and decision-making.
            </span>
            <br />
            <span style={{ color: COLORS.accentBlue, fontWeight: 600, fontSize: "0.97em" }}>
              <i>
                In case of a tie, your dominant element & aspect is determined by the number of strongest ("Always") then strong ("Often") answers.
                If still tied, alphabetical order is used.
              </i>
            </span>
          </div>

          {/* Quiz size selection */}
          <div style={{
            background: "#fffbe7",
            border: "2px dashed #B38E3F",
            borderRadius: "1.2em",
            padding: "1em",
            margin: "0.6em 0 2em 0",
            color: "#C0392B",
            fontWeight: 700,
            textAlign: "center"
          }}>
            <span><b>Select Quiz Length:</b></span>
            <div style={{ margin: "0.7em 0 0.8em 0", fontWeight: 700 }}>
              <select
                value={quizSize || ""}
                onChange={handleQuizSizeChange}
                style={{
                  fontWeight: 700,
                  fontSize: "1.12em",
                  padding: "7px 18px",
                  background: COLORS.backgroundGold,
                  borderRadius: "1.2em",
                  border: `2px solid ${COLORS.accentGold}`,
                  marginRight: "1em"
                }}
              >
                <option value="" disabled>Select...</option>
                {QUIZ_SIZE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <span style={{
                fontSize: "0.97em",
                color: "#44210A",
                marginTop: "0.2em",
                fontWeight: 500,
                display: "block"
              }}>
                <b>Tip:</b> The longer the quiz, the more accurate your results.<br />
                <span style={{fontWeight:700, color:"#C0392B"}}>You cannot begin the quiz until you select a quiz length.</span>
              </span>
            </div>
          </div>

          {/* Quiz Questions */}
          {quizSize && (
            <form onSubmit={handleSubmit} style={{width:"100%"}}>
              <div style={{
                borderRadius: "1.1em",
                background: COLORS.backgroundGold,
                border: `1.5px solid ${COLORS.accentGold}`,
                marginBottom: "2em"
              }}>
                {quizQuestions.map((q, idx) => (
                  <div key={idx} style={{
                    padding: isMobile ? "10px 0 7px 0" : "14px 0 8px 0",
                    borderBottom: idx < (quizQuestions.length-1) ? `1px solid ${COLORS.accentGray}` : "none",
                    marginBottom: "0.2em"
                  }}>
                    <label style={{
                      color: COLORS.accentBlack,
                      fontWeight: 800,
                      fontSize: isMobile ? "1em" : "1.08em",
                      marginBottom: "0.12em",
                      display: "block"
                    }}>
                      {idx + 1}. {q.text}
                    </label>
                    <div
                      style={{
                        display: "flex",
                        gap: isMobile ? "0.18em" : "0.7em",
                        flexWrap: "nowrap",
                        justifyContent: isMobile ? "flex-start" : "flex-start",
                        alignItems: "center",
                        overflowX: isMobile ? "auto" : "visible",
                        marginBottom: isMobile ? "2px" : "0px",
                      }}
                    >
                      {["Never", "Rarely", "Sometimes", "Often", "Always"].map((opt, vIdx) => (
                        <label
                          key={vIdx}
                          style={{
                            background: answers[idx] === vIdx ? COLORS.accentGold : COLORS.backgroundGold,
                            color: answers[idx] === vIdx ? COLORS.backgroundRed : COLORS.accentBlack,
                            border: `2px solid ${COLORS.accentGold}`,
                            borderRadius: "1.7em",
                            padding: isMobile
                              ? "6px 2vw"
                              : "7px 17px",
                            fontWeight: 700,
                            cursor: "pointer",
                            userSelect: "none",
                            fontSize: isMobile ? "0.82em" : "1em",
                            boxShadow: answers[idx] === vIdx ? `0 2px 12px -3px ${COLORS.accentGold}88` : "none",
                            opacity: answers[idx] === vIdx ? 1 : 0.95,
                            transition: "background 0.16s, color 0.16s",
                            minWidth: isMobile ? 54 : undefined,
                            maxWidth: isMobile ? "22vw" : undefined,
                            textAlign: "center",
                            marginBottom: isMobile ? "0px" : "0px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <input
                            type="radio"
                            name={`q${idx}`}
                            value={vIdx}
                            checked={answers[idx] === vIdx}
                            onChange={() => handleAnswer(idx, vIdx)}
                            style={{ display: "none" }}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{textAlign:"center"}}>
                <button
                  type="submit"
                  style={{
                    background: `linear-gradient(92deg, ${COLORS.accentEmerald} 60%, ${COLORS.accentGold} 100%)`,
                    color: COLORS.accentIvory,
                    fontWeight: 900,
                    fontSize: isMobile ? "1em" : "1.2em",
                    border: `2px solid ${COLORS.accentGold}`,
                    borderRadius: "2em",
                    padding: isMobile ? "11px 15vw" : "19px 40px",
                    boxShadow: `0 6px 24px -8px ${COLORS.shadowStrong}, 0 2px 8px ${COLORS.accentGold}33`,
                    marginBottom: "0.6em",
                    cursor: "pointer",
                    letterSpacing: "-0.01em",
                    transition: "background 0.19s, color 0.17s",
                    outline: "none",
                    userSelect: "none",
                    width: isMobile ? "90vw" : undefined
                  }}
                >
                  See My Five Element Results
                </button>
              </div>
            </form>
          )}
          {!quizSize && (
            <div style={{
              color: COLORS.accentCrimson,
              textAlign: "center",
              fontWeight: 700,
              fontSize: isMobile ? "1.1em" : "1.23em",
              margin: "2em 0"
            }}>
              Please select a quiz length above to begin.
            </div>
          )}
        </div>
        <FooterCard />
      </div>
    </div>
  );
}