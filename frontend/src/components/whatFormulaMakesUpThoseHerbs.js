import React, { useEffect, useState, useMemo } from "react";

// Badge logic for formulas (copied to match formulaBuilderSearchBar.js)
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

const COLORS = {
  vanilla: "#FFF7E3",
  violet: "#7C5CD3",
  carolina: "#68C5E6",
  claret: "#A52439",
  seal: "#3B4461",
  highlight: "#ffe066",
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
    .replace(/\d+(\.\d+)?(-\d+(\.\d+)?)?\s*(g|ml|pieces)?/gi, "")
    .trim();
  base = base.replace(/\s+/g, " ");
  return [base];
}

const API_URL = process.env.REACT_APP_API_URL || "https://thetcmatlas.fly.dev";

export default function WhatFormulaMakesUpThoseHerbs({
  herbs,
  excludeFormulaPinyinNames = [],
  onAddFormula,
  showIndividualAddButtons = false,
  onAddIndividualHerb
}) {
  const [allHerbs, setAllHerbs] = useState([]);
  const [allFormulas, setAllFormulas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_URL}/api/data/caleandnccaomformulas`).then(r => r.json()),
      fetch(`${API_URL}/api/data/caleandnccaomherbs`).then(r => r.json()),
      fetch(`${API_URL}/api/data/caleherbs`).then(r => r.json()),
      fetch(`${API_URL}/api/data/extraformulas`).then(r => r.json()),
      fetch(`${API_URL}/api/data/extraherbs`).then(r => r.json()),
      fetch(`${API_URL}/api/data/nccaomformulas`).then(r => r.json()),
      fetch(`${API_URL}/api/data/nccaomherbs`).then(r => r.json())
    ]).then((
      [
        caleAndNccaomFormulas,
        caleAndNccaomHerbs,
        caleHerbs,
        extraFormulas,
        extraHerbs,
        nccaomFormulas,
        nccaomHerbs
      ]
    ) => {
      setAllHerbs([
        ...caleHerbs,
        ...caleAndNccaomHerbs,
        ...extraHerbs,
        ...nccaomHerbs
      ]);
      setAllFormulas([
        ...caleAndNccaomFormulas.map(f => ({ ...f, origin: "CALE" })),
        ...extraFormulas.map(f => ({ ...f, origin: "Extra" })),
        ...nccaomFormulas.map(f => ({ ...f, origin: "NCCAOM" }))
      ]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const customHerbPinyinNormalized = useMemo(() => {
    if (!herbs) return [];
    return herbs
      .map((h) => {
        if (h.pinyinName) {
          return normalize(Array.isArray(h.pinyinName) ? h.pinyinName[0] : h.pinyinName);
        } else if (h.name) {
          return normalize(Array.isArray(h.name) ? h.name[0] : h.name);
        } else if (h.originalString) {
          const variants = parseHerbPinyinNameVariants(h.originalString);
          return normalize(variants[0]);
        } else {
          return "";
        }
      })
      .filter(Boolean);
  }, [herbs]);

  const customHerbPinyinSet = useMemo(
    () => new Set(customHerbPinyinNormalized),
    [customHerbPinyinNormalized]
  );

  function findFullHerbObject(pinyinName) {
    const normalized = normalize(pinyinName);
    return allHerbs.find(h => {
      const candidates = [
        ...(Array.isArray(h.pinyinName) ? h.pinyinName : [h.pinyinName]).filter(Boolean),
        ...(Array.isArray(h.name) ? h.name : [h.name]).filter(Boolean),
        ...(Array.isArray(h.englishNames) ? h.englishNames : [h.englishNames]).filter(Boolean),
        h.pharmaceuticalName,
        h.pharmaceuticalLatin,
      ].filter(Boolean);
      return candidates.some(n => normalize(n) === normalized);
    });
  }

  const matchingFormulas = useMemo(() => {
    if (customHerbPinyinNormalized.length === 0 || allFormulas.length === 0) return [];
    return allFormulas.filter((formula) => {
      if (!formula.ingredientsAndDosages) return false;
      const formulaHerbsNorm = formula.ingredientsAndDosages
        .map((ing) => {
          const variants = parseHerbPinyinNameVariants(ing);
          return variants.map(normalize);
        })
        .flat();
      return customHerbPinyinNormalized.every((customName) =>
        formulaHerbsNorm.some(fh => fh === customName)
      );
    });
  }, [customHerbPinyinNormalized, allFormulas, excludeFormulaPinyinNames]);

  const herbKeys = useMemo(() => new Set((herbs || []).map(h => {
    if (h.pinyinName) {
      return normalize(Array.isArray(h.pinyinName) ? h.pinyinName[0] : h.pinyinName);
    } else if (h.name) {
      return normalize(Array.isArray(h.name) ? h.name[0] : h.name);
    } else if (h.originalString) {
      const variants = parseHerbPinyinNameVariants(h.originalString);
      return normalize(variants[0]);
    }
    return "";
  })), [herbs]);

  function isHerbPresent(ingredientStr) {
    const pinyinVariants = parseHerbPinyinNameVariants(ingredientStr);
    for (const variant of pinyinVariants) {
      const norm = normalize(variant);
      if (herbKeys.has(norm)) return true;
    }
    return false;
  }

  function isSharedHerb(ingredientStr) {
    const variants = parseHerbPinyinNameVariants(ingredientStr).map(normalize);
    return variants.some((v) => customHerbPinyinSet.has(v));
  }

  function getOtherHerbsForFormula(formula) {
    if (!formula.ingredientsAndDosages) return [];
    return formula.ingredientsAndDosages
      .map((ing, i) => {
        const pinyinVariants = parseHerbPinyinNameVariants(ing);
        const normalizedVariants = pinyinVariants.map(normalize);
        const isAlready = normalizedVariants.some((v) => customHerbPinyinSet.has(v));
        if (isAlready) return null;
        const dosage =
        ing.match(/(\d[\d\-.]*ml)/)?.[0] ||
          ing.match(/(\d[\d\-.]*g)/)?.[0] ||
          ing.match(/(\d[\d\-.]*\s*pieces)/)?.[0] ||
          "";
        let fullHerb = null;
        for (const variant of pinyinVariants) {
          fullHerb = findFullHerbObject(variant);
          if (fullHerb) break;
        }
        if (fullHerb) {
          return {
            ...fullHerb,
            dosage,
            id: `${normalize(pinyinVariants[0])}-${i}`,
          };
        } else {
          return {
            pinyinName: pinyinVariants[0],
            dosage,
            id: `${normalize(pinyinVariants[0])}-${i}`,
            originalString: ing
          };
        }
      })
      .filter(Boolean);
  }

  function getTransferCount(formula) {
    const otherHerbs = getOtherHerbsForFormula(formula);
    return otherHerbs.length;
  }

  function handleAddAllHerbsClick(formula) {
    if (!onAddFormula) return;
    const otherHerbs = getOtherHerbsForFormula(formula);
    onAddFormula(otherHerbs);
  }

  function handleAddIndividualHerbClick(herbObj) {
    if (!onAddIndividualHerb) return;
    onAddIndividualHerb(herbObj);
  }

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto mt-10 mb-16 p-8 rounded-3xl shadow-2xl bg-white/80 border-2 border-violet flex flex-col items-center animate-fadeIn">
        <h3 className="font-bold text-xl mb-4 text-claret">
          Loading formulas & herbs...
        </h3>
      </div>
    );
  }

  if (!herbs || herbs.length === 0) return null;
  if (matchingFormulas.length === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto mt-10 mb-16 p-8 rounded-3xl shadow-2xl bg-white/80 border-2 border-violet flex flex-col items-center animate-fadeIn">
        <h3 className="font-bold text-xl mb-4 text-claret">
          No formulas found that contain all selected herbs.
        </h3>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 mb-16 p-8 rounded-3xl shadow-2xl bg-white/80 border-2 border-violet flex flex-col items-center animate-fadeIn">
      <h3 className="font-bold text-xl mb-4 text-claret">
        Formulas containing selected herb(s):
      </h3>
      <div className="flex flex-wrap justify-center gap-8">
        {matchingFormulas.map((formula) => {
          const transferCount = getTransferCount(formula);
          const badge = getFormulaBadge(formula);
          const addableHerbs = getOtherHerbsForFormula(formula);
          return (
            <div
              key={formula.pinyinName}
              className="min-w-[320px] max-w-[420px] flex-1 bg-vanilla border border-violet rounded-xl p-6 shadow-lg mb-3"
            >
              <div className="flex flex-col">
                <span className="font-bold text-lg text-violet flex items-center">
                  {formula.pinyinName}
                  <Badge badge={badge} />
                </span>
                <span className="text-seal text-md">{formula.englishName}</span>
                <span className="text-violet">{formula.chineseCharacters}</span>
                <span className="text-xs text-seal mb-1">
                  <strong>Category:</strong> {formula.category}
                </span>
                <span className="text-xs text-seal mb-1">
                  <strong>Actions:</strong> {formula.actions}
                </span>
                <span className="text-xs text-seal mb-1">
                  <strong>Indications:</strong> {formula.indications}
                </span>
              </div>
              <div className="mt-2">
                <strong>Ingredients:</strong>
                <ul className="pl-0 mt-1">
                  {formula.ingredientsAndDosages.map((ing, i) => {
                    let style = {};
                    if (isHerbPresent(ing)) {
                      style = {
                        background: COLORS.highlight,
                        color: COLORS.seal,
                        borderRadius: "6px",
                        fontWeight: "bold",
                        padding: "2px 8px",
                        boxShadow: `0 0 2px 1px ${COLORS.seal}30`,
                        display: "inline-block",
                        margin: "0 2px"
                      };
                    } else if (isSharedHerb(ing)) {
                      style = {
                        background: COLORS.violet,
                        color: COLORS.vanilla,
                        borderRadius: "6px",
                        fontWeight: "bold",
                        padding: "2px 8px",
                        boxShadow: `0 0 2px 1px ${COLORS.violet}55`,
                        display: "inline-block",
                        margin: "0 2px"
                      };
                    } else {
                      style = { fontSize: "0.92rem" };
                    }
                    const otherHerbObj = addableHerbs.find(h =>
                      normalize(h.pinyinName || h.name || h.originalString) ===
                      normalize(parseHerbPinyinNameVariants(ing)[0])
                    );
                    return (
                      <li key={i} className="transition-all duration-150 flex items-center w-full" style={{ ...style, listStyle: "none", padding: "4px 0" }}>
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
                        {showIndividualAddButtons && onAddIndividualHerb && otherHerbObj && (
                          <div style={{ flex: "none", marginLeft: "auto" }}>
                            <button
                              className="ml-3 px-2 py-1 rounded-full text-xs font-bold bg-violet text-vanilla shadow hover:scale-105 transition"
                              style={{
                                cursor: "pointer",
                                fontSize: "0.92rem",
                              }}
                              onClick={() => handleAddIndividualHerbClick(otherHerbObj)}
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
              {onAddFormula && transferCount === 0 && (
                <button
                  className="mt-4 px-4 py-2 font-bold rounded-full transition-all duration-150 shadow"
                  style={{
                    background: "#aaa",
                    color: "#FFF7E3",
                    fontSize: "0.92rem",
                    cursor: "not-allowed",
                  }}
                  disabled
                  title="All herbs already in list"
                >
                  All Herbs Already Added
                </button>
              )}
              {onAddFormula && transferCount > 0 && (
                <button
                  className="mt-4 px-4 py-2 font-bold rounded-full transition-all duration-150 shadow hover:scale-105 animate-pulse"
                  style={{
                    background: COLORS.violet,
                    color: COLORS.vanilla,
                    fontSize: "0.92rem",
                  }}
                  onClick={() => handleAddAllHerbsClick(formula)}
                >
                  {transferCount === 1
                    ? "Transfer 1 Herb"
                    : `Transfer ${transferCount} Herbs`}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}