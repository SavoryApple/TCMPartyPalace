import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";

// Color scheme
const COLORS = {
  vanilla: "#FFF7E3",
  violet: "#7C5CD3",
  carolina: "#68C5E6",
  claret: "#A52439",
  seal: "#3B4461",
};

const GlobalAnimations = () => (
  <style>
    {`
      @keyframes fadeIn {
        0% { opacity: 0; transform: translateY(24px) scale(0.98);}
        80% { opacity: 1; transform: translateY(-6px) scale(1.04);}
        100% { opacity: 1; transform: translateY(0) scale(1);}
      }
      .animate-fadeIn { animation: fadeIn 0.5s cubic-bezier(.36,1.29,.45,1.01); }
      @keyframes pulseGlow {
        0% { box-shadow: 0 0 0 0 #7C5CD333; }
        50% { box-shadow: 0 0 16px 8px #7C5CD388; }
        100% { box-shadow: 0 0 0 0 #7C5CD333; }
      }
      .animate-pulseGlow { animation: pulseGlow 2s infinite; }
      @keyframes bounceIn {
        0% { opacity: 0; transform: scale(0.7);}
        70% { opacity: 1; transform: scale(1.05);}
        100% { opacity: 1; transform: scale(1);}
      }
      .animate-bounceIn { animation: bounceIn 0.7s cubic-bezier(.36,1.29,.45,1.01); }
      @keyframes fadeInScale {
        0% { opacity: 0; transform: scale(0.92);}
        100% { opacity: 1; transform: scale(1);}
      }
      .animate-fadeInScale { animation: fadeInScale 0.4s cubic-bezier(.36,1.29,.45,1.01);}
      @keyframes popHerb {
        0% { transform: scale(1);}
        60% { transform: scale(1.09);}
        100% { transform: scale(1);}
      }
      .herb-link-pop {
        animation: popHerb 0.175s cubic-bezier(.36,1.29,.45,1.01);
      }
      .herb-link-hover {
        transition: 
          transform 0.10s cubic-bezier(.36,1.29,.45,1.01),
          box-shadow 0.125s cubic-bezier(.36,1.29,.45,1.01),
          color 0.10s;
      }
      .herb-link-hover:hover, .herb-link-hover:focus {
        transform: scale(1.06) translateY(-1px);
        color: #68C5E6;
        box-shadow: 0 2px 4px 0 #7C5CD333;
        outline: none;
      }
    `}
  </style>
);

// Helper functions
function highlightText(text, query) {
  if (!text) return "";
  if (!query) return text;
  const safeQuery = query.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
  const regex = new RegExp(`(${safeQuery})`, "gi");
  return String(text).split(regex).map((part, i) =>
    regex.test(part)
      ? <span key={i} style={{ background: "#FFF8C8", color: COLORS.claret, fontWeight: "bold" }}>{part}</span>
      : part
  );
}
function safeArr(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return [val];
}
const numberCircleStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: `linear-gradient(135deg, ${COLORS.carolina}, ${COLORS.vanilla}, ${COLORS.violet})`,
  color: COLORS.claret,
  borderRadius: "50%",
  width: "1.3em",
  height: "1.3em",
  minWidth: "1.3em",
  minHeight: "1.3em",
  maxWidth: "1.3em",
  maxHeight: "1.3em",
  textAlign: "center",
  fontSize: "0.85em",
  fontWeight: 700,
  marginRight: "0.5em",
  border: `1.4px solid ${COLORS.violet}`,
  boxSizing: "border-box",
  boxShadow: `0 0 6px 0 ${COLORS.carolina}22`
};

// Extract pinyin for matching
function getPinyinFromIngredient(ingredient) {
  let match = ingredient.match(/^([a-zA-Z\s]+?)(?=\(|\d|$)/);
  if (match) {
    return match[1].trim();
  }
  return ingredient.split(" ").slice(0, 2).join(" ").trim();
}

function HerbSideCard({ herb, query, onClose }) {
  return (
    <div
      className="animate-fadeIn"
      style={{
        position: "fixed",
        top: "84px",
        right: "24px",
        width: "390px",
        maxWidth: "85vw",
        background: `linear-gradient(120deg, ${COLORS.vanilla} 80%, ${COLORS.carolina} 100%)`,
        border: `2px solid ${COLORS.violet}`,
        borderRadius: "38px",
        boxShadow: `-6px 0 24px 1px ${COLORS.violet}22`,
        padding: "36px 28px 28px 28px",
        zIndex: 99,
        height: "calc(100vh - 104px)",
        overflowY: "auto"
      }}
    >
      <button
        className="absolute top-6 right-8 px-4 py-2 font-bold rounded-full shadow-xl transition hover:scale-105 animate-bounceIn"
        style={{
          background: COLORS.claret,
          color: COLORS.vanilla,
          fontSize: "1.05rem",
          zIndex: 100
        }}
        onClick={onClose}
      >
        Close
      </button>
      <div className="mb-6">
        <span className="text-4xl mr-3">🌿</span>
        <h2 className="font-bold text-2xl mb-2" style={{ color: COLORS.claret }}>
          {highlightText(Array.isArray(herb.pinyinName) ? herb.pinyinName[0] : herb.pinyinName, query)}
          <span className="ml-2 text-lg" style={{ color: COLORS.violet }}>{herb.chineseCharacters}</span>
        </h2>
      </div>
      <div style={{ color: COLORS.violet }} className="mb-2">
        <strong>Category:</strong> {highlightText(herb.category, query)}
      </div>
      <div style={{ color: COLORS.seal }} className="mb-2">
        <strong>Pharmaceutical Name:</strong> {highlightText(herb.pharmaceuticalName, query)}
      </div>
      <div style={{ color: COLORS.seal }} className="mb-2">
        <strong>English Name(s):</strong>{" "}
        {safeArr(herb.englishNames).map((n, i) => (
          <span key={i}>{highlightText(n, query)}{i < safeArr(herb.englishNames).length - 1 ? ", " : ""}</span>
        ))}
      </div>
      <div style={{ color: COLORS.seal }} className="mb-2">
        <strong>Properties:</strong>{" "}
        {typeof herb.properties === "object"
          ? [safeArr(herb.properties.taste).join(", "), safeArr(herb.properties.temperature).join(", ")].filter(Boolean).join(" / ")
          : highlightText(herb.properties, query)}
      </div>
      <div style={{ color: COLORS.seal }} className="mb-2">
        <strong>Channels Entered:</strong>{" "}
        {safeArr(herb.channelsEntered).join(", ")}
      </div>
      <div style={{ color: COLORS.seal }} className="mb-2">
        <strong>Keywords:</strong>{" "}
        {safeArr(herb.keywords).map((k, i) => (
          <span key={i}>{highlightText(k, query)}{i < safeArr(herb.keywords).length - 1 ? ", " : ""}</span>
        ))}
      </div>
      <div style={{ color: COLORS.seal }} className="mb-2">
        <strong>Dosage:</strong> {highlightText(herb.dosage, query)}
      </div>
      <div style={{ color: COLORS.seal }} className="mb-2">
        <strong>Cautions/Contraindications:</strong>{" "}
        {safeArr(herb.cautionsAndContraindications).map((c, i) => (
          <span key={i}>{highlightText(c, query)}{i < safeArr(herb.cautionsAndContraindications).length - 1 ? "; " : ""}</span>
        ))}
      </div>
      <div style={{ color: COLORS.seal }} className="mb-2">
        <strong>Notes:</strong>{" "}
        {safeArr(herb.notes).map((n, i) => (
          <span key={i}>{highlightText(n, query)}{i < safeArr(herb.notes).length - 1 ? "; " : ""}</span>
        ))}
      </div>
    </div>
  );
}

export default function FormulaCard() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("q") || "";
  const { id } = useParams();
  const navigate = useNavigate();

  const [allFormulas, setAllFormulas] = useState([]);
  const [allHerbs, setAllHerbs] = useState([]);
  const [sideHerb, setSideHerb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [herbLinkAnimating, setHerbLinkAnimating] = useState({}); // for per-link animation

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/data/caleAndNccaomFormulasObject.json").then(r => r.json()),
      fetch("/data/NCCAOMFormulasObject.json").then(r => r.json()),
      fetch("/data/extraFormulasObject.json").then(r => r.json()),
      fetch("/data/caleHerbsObject.json").then(r => r.json()),
      fetch("/data/caleAndNccaomHerbsObject.json").then(r => r.json()),
      fetch("/data/nccaomHerbsObject.json").then(r => r.json()),
      fetch("/data/extraHerbsObject.json").then(r => r.json())
    ]).then(([caleNccaomFormulasShared, nccaomFormulasOnly, extraFormulas, caleHerbs, caleAndNccaomHerbs, nccaomHerbs, extraHerbs]) => {
      setAllFormulas([
        ...caleNccaomFormulasShared,
        ...nccaomFormulasOnly,
        ...extraFormulas,
      ]);
      setAllHerbs([
        ...caleHerbs,
        ...caleAndNccaomHerbs,
        ...nccaomHerbs,
        ...extraHerbs,
      ]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  let formula = null;

  if (!loading && allFormulas.length > 0) {
    if (id) {
      const decodedId = decodeURIComponent(id).toLowerCase().replace(/\s+/g, "");
      formula = allFormulas.find(f => {
        let names = [];
        if (Array.isArray(f.pinyinName)) {
          names = f.pinyinName.map(n => n.toLowerCase().replace(/\s+/g, ""));
        } else if (f.pinyinName) {
          names = [f.pinyinName.toLowerCase().replace(/\s+/g, "")];
        }
        return names.includes(decodedId);
      });
    } else if (query) {
      formula = allFormulas.find(f =>
        (Array.isArray(f.pinyinName) ? f.pinyinName.join(", ") : f.pinyinName || "").toLowerCase().includes(query.toLowerCase()) ||
        (f.englishName || "").toLowerCase().includes(query.toLowerCase()) ||
        (f.category || "").toLowerCase().includes(query.toLowerCase()) ||
        (f.chineseCharacters || "").toLowerCase().includes(query.toLowerCase())
      );
    }
  }

  function handleAddToFormulaBuilder() {
    if (formula && formula.pinyinName) {
      const formulaName = Array.isArray(formula.pinyinName)
        ? formula.pinyinName[0]
        : formula.pinyinName;
      navigate(`/formulabuilder?formula=${encodeURIComponent(formulaName)}`);
    }
  }

  // Animation handler for herb links
  function handleHerbLinkClick(herbObj, idx) {
    setHerbLinkAnimating(prev => ({ ...prev, [idx]: true }));
    setTimeout(() => setHerbLinkAnimating(prev => ({ ...prev, [idx]: false })), 350);
    setSideHerb(herbObj);
  }

  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{
          background: `linear-gradient(135deg, ${COLORS.vanilla} 0%, ${COLORS.carolina} 50%, ${COLORS.violet} 100%)`
        }}
      >
        <GlobalAnimations />
        <div
          className="rounded-xl p-8 mb-6 flex flex-col items-start animate-fadeInScale shadow-lg"
          style={{
            background: COLORS.vanilla,
            border: `2px solid ${COLORS.claret}`,
            color: COLORS.seal,
            maxWidth: "500px",
            textAlign: "left",
          }}
        >
          <h2 className="text-3xl font-bold mb-4" style={{ color: COLORS.claret }}>Loading...</h2>
          <p className="mb-3">Loading formula data...</p>
        </div>
      </div>
    );
  }

  if (!formula) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{
          background: `linear-gradient(135deg, ${COLORS.vanilla} 0%, ${COLORS.carolina} 50%, ${COLORS.violet} 100%)`
        }}
      >
        <GlobalAnimations />
        <div
          className="rounded-xl p-8 mb-6 flex flex-col items-start animate-fadeInScale shadow-lg"
          style={{
            background: COLORS.vanilla,
            border: `2px solid ${COLORS.claret}`,
            color: COLORS.seal,
            maxWidth: "500px",
            textAlign: "left",
          }}
        >
          <h2 className="text-3xl font-bold mb-4" style={{ color: COLORS.claret }}>Formula Not Found</h2>
          <p className="mb-3">Sorry, we couldn't find a formula matching your search.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 mt-2 rounded-full font-bold shadow-xl transition hover:scale-105 animate-bounceIn"
            style={{
              background: COLORS.violet,
              color: COLORS.vanilla
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-row items-center justify-center px-4"
      style={{
        background: `linear-gradient(135deg, ${COLORS.vanilla} 0%, ${COLORS.carolina} 50%, ${COLORS.violet} 100%)`
      }}
    >
      <GlobalAnimations />
      <div className="fixed top-6 right-8 z-40">
        <Link
          to="/"
          className="px-5 py-2 rounded-full font-bold shadow-xl transition-all duration-200 hover:scale-105 animate-bounceIn"
          style={{
            background: COLORS.violet,
            color: COLORS.vanilla
          }}
        >
          Back to Home
        </Link>
      </div>
      {/* Formula Card */}
      <div
        className="rounded-2xl p-8 flex flex-col items-start shadow-2xl animate-fadeIn"
        style={{
          background: `linear-gradient(120deg, ${COLORS.vanilla} 80%, ${COLORS.carolina} 100%)`,
          border: `2px solid ${COLORS.violet}`,
          maxWidth: "600px",
          width: "100%",
          textAlign: "left",
          position: "relative",
          zIndex: 10
        }}
      >
        {/* Add to Formula Builder Button - smaller and in the top right corner inside the card */}
        <button
          className="px-4 py-1 font-bold rounded-full shadow transition hover:scale-105"
          style={{
            background: COLORS.carolina,
            color: COLORS.claret,
            position: "absolute",
            top: "18px",
            right: "18px",
            zIndex: 30,
            minWidth: "fit-content",
            fontSize: "0.80rem",
            padding: "0.5em 1em",
            boxShadow: "0 2px 12px 0 #7C5CD344"
          }}
          onClick={handleAddToFormulaBuilder}
        >
          Add to Formula Builder
        </button>

        <div className="flex items-center mb-4 mt-2 animate-bounceIn">
          <span className="text-4xl mr-3">🧪</span>
          <h2 className="font-bold text-3xl" style={{ color: COLORS.claret, textAlign: "left" }}>
            {highlightText(Array.isArray(formula.pinyinName) ? formula.pinyinName[0] : formula.pinyinName, query)}
            <span className="ml-2 text-xl" style={{ color: COLORS.violet }}>{formula.chineseCharacters}</span>
          </h2>
        </div>
        <p className="mb-2" style={{ color: COLORS.violet }}>
          <strong>English Name:</strong> {highlightText(formula.englishName, query)}
        </p>
        <p className="mb-2" style={{ color: COLORS.seal }}>
          <strong>Category:</strong> {highlightText(formula.category, query)}
        </p>
        <p className="mb-2" style={{ color: COLORS.seal }}>
          <strong>Ingredients & Dosages:</strong>
          <ul className="ml-4">
            {safeArr(formula.ingredientsAndDosages).map((ing, i) => {
              const pinyin = getPinyinFromIngredient(ing);
              const herbObj = allHerbs.find(h => {
                let names = Array.isArray(h.pinyinName)
                  ? h.pinyinName.map(n => n.toLowerCase().replace(/\s+/g, ""))
                  : [h.pinyinName ? h.pinyinName.toLowerCase().replace(/\s+/g, "") : ""];
                let pinyinNorm = pinyin.toLowerCase().replace(/\s+/g, "");
                return names.some(n => n === pinyinNorm);
              });
              return (
                <li key={i} style={{ display: "flex", alignItems: "center", marginBottom: "2px" }}>
                  <span style={numberCircleStyle}>{i + 1}</span>
                  {herbObj ? (
                    <button
                      className={
                        `${herbLinkAnimating[i] ? "herb-link-pop " : ""}herb-link-hover`
                      }
                      style={{
                        color: COLORS.violet,
                        textDecoration: "underline",
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "1em",
                        marginRight: "0.35em"
                      }}
                      onClick={() => handleHerbLinkClick(herbObj, i)}
                      title={`View details for ${herbObj.pinyinName}`}
                    >
                      {highlightText(ing, query)}
                    </button>
                  ) : (
                    <span>{highlightText(ing, query)}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </p>
        <p className="mb-2" style={{ color: COLORS.seal }}>
          <strong>Actions:</strong> {highlightText(formula.actions, query)}
        </p>
        <p className="mb-2" style={{ color: COLORS.seal }}>
          <strong>Indications:</strong> {highlightText(formula.indications, query)}
        </p>
        <p className="mb-2" style={{ color: COLORS.seal }}>
          <strong>Cautions/Contraindications:</strong>{" "}
          {safeArr(formula.cautionsAndContraindications).map((c, i) => (
            <span key={i}>{highlightText(c, query)}{i < safeArr(formula.cautionsAndContraindications).length - 1 ? "; " : ""}</span>
          ))}
        </p>
        <p className="mb-2" style={{ color: COLORS.seal }}>
          <strong>Modifications:</strong>
          <ul className="ml-4">
            {safeArr(formula.modifications).map((mod, i) => (
              <li key={i} style={{ display: "flex", alignItems: "center", marginBottom: "2px" }}>
                <span style={numberCircleStyle}>{i + 1}</span>
                <span>{highlightText(mod, query)}</span>
              </li>
            ))}
          </ul>
        </p>
        <p className="mb-2" style={{ color: COLORS.seal }}>
          <strong>Notes:</strong>{" "}
          {safeArr(formula.notes).map((n, i) => (
            <span key={i}>{highlightText(n, query)}{i < safeArr(formula.notes).length - 1 ? "; " : ""}</span>
          ))}
        </p>
        <button
          className="px-6 py-3 mt-8 font-bold rounded-full shadow-xl transition hover:scale-105 animate-pulseGlow"
          style={{
            background: COLORS.violet,
            color: COLORS.vanilla,
            alignSelf: "flex-start"
          }}
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
      {sideHerb && (
        <HerbSideCard
          herb={sideHerb}
          query={query}
          onClose={() => setSideHerb(null)}
        />
      )}
    </div>
  );
}