import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import FormulaSearchBar from "../components/formulaBuilderSearchBar";
import WhatFormulaMakesUpThoseHerbs from "../components/whatFormulaMakesUpThoseHerbs";
import FormulaBuilderHerbList from "../components/formulaBuilderHerbList";
import HerbListCopyToClipboard from "../components/herbListCopyToClipboard";
import Logo from "../components/Logo"; // <-- Import Logo component

// Color scheme
const COLORS = {
  vanilla: "#FFF7E3",
  violet: "#7C5CD3",
  carolina: "#68C5E6",
  claret: "#A52439",
  seal: "#3B4461",
  highlight: "#ffe066",
};

// API endpoint base
const API_BASE_URL = process.env.REACT_APP_API_URL || "https://thetcmatlas.fly.dev";

// ---- Back to Top Button ----
function BackToTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShow(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleClick() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  if (!show) return null;
  return (
    <button
      type="button"
      onClick={handleClick}
      className="fixed right-8 bottom-8 px-4 py-3 rounded-full font-bold shadow-2xl animate-bounceIn z-50"
      style={{
        background: COLORS.violet,
        color: COLORS.vanilla,
        fontSize: "1.35rem",
        border: `2px solid ${COLORS.carolina}`,
        boxShadow: `0 2px 14px 0 ${COLORS.violet}66`,
        transition: "background 0.22s, transform 0.17s",
      }}
      aria-label="Back to top"
      title="Back to top"
    >
      ↑ Top
    </button>
  );
}

// Utility functions (unchanged)
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
    return Array.isArray(herb.pinyinName)
      ? herb.pinyinName[0]
      : herb.pinyinName;
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

// Badge logic for formulas (same as whatFormulaMakesUpThoseHerbs.js)
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

function FormulaCard({
  formula,
  onTransferHerbs,
  onRemoveFormula,
  sharedHerbsNormalized,
  herbs,
  getTransferHerbObjectByPinyin,
}) {
  const [exiting, setExiting] = useState(false);
  const handleRemove = () => {
    setExiting(true);
    setTimeout(onRemoveFormula, 350);
  };

  const SHARED_STYLE = {
    background: COLORS.violet,
    color: COLORS.vanilla,
    borderRadius: "6px",
    fontWeight: "bold",
    padding: "2px 8px",
    boxShadow: `0 0 2px 1px ${COLORS.violet}55`,
  };

  // Highlight style for herbs present in the herb list
  const PRESENT_STYLE = {
    background: COLORS.highlight,
    color: COLORS.seal,
    borderRadius: "6px",
    fontWeight: "bold",
    padding: "2px 8px",
    boxShadow: `0 0 2px 1px ${COLORS.seal}30`,
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

  return (
    <div
      className={`bg-white/80 border-2 border-[${COLORS.violet}] rounded-xl p-7 mb-6 flex flex-col shadow-2xl relative w-full max-w-xl mx-auto animate-fadeIn transition-all duration-300 hover:border-[${COLORS.claret}] backdrop-blur-lg hover:scale-[1.03] ${
        exiting ? "animate-slideOut" : ""
      }`}
      style={{ minWidth: "340px" }}
    >
      <button
        className="absolute top-2 right-2 px-3 py-1"
        style={{
          background: COLORS.claret,
          color: COLORS.vanilla,
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
        <span className="font-bold text-xl" style={{ color: COLORS.violet }}>
          {formula.pinyinName}
          <Badge badge={badge} />
        </span>
        <span
          className="ml-4 font-normal text-md"
          style={{ color: COLORS.seal, fontSize: "0.95rem" }}
        >
          {formula.englishName}
        </span>
        <span className="ml-4" style={{ color: "#666", fontSize: "0.95rem" }}>
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
        <ul className="list-disc pl-6 mt-2 mb-2">
          {formula.ingredientsAndDosages &&
          formula.ingredientsAndDosages.length > 0 ? (
            formula.ingredientsAndDosages.map((ing, i) => {
              let style = {};
              if (isHerbPresent(ing)) style = PRESENT_STYLE;
              else if (isSharedHerb(ing)) style = SHARED_STYLE;
              else style = { fontSize: "0.92rem" };
              return (
                <li
                  key={i}
                  className="transition-all duration-150"
                  style={style}
                >
                  {ing}
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
            background: "#aaa",
            color: "#FFF7E3",
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
            background: COLORS.violet,
            color: COLORS.vanilla,
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

  // Use backend endpoints instead of static JSON files
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

  const getFormulaObjectByPinyin = useMemo(() => {
    return (pinyinNameOrVariants) => {
      const variants = Array.isArray(pinyinNameOrVariants)
        ? pinyinNameOrVariants
        : [pinyinNameOrVariants];
      const normalizedVariants = variants.map(normalize);
      return formulas.find((f) => {
        let allNames = [];
        if (f.pinyinName) {
          if (Array.isArray(f.pinyinName)) allNames.push(...f.pinyinName);
          else allNames.push(f.pinyinName);
        }
        if (f.englishName) allNames.push(f.englishName);
        if (f.chineseCharacters) allNames.push(f.chineseCharacters);
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
  }, [formulas]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${COLORS.vanilla} 0%, ${COLORS.carolina} 50%, ${COLORS.violet} 100%)`
        }}
      >
        <span className="text-2xl font-bold" style={{ color: COLORS.violet }}>
          Loading herbal data...
        </span>
      </div>
    );
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

  function handleTransferHerbsFromFormula(formulaIdx, customMissingCount) {
    const selectedFormula = selectedFormulas[formulaIdx];
    if (!selectedFormula) return;
    const formulaHerbs = selectedFormula.ingredientsAndDosages
      .map((ingredientStr, i) => {
        const pinyinVariants = parseHerbPinyinNameVariants(ingredientStr);
        const herbObj = getTransferHerbObjectByPinyin(pinyinVariants);
        if (herbObj) {
          return {
            ...herbObj,
            id: `formula-${normalize(
              getHerbDisplayName(herbObj)
            )}-${formulaIdx}-${i}`,
            dosage:
              ingredientStr.match(/(\d[\d\-.]*g)/)?.[0] ||
              ingredientStr.match(/(\d[\d\-.]*\s*pieces)/)?.[0] ||
              herbObj.dosage ||
              "",
          };
        }
        return {
          error: true,
          id: `formula-error-${pinyinVariants[0]}-${formulaIdx}-${i}`,
          name: pinyinVariants[0],
          originalString: ingredientStr,
          pinyin: pinyinVariants[0],
        };
      })
      .filter((herbObj) => {
        const key = getHerbUniqueKey(herbObj);
        const exists = herbs.find((h) => getHerbUniqueKey(h) === key);
        return !exists || herbObj.error;
      });

    const filteredHerbs = formulaHerbs.filter((h) => !h.error);
    const newHerbs = [...herbs, ...filteredHerbs].slice(0, maxHerbs);

    setHerbs(newHerbs);
    if (filteredHerbs.length > 0) {
      setHerbWarning(
        `${filteredHerbs.length} herb${filteredHerbs.length > 1 ? "s" : ""} from the formula were transferred to the herb list!`
      );
    } else {
      setHerbWarning("Your formula already contains that/those herb(s)!");
    }
    setTimeout(() => setHerbWarning(""), 1800);
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
    const filtered = herbsToAdd.filter(
      (h) => !currentKeys.has(getHerbUniqueKey(h))
    );
    setHerbs([...herbs, ...filtered]);
  }

  return (
    <div
      className="min-h-screen pb-12 flex flex-col items-center relative"
      style={{
        background: `linear-gradient(135deg, ${COLORS.vanilla} 0%, ${COLORS.carolina} 50%, ${COLORS.violet} 100%)`,
      }}
    >
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
      {/* Centered The TCM Atlas Logo at very top (animated shimmer, crisp, not blurry) */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "1.1em",
          marginBottom: "0.2em"
        }}
      >
        <Logo size={56} showBeta={true} />
      </div>
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
          }}
          className="px-8 py-4 rounded-2xl bg-yellow-300 text-claret font-bold shadow-2xl text-2xl transition-all"
        >
          {herbWarning}
        </div>
      )}
      <div className="fixed top-6 right-8 z-40">
        <Link
          to="/"
          className="px-5 py-2 rounded-full font-bold shadow-xl transition-all duration-200 hover:scale-105"
          style={{
            background: COLORS.violet,
            color: COLORS.vanilla,
          }}
        >
          Back to Home
        </Link>
      </div>
      <BackToTopButton />
      <div className="w-full max-w-7xl mx-auto px-2 py-12">
        <div className="flex flex-col items-center mb-10">
          <h2
            className="font-bold text-center mb-4 tracking-tight drop-shadow-lg"
            style={{
              fontSize: "2.5rem",
              color: COLORS.claret,
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
            <div style={{ width: "100%", marginTop: -24 }}>
              <FormulaBuilderHerbList
                herbs={herbs}
                onRemoveHerb={handleRemoveHerb}
                onResetHerbs={handleResetHerbs}
                maxHerbs={maxHerbs}
              />
            </div>
          </div>
          <div className="md:col-span-2 flex flex-col md:flex-row gap-8 items-start justify-center">
            {selectedFormulas.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center mt-16 w-full">
                <span
                  className="text-xl font-semibold mb-3"
                  style={{ color: COLORS.violet }}
                >
                  No formula selected
                </span>
                <span className="text-seal text-base">
                  Search and select a formula to view details here.
                </span>
              </div>
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
                    />
                  </div>
                ))}
                {selectedFormulas.length === 1 && (
                  <div className="flex-1 flex items-center justify-center">
                    <div
                      className="bg-white/60 rounded-xl p-7 mb-6 flex flex-col shadow-xl border-2 border-dashed w-full max-w-xl mx-auto min-h-[400px] items-center justify-center"
                      style={{ borderColor: COLORS.violet }}
                    >
                      <span
                        className="font-bold mb-4"
                        style={{ color: COLORS.violet }}
                      >
                        Select a second formula for side-by-side comparison
                      </span>
                      <span className="text-seal text-base text-center">
                        Use the search bar above to add another formula.
                      </span>
                    </div>
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
        formulas={formulas}
        herbsData={herbSources}
      />
    </div>
  );
}