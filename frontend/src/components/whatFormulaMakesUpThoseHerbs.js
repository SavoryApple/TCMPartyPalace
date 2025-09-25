import React, { useEffect, useState, useMemo } from "react";

// --- Colors and Utility ---
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
  herbLink: "#2176AE",
  herbLinkHover: "#438C3B",
  herbLinkBg: "#FFF7E3",
  highlight: "#ffe066",
  accentHerbInCart: "#fffbe6",
  accentHerbInCopyList: "#438C3B",
  accentHerbInCopyListText: "#FCF5E5",
  checkmarkVisible: "#FF9800", // Bright orange for checkmark
  checkmarkBorder: "#fff",     // White outline for visibility
};

function normalize(str) {
  if (Array.isArray(str)) {
    return str
      .map((s) =>
        typeof s === "string"
          ? s.replace(/[\s\-']/g, "")
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          : ""
      )
      .filter(Boolean);
  }
  return typeof str === "string"
    ? str
        .replace(/[\s\-']/g, "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    : "";
}

function parseHerbPinyinNameVariants(ingredientStr) {
  let base = ingredientStr
    .replace(/\([^)]+\)/g, "")
    .replace(/\d+(\.\d+)?(-\d+(\.\d+)?)?\s*(g|mg|ml|pieces)?/gi, "")
    .trim();
  base = base.replace(/\s+/g, " ");
  return [base];
}

function getHerbKey(herb) {
  if (!herb) return "";
  if (herb.pinyinName) return herb.pinyinName;
  if (herb.name) return herb.name;
  if (herb.id && !herb.error) return herb.id;
  return "";
}

function getFormulaBadge(formula) {
  if (formula.caleAndNccaom === "yes" || formula.origin === "CALE") {
    return { label: "NCCAOM/CALE", color: "bg-green-200 text-green-700" };
  }
  if (formula.nccaom === "yes" && formula.caleAndNccaom !== "yes") {
    return { label: "NCCAOM", color: "bg-blue-200 text-blue-700" };
  }
  if (formula.origin === "Extra" || formula.origin === "EXTRA" || formula.extraFormula === "yes") {
    return { label: "EXTRA", color: "bg-gray-300 text-gray-700" };
  }
  return null;
}

function Badge({ badge }) {
  if (!badge) return null;
  return (
    <span className={`inline-block ml-2 px-2 py-1 rounded text-xs font-semibold align-middle ${badge.color}`}>
      {badge.label}
    </span>
  );
}

function highlightText(text, query) {
  if (!text) return "";
  if (!query) return text;
  const safeQuery = query.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
  const regex = new RegExp(`(${safeQuery})`, "gi");
  return String(text)
    .split(regex)
    .map((part, i) =>
      regex.test(part)
        ? (
          <span key={i} style={{
            background: COLORS.highlight,
            color: COLORS.backgroundRed,
            fontWeight: "bold"
          }}>{part}</span>
        )
        : part
    );
}

// --- Herb Button Styling Function ---
function getHerbButtonStyle(isHighlighted, builderHighlight = false) {
  // No red/yellow highlight, only normal and builder green
  if (isHighlighted && builderHighlight) {
    // Green highlight for builder page (and main herb on HerbCard)
    return {
      color: COLORS.accentHerbInCopyListText,
      background: COLORS.accentHerbInCopyList,
      borderRadius: "1em",
      border: `2px solid ${COLORS.accentGold}`,
      fontWeight: 700,
      fontSize: "1em",
      marginRight: "0.35em",
      padding: "0 0.4em",
      textDecoration: "underline",
      cursor: "pointer",
      boxShadow: `0 0 0 2px ${COLORS.accentGold}33`,
      transition: "all 0.13s cubic-bezier(.36,1.29,.45,1.01)",
      position: "relative",
    };
  }
  // Default (no cart/yellow/red highlight)
  return {
    color: COLORS.herbLink,
    background: COLORS.herbLinkBg,
    borderRadius: "1em",
    border: "none",
    fontWeight: 700,
    fontSize: "1em",
    marginRight: "0.35em",
    padding: "0 0.22em",
    textDecoration: "underline",
    cursor: "pointer",
    boxShadow: "none",
    transition: "all 0.13s cubic-bezier(.36,1.29,.45,1.01)",
    position: "relative",
  };
}

// --- Animated Checkmark Component ---
// Orange checkmark, white outline, shadow for visibility.
function AnimatedCheckmark({ show }) {
  if (!show) return null;
  return (
    <span
      style={{
        display: "inline-block",
        marginLeft: 7,
        verticalAlign: "middle",
        animation: "checkmark-pop 0.38s cubic-bezier(.36,1.29,.45,1.01)",
        position: "relative",
        zIndex: 10,
      }}
    >
      <svg
        width="23"
        height="23"
        viewBox="0 0 24 24"
        fill="none"
        style={{
          display: "inline-block",
          verticalAlign: "middle",
          filter: "drop-shadow(0 2px 4px #FF9800)",
        }}
        aria-label="In cart"
      >
        {/* White outline */}
        <path
          d="M5.6 13.5l5 5 7.5-11"
          stroke={COLORS.checkmarkBorder}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 0.7 }}
        />
        {/* Orange main checkmark */}
        <path
          d="M5.6 13.5l5 5 7.5-11"
          stroke={COLORS.checkmarkVisible}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <style>{`
        @keyframes checkmark-pop {
          0% { opacity: 0; transform: scale(0.6) rotate(-18deg);}
          72% { opacity: 1; transform: scale(1.15) rotate(6deg);}
          100% { opacity: 1; transform: scale(1) rotate(0);}
        }
      `}</style>
    </span>
  );
}

// --- Small Button Style for HerbCard.js ---
const SMALL_BUTTON_STYLE = {
  fontSize: "0.8em",
  padding: "4px 13px",
  borderRadius: "8px",
  minHeight: "unset",
  height: "unset",
  fontWeight: 700,
  boxShadow: "0 1px 3px -1px #B38E3F44",
  marginRight: "0.7em",
};
const SMALL_BUTTON_CONTAINER_STYLE = {
  gap: "0.6em",
  marginTop: "0.6em",
  marginBottom: "0.6em",
  display: "flex",
  flexWrap: "wrap"
};

const API_URL = process.env.REACT_APP_API_URL || "https://thetcmatlas.fly.dev";

function KeyActionsExplanation({ explanation, keyActions }) {
  if (!explanation && !keyActions) return null;
  return (
    <div
      style={{
        background: COLORS.accentIvory,
        color: COLORS.accentCrimson,
        fontWeight: 600,
        fontSize: "1.05em",
        borderRadius: "1em",
        padding: "11px 18px",
        marginTop: "10px",
        marginBottom: "10px",
        textAlign: "center",
        boxShadow: `0 2px 18px -4px ${COLORS.shadowStrong}`,
        border: `2px solid ${COLORS.accentGold}`,
        letterSpacing: ".01em",
        maxWidth: "98%",
        alignSelf: "center",
        wordBreak: "break-word",
        lineHeight: "1.4",
      }}
    >
      {keyActions && <div><strong>Key Actions:</strong> {keyActions}</div>}
      {explanation && <div><strong>Clinical Summary:</strong> {explanation}</div>}
    </div>
  );
}

function ExtraPropsBlock({ yosancarries, formats }) {
  return (
    <div style={{ marginTop: "10px", marginBottom: "10px", fontSize: "1.02em" }}>
      {typeof yosancarries !== "undefined" && (
        <div>
          <strong style={{ color: COLORS.backgroundRed }}>Yo San Carries:</strong>{" "}
          <span style={{ color: yosancarries ? COLORS.accentEmerald : COLORS.accentCrimson, fontWeight: 600 }}>
            {yosancarries === true ? "Yes" : yosancarries === false ? "No" : yosancarries}
          </span>
        </div>
      )}
      {formats && Array.isArray(formats) && formats.length > 0 && (
        <div>
          <strong style={{ color: COLORS.backgroundRed }}>Format:</strong>{" "}
          <span style={{ color: COLORS.accentBlack }}>
            {formats.join(", ")}
          </span>
        </div>
      )}
    </div>
  );
}

export default function WhatFormulaMakesUpThoseHerbs({
  herbs,
  excludeFormulaPinyinNames = [],
  onAddFormula,
  onAddIndividualHerb,
  cart,
  addHerb,
  removeHerb,
  onAddFormulaBuilder,
  query = "",
  mainHerbObj,
  showFormulaActions = true,
  highlightMainHerb = false,
  onlyShowAddToFormulaButton = false, // <-- for FormulaBuilder.js
  showAddToFormulaBuilderButton = false, // <-- for HerbCard.js
}) {
  const [allHerbs, setAllHerbs] = useState([]);
  const [allFormulas, setAllFormulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [herbLinkAnimating, setHerbLinkAnimating] = useState({});
  const [formulaCategoryList, setFormulaCategoryList] = useState([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_URL}/api/data/caleandnccaomformulas`).then(r => r.json()),
      fetch(`${API_URL}/api/data/caleandnccaomherbs`).then(r => r.json()),
      fetch(`${API_URL}/api/data/caleherbs`).then(r => r.json()),
      fetch(`${API_URL}/api/data/extraformulas`).then(r => r.json()),
      fetch(`${API_URL}/api/data/extraherbs`).then(r => r.json()),
      fetch(`${API_URL}/api/data/nccaomformulas`).then(r => r.json()),
      fetch(`${API_URL}/api/data/nccaomherbs`).then(r => r.json()),
      fetch(`/data/formulaCategoryListObject.json`).then(r => r.json()).catch(() => []),
    ]).then(([ 
      caleAndNccaomFormulas,
      caleAndNccaomHerbs,
      caleHerbs,
      extraFormulas,
      extraHerbs,
      nccaomFormulas,
      nccaomHerbs,
      categoryList,
    ]) => {
      setAllHerbs([
        ...caleHerbs,
        ...caleAndNccaomHerbs,
        ...extraHerbs,
        ...nccaomHerbs,
      ]);
      setAllFormulas([
        ...caleAndNccaomFormulas.map(f => ({ ...f, origin: "CALE" })),
        ...extraFormulas.map(f => ({ ...f, origin: "Extra" })),
        ...nccaomFormulas.map(f => ({ ...f, origin: "NCCAOM" })),
      ]);
      setFormulaCategoryList(categoryList || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const normalizedSelectedHerbs = useMemo(() => {
    let arr = [];
    if (herbs) {
      arr = herbs
        .map(h => normalize(Array.isArray(h.pinyinName) ? h.pinyinName[0] : h.pinyinName))
        .filter(Boolean);
    }
    if (mainHerbObj && !Array.isArray(mainHerbObj)) {
      const mainNorm = normalize(Array.isArray(mainHerbObj.pinyinName) ? mainHerbObj.pinyinName[0] : mainHerbObj.pinyinName);
      if (mainNorm && !arr.includes(mainNorm)) arr.push(mainNorm);
    }
    if (mainHerbObj && Array.isArray(mainHerbObj)) {
      mainHerbObj.forEach(h => {
        const norm = normalize(Array.isArray(h.pinyinName) ? h.pinyinName[0] : h.pinyinName);
        if (norm && !arr.includes(norm)) arr.push(norm);
      });
    }
    return arr;
  }, [herbs, mainHerbObj]);

  function findHerbObjByName(name) {
    if (!name || !allHerbs?.length) return null;
    const pinyinNorm = name.toLowerCase().replace(/\s+/g, "");
    return allHerbs.find(h => {
      let names = Array.isArray(h.pinyinName)
        ? h.pinyinName.map(n => n.toLowerCase().replace(/\s+/g, ""))
        : [h.pinyinName ? h.pinyinName.toLowerCase().replace(/\s+/g, "") : ""];
      return names.some(n => n === pinyinNorm);
    });
  }

  function isHerbInCart(herbObj) {
    const herbKey = getHerbKey(herbObj);
    return cart && cart.some(h => getHerbKey(h) === herbKey);
  }

  function isHerbInCopyList(herbObj) {
    const herbKey = getHerbKey(herbObj);
    return herbs && herbs.some(h => getHerbKey(h) === herbKey);
  }

  // Helper to check if a herbObj is the main herb
  function isMainHerb(herbObj) {
    if (!mainHerbObj || !herbObj) return false;
    const herbKey = normalize(Array.isArray(herbObj.pinyinName) ? herbObj.pinyinName[0] : herbObj.pinyinName);
    if (Array.isArray(mainHerbObj)) {
      return mainHerbObj.some(h => normalize(Array.isArray(h.pinyinName) ? h.pinyinName[0] : h.pinyinName) === herbKey);
    } else {
      return normalize(Array.isArray(mainHerbObj.pinyinName) ? mainHerbObj.pinyinName[0] : mainHerbObj.pinyinName) === herbKey;
    }
  }

  function handleAddIndividualHerb(herbObj) {
    if (!herbObj) return;
    if (typeof onAddIndividualHerb === "function") {
      onAddIndividualHerb(herbObj);
    }
  }

  function handleHerbClick(herbObj, idx) {
    if (!addHerb || !removeHerb) return;
    const inCart = isHerbInCart(herbObj);
    setHerbLinkAnimating(prev => ({ ...prev, [idx]: true }));
    setTimeout(() => setHerbLinkAnimating(prev => ({ ...prev, [idx]: false })), 350);
    if (inCart) {
      removeHerb(getHerbKey(herbObj));
    } else {
      addHerb(herbObj);
    }
  }

  function getCartHerbsForFormula(formula) {
    if (!formula.ingredientsAndDosages) return [];
    return formula.ingredientsAndDosages
      .map((ingredientStr, i) => {
        const pinyinVariants = parseHerbPinyinNameVariants(ingredientStr);
        let fullHerb = null;
        for (const variant of pinyinVariants) {
          fullHerb = findHerbObjByName(variant);
          if (fullHerb) break;
        }
        return fullHerb || null;
      })
      .filter(Boolean);
  }

  function allHerbsInCart(formula) {
    const allFormulaHerbs = getCartHerbsForFormula(formula).filter(h => !h.error);
    if (!cart) return false;
    const currentHerbKeys = new Set(cart.map(getHerbKey));
    return allFormulaHerbs.length > 0 && allFormulaHerbs.every(h => currentHerbKeys.has(getHerbKey(h)));
  }

  function addAllHerbsToCart(formula) {
    const allFormulaHerbs = getCartHerbsForFormula(formula).filter(h => !h.error);
    if (!cart) return;
    const currentHerbKeys = new Set(cart.map(getHerbKey));
    const herbsToAdd = allFormulaHerbs.filter(h => !currentHerbKeys.has(getHerbKey(h)));
    herbsToAdd.forEach(h => addHerb(h));
  }

  function formulaBuilderButton(formula) {
    const allFormulaHerbs = getCartHerbsForFormula(formula).filter(h => !h.error);
    const currentHerbKeys = new Set((herbs || []).map(getHerbKey));
    const missingHerbs = allFormulaHerbs.filter(h => !currentHerbKeys.has(getHerbKey(h)));
    const allPresent = missingHerbs.length === 0;

    if (showAddToFormulaBuilderButton) {
      return (
        <button
          style={{
            ...SMALL_BUTTON_STYLE,
            background: COLORS.accentGold,
            color: COLORS.backgroundRed,
            border: `1.5px solid ${COLORS.accentGold}`,
            cursor: "pointer",
            fontWeight: 700,
            opacity: 1,
          }}
          onClick={e => {
            e.stopPropagation();
            if (typeof onAddFormulaBuilder === "function") {
              onAddFormulaBuilder(formula);
            }
          }}
          title="Add this formula to Formula Builder"
        >
          Add To Formula Builder
        </button>
      );
    }

    return (
      <button
        className="mt-4 px-4 py-2 font-bold rounded-full transition-all duration-150 shadow hover:scale-105"
        style={{
          background: allPresent ? COLORS.accentGray : COLORS.accentGold,
          color: COLORS.backgroundRed,
          fontSize: "0.92rem",
          cursor: allPresent ? "not-allowed" : "pointer",
          opacity: allPresent ? 0.7 : 1,
        }}
        onClick={e => {
          e.stopPropagation();
          if (!allPresent && typeof onAddFormula === "function") {
            onAddFormula(missingHerbs);
          }
        }}
        disabled={allPresent}
        title={allPresent ? "All herbs already added" : `Add ${missingHerbs.length} herb${missingHerbs.length === 1 ? "" : "s"} to formula`}
      >
        {allPresent
          ? "All Herbs Already Added"
          : `Add ${missingHerbs.length} Herb${missingHerbs.length === 1 ? "" : "s"} to Formula`}
      </button>
    );
  }

  function getCategoryExplanation(formula, formulaCategoryList) {
    if (!formula || !formulaCategoryList) return undefined;
    for (const cat of formulaCategoryList) {
      for (const subcat of cat.subcategories || []) {
        for (const f of subcat.formulas || []) {
          if (
            f.name &&
            formula.pinyinName &&
            f.name.replace(/\s/g, "").toLowerCase() ===
              (Array.isArray(formula.pinyinName)
                ? formula.pinyinName[0]
                : formula.pinyinName
              ).replace(/\s/g, "").toLowerCase()
          ) {
            return f.explanation;
          }
        }
      }
    }
    return undefined;
  }

  const matchingFormulas = useMemo(() => {
    if (normalizedSelectedHerbs.length === 0 || allFormulas.length === 0) return [];
    return allFormulas.filter((formula) => {
      if (!formula.ingredientsAndDosages) return false;
      if (
        excludeFormulaPinyinNames &&
        excludeFormulaPinyinNames.length > 0 &&
        excludeFormulaPinyinNames.some(ex =>
          normalize(ex) === normalize(Array.isArray(formula.pinyinName) ? formula.pinyinName[0] : formula.pinyinName)
        )
      ) {
        return false;
      }
      const formulaHerbsNorm = formula.ingredientsAndDosages
        .map(ing => normalize(parseHerbPinyinNameVariants(ing)[0]));
      return normalizedSelectedHerbs.every(customName =>
        formulaHerbsNorm.some(fh => fh === customName)
      );
    });
  }, [normalizedSelectedHerbs, allFormulas, excludeFormulaPinyinNames]);

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto mt-10 mb-16 p-8 rounded-3xl shadow-2xl" style={{
        background: COLORS.accentIvory,
        border: `2px solid ${COLORS.accentGold}`,
        boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
        color: COLORS.backgroundRed,
      }}>
        <h3 className="font-bold text-xl mb-4" style={{ color: COLORS.backgroundRed }}>
          Loading formulas & herbs...
        </h3>
      </div>
    );
  }

  if ((!herbs || herbs.length === 0) && !mainHerbObj) return null;
  if (matchingFormulas.length === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto mt-10 mb-16 p-8 rounded-3xl shadow-2xl" style={{
        background: COLORS.accentIvory,
        border: `2px solid ${COLORS.accentGold}`,
        boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
        color: COLORS.backgroundRed,
      }}>
        <h3 className="font-bold text-xl mb-4" style={{ color: COLORS.backgroundRed }}>
          No formulas found that contain all selected herbs.
        </h3>
      </div>
    );
  }

  // --- MAIN RENDER ---
  return (
    <div className="w-full max-w-5xl mx-auto mt-10 mb-16 p-8 rounded-3xl shadow-2xl"
      style={{
        background: COLORS.accentIvory,
        border: `2px solid ${COLORS.accentGold}`,
        boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
        color: COLORS.backgroundRed
      }}>
      <h3 className="font-bold text-xl mb-4" style={{ color: COLORS.backgroundRed }}>
        Formulas containing selected herb(s):
      </h3>
      <div className="flex flex-wrap justify-center gap-8">
        {matchingFormulas.map((formula, formulaIdx) => {
          const badge = getFormulaBadge(formula);
          const allInCart = allHerbsInCart(formula);
          const useBuilder = onlyShowAddToFormulaButton && typeof onAddIndividualHerb === "function";

          // Explanation, yosancarries, formats
          const categoryExplanation = getCategoryExplanation(formula, formulaCategoryList);
          const explanation = formula.explanation || categoryExplanation;
          const keyActions = formula.keyActions || undefined;
          const yosancarries =
            typeof formula.yosancarries !== "undefined"
              ? formula.yosancarries
              : typeof formula.yoSanCarries !== "undefined"
              ? formula.yoSanCarries
              : undefined;
          const formats = formula.formats || [];

          return (
            <div
              key={formula.pinyinName}
              className="min-w-[320px] max-w-[420px] flex-1 bg-white border border-violet rounded-xl p-6 shadow-lg mb-3"
              style={{
                background: COLORS.backgroundGold,
                border: `2px solid ${COLORS.accentGold}`,
                borderRadius: "1.1em",
                padding: "1.4em 1.3em 1.3em 1.3em",
                color: COLORS.backgroundRed,
                boxShadow: `0 4px 18px -6px ${COLORS.shadowStrong}`,
                position: "relative",
              }}
            >
              <div className="flex flex-col">
                <span className="font-bold text-lg flex items-center" style={{ color: COLORS.accentBlue }}>
                  {formula.pinyinName}
                  <Badge badge={badge} />
                </span>
                <span className="text-md" style={{ color: COLORS.backgroundRed }}>{formula.englishName}</span>
                <span style={{ color: COLORS.accentEmerald }}>{formula.chineseCharacters}</span>
                <span className="text-xs mb-1" style={{ color: COLORS.accentBlack }}>
                  <strong>Category:</strong> {formula.category}
                </span>
                <span className="text-xs mb-1" style={{ color: COLORS.accentBlack }}>
                  <strong>Actions:</strong> {formula.actions}
                </span>
                <span className="text-xs mb-1" style={{ color: COLORS.accentBlack }}>
                  <strong>Indications:</strong> {formula.indications}
                </span>
              </div>
              <div className="mt-2">
                <strong style={{ color: COLORS.accentGold }}>Ingredients:</strong>
                <ul className="pl-0 mt-1" style={{ paddingLeft: 0 }}>
                  {formula.ingredientsAndDosages.map((ing, i) => {
                    const pinyin = parseHerbPinyinNameVariants(ing)[0];
                    const herbObj = findHerbObjByName(pinyin);
                    const inCart = herbObj && isHerbInCart(herbObj);
                    const inCopyList = herbObj && isHerbInCopyList(herbObj);

                    // Highlight logic:
                    // On FormulaBuilder: highlight ONLY if in herblistcopytoclipboard (green)
                    // On other pages: only green for builder/highlightMainHerb
                    let isHighlighted = false;
                    let builderHighlight = false;
                    if (useBuilder) {
                      isHighlighted = inCopyList;
                      builderHighlight = true;
                    } else {
                      if (highlightMainHerb && isMainHerb(herbObj)) {
                        // On HerbCard and highlightMainHerb is true, main herb gets green
                        isHighlighted = true;
                        builderHighlight = true;
                      }
                    }

                    // Show checkmark if herb is in cart, even if mainHerb
                    const showCheckmark = inCart;

                    return (
                      <li key={i} style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "2px",
                        position: "relative",
                        minHeight: "2.2em",
                      }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                        {herbObj ? (
                          <>
                            <button
                              className={`herb-link-hover`}
                              style={getHerbButtonStyle(isHighlighted, builderHighlight)}
                              onClick={
                                useBuilder && !inCopyList
                                  ? () => handleAddIndividualHerb(herbObj)
                                  : !useBuilder
                                  ? () => handleHerbClick(herbObj, `${formulaIdx}_${i}`)
                                  : undefined
                              }
                              title={
                                useBuilder
                                  ? (
                                      !inCopyList
                                        ? `Add ${herbObj.pinyinName} to list`
                                        : `${herbObj.pinyinName} already present`
                                    )
                                  : inCart
                                  ? `Remove ${herbObj.pinyinName} from cart`
                                  : `Add ${herbObj.pinyinName} to cart`
                              }
                              tabIndex={0}
                            >
                              {highlightText(ing, query)}
                              {showCheckmark && <AnimatedCheckmark show={true} />}
                            </button>
                          </>
                        ) : (
                          <span style={{ color: COLORS.herbLink }}>{highlightText(ing, query)}</span>
                        )}
                        </div>
                        {useBuilder && herbObj && !inCopyList && (
                          <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                            position: "absolute",
                            right: 0,
                            top: 0,
                            bottom: 0,
                          }}>
                            <button
                              style={{
                                background: COLORS.accentEmerald,
                                color: COLORS.backgroundGold,
                                borderRadius: "50%",
                                fontWeight: "bold",
                                fontSize: "1.2em",
                                border: "none",
                                width: "2em",
                                height: "2em",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: `0 1px 5px 0 ${COLORS.accentGold}44`,
                                cursor: "pointer",
                                marginLeft: "auto",
                                transition: "background 0.18s",
                              }}
                              onClick={() => handleAddIndividualHerb(herbObj)}
                              title={`Add ${herbObj.pinyinName} to list`}
                              tabIndex={0}
                            >
                              +
                            </button>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
              {showFormulaActions && (
                <div
                  className="flex gap-2 mt-4 mb-2"
                  style={showAddToFormulaBuilderButton ? SMALL_BUTTON_CONTAINER_STYLE : undefined}
                >
                  {onlyShowAddToFormulaButton ? (
                    formulaBuilderButton(formula)
                  ) : (
                    <>
                      <button
                        style={showAddToFormulaBuilderButton
                          ? {
                              ...SMALL_BUTTON_STYLE,
                              background: allInCart ? COLORS.accentGray : COLORS.accentEmerald,
                              color: allInCart ? COLORS.backgroundRed : COLORS.backgroundGold,
                              border: `1.5px solid ${COLORS.accentEmerald}`,
                              opacity: allInCart ? 0.7 : 1,
                              cursor: allInCart ? "not-allowed" : "pointer",
                              fontWeight: 700,
                            }
                          : {
                              background: allInCart ? COLORS.accentGray : COLORS.accentEmerald,
                              color: allInCart ? COLORS.backgroundRed : COLORS.backgroundGold,
                              fontSize: "0.97em",
                              border: `2px solid ${COLORS.accentGold}`,
                              boxShadow: `0 1px 5px -2px ${COLORS.accentEmerald}33`,
                              cursor: allInCart ? "not-allowed" : "pointer",
                              letterSpacing: "0.01em",
                              opacity: allInCart ? 0.7 : 1,
                            }
                        }
                        onClick={() => {
                          if (!allInCart) addAllHerbsToCart(formula);
                        }}
                        disabled={allInCart}
                        title={allInCart ? "All herbs are already in cart" : "Add all herbs to cart"}
                      >
                        {allInCart ? "All Herbs in Cart" : "Add All Herbs to Cart"}
                      </button>
                      {formulaBuilderButton(formula)}
                    </>
                  )}
                </div>
              )}
              <div style={{ marginTop: "12px", borderTop: `2px solid ${COLORS.accentGold}`, paddingTop: "10px" }}>
                <KeyActionsExplanation
                  keyActions={keyActions}
                  explanation={explanation}
                />
                <ExtraPropsBlock yosancarries={yosancarries} formats={formats} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}