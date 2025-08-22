import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Badge logic for herbs (matches formulaBuilderSearchBar.js)
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

// Badge logic for formulas (matches formulaBuilderSearchBar.js)
function getFormulaBadge(formula) {
  if (formula.caleAndNccaom === "yes" || formula.origin === "CALE") {
    return { label: "NCCAOM/CALE", color: "bg-green-200 text-green-700" };
  }
  if (formula.nccaom === "yes" && formula.caleAndNccaom !== "yes") {
    return { label: "NCCAOM", color: "bg-blue-200 text-blue-700" };
  }
  if (formula.extraFormula === "yes" || formula.origin === "EXTRA") {
    // Support both badge conventions for extra formulas
    return { label: "Extra", color: "bg-gray-200 text-gray-700" };
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

// Utility: highlight matching text
function highlightText(text, query) {
  if (!text) return "";
  if (!query) return text;
  const safeQuery = query.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
  const regex = new RegExp(`(${safeQuery})`, "gi");
  return String(text).split(regex).map((part, i) =>
    regex.test(part)
      ? <span key={i} className="bg-yellow-200 text-claret font-bold">{part}</span>
      : part
  );
}

// Helper: normalize search for array or string or object
function norm(val) {
  if (!val) return "";
  if (Array.isArray(val)) return val.join(", ");
  if (typeof val === "object") return Object.values(val).join(", ");
  return String(val); // Ensures string for everything else
}

export default function HomePageSearchBar() {
  // FIX: Always initialize as empty string to avoid uncontrolled/controlled warning
  const [search, setSearch] = useState(""); 
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [allHerbs, setAllHerbs] = useState([]);
  const [allFormulas, setAllFormulas] = useState([]);
  const [loading, setLoading] = useState(true);

  // PATCH: Input ref for keyboard handling
  const inputRef = useRef(null);

  // Backend API base URL (set via .env for deployment flexibility)
 const API_URL = process.env.REACT_APP_API_URL || "https://tcmpartypalace.onrender.com";

  // Fetch herbs and formulas from backend API on mount
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
        ...extraHerbs.map(h => ({ ...h, badge: getHerbBadge(h) })),
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
  }, [API_URL]);

  // Search all herb arrays
  function getHerbMatches(query) {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return allHerbs
      .map((herb) => {
        // What fields to search
        const fields = [
          herb.pinyinName,
          herb.englishNames,
          herb.category,
          herb.pharmaceuticalName,
          herb.chineseCharacters,
          herb.keywords,
          herb.actions,
          herb.indications,
          herb.notes,
          herb.dosage,
          herb.cautionsAndContraindications,
          herb.properties,
          herb.channelsEntered
        ];
        // Some fields may be arrays or objects
        const matchField = fields.find((f) =>
          norm(f).toLowerCase().includes(lowerQuery)
        );
        if (matchField) {
          return { type: "herb", herb, matchField, badge: herb.badge };
        }
        return null;
      })
      .filter(Boolean);
  }

  // Search all formula arrays
  function getFormulaMatches(query) {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return allFormulas
      .map((formula) => {
        const fields = [
          formula.pinyinName,
          formula.englishName,
          formula.chineseCharacters,
          formula.category,
          formula.ingredientsAndDosages,
          formula.actions,
          formula.indications,
          formula.notes,
          formula.cautionsAndContraindications,
          formula.modifications
        ];
        const matchField = fields.find((f) =>
          norm(f).toLowerCase().includes(lowerQuery)
        );
        if (matchField) {
          return { type: "formula", formula, matchField, badge: formula.badge };
        }
        return null;
      })
      .filter(Boolean);
  }

  const herbMatches = getHerbMatches(search);
  const formulaMatches = getFormulaMatches(search);
  const hasMatches = herbMatches.length > 0 || formulaMatches.length > 0;

  // PATCH: Returns first result (herb or formula)
  function getFirstResult() {
    if (herbMatches.length > 0) {
      return { ...herbMatches[0] };
    } else if (formulaMatches.length > 0) {
      return { ...formulaMatches[0] };
    }
    return null;
  }

  function handleChange(e) {
    setSearch(e.target.value);
    setShowDropdown(!!e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    // PATCH: If matches, go to first result. Otherwise, fallback to search page.
    const firstResult = getFirstResult();
    if (firstResult) {
      handlePreviewClick(firstResult);
    } else if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
    }
    setShowDropdown(false);
  }

  function handlePreviewClick(item) {
    if (item.type === "herb") {
      // Routing: use pinyinName for all herbs, including extraHerbs
      navigate(`/herb/${encodeURIComponent(norm(item.herb.pinyinName))}`);
    } else if (item.type === "formula") {
      navigate(`/formulacard/${encodeURIComponent(norm(item.formula.pinyinName).replace(/\s+/g, "").toLowerCase())}`);
    }
    setShowDropdown(false);
  }

  // PATCH: Keyboard handler for Enter on input, selects first result if present
  function handleKeyDown(e) {
    if (e.key === "Enter" && showDropdown && search) {
      e.preventDefault();
      const firstResult = getFirstResult();
      if (firstResult) {
        handlePreviewClick(firstResult);
      }
    }
  }

  // PATCH: Attach/detach keyboard event for input
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
  }, [showDropdown, search, herbMatches, formulaMatches]);

  if (loading) {
    return (
      <form className="flex flex-col items-center w-full max-w-lg mx-auto py-8">
        <div className="flex w-full justify-center">
          <input
            type="text"
            placeholder="Loading herbs and formulas..."
            disabled
            // FIX: Always set value to "" for controlled input
            value=""
            className="w-[70%] bg-white border-2 border-violet px-5 py-4 rounded-full text-lg text-claret text-center opacity-50"
            style={{ borderRadius: "2rem" }}
          />
        </div>
      </form>
    );
  }

  return (
    <form className="flex flex-col items-center w-full max-w-lg mx-auto py-8" onSubmit={handleSubmit} autoComplete="off">
      <div className="flex w-full justify-center">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search herbs, formulas, keywords, categories, etc..."
          value={search}
          onChange={handleChange}
          className="w-[70%] bg-white border-2 border-violet px-5 py-4 rounded-full text-lg text-claret focus:outline-none focus:ring-2 focus:ring-violet text-center"
          onFocus={() => setShowDropdown(!!search)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          style={{ borderRadius: "2rem" }}
        />
      </div>
      {/* Live preview dropdown */}
      {showDropdown && search && (
        <div className="w-[70%] bg-white border border-violet rounded-xl shadow-xl mt-1 z-50 max-h-96 overflow-auto">
          {!hasMatches ? (
            <p className="text-seal px-4 py-2">No matches found.</p>
          ) : (
            <>
              {herbMatches.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-violet font-bold border-b border-violet">Herbs</div>
                  {herbMatches.slice(0, 8).map((match, i) => (
                    <button
                      key={(match.herb.pinyinName || "") + i}
                      className="block w-full text-left px-4 py-3 hover:bg-violet hover:text-vanilla transition"
                      type="button"
                      onMouseDown={() => handlePreviewClick(match)}
                    >
                      <span className="font-bold text-lg">🌿 {highlightText(match.herb.pinyinName, search)}</span>
                      <Badge badge={match.badge} />
                      <span className="ml-2 text-violet">{highlightText(norm(match.herb.category), search)}</span>
                      <span className="block text-seal text-sm mt-1">
                        <strong>English:</strong> {highlightText(norm(match.herb.englishNames), search)}
                      </span>
                      <span className="block text-violet text-xs mt-1">
                        <strong>Keywords:</strong> {highlightText(norm(match.herb.keywords), search)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {formulaMatches.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-violet font-bold border-b border-violet">Formulas</div>
                  {formulaMatches.slice(0, 8).map((match, i) => (
                    <button
                      key={(match.formula.pinyinName || "") + i}
                      className="block w-full text-left px-4 py-3 hover:bg-claret hover:text-vanilla transition"
                      type="button"
                      onMouseDown={() => handlePreviewClick(match)}
                    >
                      <span className="font-bold text-lg">🧪 {highlightText(match.formula.pinyinName, search)}</span>
                      <Badge badge={match.badge} />
                      <span className="ml-2 text-violet">{highlightText(norm(match.formula.category), search)}</span>
                      <span className="block text-seal text-sm mt-1">
                        <strong>English:</strong> {highlightText(match.formula.englishName, search)}
                      </span>
                      <span className="block text-violet text-xs mt-1">
                        <strong>Actions:</strong> {highlightText(norm(match.formula.actions), search)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </form>
  );
}