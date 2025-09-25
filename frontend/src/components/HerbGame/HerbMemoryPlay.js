import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import NavBar from "../NavBar";
import FooterCard from "../FooterCard";
import BackToTopButton from "../BackToTopButton";
import { generateHerbGamePairs } from "./herbGameUtils";

// --- Color Setup ---
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

function shuffle(array) {
  let arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function renderHerb(herb, { bold = true, allHerbs } = {}) {
  if (!herb) return null;
  let pinyin, pharm;
  if (typeof herb === "object") {
    pinyin =
      Array.isArray(herb.pinyinName)
        ? herb.pinyinName[0]
        : herb.pinyinName ||
          herb.name ||
          herb.herbName ||
          "";
    pharm =
      herb.pharmaceuticalName ||
      herb.pharmaceutical ||
      herb.latin ||
      herb.latinName ||
      "";
    if (!pharm && Array.isArray(allHerbs)) {
      const match = allHerbs.find(h =>
        h.pinyinName === pinyin ||
        h.name === pinyin ||
        h.herbName === pinyin ||
        h.pinyinName === herb.name ||
        h.name === herb.name
      );
      if (match) {
        pharm =
          match.pharmaceuticalName ||
          match.pharmaceutical ||
          match.latin ||
          match.latinName ||
          "";
      }
    }
  } else if (typeof herb === "string" && Array.isArray(allHerbs)) {
    pinyin = herb;
    const match = allHerbs.find(h =>
      h.pinyinName === herb ||
      h.name === herb ||
      h.herbName === herb
    );
    pharm =
      match?.pharmaceuticalName ||
      match?.pharmaceutical ||
      match?.latin ||
      match?.latinName ||
      "";
  }

  if (pharm) {
    return (
      <span>
        {bold ? <b>{pinyin}</b> : pinyin}
        <span style={{ color: COLORS.accentBlue, fontSize: "0.96em" }}> ({pharm})</span>
      </span>
    );
  } else {
    return bold ? <b>{pinyin}</b> : pinyin;
  }
}

function findHerbInCategories(herbName, herbCategoryList) {
  for (const cat of herbCategoryList) {
    if (cat.subcategories) {
      for (const subcat of cat.subcategories) {
        if (subcat.herbs) {
          for (const herb of subcat.herbs) {
            if (
              herb.name === herbName ||
              herb.pinyinName === herbName ||
              herb.pharmaceutical === herbName ||
              herb.pharmaceuticalName === herbName
            ) {
              return {
                ...herb,
                category: cat.name || cat.category,
                subcategory: subcat.name || subcat.title
              };
            }
          }
        }
      }
    }
  }
  return null;
}

function getFullHerbDetails(herbName, herbCategoryList, allHerbs) {
  let herbObj = findHerbInCategories(herbName, herbCategoryList);
  let fallbackObj =
    Array.isArray(allHerbs)
      ? allHerbs.find(h =>
          h.pinyinName === herbName ||
          h.name === herbName ||
          h.herbName === herbName
        )
      : undefined;

  // Prefer herbObj fields, fallback to allHerbs for missing info
  return {
    ...herbObj,
    ...(fallbackObj || {}),
    category: herbObj?.category || fallbackObj?.category,
    subcategory: herbObj?.subcategory || fallbackObj?.subcategory,
    keyActions: (
      herbObj?.keyActions ||
      fallbackObj?.keyActions ||
      herbObj?.actions ||
      fallbackObj?.actions ||
      herbObj?.mainActions ||
      fallbackObj?.mainActions ||
      herbObj?.keyAction ||
      fallbackObj?.keyAction
    )
  };
}

export default function HerbMemoryPlay() {
  const navigate = useNavigate();
  const location = useLocation();
  const { matchMode } = location.state || {};

  const [herbCategoryList, setHerbCategoryList] = useState([]);
  const [herbGroupsList, setHerbGroupsList] = useState([]);
  const [allHerbs, setAllHerbs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pairs, setPairs] = useState([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const [totalAnswered, setTotalAnswered] = useState(0);
  const [correctAnswered, setCorrectAnswered] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(false);

  const [groupQuestions, setGroupQuestions] = useState([]);
  const [currentGroupQuestionIdx, setCurrentGroupQuestionIdx] = useState(0);
  const [groupOptions, setGroupOptions] = useState([]);

  // --- FIX: Auto Advance actually works ---
  useEffect(() => {
    if (autoAdvance && selectedOption !== null) {
      const timer = setTimeout(() => {
        handleNextQuestion();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [selectedOption, autoAdvance]); // depend on selectedOption and autoAdvance

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/data/herbCategoryListObject.json").then((r) => r.json()),
      fetch("/data/herbGroupsList.json").then((r) => r.json()),
      fetch("https://thetcmatlas.fly.dev/api/data/caleandnccaomherbs").then((r) => r.json()).catch(() => []),
      fetch("https://thetcmatlas.fly.dev/api/data/caleherbs").then((r) => r.json()).catch(() => []),
      fetch("https://thetcmatlas.fly.dev/api/data/extraherbs").then((r) => r.json()).catch(() => []),
      fetch("https://thetcmatlas.fly.dev/api/data/nccaomherbs").then((r) => r.json()).catch(() => []),
    ])
      .then(([catList, groupList, caleNccaom, cale, extra, nccaom]) => {
        let arr = [];
        if (Array.isArray(catList.categories)) {
          arr = catList.categories;
        } else if (Array.isArray(catList)) {
          arr = catList;
        }
        setHerbCategoryList(arr);
        setHerbGroupsList(Array.isArray(groupList) ? groupList : (groupList.groups || []));
        const mongoHerbs = [].concat(caleNccaom, cale, extra, nccaom);
        setAllHerbs(mongoHerbs.length > 0 ? mongoHerbs : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading) return;
    if (matchMode === "group-category") {
      let groupQuestionsTmp = [];
      let allGroupNames = [];
      for (const group of herbGroupsList) {
        const groupName = group.category || group.group || group.name;
        if (groupName && !allGroupNames.includes(groupName)) {
          allGroupNames.push(groupName);
        }
      }
      for (const groupName of allGroupNames) {
        let herbs = [];
        for (const group of herbGroupsList) {
          if ((group.category || group.group || group.name) === groupName) {
            herbs = herbs.concat(group.herbs || []);
          }
        }
        herbs = Array.from(new Set(herbs));
        if (herbs.length > 0) {
          groupQuestionsTmp.push({
            herbs,
            group: groupName
          });
        }
      }
      groupQuestionsTmp = shuffle(groupQuestionsTmp);

      const uniqueGroups = groupQuestionsTmp.map(q => q.group);
      const optionsArr = groupQuestionsTmp.map(q => {
        const correctGroup = q.group;
        const wrongOptions = shuffle(uniqueGroups.filter(g => g !== correctGroup)).slice(0, 3);
        let allOptions = [correctGroup, ...wrongOptions];
        allOptions = Array.from(new Set(allOptions));
        if (allOptions.length < 4) {
          const fill = uniqueGroups.filter(g => !allOptions.includes(g));
          allOptions = allOptions.concat(fill.slice(0, 4 - allOptions.length));
        }
        if (!allOptions.includes(correctGroup)) allOptions[0] = correctGroup;
        allOptions = shuffle(allOptions);
        return {
          options: allOptions,
          groupIdx: allOptions.indexOf(correctGroup)
        };
      });

      setGroupQuestions(groupQuestionsTmp);
      setGroupOptions(optionsArr);
      setCurrentGroupQuestionIdx(0);
      setSelectedOption(null);
      setFeedback(null);
      setTotalAnswered(0);
      setCorrectAnswered(0);
      return;
    }
    let p = generateHerbGamePairs({
      herbCategoryList,
      herbGroupsList,
      allHerbs,
      mode: matchMode,
    });
    if (!Array.isArray(p) || p.length < 4) {
      setPairs([]);
      setCurrentQuestionIdx(0);
      setSelectedOption(null);
      setFeedback(null);
      return;
    }
    setPairs(shuffle(p));
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setFeedback(null);
    setTotalAnswered(0);
    setCorrectAnswered(0);
  }, [loading, herbCategoryList, herbGroupsList, allHerbs, matchMode, navigate]);

  const getQuestion = useCallback((pairsArr, idx) => {
    if (!pairsArr || pairsArr.length < 4) return null;
    const answerPair = pairsArr[idx % pairsArr.length];

    let questionText = "";
    let options = [];
    let answerIdx = 0;
    let extraContent = (
      <div style={{
        margin: "1em 0",
        color: COLORS.accentBlack,
        background: "#FFF7E3",
        borderRadius: "0.85em",
        padding: "0.8em",
        fontWeight: 600,
        fontSize: "1.05em",
        letterSpacing: ".01em",
        boxShadow: "0 1px 6px -2px #B38E3FCC",
        border: "2px solid #F9E8C2",
        maxWidth: "99%",
        textAlign: "center",
        wordBreak: "break-word"
      }}>
        {renderHerb(answerPair.left, { allHerbs })}
      </div>
    );

    if (matchMode === "name-keyActions") {
      questionText = "What are the key actions for this herb?";
      let pool = pairsArr.map(p => p.right && p.right.keyActions).filter(Boolean);
      let uniqueActions = [...new Set(pool)];
      let correctAction = answerPair.right.keyActions;
      let wrongOptions = shuffle(uniqueActions.filter(act => act !== correctAction)).slice(0, 3);
      let allOptions = shuffle([correctAction, ...wrongOptions]);
      answerIdx = allOptions.indexOf(correctAction);
      options = allOptions;
    } else if (matchMode === "name-category") {
      questionText = "What is the category for this herb?";
      function catSubcat(pair) {
        const c = pair.category || pair.right?.category || "";
        const s = pair.subcategory || pair.right?.subcategory || "";
        return c && s ? `${c}: ${s}` : c || "(unknown)";
      }
      let correctCatSubcat = catSubcat(answerPair);
      let pool = pairsArr.map(catSubcat).filter(Boolean);
      let uniqueCatSubcats = [...new Set(pool)];
      let wrongOptions = shuffle(uniqueCatSubcats.filter(cs => cs !== correctCatSubcat)).slice(0, 3);
      let allOptions = shuffle([correctCatSubcat, ...wrongOptions]);
      answerIdx = allOptions.indexOf(correctCatSubcat);
      options = allOptions;
    }
    else {
      questionText = "What is the correct match for this herb?";
      let pool = pairsArr.map(p => p.right).filter(x => x && typeof x === "object");
      let uniqueHerbObjs = [];
      let seenKeys = new Set();
      for (let obj of pool) {
        let key = (obj.pinyinName || obj.name || "") + "|" + (obj.pharmaceutical || obj.pharmaceuticalName || obj.latin || "");
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          uniqueHerbObjs.push(obj);
        }
      }
      let correctHerb = answerPair.right;
      let wrongOptions = shuffle(uniqueHerbObjs.filter(obj => {
        let keyA = (obj.pinyinName || obj.name || "") + "|" + (obj.pharmaceutical || obj.pharmaceuticalName || obj.latin || "");
        let keyB = (correctHerb.pinyinName || correctHerb.name || "") + "|" + (correctHerb.pharmaceutical || correctHerb.pharmaceuticalName || correctHerb.latin || "");
        return keyA !== keyB;
      })).slice(0, 3);
      let allOptions = shuffle([correctHerb, ...wrongOptions]);
      answerIdx = allOptions.findIndex(obj => {
        let keyA = (obj.pinyinName || obj.name || "") + "|" + (obj.pharmaceutical || obj.pharmaceuticalName || obj.latin || "");
        let keyB = (correctHerb.pinyinName || correctHerb.name || "") + "|" + (correctHerb.pharmaceutical || correctHerb.pharmaceuticalName || correctHerb.latin || "");
        return keyA === keyB;
      });
      options = allOptions;
    }

    return {
      question: questionText,
      options,
      answerIdx,
      extraContent,
      pair: answerPair,
    };
  }, [matchMode, allHerbs]);

  function getCategorySubcategory(pair) {
    const category =
      pair.category ||
      pair.right?.category ||
      (typeof pair.left === "object" && pair.left.category) ||
      "";
    const subcategory =
      pair.subcategory ||
      pair.right?.subcategory ||
      (typeof pair.left === "object" && pair.left.subcategory) ||
      "";
    if (category && subcategory) return `${category}: ${subcategory}`;
    if (category) return category;
    return "(unknown)";
  }

  const currentQuestion = useMemo(
    () => getQuestion(pairs, currentQuestionIdx),
    [pairs, currentQuestionIdx, getQuestion]
  );

  function handleOptionClick(idx) {
    setSelectedOption(idx);
    setTotalAnswered(prev => prev + 1);
    if (matchMode === "group-category") {
      const correctIdx = groupOptions[currentGroupQuestionIdx]?.options?.indexOf(groupQuestions[currentGroupQuestionIdx].group);
      if (idx === correctIdx) {
        setCorrectAnswered(prev => prev + 1);
        setFeedback("Correct!");
      } else {
        const answerInOptions = groupOptions[currentGroupQuestionIdx]?.options?.includes(groupQuestions[currentGroupQuestionIdx].group);
        if (answerInOptions) {
          setFeedback(`Incorrect. The answer was "${groupQuestions[currentGroupQuestionIdx].group}".`);
        } else {
          setFeedback("Incorrect. No correct answer was available in the options (please refresh).");
        }
      }
    } else {
      if (idx === currentQuestion.answerIdx) {
        setCorrectAnswered(prev => prev + 1);
        setFeedback("Correct!");
      } else {
        let answerText = currentQuestion.options[currentQuestion.answerIdx];
        if (typeof answerText === "string") {
          setFeedback(`Incorrect. The answer was "${answerText}".`);
        } else {
          setFeedback(`Incorrect. The answer was "${renderHerb(answerText, { bold: false, allHerbs })}".`);
        }
      }
    }
  }

  function handleNextQuestion() {
    if (matchMode === "group-category") {
      setCurrentGroupQuestionIdx((idx) => (idx + 1) % groupQuestions.length);
      setSelectedOption(null);
      setFeedback(null);
    } else {
      setCurrentQuestionIdx((idx) => (idx + 1) % pairs.length);
      setSelectedOption(null);
      setFeedback(null);
    }
  }

  function handleBackToSetup() {
    navigate("/game/herbs");
  }
  function handleExitToLanding() {
    navigate("/tcmgames");
  }

  const percentCorrect =
    totalAnswered === 0 ? 0 : Math.round((correctAnswered / totalAnswered) * 100);

  const renderAutoAdvanceToggle = () => (
    <div style={{ margin: "18px 0 0 0", textAlign: "left" }}>
      <label style={{ fontWeight: 600, color: COLORS.accentBlue, cursor: "pointer", fontSize: "1.03em" }}>
        <input
          type="checkbox"
          checked={autoAdvance}
          onChange={e => setAutoAdvance(e.target.checked)}
          style={{ marginRight: 9, transform: "scale(1.18)" }}
        />
        Auto advance to next question after a brief delay
      </label>
    </div>
  );

  // --- Render ---
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: COLORS.backgroundGold,
        position: "relative",
        fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <NavBar showReportError showAbout showAdminButtons showLogo fixed />
      <div style={{ height: NAVBAR_HEIGHT }} />
      <ReturnToHomeButton />
      <BackToTopButton right={75} />
      <div
        style={{
          flex: "1 1 auto",
          maxWidth: 700,
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "24px",
          marginBottom: "12px",
          width: "100%",
          minHeight: "80vh",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loading ? (
          <div
            className="rounded-xl p-8 mb-6 flex flex-col items-start card-shadow"
            style={{
              background: COLORS.backgroundGold,
              border: `2.5px solid ${COLORS.accentGold}`,
              color: COLORS.accentBlack,
              maxWidth: "500px",
              textAlign: "center",
              boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
              fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
              margin: "0 auto",
            }}
          >
            <h2 className="text-3xl font-bold mb-4" style={{ color: COLORS.accentCrimson }}>
              Loading...
            </h2>
            <p className="mb-3">Loading herb data...</p>
          </div>
        ) : matchMode === "group-category" && groupQuestions.length > 0 ? (
          <div style={{
            background: "#fffbe4",
            borderRadius: "1.25em",
            padding: "32px 22px",
            boxShadow: "0 2px 16px #D4AF37cc",
            maxWidth: 700,
            width: "100%",
            margin: "0 auto",
            textAlign: "center"
          }}>
            <div style={{
              fontWeight: 700,
              fontSize: "1.13em",
              marginBottom: "0.8em",
              color: COLORS.accentBlack,
              textAlign: "center"
            }}>
              Score: {correctAnswered}/{totalAnswered} correct ({percentCorrect}%)
            </div>
            <div style={{ fontWeight: 700, fontSize: "1.18em", marginBottom: "1em", color: COLORS.accentBlack }}>
              Question {currentGroupQuestionIdx + 1}
            </div>
            <div style={{ fontWeight: 700, fontSize: "1.15em", marginBottom: "1em", color: COLORS.accentBlue }}>
              What do these herbs have in common?
            </div>
            <div style={{
              marginBottom: "1.2em",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5em",
              justifyContent: "center",
            }}>
              {groupQuestions[currentGroupQuestionIdx].herbs.map((herbName, idx) => {
                const herbObj = findHerbInCategories(herbName, herbCategoryList);
                return (
                  <div key={idx} style={{
                    padding: "7px 12px",
                    fontWeight: 700,
                    fontSize: "1.07em",
                    color: COLORS.backgroundRed,
                    background: "#fff",
                    borderRadius: "0.8em",
                    border: "1px solid #eee",
                    boxShadow: "0 1px 5px #D4AF3722",
                    marginBottom: "0.2em",
                    marginRight: "0.2em",
                  }}>
                    {renderHerb(herbObj || herbName, { allHerbs })}
                  </div>
                );
              })}
            </div>
            <div>
              {groupOptions.length > currentGroupQuestionIdx &&
                groupOptions[currentGroupQuestionIdx].options.map((opt, idx) => (
                  <button
                    key={opt + "_" + idx}
                    disabled={selectedOption != null}
                    onClick={() => handleOptionClick(idx)}
                    style={{
                      background: selectedOption === idx
                        ? (idx === groupOptions[currentGroupQuestionIdx].options.indexOf(groupQuestions[currentGroupQuestionIdx].group) ? COLORS.accentEmerald : COLORS.accentCrimson)
                        : COLORS.backgroundGold,
                      color: selectedOption === idx ? "#fff" : COLORS.accentBlack,
                      border: selectedOption === idx ? `2.5px solid ${COLORS.accentGold}` : `2px solid ${COLORS.accentGold}`,
                      borderRadius: "0.85em",
                      fontWeight: 700,
                      fontSize: "1.09em",
                      margin: "7px 0",
                      padding: "12px 18px",
                      width: "100%",
                      maxWidth: "350px",
                      boxShadow: selectedOption === idx ? "0 2px 10px #B38E3FAA" : "0 2px 7px #D4AF3722",
                      cursor: selectedOption == null ? "pointer" : "not-allowed",
                      transition: "background 0.2s, color 0.2s, box-shadow 0.2s"
                    }}
                  >
                    {opt}
                  </button>
                ))}
            </div>
            <div style={{
              minHeight: 24,
              marginTop: "1.5em",
              fontWeight: 700,
              fontSize: "1.12em",
              color: feedback === "Correct!" ? COLORS.accentEmerald : COLORS.accentCrimson
            }}>
              {feedback}
            </div>
            {renderAutoAdvanceToggle()}
            {selectedOption != null && (
              <>
                {/* Only ONE Exit button rendered here */}
                {!autoAdvance && (
                  <button
                    onClick={handleNextQuestion}
                    style={{
                      marginTop: "18px",
                      background: COLORS.accentEmerald,
                      color: "#fff",
                      border: "none",
                      borderRadius: "2em",
                      padding: "9px 28px",
                      fontWeight: 900,
                      fontSize: "1em",
                      boxShadow: "0 2px 8px #438C3BCC",
                      cursor: "pointer"
                    }}
                  >
                    Next Question
                  </button>
                )}
                <button
                  onClick={handleExitToLanding}
                  style={{
                    marginTop: "18px",
                    background: COLORS.accentCrimson,
                    color: "#fff",
                    border: "none",
                    borderRadius: "2em",
                    padding: "9px 28px",
                    fontWeight: 900,
                    fontSize: "1em",
                    boxShadow: "0 2px 8px #C0392BCC",
                    cursor: "pointer"
                  }}
                >
                  Exit
                </button>
                <div style={{
                  marginTop: "2em",
                  background: "#FCF5E5",
                  borderRadius: "1em",
                  padding: "1em",
                  boxShadow: "0 2px 12px #D4AF3788"
                }}>
                  <h3 style={{fontWeight:700, fontSize:"1.1em", color:COLORS.backgroundRed, marginBottom:"0.7em"}}>Details for these herbs:</h3>
                  {groupQuestions[currentGroupQuestionIdx].herbs.map((herbName, idx) => {
                    const details = getFullHerbDetails(herbName, herbCategoryList, allHerbs);
                    return (
                      <div key={idx} style={{
                        marginBottom: "1.2em",
                        border: "1px solid #eee",
                        borderRadius: "0.7em",
                        padding: "0.7em 1em",
                        background: "#fff",
                        boxShadow: "0 1px 7px #D4AF3722"
                      }}>
                        <div style={{fontWeight:800, color:COLORS.accentBlue, fontSize:"1.06em", marginBottom:"0.3em"}}>
                          {renderHerb(details, { allHerbs })}
                        </div>
                        <div style={{color:COLORS.accentGold}}>
                          <b>Category:</b> {details.category || "(unknown)"}
                          {details.subcategory && (
                            <>: {details.subcategory}</>
                          )}
                        </div>
                        <div style={{color:COLORS.accentCrimson}}>
                          <b>Key Actions:</b> {details.keyActions || "(none)"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        ) : pairs.length < 4 ? (
          <div
            className="rounded-xl p-8 mb-6 flex flex-col items-center card-shadow"
            style={{
              background: COLORS.backgroundGold,
              border: `2.5px solid ${COLORS.accentGold}`,
              color: COLORS.accentBlack,
              maxWidth: "500px",
              textAlign: "center",
              boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
              fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
              margin: "0 auto",
            }}
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: COLORS.accentCrimson }}>
              Not Enough Herbs
            </h2>
            <p className="mb-3">Please select a different matching mode or check your herb data.</p>
            <button
              onClick={handleBackToSetup}
              style={{
                marginTop: "18px",
                background: COLORS.accentBlue,
                color: "#fff",
                border: "none",
                borderRadius: "2em",
                padding: "9px 28px",
                fontWeight: 900,
                fontSize: "1em",
                boxShadow: "0 2px 8px #2176AEAA",
                cursor: "pointer",
              }}
            >
              Back to Setup
            </button>
            <button
              onClick={handleExitToLanding}
              style={{
                marginTop: "18px",
                background: COLORS.accentCrimson,
                color: "#fff",
                border: "none",
                borderRadius: "2em",
                padding: "9px 28px",
                fontWeight: 900,
                fontSize: "1em",
                boxShadow: "0 2px 8px #C0392BCC",
                cursor: "pointer",
              }}
            >
              Exit
            </button>
          </div>
        ) : (
          <div style={{
            background: "#fffbe4",
            borderRadius: "1.25em",
            padding: "32px 22px",
            boxShadow: "0 2px 16px #D4AF37cc",
            maxWidth: 500,
            width: "100%",
            margin: "0 auto",
            textAlign: "center"
          }}>
            {/* Legacy modes */}
            <div style={{
              fontWeight: 700,
              fontSize: "1.13em",
              marginBottom: "0.8em",
              color: COLORS.accentBlack,
              textAlign: "center"
            }}>
              Score: {correctAnswered}/{totalAnswered} correct ({percentCorrect}%)
            </div>
            <div style={{ fontWeight: 700, fontSize: "1.18em", marginBottom: "1em", color: COLORS.accentBlack }}>
              Question {currentQuestionIdx + 1}
            </div>
            <div style={{ fontWeight: 700, fontSize: "1.15em", marginBottom: "1em", color: COLORS.accentBlue }}>
              {currentQuestion?.question}
            </div>
            {currentQuestion?.extraContent}
            <div>
              {currentQuestion?.options.map((opt, idx) => (
                <button
                  key={typeof opt === "object" ? (opt.pinyinName || opt.name || "option") + "_" + idx : opt + "_" + idx}
                  disabled={selectedOption != null}
                  onClick={() => handleOptionClick(idx)}
                  style={{
                    background: selectedOption === idx
                      ? (idx === currentQuestion.answerIdx ? COLORS.accentEmerald : COLORS.accentCrimson)
                      : COLORS.backgroundGold,
                    color: selectedOption === idx ? "#fff" : COLORS.accentBlack,
                    border: selectedOption === idx ? `2.5px solid ${COLORS.accentGold}` : `2px solid ${COLORS.accentGold}`,
                    borderRadius: "0.85em",
                    fontWeight: 700,
                    fontSize: "1.09em",
                    margin: "7px 0",
                    padding: "12px 18px",
                    width: "100%",
                    maxWidth: "350px",
                    boxShadow: selectedOption === idx ? "0 2px 10px #B38E3FAA" : "0 2px 7px #D4AF3722",
                    cursor: selectedOption == null ? "pointer" : "not-allowed",
                    transition: "background 0.2s, color 0.2s, box-shadow 0.2s"
                  }}
                >
                  {typeof opt === "object"
                    ? renderHerb(opt, { allHerbs })
                    : opt}
                </button>
              ))}
            </div>
            <div style={{
              minHeight: 24,
              marginTop: "1.5em",
              fontWeight: 700,
              fontSize: "1.12em",
              color: feedback === "Correct!" ? COLORS.accentEmerald : COLORS.accentCrimson
            }}>
              {feedback}
            </div>
            {renderAutoAdvanceToggle()}
            {selectedOption != null && (
              <>
                {!autoAdvance && (
                  <button
                    onClick={handleNextQuestion}
                    style={{
                      marginTop: "18px",
                      background: COLORS.accentEmerald,
                      color: "#fff",
                      border: "none",
                      borderRadius: "2em",
                      padding: "9px 28px",
                      fontWeight: 900,
                      fontSize: "1em",
                      boxShadow: "0 2px 8px #438C3BCC",
                      cursor: "pointer"
                    }}
                  >
                    Next Question
                  </button>
                )}
                <button
                  onClick={handleExitToLanding}
                  style={{
                    marginTop: "18px",
                    background: COLORS.accentCrimson,
                    color: "#fff",
                    border: "none",
                    borderRadius: "2em",
                    padding: "9px 28px",
                    fontWeight: 900,
                    fontSize: "1em",
                    boxShadow: "0 2px 8px #C0392BCC",
                    cursor: "pointer"
                  }}
                >
                  Exit
                </button>
                {currentQuestion.pair && (
                  <div style={{
                    marginTop: "2em",
                    background: "#FCF5E5",
                    borderRadius: "1em",
                    padding: "1em",
                    boxShadow: "0 2px 12px #D4AF3788"
                  }}>
                    <h3 style={{fontWeight:700, fontSize:"1.1em", color:COLORS.backgroundRed, marginBottom:"0.7em"}}>Details:</h3>
                    <div style={{fontWeight:800, color:COLORS.backgroundRed, fontSize:"1.06em", marginBottom:"0.3em"}}>
                      {renderHerb(currentQuestion.pair.left, { allHerbs })}
                    </div>
                    {matchMode === "name-keyActions" && (
                      <>
                        <div><b>Key Actions:</b> {currentQuestion.pair.right?.keyActions}</div>
                        <div>
                          <b>Category:</b> {getCategorySubcategory(currentQuestion.pair)}
                        </div>
                      </>
                    )}
                    {matchMode === "name-category" && (
                      <>
                        <div>
                          <b>Category:</b> {getCategorySubcategory(currentQuestion.pair)}
                        </div>
                        <div>
                          <b>Key Actions:</b> {currentQuestion.pair.left?.keyActions || currentQuestion.pair.right?.keyActions || "(none)"}
                        </div>
                      </>
                    )}
                    {currentQuestion.pair.group && (
                      <div><b>Group:</b> {currentQuestion.pair.group}</div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
      <FooterCard />
    </div>
  );
}