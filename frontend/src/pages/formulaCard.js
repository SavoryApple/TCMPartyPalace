import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useHerbCart } from "../context/HerbCartContext";
import HerbCart from "../components/HerbCart";

// API base URL for backend
const API_BASE_URL = "https://thetcmatlas.fly.dev";

const COLORS = {
  vanilla: "#FFF7E3",
  violet: "#7C5CD3",
  carolina: "#68C5E6",
  claret: "#A52439",
  seal: "#3B4461",
  accent: "#fff0f0"
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
      .herb-link-in-cart {
        background: ${COLORS.carolina};
        color: ${COLORS.seal};
        border-radius: 1em;
        font-weight: bold;
        box-shadow: 0 0 0 2px ${COLORS.violet}33;
        padding: 0 0.4em;
        border: 2px solid ${COLORS.violet};
      }
      /* Floating Cart & Back to Top Button styles */
      .floating-btns-container {
        position: fixed;
        right: 18px;
        bottom: 28px;
        z-index: 80;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .floating-backtotop-btn {
        background: #7C5CD3;
        color: #FFF7E3;
        border-radius: 50%;
        width: 49px;
        height: 49px;
        border: 2.5px solid #FFF7E3;
        box-shadow: 0 6px 40px -8px #7C5CD399;
        font-weight: 900;
        font-size: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s, scale 0.15s;
        cursor: pointer;
        outline: none;
        opacity: 1;
      }
      @media (max-width: 600px) {
        .floating-btns-container {
          right: 8px;
          bottom: 12px;
          gap: 6px;
        }
        .floating-backtotop-btn {
          width: 38px;
          height: 38px;
          font-size: 1.2rem;
        }
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

function BackToTopButton({ show }) {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  if (!show) return null;
  return (
    <button
      className="floating-backtotop-btn animate-fadeInScale"
      onClick={handleClick}
      aria-label="Back to top"
      title="Back to top"
    >
      ↑
    </button>
  );
}

export default function FormulaCard() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("q") || "";
  const { id } = useParams();
  const navigate = useNavigate();

  const { cart, addHerb, removeHerb, clearCart } = useHerbCart();
  const [showCart, setShowCart] = useState(false);

  const [allFormulas, setAllFormulas] = useState([]);
  const [allHerbs, setAllHerbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [herbLinkAnimating, setHerbLinkAnimating] = useState({});
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE_URL}/api/data/caleandnccaomformulas`).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/data/nccaomformulas`).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/data/extraformulas`).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/data/caleherbs`).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/data/caleandnccaomherbs`).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/data/nccaomherbs`).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/data/extraherbs`).then(r => r.json())
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

  useEffect(() => {
    function onScroll() {
      setShowBackToTop(window.scrollY > 180);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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

  function handleHerbLinkClick(herbObj, idx) {
    setHerbLinkAnimating(prev => ({ ...prev, [idx]: true }));
    setTimeout(() => setHerbLinkAnimating(prev => ({ ...prev, [idx]: false })), 350);
    addHerb(herbObj);
    setShowCart(true);
  }

  function handleCreateFormula() {
    if (cart.length > 0) {
      navigate("/formulabuilder", { state: { herbCart: cart } });
      clearCart();
      setShowCart(false);
    }
  }

  // Helper to check if a herb is in the cart
  function getHerbKey(herb) {
    if (herb.pinyinName) return herb.pinyinName;
    if (herb.name) return herb.name;
    return undefined;
  }
  function isHerbInCart(herbObj) {
    const herbKey = getHerbKey(herbObj);
    return cart.some(h => getHerbKey(h) === herbKey);
  }

  // --- Loading State ---
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
        <div className="floating-btns-container">
          <button
            style={{
              background: COLORS.violet,
              color: COLORS.vanilla,
              borderRadius: "50%",
              width: 49,
              height: 49,
              minWidth: 49,
              minHeight: 49,
              boxShadow: "0 2px 12px 0 #7C5CD366",
              fontWeight: 700,
              fontSize: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `2px solid ${COLORS.vanilla}`,
              transition: "background 0.2s, scale 0.15s",
            }}
            aria-label="Show Cart"
            title="Show Cart"
            disabled
          >
            🛒
          </button>
          <BackToTopButton show={showBackToTop} />
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
        <div className="floating-btns-container">
          <button
            style={{
              background: COLORS.violet,
              color: COLORS.vanilla,
              borderRadius: "50%",
              width: 49,
              height: 49,
              minWidth: 49,
              minHeight: 49,
              boxShadow: "0 2px 12px 0 #7C5CD366",
              fontWeight: 700,
              fontSize: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `2px solid ${COLORS.vanilla}`,
              transition: "background 0.2s, scale 0.15s",
            }}
            aria-label="Show Cart"
            title="Show Cart"
            disabled
          >
            🛒
          </button>
          <BackToTopButton show={showBackToTop} />
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
      {/* HerbCart Drawer */}
      <HerbCart
        show={showCart}
        onClose={() => setShowCart(false)}
        onCreateFormula={handleCreateFormula}
      />
      {/* Floating Cart & BackToTop Buttons */}
      <div className="floating-btns-container">
        <button
          style={{
            background: COLORS.violet,
            color: COLORS.vanilla,
            borderRadius: "50%",
            width: 49,
            height: 49,
            minWidth: 49,
            minHeight: 49,
            boxShadow: "0 2px 12px 0 #7C5CD366",
            zIndex: 81,
            fontWeight: 700,
            fontSize: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `2px solid ${COLORS.vanilla}`,
            transition: "background 0.2s, scale 0.15s",
          }}
          onClick={() => setShowCart(true)}
          aria-label="Show Cart"
          title="Show Cart"
        >
          🛒{cart.length > 0 && (
            <span
              style={{
                fontSize: 16,
                marginLeft: 5,
                background: COLORS.claret,
                color: COLORS.vanilla,
                borderRadius: "50%",
                padding: "2px 8px",
                fontWeight: 500,
              }}
            >
              {cart.length}
            </span>
          )}
        </button>
        <BackToTopButton show={showBackToTop} />
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
              const inCart = herbObj && isHerbInCart(herbObj);
              return (
                <li key={i} style={{ display: "flex", alignItems: "center", marginBottom: "2px" }}>
                  <span style={numberCircleStyle}>{i + 1}</span>
                  {herbObj ? (
                    <button
                      className={
                        `${herbLinkAnimating[i] ? "herb-link-pop " : ""}herb-link-hover${inCart ? " herb-link-in-cart" : ""}`
                      }
                      style={{
                        textDecoration: "underline",
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "1em",
                        marginRight: "0.35em",
                        ...(inCart ? {
                          // Additional highlight style if in cart
                          background: COLORS.carolina,
                          color: COLORS.seal,
                          borderRadius: "1em",
                          border: `2px solid ${COLORS.violet}`,
                          boxShadow: `0 0 0 2px ${COLORS.violet}33`,
                          padding: "0 0.4em"
                        } : { color: COLORS.violet })
                      }}
                      onClick={() => handleHerbLinkClick(herbObj, i)}
                      title={inCart ? `${herbObj.pinyinName} is already in cart` : `Add ${herbObj.pinyinName} to cart`}
                    >
                      {highlightText(ing, query)}
                      {inCart && <span style={{ fontWeight: 700, color: COLORS.claret, marginLeft: 3 }}>✔</span>}
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
    </div>
  );
}