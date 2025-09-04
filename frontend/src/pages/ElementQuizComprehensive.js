import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import FooterCard from "../components/FooterCard";

import {
  WOOD_QUESTIONS,
  FIRE_QUESTIONS,
  EARTH_QUESTIONS,
  METAL_QUESTIONS,
  WATER_QUESTIONS
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
  shadowStrong: "#B38E3FCC"
};
const NAVBAR_HEIGHT = 74;

const QUIZ_SIZE_OPTIONS = [
  { label: "45 Questions (Quick)", value: 45 },
  { label: "60 Questions", value: 60 },
  { label: "75 Questions (Most Accurate)", value: 75 }
];

function pickRandomQuestions(array, count) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
}

function assembleQuizQuestions(size) {
  if (!size) return [];
  const elements = [
    { arr: WOOD_QUESTIONS, element: "Wood" },
    { arr: FIRE_QUESTIONS, element: "Fire" },
    { arr: EARTH_QUESTIONS, element: "Earth" },
    { arr: METAL_QUESTIONS, element: "Metal" },
    { arr: WATER_QUESTIONS, element: "Water" }
  ];
  const perElement = Math.floor(size / 5);

  let questions = [];
  for (const { arr, element } of elements) {
    questions.push(
      ...pickRandomQuestions(arr, perElement).map(q => ({ ...q, element }))
    );
  }

  while (questions.length < size) {
    let remainingQuestions = [];
    for (const { arr, element } of elements) {
      remainingQuestions.push(...arr.map(q => ({ ...q, element })));
    }
    const chosenPrompts = new Set(questions.map(q => q.prompt));
    const available = remainingQuestions.filter(q => !chosenPrompts.has(q.prompt));
    if (!available.length) break;
    questions.push(...pickRandomQuestions(available, size - questions.length));
  }

  return pickRandomQuestions(questions, questions.length);
}

function getElementScores(answers, questions) {
  const scores = {
    Wood: 0,
    Fire: 0,
    Earth: 0,
    Metal: 0,
    Water: 0
  };
  const counts = {
    Wood: 0,
    Fire: 0,
    Earth: 0,
    Metal: 0,
    Water: 0
  };

  questions.forEach((q, i) => {
    let val = answers[i];
    if (val === undefined || val === "") val = 100; // default is center
    let mapped;
    if (val === 100) mapped = 50; // middle
    else if (val < 100) mapped = 100 - val; // left side (A)
    else mapped = val - 100; // right side (B)
    scores[q.element] += mapped;
    counts[q.element]++;
  });

  const averages = Object.keys(scores).map(key => ({
    element: key,
    score: counts[key] ? Math.round(scores[key] / counts[key]) : 0
  }));

  averages.sort((a, b) => b.score - a.score);

  return averages;
}

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

  function handleSubmit(e) {
    e.preventDefault();
    const totalQuestions = quizQuestions.length;
    const answeredQuestions = Object.keys(answers).filter(key => answers[key] !== "" && answers[key] !== undefined).length;
    if (answeredQuestions < totalQuestions) {
      showAlert(`Please answer all ${totalQuestions} questions before viewing your results.`, "error", 3000);
      return;
    }
    const top = getElementScores(answers, quizQuestions);
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
      <AnimatedAlert
        message={alertState.message}
        visible={alertState.visible}
        type={alertState.type}
        onClose={() => setAlertState({ ...alertState, visible: false })}
        delay={alertState.delay}
        showButtons={false}
      />

      <ModalConfirm
        visible={quizSizeModal.visible}
        message="Changing the quiz size will erase all current answers. Are you sure you want to change the quiz length?"
        onConfirm={handleQuizSizeModalConfirm}
        onCancel={handleQuizSizeModalCancel}
      />

      <ModalConfirm
        visible={backToHomeModal}
        message="All quiz data will be erased if you leave this page. Are you sure you want to return home?"
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
            Discover your dominant Five Element type <b>and where you fall on the Yin/Yang spectrum</b> in Traditional Chinese Medicine (TCM)! <br />
            This comprehensive quiz ranks your Wood, Fire, Earth, Metal, and Water personality traits based on up to 75 questions about your nature, preferences, and life approach.<br /><br />
            <span style={{ color: COLORS.accentEmerald }}>
              Based on TCM theory, Five Elements affect your health, relationships, and decision-making.
            </span>
            <br />
            <span style={{ color: COLORS.accentBlue, fontWeight: 600, fontSize: "0.97em" }}>
              <i>
                For each question, use the slider to choose how much you relate to option A (Yin) or option B (Yang). All options are valid!
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
                {quizQuestions.map((q, idx) => {
                  const sliderValue = answers[idx] !== undefined ? answers[idx] : 100;
                  let displayValue;
                  if (sliderValue < 100) displayValue = `A: ${100 - sliderValue}`;
                  else if (sliderValue > 100) displayValue = `B: ${sliderValue - 100}`;
                  else displayValue = "0";

                  return (
                    <div key={idx} style={{
                      padding: isMobile ? "10px 0 7px 0" : "14px 0 8px 0",
                      borderBottom: idx < (quizQuestions.length-1) ? `1px solid ${COLORS.accentGray}` : "none",
                      marginBottom: "0.2em"
                    }}>
                      <label style={{
                        color: COLORS.accentBlack,
                        fontWeight: 800,
                        fontSize: isMobile ? "1.14em" : "1.18em",
                        marginBottom: "0.12em",
                        display: "block",
                        letterSpacing: "0.01em"
                      }}>
                        {idx + 1}. {q.prompt}
                      </label>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: isMobile ? "0.5em" : "1em",
                        marginBottom: "0.2em"
                      }}>
                        <span style={{
                          color: COLORS.accentBlack,
                          fontWeight: 600,
                          fontSize: isMobile ? "0.97em" : "1em",
                          minWidth: isMobile ? "65px" : "150px",
                          textAlign: "right"
                        }}>
                          A:&nbsp;{q.A}
                        </span>
                        <div style={{ width: isMobile ? "50vw" : "250px", textAlign: "center" }}>
                          <div
                            style={{
                              fontWeight: 800,
                              fontSize: isMobile ? "1em" : "1.15em",
                              color: COLORS.accentEmerald,
                              marginBottom: "0.1em",
                              userSelect: "none"
                            }}
                          >
                            {displayValue}
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={200}
                            step={1}
                            value={sliderValue}
                            onChange={e => {
                              setAnswers(prev => ({
                                ...prev,
                                [idx]: Number(e.target.value)
                              }));
                              if (!hasAnswered) setHasAnswered(true);
                            }}
                            style={{
                              width: "100%",
                              accentColor: COLORS.accentGold,
                              margin: "0 0.6em"
                            }}
                          />
                        </div>
                        <span style={{
                          color: COLORS.accentBlack,
                          fontWeight: 600,
                          fontSize: isMobile ? "0.97em" : "1em",
                          minWidth: isMobile ? "65px" : "150px",
                          textAlign: "left"
                        }}>
                          B:&nbsp;{q.B}
                        </span>
                      </div>
                    </div>
                  );
                })}
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