import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import NavBar from "../NavBar";
import FooterCard from "../FooterCard";
import BackToTopButton from "../BackToTopButton";

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

function pickRandom(array, n) {
  return shuffle(array).slice(0, n);
}

// Updated for separate Pinyin and English, line break
function getDisplayFormulaNameSplit(formula) {
  const pinyin = formula.pinyinName || formula.name || "";
  const english = formula.english || formula.englishName || "";
  return {
    pinyin: pinyin,
    english: english
  };
}

function getDisplayFormulaName(formula) {
  const { pinyin, english } = getDisplayFormulaNameSplit(formula);
  if (pinyin && english) return `${pinyin} (${english})`;
  if (pinyin) return pinyin;
  if (english) return english;
  return formula.name || "Unknown formula";
}

function getFormulaIngredients(formula) {
  if (Array.isArray(formula.ingredientsAndDosages) && formula.ingredientsAndDosages.length > 0) {
    return formula.ingredientsAndDosages;
  }
  if (Array.isArray(formula.ingredients) && formula.ingredients.length > 0) {
    return formula.ingredients;
  }
  if (typeof formula.ingredients === "string" && formula.ingredients.trim()) {
    return [formula.ingredients];
  }
  return [];
}

function findSubcategory(formula, categoryList) {
  if (!formula || !formula.category) return "";
  const catObj = categoryList.find(c => c.category === formula.category);
  if (!catObj || !Array.isArray(catObj.subcategories)) return "";
  for (const subcat of catObj.subcategories) {
    if (subcat.formulas && subcat.formulas.some(f => {
      const formulaNames = [
        ...(Array.isArray(f.pinyinName) ? f.pinyinName : [f.pinyinName || ""]),
        f.name || "",
        f.englishName || "",
        f.english || ""
      ].map(n => n && n.toString().toLowerCase().trim()).filter(Boolean);
      const myNames = [
        ...(Array.isArray(formula.pinyinName) ? formula.pinyinName : [formula.pinyinName || ""]),
        formula.name || "",
        formula.englishName || "",
        formula.english || ""
      ].map(n => n && n.toString().toLowerCase().trim()).filter(Boolean);

      return formulaNames.some(fn => myNames.includes(fn));
    })) return subcat.title;
  }
  return "";
}

export default function FormulaIngredientsPlay() {
  const location = useLocation();
  const navigate = useNavigate();
  const { categories, filters, matchMode } = location.state || {};

  const [allFormulas, setAllFormulas] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const [totalAnswered, setTotalAnswered] = useState(0);
  const [correctAnswered, setCorrectAnswered] = useState(0);

  useEffect(() => {
    if (!categories || !filters || !matchMode) {
      navigate("/game/formula-ingredients");
      return;
    }

    setLoading(true);
    Promise.all([
      fetch('/data/formulaCategoryListObject.json').then(r => r.json()),
      fetch('https://thetcmatlas.fly.dev/api/data/caleandnccaomformulas').then(r => r.json()),
      fetch('https://thetcmatlas.fly.dev/api/data/nccaomformulas').then(r => r.json()),
      fetch('https://thetcmatlas.fly.dev/api/data/extraformulas').then(r => r.json()),
    ])
      .then(([categoryListObj, caleNccaom, nccaom, extra]) => {
        setCategoryList(categoryListObj);

        const mongoFormulas = [
          ...caleNccaom,
          ...nccaom,
          ...extra,
        ];

        let selectedFormulas = [];
        categories.forEach(catName => {
          const catObj = categoryListObj.find(c => c.category === catName);
          if (catObj) {
            catObj.subcategories.forEach(subcat => {
              selectedFormulas.push(...subcat.formulas);
            });
          }
        });

        const filtered = selectedFormulas.map(localFormula => {
          const localPinyin = Array.isArray(localFormula.pinyinName)
            ? localFormula.pinyinName[0]
            : localFormula.pinyinName || localFormula.name;
          const mongoFormula = mongoFormulas.find(m =>
            m.pinyinName &&
            (
              (Array.isArray(m.pinyinName) && m.pinyinName.some(p => p === localPinyin)) ||
              m.pinyinName === localPinyin
            )
          );
          if (!mongoFormula) return null;
          let filterMatch =
            filters.length === 0 ||
            filters.some(filter =>
              (mongoFormula.sources && mongoFormula.sources.map(s => s.toLowerCase()).includes(filter)) ||
              (filter === "nccaom" && (mongoFormula.nccaom === "yes" || mongoFormula.nccaom === true)) ||
              (filter === "extra" && mongoFormula.extra === true) ||
              (filter === "cale+nccaom" && mongoFormula.caleNccaom === true)
            );
          return filterMatch ? { ...localFormula, ...mongoFormula } : null;
        }).filter(Boolean);

        setAllFormulas(filtered);
        setLoading(false);
      })
      .catch((err) => {
        setAllFormulas([]);
        setLoading(false);
        console.error("API error:", err);
      });
  }, [categories, filters, matchMode, navigate]);

  const getCategoryOptions = useCallback((answerFormula, allCategoryList, allFormulas) => {
    let possibleCategories = [];
    if (allCategoryList?.length > 0) {
      possibleCategories = allCategoryList.map(cat => cat.category);
    } else {
      possibleCategories = Array.from(new Set(allFormulas.map(f => f.category).filter(Boolean)));
    }
    const correctCategory = answerFormula.category;
    const otherCategories = possibleCategories.filter(cat => cat !== correctCategory);
    const options = shuffle([correctCategory, ...pickRandom(otherCategories, 3)]);
    const answerIdx = options.findIndex(c => c === correctCategory);
    const optionObjs = options.map(cat => {
      let subcat = "";
      if (cat === correctCategory) {
        subcat = findSubcategory(answerFormula, allCategoryList);
      } else {
        const catObj = allCategoryList.find(cObj => cObj.category === cat);
        let foundSubcat = "";
        if (catObj && Array.isArray(catObj.subcategories)) {
          for (const sub of catObj.subcategories) {
            if (sub.formulas && sub.formulas.length > 0) {
              foundSubcat = sub.title;
              break;
            }
          }
        }
        subcat = foundSubcat;
      }
      return { category: cat, subcategory: subcat };
    });
    return { options: optionObjs, answerIdx };
  }, []);

  const getQuestion = useCallback((formulas, catList) => {
    if (!formulas || formulas.length < 4) return null;

    if (matchMode === "category") {
      const answerFormula = formulas[Math.floor(Math.random() * formulas.length)];
      const { options: categoryOptions, answerIdx } = getCategoryOptions(answerFormula, catList, formulas);

      // BEAUTIFIED: Question text with colored header, formula pinyin then english name below, line break
      const { pinyin, english } = getDisplayFormulaNameSplit(answerFormula);
      let questionText = (
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <div
            style={{
              fontWeight: 900,
              fontSize: "1.12em",
              color: COLORS.accentBlue,
              background: "#e7f1fd",
              borderRadius: "1em",
              padding: "6px 14px",
              marginBottom: "0.6em",
              display: "inline-block",
              letterSpacing: "-0.01em",
              boxShadow: "0 2px 10px #2176AE22"
            }}
          >
            What category does this formula belong to:
          </div>
          <div
            style={{
              fontWeight: 800,
              fontSize: "1.19em",
              color: COLORS.backgroundRed,
              letterSpacing: "-0.01em",
              marginTop: "0.22em",
              marginBottom: "0.04em"
            }}
          >
            {pinyin}
          </div>
          {english && (
            <div
              style={{
                fontWeight: 600,
                fontSize: "1.08em",
                color: COLORS.accentBlack,
                marginTop: "0.15em"
              }}
            >
              {english}
            </div>
          )}
        </div>
      );
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
          <div style={{ fontWeight: 700, fontSize: "1.11em", color: COLORS.backgroundRed }}>
            {getDisplayFormulaName(answerFormula)}
          </div>
          {getFormulaIngredients(answerFormula)?.length > 0 && (
            <div style={{ marginTop: "0.4em", color: COLORS.accentBlack }}>
              <b>Ingredients:</b>
              <ul style={{ margin: "0.3em 0 0 1em", padding:0 }}>
                {getFormulaIngredients(answerFormula).map((ing, i) => (
                  <li key={i} style={{ textAlign: "left" }}>
                    <span style={{ fontWeight: "bold", color: COLORS.accentEmerald, marginRight: 6 }}>{i+1}.</span> {ing}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
      return {
        question: questionText,
        options: categoryOptions,
        optionObjs: categoryOptions,
        answerIdx,
        formulaObj: answerFormula,
        extraContent
      };
    }

    const answerFormula = formulas[Math.floor(Math.random() * formulas.length)];
    let optionObjs = [answerFormula];
    let others = formulas.filter(f => f !== answerFormula);
    optionObjs = optionObjs.concat(pickRandom(others, 3));
    optionObjs = shuffle(optionObjs);
    const answerIdx = optionObjs.findIndex(f => f === answerFormula);

    let questionText, optionTexts, extraContent;
    if (matchMode === "actions") {
      questionText = `Which formula matches this action: "${answerFormula.explanation || answerFormula.actions || "No action listed"}"?`;
      optionTexts = optionObjs.map(getDisplayFormulaName);
    } else if (matchMode === "ingredients" || matchMode === "Ingredients <-> Name") {
      const ingredientsArr = getFormulaIngredients(answerFormula);
      questionText = "Which formula contains these ingredients?";
      extraContent = (
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
          {ingredientsArr.length > 0 ? (
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {ingredientsArr.map((ing, idx) => (
                <li key={idx} style={{ marginBottom: "2px", textAlign: "left" }}>
                  <span style={{
                    fontWeight: "bold",
                    color: COLORS.accentEmerald,
                    marginRight: "6px"
                  }}>{idx + 1}.</span> {ing}
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ opacity: 0.7 }}>(No ingredients listed for this formula)</div>
          )}
        </div>
      );
      optionTexts = optionObjs.map(getDisplayFormulaName);
    } else {
      questionText = "Unknown match mode";
      optionTexts = optionObjs.map(getDisplayFormulaName);
    }
    return {
      question: questionText,
      options: optionTexts,
      optionObjs,
      answerIdx,
      formulaObj: answerFormula,
      extraContent
    };
  }, [matchMode, getCategoryOptions]);

  useEffect(() => {
    if (!loading && allFormulas.length >= 4) {
      setCurrentQuestion(getQuestion(allFormulas, categoryList));
      setSelectedOption(null);
      setFeedback(null);
    }
  }, [loading, questionNumber, allFormulas, matchMode, getQuestion, categoryList]);

  function handleOptionClick(idx) {
    setSelectedOption(idx);
    setTotalAnswered(prev => prev + 1);
    if (idx === currentQuestion.answerIdx) {
      setCorrectAnswered(prev => prev + 1);
      setFeedback("Correct!");
    } else {
      if (matchMode === "category") {
        setFeedback(`Incorrect. The answer was "${currentQuestion.options[currentQuestion.answerIdx].category}${currentQuestion.options[currentQuestion.answerIdx].subcategory ? " - "+currentQuestion.options[currentQuestion.answerIdx].subcategory : ""}".`);
      } else {
        setFeedback(`Incorrect. The answer was "${currentQuestion.options[currentQuestion.answerIdx]}".`);
      }
    }
  }

  function handleNextQuestion() {
    setQuestionNumber(q => q + 1);
    setSelectedOption(null);
    setFeedback(null);
  }

  function handleBackToSetup() {
    navigate("/game/formula-ingredients");
  }

  function handleExitToLanding() {
    navigate("/tcmgames");
  }

  const percentCorrect = totalAnswered === 0 ? 0 : Math.round((correctAnswered / totalAnswered) * 100);

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
        flexDirection: "column"
      }}
    >
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
          justifyContent: "center"
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
              margin: "0 auto"
            }}
          >
            <h2 className="text-3xl font-bold mb-4" style={{ color: COLORS.accentCrimson }}>Loading...</h2>
            <p className="mb-3">Loading formulas...</p>
          </div>
        ) : allFormulas.length < 4 ? (
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
              margin: "0 auto"
            }}
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: COLORS.accentCrimson }}>Not Enough Formulas</h2>
            <p className="mb-3">Please select more formulas in setup to play this game.</p>
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
                cursor: "pointer"
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
                cursor: "pointer"
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
              Question {questionNumber}
            </div>
            <div style={{ fontWeight: 700, fontSize: "1.15em", marginBottom: "1em", color: COLORS.accentBlue }}>
              {currentQuestion?.question}
            </div>
            {currentQuestion?.extraContent && matchMode !== "category" && currentQuestion?.extraContent}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%"
            }}>
              {matchMode === "category" ? (
                currentQuestion?.options.map((opt, idx) => (
                  <button
                    key={opt.category + "|" + opt.subcategory}
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
                      fontSize: "1.10em",
                      margin: "10px 0",
                      padding: "14px 18px",
                      width: "70%",
                      maxWidth: "360px",
                      boxShadow: selectedOption === idx ? "0 2px 10px #B38E3FAA" : "0 2px 7px #D4AF3722",
                      cursor: selectedOption == null ? "pointer" : "not-allowed",
                      transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center"
                    }}
                  >
                    <span style={{
                      fontWeight: 800,
                      fontSize: "1.10em",
                      color: COLORS.backgroundRed,
                      letterSpacing: "-0.01em"
                    }}>
                      {opt.category}{opt.subcategory ? ` - ${opt.subcategory}` : ""}
                    </span>
                  </button>
                ))
              ) : (
                currentQuestion?.options.map((opt, idx) => (
                  <button
                    key={opt}
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
                    {opt}
                  </button>
                ))
              )}
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
            {selectedOption != null && (
              <>
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
                {matchMode === "category" ? (
                  <div style={{
                    marginTop: "2em",
                    background: "#FCF5E5",
                    borderRadius: "1em",
                    padding: "1em",
                    boxShadow: "0 2px 12px #D4AF3788"
                  }}>
                    <h3 style={{fontWeight:700, fontSize:"1.1em", color:COLORS.backgroundRed, marginBottom:"0.7em"}}>Formula & Category Details:</h3>
                    <div style={{
                      marginBottom: "1.8em",
                      border: `2px solid ${COLORS.accentEmerald}`,
                      borderRadius: "0.7em",
                      padding: "0.7em 1em",
                      background: "#eaffed",
                      boxShadow: "0 2px 10px #438C3B33"
                    }}>
                      <div style={{fontWeight:800, color:COLORS.backgroundRed, fontSize:"1.06em", marginBottom:"0.3em"}}>
                        {getDisplayFormulaName(currentQuestion.formulaObj)}
                        <span style={{marginLeft:8, color:COLORS.accentEmerald}}>
                          ✔ Answer: {currentQuestion.options[currentQuestion.answerIdx].category}
                          {currentQuestion.options[currentQuestion.answerIdx].subcategory ? ` - ${currentQuestion.options[currentQuestion.answerIdx].subcategory}` : ""}
                        </span>
                      </div>
                      <div style={{marginBottom:"0.3em", color:COLORS.accentBlue}}>
                        <b>Category:</b> {currentQuestion.formulaObj?.category}
                      </div>
                      <div style={{marginBottom:"0.3em", color:COLORS.accentBlue}}>
                        <b>{/* no label, just value */}</b> {findSubcategory(currentQuestion.formulaObj, categoryList)}
                      </div>
                      <div style={{marginBottom:"0.3em", color:COLORS.accentBlack}}>
                        <b>Actions/Explanation:</b> {currentQuestion.formulaObj?.explanation || currentQuestion.formulaObj?.actions || "(no action listed)"}
                      </div>
                      {getFormulaIngredients(currentQuestion.formulaObj)?.length > 0 && (
                        <div style={{marginBottom:"0.2em"}}>
                          <b>Ingredients:</b>
                          <ul style={{margin: "0.3em 0 0 1em", padding:0}}>
                            {getFormulaIngredients(currentQuestion.formulaObj).map((ing, i) => (
                              <li key={i} style={{textAlign:"left"}}>
                                <span style={{fontWeight:"bold", color:COLORS.accentEmerald, marginRight:6}}>{i+1}.</span> {ing}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {currentQuestion.formulaObj?.indications && (
                        <div style={{marginBottom:"0.2em"}}>
                          <b>Indications:</b> {currentQuestion.formulaObj.indications}
                        </div>
                      )}
                      {currentQuestion.formulaObj?.notes && (
                        <div>
                          <b>Notes:</b> {Array.isArray(currentQuestion.formulaObj.notes) ? currentQuestion.formulaObj.notes.join("; ") : currentQuestion.formulaObj.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ) : Array.isArray(currentQuestion.optionObjs) && (
                  <div style={{
                    marginTop: "2em",
                    background: "#FCF5E5",
                    borderRadius: "1em",
                    padding: "1em",
                    boxShadow: "0 2px 12px #D4AF3788"
                  }}>
                    <h3 style={{fontWeight:700, fontSize:"1.1em", color:COLORS.backgroundRed, marginBottom:"0.7em"}}>Details for Each Option:</h3>
                    {currentQuestion.optionObjs.map((formulaObj, idx) => (
                      <div key={idx} style={{
                        marginBottom: "1.8em",
                        border: idx === currentQuestion.answerIdx ? `2px solid ${COLORS.accentEmerald}` : "1px solid #eee",
                        borderRadius: "0.7em",
                        padding: "0.7em 1em",
                        background: idx === currentQuestion.answerIdx ? "#eaffed" : "#fff",
                        boxShadow: idx === currentQuestion.answerIdx ? "0 2px 10px #438C3B33" : "0 1px 7px #D4AF3722"
                      }}>
                        <div style={{fontWeight:800, color:COLORS.backgroundRed, fontSize:"1.06em", marginBottom:"0.3em"}}>
                          {getDisplayFormulaName(formulaObj)}
                          {idx === currentQuestion.answerIdx && <span style={{marginLeft:8, color:COLORS.accentEmerald}}>✔ Correct Answer</span>}
                        </div>
                        <div style={{marginBottom:"0.3em", color:COLORS.accentBlue}}>
                          <b>Category:</b> {formulaObj?.category}
                        </div>
                        <div style={{marginBottom:"0.3em", color:COLORS.accentBlack}}>
                          <b>Actions/Explanation:</b> {formulaObj?.explanation || formulaObj?.actions || "(no action listed)"}
                        </div>
                        {getFormulaIngredients(formulaObj)?.length > 0 && (
                          <div style={{marginBottom:"0.2em"}}>
                            <b>Ingredients:</b>
                            <ul style={{margin: "0.3em 0 0 1em", padding:0}}>
                              {getFormulaIngredients(formulaObj).map((ing, i) => (
                                <li key={i} style={{textAlign:"left"}}>
                                  <span style={{fontWeight:"bold", color:COLORS.accentEmerald, marginRight:6}}>{i+1}.</span> {ing}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {formulaObj?.indications && (
                          <div style={{marginBottom:"0.2em"}}>
                            <b>Indications:</b> {formulaObj.indications}
                          </div>
                        )}
                        {formulaObj?.notes && (
                          <div>
                            <b>Notes:</b> {Array.isArray(formulaObj.notes) ? formulaObj.notes.join("; ") : formulaObj.notes}
                          </div>
                        )}
                      </div>
                    ))}
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