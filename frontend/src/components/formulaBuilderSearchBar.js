import React, { useState, useEffect, useRef } from "react";

// Badge logic for herbs
function getHerbBadge(herb) {
  if (herb.caleOnly === "yes") {
    return { label: "CALE", color: "bg-orange-200 text-orange-700" };
  }
  if (herb.nccaomAndCale === "yes") {
    return { label: "NCCAOM/CALE", color: "bg-green-200 text-green-700" };
  }
  if (herb.nccaomOnly === "yes") {
    return { label: "NCCAOM", color: "bg-blue-200 text-blue-700" };
  }
  if (herb.extraHerb === "yes") {
    return { label: "Extra", color: "bg-gray-200 text-gray-700" };
  }
  return null;
}

// Badge logic for formulas
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

// Highlight search match in text
function highlightText(text, query) {
  if (text == null) return null;
  if (typeof text !== "string") text = String(text);
  if (!query) return text;
  const safeQuery = query.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
  const regex = new RegExp(`(${safeQuery})`, "gi");
  return text.split(regex).map((part, i) =>
    regex.test(part)
      ? <span key={i} className="bg-yellow-200 text-claret font-bold">{part}</span>
      : part
  );
}

function Badge({ badge }) {
  if (!badge) return null;
  return (
    <span className={`inline-block ml-2 px-2 py-1 rounded text-xs font-semibold align-middle ${badge.color}`}>
      {badge.label}
    </span>
  );
}

// PATCH: Use backend API for herb/formula data
const API_URL = process.env.REACT_APP_API_URL || "https://thetcmatlas.fly.dev";

export default function SearchBar({ onSelect, disabled }) {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [allHerbs, setAllHerbs] = useState([]);
  const [allFormulas, setAllFormulas] = useState([]);
  const [loading, setLoading] = useState(true);

  // For keyboard handling
  const inputRef = useRef(null);

  // Fetch all data on mount -- PATCH: use backend endpoints
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_URL}/api/data/caleherbs`).then(r => r.json()),
      fetch(`${API_URL}/api/data/caleandnccaomherbs`).then(r => r.json()),
      fetch(`${API_URL}/api/data/nccaomherbs`).then(r => r.json()),
      fetch(`${API_URL}/api/data/extraherbs`).then(r => r.json()),
      fetch(`${API_URL}/api/data/caleandnccaomformulas`).then(r => r.json()),
      fetch(`${API_URL}/api/data/nccaomformulas`).then(r => r.json()),
      fetch(`${API_URL}/api/data/extraformulas`).then(r => r.json())
    ]).then(([caleHerbs, caleAndNccaomHerbs, nccaomHerbs, extraHerbs, caleNccaomFormulasShared, nccaomFormulasOnly, extraFormulas]) => {
      const herbs = [
        ...caleHerbs.map(h => ({ ...h, badge: getHerbBadge(h) })),
        ...caleAndNccaomHerbs.map(h => ({ ...h, badge: getHerbBadge(h) })),
        ...nccaomHerbs.map(h => ({ ...h, badge: getHerbBadge(h) })),
        ...extraHerbs.map(h => ({ ...h, badge: getHerbBadge(h) }))
      ];
      const formulas = [
        ...caleNccaomFormulasShared.map(f => ({ ...f, origin: "CALE", badge: getFormulaBadge({ ...f, origin: "CALE" }) })),
        ...nccaomFormulasOnly.map(f => ({ ...f, origin: "NCCAOM", badge: getFormulaBadge({ ...f, origin: "NCCAOM" }) })),
        ...extraFormulas.map(f => ({ ...f, origin: "EXTRA", extraFormula: "yes", badge: getFormulaBadge({ ...f, origin: "EXTRA", extraFormula: "yes" }) }))
      ];
      setAllHerbs(herbs);
      setAllFormulas(formulas);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Get matches for herbs
  function getHerbMatches(query) {
    if (!query) return [];
    return allHerbs
      .map((herb) => {
        const taste = Array.isArray(herb.properties?.taste) ? herb.properties.taste.join(", ") : (herb.properties?.taste || "");
        const temp = Array.isArray(herb.properties?.temperature) ? herb.properties.temperature.join(", ") : (herb.properties?.temperature || "");
        const keywords = Array.isArray(herb.keywords) ? herb.keywords.join(", ") : (herb.keywords || "");
        const pharmaLatin =
          herb.pharmaceuticalLatin ||
          herb.pharmaceuticalName ||
          herb.pharmaceutical ||
          herb.latin ||
          herb.latinName ||
          "";

        const nameField = Array.isArray(herb.name) ? herb.name.join(", ") : herb.name || "";
        const pinyinField = Array.isArray(herb.pinyinName) ? herb.pinyinName.join(", ") : herb.pinyinName || "";

        const fields = [
          nameField,
          pinyinField,
          pharmaLatin,
          herb.category,
          taste,
          temp,
          keywords,
          herb.chineseCharacters,
          herb.actions,
          herb.indications,
          herb.notes
        ].map(f => (typeof f === "string" ? f : ""));

        let matchField = fields.find((v) => v && v.toLowerCase().includes(query.toLowerCase()));
        if (matchField) {
          return {
            type: "herb",
            item: herb,
            matchField,
            taste,
            temp,
            pharmaLatin,
            keywords,
            badge: herb.badge
          };
        }
        return null;
      })
      .filter(Boolean);
  }

  // Get matches for formulas
  function getFormulaMatches(query) {
    if (!query) return [];
    return allFormulas
      .map((formula) => {
        const fields = [
          formula.pinyinName,
          formula.englishName,
          formula.chineseCharacters,
          formula.category,
          formula.actions,
          formula.indications,
          formula.notes
        ].map(f => (typeof f === "string" ? f : ""));
        let matchField = fields.find((v) => v && v.toLowerCase().includes(query.toLowerCase()));
        if (matchField) {
          return {
            type: "formula",
            item: formula,
            matchField,
            badge: formula.badge
          };
        }
        return null;
      })
      .filter(Boolean);
  }

  const herbMatches = getHerbMatches(search);
  const formulaMatches = getFormulaMatches(search);

  const allMatches = [...herbMatches, ...formulaMatches];

  function handleChange(e) {
    setSearch(e.target.value);
    setShowDropdown(!!e.target.value);
  }

  function handleSelect(item, type) {
    onSelect(item, type);
    setShowDropdown(false);
    setSearch("");
  }

  // PATCH: Pressing Enter while typing selects the first result (if exists)
  function handleKeyDown(e) {
    if (e.key === "Enter" && showDropdown && allMatches.length > 0 && search) {
      e.preventDefault();
      handleSelect(allMatches[0].item, allMatches[0].type);
    }
  }

  // Focus input after mount (optional usability)
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener("keydown", handleKeyDown);
      }
    };
    // eslint-disable-next-line
  }, [showDropdown, allMatches, search]); // update event on dropdown/matches/search change

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto py-8">
      <div className="flex w-full justify-center">
        <input
          ref={inputRef}
          type="text"
          disabled={disabled || loading}
          placeholder={loading ? "Loading..." : disabled ? "Max herbs reached (25)" : "Search for herbs or formulas to add..."}
          value={search}
          onChange={handleChange}
          className={`w-[70%] bg-white border-2 border-violet px-5 py-4 rounded-full text-lg text-claret focus:outline-none focus:ring-2 focus:ring-violet text-center ${disabled || loading ? "bg-gray-100 cursor-not-allowed" : ""}`}
          onFocus={() => setShowDropdown(!!search)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          style={{ borderRadius: "2rem" }}
        />
      </div>
      {/* Live preview dropdown for herbs AND formulas */}
      {showDropdown && search && (
        <div className="w-[70%] bg-white border border-violet rounded-xl shadow-xl mt-1 z-50 max-h-96 overflow-auto">
          {allMatches.length === 0 ? (
            <p className="text-seal px-4 py-2">No matches found.</p>
          ) : (
            allMatches.slice(0, 12).map((match, i) => (
              <button
                key={(match.type === "herb" ? match.item.pinyinName : match.item.pinyinName) + i}
                className="block w-full text-left px-4 py-3 hover:bg-violet hover:text-vanilla transition"
                type="button"
                onMouseDown={() => handleSelect(match.item, match.type)}
              >
                {match.type === "herb" ? (
                  <>
                    <span className="font-bold">
                      {highlightText(Array.isArray(match.item.name) ? match.item.name.join(", ") : match.item.name || match.item.pinyinName, search)}
                    </span>
                    <Badge badge={match.badge} />
                    <span className="ml-2 text-violet">
                      {highlightText(match.item.category, search)}
                    </span>
                    <span className="block text-seal text-sm mt-1">
                      <strong>Pinyin:</strong> {highlightText(Array.isArray(match.item.pinyinName) ? match.item.pinyinName.join(", ") : match.item.pinyinName, search)}{" | "}
                      <strong>Pharma:</strong> {highlightText(match.pharmaLatin, search)}
                    </span>
                    <span className="block text-seal text-sm mt-1">
                      <strong>Properties:</strong> {highlightText(
                        match.item.properties && typeof match.item.properties === "string"
                          ? match.item.properties
                          : [match.taste, match.temp].filter(Boolean).join(", "),
                        search
                      )}
                    </span>
                    <span className="block text-violet text-xs mt-1">
                      <strong>Keywords:</strong> {highlightText(match.keywords, search)}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-bold text-lg">{highlightText(match.item.pinyinName, search)}</span>
                    <Badge badge={match.badge} />
                    <span className="ml-2 text-seal">{highlightText(match.item.englishName, search)}</span>
                    <span className="ml-2 text-violet">{highlightText(match.item.chineseCharacters, search)}</span>
                    <span className="block text-violet text-sm mt-1">
                      <strong>Category:</strong> {highlightText(match.item.category, search)}
                    </span>
                    <span className="block text-xs mt-1">
                      <strong>Origin:</strong> {match.item.origin || (match.badge && match.badge.label)}
                    </span>
                  </>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}