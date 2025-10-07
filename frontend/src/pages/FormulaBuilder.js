import React, { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import FormulaSearchBar from "../components/formulaBuilderSearchBar";
import WhatFormulaMakesUpThoseHerbs from "../components/whatFormulaMakesUpThoseHerbs";
import HerbListCopyToClipboard from "../components/herbListCopyToClipboard";
import NavBar from "../components/NavBar";
import FooterCard from "../components/FooterCard";
import BackToTopButton from "../components/BackToTopButton";

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

function parseHerbPinyinNameVariants(ingredientStr) {
  let base = ingredientStr
    .replace(/\s*\d+(\.\d+)?(-\d+(\.\d+)?)?\s*[a-zA-Z\u4e00-\u9fa5]*$/, "")
    .trim();
  let noParen = base.replace(/\([^)]+\)/g, "").trim();
  noParen = noParen.replace(/\s+/g, " ");
  return Array.from(new Set([base, noParen]));
}
function normalize(str) {
  if (Array.isArray(str)) {
    return str
      .map((s) =>
        typeof s === "string"
          ? s
              .replace(/\s|-/g, "")
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          : ""
      )
      .filter(Boolean);
  }
  return typeof str === "string"
    ? str
        .replace(/\s|-/g, "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    : "";
}
function getHerbDisplayName(herb) {
  if (herb.pinyinName) {
    return Array.isArray(herb.pinyinName) ? herb.pinyinName[0] : herb.pinyinName;
  }
  if (herb.name) {
    return Array.isArray(herb.name) ? herb.name[0] : herb.name;
  }
  if (herb.englishNames) {
    return Array.isArray(herb.englishNames)
      ? herb.englishNames[0]
      : herb.englishNames;
  }
  if (herb.pharmaceuticalName) {
    return herb.pharmaceuticalName;
  }
  return "Unknown";
}
function getHerbUniqueKey(herb) {
  if (herb.pinyinName)
    return normalize(
      Array.isArray(herb.pinyinName) ? herb.pinyinName[0] : herb.pinyinName
    );
  if (herb.name)
    return normalize(Array.isArray(herb.name) ? herb.name[0] : herb.name);
  return herb.id || "";
}

// --- Formula badge ---
function getFormulaBadge(formula) {
  if (formula.caleAndNccaom === "yes" || formula.origin === "CALE") {
    return { label: "NCCAOM/CALE", color: "bg-green-200 text-green-700" };
  }
  if (formula.nccaom === "yes" && formula.caleAndNccaom !== "yes") {
    return { label: "NCCAOM", color: "bg-blue-200 text-blue-700" };
  }
  if (formula.origin === "Extra" || formula.extraFormula === "yes" || formula.origin === "EXTRA") {
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

// --- FormulaCard component ---
function FormulaCard({
  formula,
  onTransferHerbs,
  onRemoveFormula,
  sharedHerbsNormalized,
  herbs,
  getTransferHerbObjectByPinyin,
  onAddIndividualHerb,
  cardRef,
}) {
  const [exiting, setExiting] = useState(false);
  const handleRemove = () => {
    setExiting(true);
    setTimeout(onRemoveFormula, 350);
  };

  const SHARED_STYLE = {
    background: COLORS.accentEmerald,
    color: COLORS.accentIvory,
    borderRadius: "6px",
    fontWeight: "bold",
    padding: "2px 8px",
    boxShadow: `0 0 2px 1px ${COLORS.accentEmerald}55`,
  };

  const PRESENT_STYLE = {
    background: COLORS.accentGold,
    color: COLORS.backgroundRed,
    borderRadius: "6px",
    fontWeight: "bold",
    padding: "2px 8px",
    boxShadow: `0 0 2px 1px ${COLORS.accentGold}30`,
  };

  const herbKeys = useMemo(() => new Set(herbs.map(getHerbUniqueKey)), [herbs]);
  const transferHerbObjs = useMemo(
    () =>
      formula.ingredientsAndDosages
        .map((ingredientStr) =>
          getTransferHerbObjectByPinyin(parseHerbPinyinNameVariants(ingredientStr))
        )
        .filter(Boolean),
    [formula, getTransferHerbObjectByPinyin]
  );
  const missingHerbObjs = transferHerbObjs.filter(
    (herbObj) => !herbKeys.has(getHerbUniqueKey(herbObj))
  );
  const missingCount = missingHerbObjs.length;

  function isHerbPresent(ingredientStr) {
    const pinyinVariants = parseHerbPinyinNameVariants(ingredientStr);
    const herbObj = getTransferHerbObjectByPinyin(pinyinVariants);
    if (!herbObj) return false;
    const key = getHerbUniqueKey(herbObj);
    return herbKeys.has(key);
  }

  function isSharedHerb(ingredientStr) {
    const pinyinVariants = parseHerbPinyinNameVariants(ingredientStr);
    return pinyinVariants.some((v) => sharedHerbsNormalized.has(normalize(v)));
  }

  const badge = getFormulaBadge(formula);

  function getIndividualAddHerbObj(ingredientStr) {
    const pinyinVariants = parseHerbPinyinNameVariants(ingredientStr);
    const herbObj = getTransferHerbObjectByPinyin(pinyinVariants);
    if (!herbObj) return null;
    const key = getHerbUniqueKey(herbObj);
    if (herbKeys.has(key)) return null;
    return herbObj;
  }

  // --- Tongue & Pulse logic ---
  const tongueAndPulse = formula.tongueandpulse || formula.tongueAndPulse || "";

  return (
    <div
      ref={cardRef}
      className={`bg-white/80 border-2 rounded-xl p-7 mb-6 flex flex-col shadow-2xl relative w-full max-w-xl mx-auto animate-fadeIn transition-all duration-300 hover:border-[${COLORS.accentCrimson}] backdrop-blur-lg hover:scale-[1.03] ${
        exiting ? "animate-slideOut" : ""
      }`}
      style={{
        minWidth: "340px",
        borderColor: COLORS.accentGold,
      }}
    >
      <button
        className="absolute top-2 right-2 px-3 py-1"
        style={{
          background: COLORS.accentCrimson,
          color: COLORS.backgroundGold,
          borderRadius: "9999px",
          fontWeight: "bold",
          fontSize: "0.85rem",
          transition: "all 0.2s",
        }}
        onClick={handleRemove}
        title="Remove formula"
      >
        ×
      </button>
      <div className="flex flex-wrap items-center justify-between mb-2">
        <span className="font-bold text-xl" style={{ color: COLORS.accentGold }}>
          {formula.pinyinName}
          <Badge badge={badge} />
        </span>
        <span
          className="ml-4 font-normal text-md"
          style={{ color: COLORS.backgroundRed, fontSize: "0.95rem" }}
        >
          {formula.englishName}
        </span>
        <span className="ml-4" style={{ color: COLORS.accentBlue, fontSize: "0.95rem" }}>
          {formula.chineseCharacters}
        </span>
      </div>
      <div className="text-xs mb-2" style={{ fontSize: "0.9rem" }}>
        <div className="mb-1">
          <strong>Category:</strong> {formula.category}
        </div>
        <div className="mb-1">
          <strong>Actions:</strong> {formula.actions}
        </div>
        <div className="mb-1">
          <strong>Indications:</strong> {formula.indications}
        </div>

        {/* TONGUE AND PULSE SECTION START */}
        {tongueAndPulse && (
          <div className="mb-1">
            <strong>Tongue & Pulse:</strong> {tongueAndPulse}
          </div>
        )}
        {/* TONGUE AND PULSE SECTION END */}

        <div className="mb-1">
          <strong>Cautions/Contraindications:</strong> {formula.cautionsAndContraindications}
        </div>
        <div className="mb-2">
          <strong>Modifications:</strong>
          <ul className="list-disc pl-6">
            {formula.modifications && formula.modifications.length > 0
              ? formula.modifications.map((mod, i) => (
                  <li key={i} style={{ fontSize: "0.9rem" }}>
                    {mod}
                  </li>
                ))
              : <li style={{ fontSize: "0.9rem" }}>None</li>}
          </ul>
        </div>
        <div className="mt-2">
          <strong>Notes:</strong> {formula.notes}
        </div>
      </div>
      <div className="mb-2" style={{ fontSize: "0.9rem" }}>
        <strong>Ingredients & Dosages:</strong>
        <ul className="pl-0 mt-2 mb-2">
          {formula.ingredientsAndDosages &&
          formula.ingredientsAndDosages.length > 0 ? (
            formula.ingredientsAndDosages.map((ing, i) => {
              let style = {};
              if (isHerbPresent(ing)) style = PRESENT_STYLE;
              else if (isSharedHerb(ing)) style = SHARED_STYLE;
              else style = { fontSize: "0.92rem" };
              const individualHerbObj = getIndividualAddHerbObj(ing);
              return (
                <li
                  key={i}
                  className="transition-all duration-150 flex items-center w-full"
                  style={{ ...style, listStyle: "none", padding: "4px 0" }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span>{ing}</span>
                    {isHerbPresent(ing) ? (
                      <span
                        className="ml-2"
                        style={{ fontSize: "0.95em", fontWeight: "bold" }}
                      >
                        ✔
                      </span>
                    ) : isSharedHerb(ing) ? (
                      <span
                        className="ml-2"
                        style={{ fontSize: "0.95em", fontWeight: "bold" }}
                      >
                        ★
                      </span>
                    ) : null}
                  </div>
                  {onAddIndividualHerb && individualHerbObj && (
                    <div style={{ flex: "none", marginLeft: "auto" }}>
                      <button
                        className="ml-3 px-2 py-1 rounded-full text-xs font-bold shadow hover:scale-105 transition"
                        style={{
                          cursor: "pointer",
                          fontSize: "0.92rem",
                          background: COLORS.accentBlue,
                          color: COLORS.accentIvory,
                        }}
                        onClick={() => onAddIndividualHerb(individualHerbObj)}
                      >
                        +
                      </button>
                    </div>
                  )}
                </li>
              );
            })
          ) : (
            <li style={{ fontSize: "0.92rem" }}>None</li>
          )}
        </ul>
      </div>
      {missingCount === 0 ? (
        <button
          className="mt-2 px-4 py-2 font-bold rounded-full transition-all duration-150 shadow"
          style={{
            background: COLORS.accentGray,
            color: COLORS.backgroundRed,
            fontSize: "0.92rem",
            cursor: "not-allowed",
          }}
          disabled
        >
          All Herbs Already Added
        </button>
      ) : (
        <button
          className="mt-2 px-4 py-2 font-bold rounded-full transition-all duration-150 shadow hover:scale-105 animate-pulse"
          style={{
            background: COLORS.accentGold,
            color: COLORS.backgroundRed,
            fontSize: "0.92rem",
          }}
          onClick={() => onTransferHerbs(missingCount)}
        >
          {missingCount === 1
            ? "Transfer 1 Herb"
            : `Transfer ${missingCount} Herbs`}
        </button>
      )}
    </div>
  );
}

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://thetcmatlas.fly.dev";

const BlankFormulaCard = ({ idx }) => (
  <div
    className="bg-white/60 rounded-xl p-7 mb-6 flex flex-col shadow-xl border-2 border-dashed w-full max-w-xl mx-auto min-h-[400px] items-center justify-center"
    style={{ borderColor: COLORS.accentGold }}
  >
    <span
      className="font-bold mb-4"
      style={{ color: COLORS.accentGold }}
    >
      {`Select formula ${idx + 1} for side-by-side comparison`}
    </span>
    <span className="text-seal text-base text-center" style={{ color: COLORS.accentBlack }}>
      Use the search bar above to add a formula.
    </span>
  </div>
);

export default function FormulaBuilder() {
  const [herbs, setHerbs] = useState([]);
  const [selectedFormulas, setSelectedFormulas] = useState([]);
  const [herbWarning, setHerbWarning] = useState("");
  const [herbSources, setHerbSources] = useState([]);
  const [formulas, setFormulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const maxHerbs = 25;
  const maxFormulaCards = 2;

  const location = useLocation();
  const formulaParam = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("formula");
  }, [location.search]);

  const formulaCardRefs = useRef([]);

  useEffect(() => {
    if (
      location.state &&
      Array.isArray(location.state.herbCart) &&
      location.state.herbCart.length > 0
    ) {
      setHerbs(location.state.herbCart);
      window.history.replaceState({}, document.title);
    }
    // eslint-disable-next-line
  }, [location.state]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE_URL}/api/data/caleherbs`).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/data/caleandnccaomherbs`).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/data/nccaomherbs`).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/data/extraherbs`).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/data/caleandnccaomformulas`).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/data/nccaomformulas`).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/data/extraformulas`).then(r => r.json())
    ])
      .then(([caleHerbs, caleAndNccaomHerbs, nccaomHerbs, extraHerbs, caleNccaomFormulasShared, nccaomFormulasOnly, extraFormulas]) => {
        setHerbSources([
          ...caleHerbs,
          ...caleAndNccaomHerbs,
          ...nccaomHerbs,
          ...extraHerbs,
        ]);
        setFormulas([
          ...caleNccaomFormulasShared,
          ...nccaomFormulasOnly,
          ...extraFormulas,
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (
      formulaParam &&
      formulas.length > 0 &&
      !selectedFormulas.find(
        f =>
          normalize(
            Array.isArray(f.pinyinName) ? f.pinyinName[0] : f.pinyinName
          ) === normalize(formulaParam)
      )
    ) {
      const match = formulas.find(
        f =>
          normalize(
            Array.isArray(f.pinyinName) ? f.pinyinName[0] : f.pinyinName
          ) === normalize(formulaParam)
      );
      if (match) {
        setSelectedFormulas([match]);
      }
    }
    // eslint-disable-next-line
  }, [formulaParam, formulas]);

  const getTransferHerbObjectByPinyin = useMemo(() => {
    return (pinyinNameOrVariants) => {
      const variants = Array.isArray(pinyinNameOrVariants)
        ? pinyinNameOrVariants
        : [pinyinNameOrVariants];
      const normalizedVariants = variants.map(normalize);
      return herbSources.find((h) => {
        let allNames = [];
        if (h.pinyinName) {
          if (Array.isArray(h.pinyinName)) allNames.push(...h.pinyinName);
          else allNames.push(h.pinyinName);
        }
        if (h.name) {
          if (Array.isArray(h.name)) allNames.push(...h.name);
          else allNames.push(h.name);
        }
        if (h.englishNames) {
          if (Array.isArray(h.englishNames)) allNames.push(...h.englishNames);
          else allNames.push(h.englishNames);
        }
        if (h.pharmaceuticalLatin) allNames.push(h.pharmaceuticalLatin);
        if (h.pharmaceuticalName) allNames.push(h.pharmaceuticalName);
        return allNames.some((n) => {
          const nNorm = normalize(n);
          return normalizedVariants.some(
            (v) =>
              nNorm === v ||
              nNorm.replace(/\s+/g, "") === v.replace(/\s+/g, "")
          );
        });
      });
    };
  }, [herbSources]);

  function extractFormulaDosage(ingredientStr, herbObj) {
    const dosageMatch = ingredientStr.match(/(\d+(\.\d+)?(-\d+(\.\d+)?)?)\s*(g|mg|ml|pieces?)/i);
    if (dosageMatch) {
      return dosageMatch[0].trim();
    }
    if (herbObj && herbObj.dosage) return herbObj.dosage;
    return "";
  }

  function handleTransferHerbsFromFormula(formulaIdx, customMissingCount) {
    const scrollY = window.scrollY;
    const selectedFormula = selectedFormulas[formulaIdx];
    if (!selectedFormula) return;
    const formulaHerbs = selectedFormula.ingredientsAndDosages
      .map((ingredientStr, i) => {
        const pinyinVariants = parseHerbPinyinNameVariants(ingredientStr);
        const herbObj = getTransferHerbObjectByPinyin(pinyinVariants);
        if (herbObj) {
          let dosage = extractFormulaDosage(ingredientStr, herbObj);
          return {
            ...herbObj,
            id: `formula-${normalize(getHerbDisplayName(herbObj))}-${formulaIdx}-${i}`,
            dosage,
            originalString: ingredientStr
          };
        }
        return {
          error: true,
          id: `formula-error-${pinyinVariants[0]}-${formulaIdx}-${i}`,
          name: pinyinVariants[0],
          originalString: ingredientStr,
          pinyin: pinyinVariants[0],
        };
      });

    const currentKeys = new Set(herbs.map(getHerbUniqueKey));
    const newHerbsToAdd = formulaHerbs.filter(
      (h) => !h.error && !currentKeys.has(getHerbUniqueKey(h))
    );
    const newHerbs = [...herbs, ...newHerbsToAdd].slice(0, maxHerbs);

    setHerbs(newHerbs);
    if (newHerbsToAdd.length > 0) {
      setHerbWarning(
        `${newHerbsToAdd.length} herb${newHerbsToAdd.length > 1 ? "s" : ""} from the formula were transferred to the herb list!`
      );
    } else {
      setHerbWarning("Your formula already contains that/those herb(s)!");
    }
    setTimeout(() => setHerbWarning(""), 1800);

    const missing = formulaHerbs.filter(h => h.error);
    if (missing.length > 0) {
      setHerbWarning(`Could not find: ${missing.map(h => h.name).join(', ')}`);
      setTimeout(() => setHerbWarning(""), 1800);
    }

    setTimeout(() => {
      window.scrollTo({ top: scrollY });
    }, 0);
  }

  function handleAddHerbOrFormula(item, type) {
    if (type === "herb") {
      if (herbs.length >= maxHerbs) return;
      const newHerbKey = getHerbUniqueKey(item);
      const existing = herbs.find((h) => getHerbUniqueKey(h) === newHerbKey);
      if (existing) {
        setHerbWarning("Your formula already contains that/those herb(s)!");
        setTimeout(() => setHerbWarning(""), 1500);
        return;
      }
      setHerbs([...herbs, item]);
    } else if (type === "formula") {
      setSelectedFormulas((prev) => {
        if (prev.find((f) => f.pinyinName === item.pinyinName)) return prev;
        if (prev.length >= maxFormulaCards) return prev;
        return [...prev, item];
      });
    }
  }

  function handleRemoveHerb(key) {
    setHerbs(herbs.filter(
      (h) => (h.pinyinName || h.name) !== key
    ));
  }
  function handleResetHerbs() {
    setHerbs([]);
  }
  function handleRemoveFormula(idx) {
    setSelectedFormulas(selectedFormulas.filter((_, i) => i !== idx));
  }

  function handleAddIndividualHerbFromFormula(herbObj) {
    if (!herbObj) return;
    const herbKey = getHerbUniqueKey(herbObj);
    const exists = herbs.find((h) => getHerbUniqueKey(h) === herbKey);
    if (exists) {
      setHerbWarning("Your formula already contains that herb!");
      setTimeout(() => setHerbWarning(""), 1200);
      return;
    }
    if (herbs.length >= maxHerbs) return;
    setHerbs([...herbs, herbObj]);
    setHerbWarning(`Herb "${getHerbDisplayName(herbObj)}" added!`);
    setTimeout(() => setHerbWarning(""), 1300);
  }

  let sharedHerbsNormalized = new Set();
  if (
    selectedFormulas[0]?.ingredientsAndDosages &&
    selectedFormulas[1]?.ingredientsAndDosages
  ) {
    const formula1Herbs = selectedFormulas[0].ingredientsAndDosages
      .map((h) => parseHerbPinyinNameVariants(h))
      .flat()
      .map(normalize);
    const formula2Herbs = selectedFormulas[1].ingredientsAndDosages
      .map((h) => parseHerbPinyinNameVariants(h))
      .flat()
      .map(normalize);
    sharedHerbsNormalized = new Set(
      formula1Herbs.filter((h1) => formula2Herbs.includes(h1))
    );
  }

  function handleAddOtherHerbsToList(herbsToAdd) {
    const currentKeys = new Set(herbs.map(getHerbUniqueKey));
    const processed = herbsToAdd
      .filter((h) => !currentKeys.has(getHerbUniqueKey(h)) && !h.error)
      .map((herb) => {
        let dosage = "";
        if (herb.originalString) {
          dosage = extractFormulaDosage(herb.originalString, herb);
        } else if (herb.dosage) {
          dosage = herb.dosage;
        }
        return { ...herb, dosage };
      });

    setHerbs([...herbs, ...processed]);
  }

  // Highlight all herbs in the list by passing as array to mainHerbObj
  // whatFormulaMakesUpThoseHerbs.js should support this (see previous responses)
  const mainHerbObj = herbs.length > 0 ? herbs : null;
  const highlightMainHerb = herbs.length > 0;

  const backToHomeButton = (
    <div
      style={{
        position: "fixed",
        top: NAVBAR_HEIGHT + 12,
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
      >
        Back to Home
      </Link>
    </div>
  );

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: `linear-gradient(120deg, ${COLORS.backgroundGold} 0%, ${COLORS.accentEmerald} 65%, ${COLORS.accentGold} 100%)`
        }}
      >
        <span className="text-2xl font-bold" style={{ color: COLORS.accentGold }}>
          Loading herbal data...
        </span>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: `linear-gradient(120deg, ${COLORS.backgroundGold} 0%, ${COLORS.accentEmerald} 65%, ${COLORS.accentGold} 100%)`,
        fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
        minHeight: "100vh",
        width: "100vw",
        position: "relative"
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
      {backToHomeButton}
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(24px) scale(0.98);}
            80% { opacity: 1; transform: translateY(-6px) scale(1.04);}
            100% { opacity: 1; transform: translateY(0) scale(1);}
          }
          .animate-fadeIn { animation: fadeIn 0.5s cubic-bezier(.36,1.29,.45,1.01);}
          @keyframes slideOut {
            0% { opacity: 1; transform: scale(1) translateY(0);}
            100% { opacity: 0; transform: scale(0.96) translateY(30px);}
          }
          .animate-slideOut { animation: slideOut 0.3s cubic-bezier(.69,.15,.41,.96);}
          @keyframes bounceIn {
            0% { opacity: 0; transform: scale(0.7);}
            70% { opacity: 1; transform: scale(1.05);}
            100% { opacity: 1; transform: scale(1);}
          }
          .animate-bounceIn { animation: bounceIn 0.45s cubic-bezier(.36,1.29,.45,1.01);}
        `}
      </style>
      {herbWarning && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            minWidth: "320px",
            maxWidth: "90vw",
            textAlign: "center",
            pointerEvents: "none",
            opacity: 1,
            background: COLORS.accentGold,
            color: COLORS.backgroundRed,
            borderRadius: "2em",
            fontWeight: 700,
            fontSize: "1.25em",
            boxShadow: `0 4px 18px -8px ${COLORS.shadowStrong}`,
            fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
          }}
          className="px-8 py-4 shadow-2xl transition-all"
        >
          {herbWarning}
        </div>
      )}
      <BackToTopButton right={32} />
      <div style={{ height: NAVBAR_HEIGHT + 24, minHeight: NAVBAR_HEIGHT + 24 }} />
      <div className="w-full max-w-7xl mx-auto px-2 py-12 flex-1">
        <div className="flex flex-col items-center mb-10">
          <h2
            className="font-bold text-center mb-4 tracking-tight drop-shadow-lg"
            style={{
              fontSize: "2.5rem",
              color: COLORS.backgroundRed,
              fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
            }}
          >
            Create Herbal Formula
          </h2>
          <div className="w-full max-w-xl mb-2">
            <FormulaSearchBar
              onSelect={handleAddHerbOrFormula}
              disabled={herbs.length >= maxHerbs}
              herbs={herbSources}
              formulas={formulas}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          <div className="flex flex-col items-center">
            <div style={{ width: "100%" }}>
              <HerbListCopyToClipboard
                herbs={herbs}
                onRemoveHerb={handleRemoveHerb}
                onResetHerbs={handleResetHerbs}
              />
            </div>
          </div>
          <div className="md:col-span-2 flex flex-col md:flex-row gap-8 items-start justify-center">
            {selectedFormulas.length === 0 ? (
              <>
                <BlankFormulaCard idx={0} />
                <BlankFormulaCard idx={1} />
              </>
            ) : (
              <>
                {selectedFormulas.map((formula, idx) => (
                  <div key={formula.pinyinName} className="flex-1">
                    <FormulaCard
                      formula={formula}
                      onTransferHerbs={(missingCount) =>
                        handleTransferHerbsFromFormula(idx, missingCount)
                      }
                      onRemoveFormula={() => handleRemoveFormula(idx)}
                      sharedHerbsNormalized={sharedHerbsNormalized}
                      herbs={herbs}
                      getTransferHerbObjectByPinyin={getTransferHerbObjectByPinyin}
                      onAddIndividualHerb={handleAddIndividualHerbFromFormula}
                      cardRef={el => formulaCardRefs.current[idx] = el}
                    />
                  </div>
                ))}
                {selectedFormulas.length === 1 && (
                  <div className="flex-1 flex items-center justify-center">
                    <BlankFormulaCard idx={1} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <WhatFormulaMakesUpThoseHerbs
        herbs={herbs}
        excludeFormulaPinyinNames={selectedFormulas.map((f) => f.pinyinName)}
        onAddFormula={handleAddOtherHerbsToList}
        showIndividualAddButtons={true}
        onAddIndividualHerb={handleAddIndividualHerbFromFormula}
        mainHerbObj={mainHerbObj}
        highlightMainHerb={highlightMainHerb}
        onlyShowAddToFormulaButton={true} // <-- Only show "Add X Herbs to Formula"
      />
      <FooterCard />
    </div>
  );
}