import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import WhatFormulaMakesUpThoseHerbs from "../components/whatFormulaMakesUpThoseHerbs";
import { useHerbCart } from "../context/HerbCartContext";
import HerbCart from "../components/HerbCart";

// --- Color scheme ---
const COLORS = {
  vanilla: "#FFF7E3",
  violet: "#7C5CD3",
  carolina: "#68C5E6",
  claret: "#A52439",
  seal: "#3B4461",
  highlight: "#ffe066",
  shadow: "#7C5CD344",
  shadowStrong: "#7C5CD399",
  accent: "#fff0f0",
};

// --- Animations ---
const GlobalAnimations = () => (
  <style>
    {`
      @keyframes fadeIn {
        0% { opacity: 0; transform: translateY(24px) scale(0.98);}
        80% { opacity: 1; transform: translateY(-6px) scale(1.04);}
        100% { opacity: 1; transform: translateY(0) scale(1);}
      }
      .animate-fadeIn { animation: fadeIn 0.5s cubic-bezier(.36,1.29,.45,1.01); }
      @keyframes fadeInScaleUp {
        0% { opacity: 0; transform: scale(0.97) translateY(14px);}
        50% { opacity: 0.7; transform: scale(1.03) translateY(-6px);}
        100% { opacity: 1; transform: scale(1) translateY(0);}
      }
      .animate-fadeInScaleUp { animation: fadeInScaleUp 0.7s cubic-bezier(.36,1.29,.45,1.01); }
      @keyframes shimmerText {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .animate-shimmerText {
        background: linear-gradient(90deg, ${COLORS.violet}, ${COLORS.carolina}, ${COLORS.claret}, ${COLORS.vanilla}, ${COLORS.highlight});
        background-size: 400% 400%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
        animation: shimmerText 3.2s ease-in-out infinite;
      }
      @keyframes pulseGlow {
        0% { box-shadow: 0 0 0 0 ${COLORS.violet}33; }
        50% { box-shadow: 0 0 16px 8px ${COLORS.violet}88; }
        100% { box-shadow: 0 0 0 0 ${COLORS.violet}33; }
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
      @keyframes imgPop {
        0% { opacity: 0; transform: scale(0.7);}
        80% { opacity: 1; transform: scale(1.04);}
        100% { opacity: 1; transform: scale(1);}
      }
      .animate-imgPop { animation: imgPop 0.3s cubic-bezier(.36,1.29,.45,1.01);}
    `}
  </style>
);

function TcmPartyZoneHeader() {
  return (
    <div
      className="animate-shimmerText animate-fadeInScaleUp"
      style={{
        fontWeight: 900,
        fontSize: "2.5rem",
        letterSpacing: "-2px",
        textAlign: "center",
        fontFamily: "inherit",
        lineHeight: 1.18,
        userSelect: "none",
        marginBottom: "0.3em",
        padding: "0.14em 0",
        textShadow: `0 3px 16px ${COLORS.shadowStrong}`,
        borderRadius: "1em",
      }}
    >
      The TCM Atlas (BETA) 🗺️
    </div>
  );
}

function highlightText(text, query) {
  if (!text) return "";
  if (!query) return text;
  const safeQuery = query.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
  const regex = new RegExp(`(${safeQuery})`, "gi");
  return String(text).split(regex).map((part, i) =>
    regex.test(part)
      ? <span key={i} style={{ background: COLORS.highlight, color: COLORS.claret, fontWeight: "bold" }}>{part}</span>
      : part
  );
}
function safeArr(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return [val];
}
function getHerbDisplayName(herb) {
  if (herb.pinyinName) return herb.pinyinName;
  if (herb.name) return herb.name;
  if (herb.englishNames) {
    if (Array.isArray(herb.englishNames)) return herb.englishNames[0];
    return herb.englishNames;
  }
  if (herb.pharmaceuticalName) return herb.pharmaceuticalName;
  if (herb.pharmaceutical) return herb.pharmaceutical;
  return "Unknown";
}
function getHerbKey(herb) {
  if (herb.pinyinName) return herb.pinyinName;
  if (herb.name) return herb.name;
  return undefined;
}

function BackToTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShow(window.scrollY > 180);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  function handleClick() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  return (
    <button
      onClick={handleClick}
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        zIndex: 70,
        background: COLORS.violet,
        color: COLORS.vanilla,
        borderRadius: "50%",
        width: 55,
        height: 55,
        border: `2.5px solid ${COLORS.vanilla}`,
        boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
        fontWeight: 900,
        fontSize: "2rem",
        display: show ? "flex" : "none",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.2s, scale 0.15s",
        cursor: "pointer",
        outline: "none"
      }}
      aria-label="Back to top"
      title="Back to top"
      className="animate-fadeInScaleUp"
    >
      ↑
    </button>
  );
}

// --- Herb Image Component ---
function HerbImage({ url, alt }) {
  const [expanded, setExpanded] = useState(false);

  // Handle click outside the expanded image to close
  useEffect(() => {
    if (!expanded) return;
    function handleClick(e) {
      if (e.target.classList.contains("herb-img-overlay")) {
        setExpanded(false);
      }
    }
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [expanded]);

  // If image URL is missing, show placeholder border and text
  if (!url) {
    return (
      <div
        style={{
          position: "absolute",
          top: 18,
          right: 18,
          zIndex: 99,
          width: 120,
          height: 120,
          border: "2.5px dashed #7C5CD3",
          borderRadius: "1em",
          background: "#FFF7E3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#A52439",
          fontWeight: 700,
          fontSize: "1.1em",
          textAlign: "center",
          boxShadow: "0 4px 18px -3px #7C5CD399",
        }}
        aria-label="Image coming soon"
      >
        Image<br />coming soon!
      </div>
    );
  }

  // If image URL is present, show clickable image
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 18,
          right: 18,
          zIndex: 99,
          cursor: "pointer",
          borderRadius: "1em",
          overflow: "hidden",
          boxShadow: `0 4px 18px -3px ${COLORS.shadowStrong}`,
          border: `2.5px solid ${COLORS.violet}`,
          background: COLORS.vanilla,
          width: 120,
          height: 120,
          transition: "box-shadow 0.2s",
        }}
        title="Click to expand"
        onClick={() => setExpanded(true)}
        className="animate-imgPop"
      >
        <img
          src={url}
          alt={alt || "Herb"}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
      {expanded && (
        <div
          className="herb-img-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(60,44,100,0.54)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <img
            src={url}
            alt={alt || "Herb"}
            style={{
              maxWidth: "80vw",
              maxHeight: "82vh",
              borderRadius: "2em",
              boxShadow: `0 10px 60px -8px ${COLORS.shadowStrong}`,
              border: `4px solid ${COLORS.violet}`,
              background: COLORS.vanilla,
              objectFit: "contain",
              transition: "box-shadow 0.18s",
            }}
            className="animate-imgPop"
          />
        </div>
      )}
    </>
  );
}

export default function HerbCard() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("q") || "";
  const { id } = useParams();
  const navigate = useNavigate();

  // Shared context cart
  const { cart, addHerb, removeHerb, clearCart } = useHerbCart();
  const [showCart, setShowCart] = useState(false);

  const [herb, setHerb] = useState(null);
  const [loading, setLoading] = useState(true);

  // Backend API base URL
  const API_URL = process.env.REACT_APP_API_URL || "https://thetcmatlas.fly.dev";

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_URL}/api/data/caleherbs`).then(r => r.json()),
      fetch(`${API_URL}/api/data/caleandnccaomherbs`).then(r => r.json()),
      fetch(`${API_URL}/api/data/nccaomherbs`).then(r => r.json()),
      fetch(`${API_URL}/api/data/extraherbs`).then(r => r.json())
    ])
      .then(([caleHerbs, caleAndNccaomHerbs, nccaomHerbs, extraHerbs]) => {
        const allHerbs = [
          ...caleHerbs,
          ...caleAndNccaomHerbs,
          ...nccaomHerbs,
          ...extraHerbs
        ];
        if (id) {
          const decodedId = decodeURIComponent(id).toLowerCase().replace(/\s+/g, "");
          const foundHerb = allHerbs.find(h => {
            let names = [];
            if (Array.isArray(h.pinyinName)) {
              names = h.pinyinName.map(n => n.toLowerCase().replace(/\s+/g, ""));
            } else if (h.pinyinName) {
              names = [h.pinyinName.toLowerCase().replace(/\s+/g, "")];
            }
            return names.includes(decodedId);
          });
          setHerb(foundHerb || null);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, API_URL]);

  const herbKey = herb ? getHerbKey(herb) : undefined;
  const isInCart = herb && cart.some(
    (h) => getHerbKey(h) === herbKey
  );

  function handleAddToCart() {
    addHerb(herb);
    setShowCart(true); // Show cart drawer after adding
  }

  function handleRemoveFromCart() {
    removeHerb(herbKey);
  }

  function handleCreateFormula() {
    if (cart.length > 0) {
      navigate("/formulabuilder", { state: { herbCart: cart } });
      clearCart();
      setShowCart(false);
    }
  }

  // --- Loading State ---
  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{
          background: `linear-gradient(120deg, ${COLORS.vanilla} 0%, ${COLORS.carolina} 50%, ${COLORS.violet} 100%)`
        }}
      >
        <GlobalAnimations />
        <TcmPartyZoneHeader />
        <div
          className="rounded-xl p-8 mb-6 flex flex-col items-start animate-fadeInScaleUp card-shadow"
          style={{
            background: COLORS.vanilla,
            border: `2.5px solid ${COLORS.violet}`,
            color: COLORS.seal,
            maxWidth: "500px",
            textAlign: "left",
            boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
          }}
        >
          <h2 className="text-3xl font-bold mb-4" style={{ color: COLORS.claret }}>Loading...</h2>
          <p className="mb-3">Loading herb data...</p>
        </div>
        <BackToTopButton />
      </div>
    );
  }

  // --- Not Found State ---
  if (!herb) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{
          background: `linear-gradient(120deg, ${COLORS.vanilla} 0%, ${COLORS.carolina} 50%, ${COLORS.violet} 100%)`
        }}
      >
        <GlobalAnimations />
        <TcmPartyZoneHeader />
        <div
          className="rounded-xl p-8 mb-6 flex flex-col items-start animate-fadeInScaleUp card-shadow"
          style={{
            background: COLORS.vanilla,
            border: `2.5px solid ${COLORS.violet}`,
            color: COLORS.seal,
            maxWidth: "500px",
            textAlign: "left",
            boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
          }}
        >
          <h2 className="text-3xl font-bold mb-4" style={{ color: COLORS.claret }}>Not Found</h2>
          <p className="mb-3">Sorry, we couldn't find a herb matching your search.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 mt-2 rounded-full font-bold shadow-xl transition hover:scale-105 animate-bounceIn"
            style={{
              background: COLORS.violet,
              color: COLORS.vanilla,
              border: `2.5px solid ${COLORS.seal}`,
              boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
            }}
          >
            Back to Home
          </button>
        </div>
        <BackToTopButton />
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: `linear-gradient(120deg, ${COLORS.vanilla} 0%, ${COLORS.carolina} 50%, ${COLORS.violet} 100%)` }}
    >
      <GlobalAnimations />
      <TcmPartyZoneHeader />

      {/* HerbCart Drawer */}
      <HerbCart
        show={showCart}
        onClose={() => setShowCart(false)}
        onCreateFormula={handleCreateFormula}
      />

      {/* Floating Cart Button */}
      <button
        className="fixed"
        style={{
          right: 18,
          bottom: 28,
          background: COLORS.violet,
          color: COLORS.vanilla,
          borderRadius: "50%",
          width: 49,
          height: 49,
          minWidth: 49,
          minHeight: 49,
          boxShadow: "0 2px 12px 0 #7C5CD366",
          zIndex: 70,
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
      {/* Main Herb Card UI */}
      <div className="fixed top-8 right-10 z-40">
        <Link
          to="/"
          className="px-5 py-2 rounded-full font-bold shadow-xl transition-all duration-200 hover:scale-105 animate-bounceIn"
          style={{
            background: COLORS.violet,
            color: COLORS.vanilla,
            border: `2.5px solid ${COLORS.seal}`,
            boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
          }}
        >
          Back to Home
        </Link>
      </div>
      <div
        className="rounded-2xl p-8 flex flex-col items-start shadow-2xl animate-fadeInScaleUp card-shadow"
        style={{
          background: `linear-gradient(120deg, ${COLORS.vanilla} 80%, ${COLORS.carolina} 100%)`,
          border: `2.5px solid ${COLORS.violet}`,
          maxWidth: "650px",
          width: "100%",
          textAlign: "left",
          boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
          marginTop: "32px",
          position: "relative",
          minHeight: "300px",
        }}
      >
        {/* Herb Image in Top Right */}
        <HerbImage url={process.env.PUBLIC_URL + "/" + herb.herbImageURL} alt={getHerbDisplayName(herb)} />
        <div className="flex items-center mb-4 animate-bounceIn">
          <span className="text-4xl mr-3">🌿</span>
          <h2 className="font-bold text-3xl" style={{ color: COLORS.claret, textAlign: "left" }}>
            {highlightText(Array.isArray(herb.pinyinName) ? herb.pinyinName[0] : herb.pinyinName, query)}
            <span className="ml-2 text-xl" style={{ color: COLORS.violet }}>{herb.chineseCharacters}</span>
          </h2>
        </div>
        <p className="mb-2" style={{ color: COLORS.violet }}>
          <strong>Category:</strong> {highlightText(herb.category, query)}
        </p>
        <p className="mb-2" style={{ color: COLORS.seal }}>
          <strong>Pharmaceutical Name:</strong> {highlightText(herb.pharmaceuticalName, query)}
        </p>
        <p className="mb-2" style={{ color: COLORS.seal }}>
          <strong>English Name(s):</strong>{" "}
          {safeArr(herb.englishNames).map((n, i) => (
            <span key={i}>{highlightText(n, query)}{i < safeArr(herb.englishNames).length - 1 ? ", " : ""}</span>
          ))}
        </p>
        <p className="mb-2" style={{ color: COLORS.seal }}>
          <strong>Properties:</strong>{" "}
          {typeof herb.properties === "object"
            ? [safeArr(herb.properties.taste).join(", "), safeArr(herb.properties.temperature).join(", ")].filter(Boolean).join(" / ")
            : highlightText(herb.properties, query)}
        </p>
        <p className="mb-2" style={{ color: COLORS.seal }}>
          <strong>Channels Entered:</strong>{" "}
          {safeArr(herb.channelsEntered).join(", ")}
        </p>
        <p className="mb-2" style={{ color: COLORS.seal }}>
          <strong>Keywords:</strong>{" "}
          {safeArr(herb.keywords).map((k, i) => (
            <span key={i}>{highlightText(k, query)}{i < safeArr(herb.keywords).length - 1 ? ", " : ""}</span>
          ))}
        </p>
        <p className="mb-2" style={{ color: COLORS.seal }}>
          <strong>Dosage:</strong> {highlightText(herb.dosage, query)}
        </p>
        <p className="mb-2" style={{ color: COLORS.seal }}>
          <strong>Cautions/Contraindications:</strong>{" "}
          {safeArr(herb.cautionsAndContraindications).map((c, i) => (
            <span key={i}>{highlightText(c, query)}{i < safeArr(herb.cautionsAndContraindications).length - 1 ? "; " : ""}</span>
          ))}
        </p>
        <p className="mb-2" style={{ color: COLORS.seal }}>
          <strong>Notes:</strong>{" "}
          {safeArr(herb.notes).map((n, i) => (
            <span key={i}>{highlightText(n, query)}{i < safeArr(herb.notes).length - 1 ? "; " : ""}</span>
          ))}
        </p>
        {/* Herb Cart Buttons */}
        <div className="flex gap-4 mt-6">
          {!isInCart ? (
            <button
              className="px-6 py-3 font-bold rounded-full shadow-xl transition hover:scale-105 animate-pulseGlow"
              style={{
                background: COLORS.carolina,
                color: COLORS.seal,
                border: `2.5px solid ${COLORS.violet}`,
                boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
                alignSelf: "flex-start"
              }}
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          ) : (
            <button
              className="px-6 py-3 font-bold rounded-full shadow-xl transition hover:scale-105 animate-pulseGlow"
              style={{
                background: COLORS.claret,
                color: COLORS.vanilla,
                border: `2.5px solid ${COLORS.violet}`,
                boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
                alignSelf: "flex-start"
              }}
              onClick={handleRemoveFromCart}
            >
              Remove from Cart
            </button>
          )}
          <button
            className="px-6 py-3 font-bold rounded-full shadow-xl transition hover:scale-105 animate-pulseGlow"
            style={{
              background: COLORS.violet,
              color: COLORS.vanilla,
              border: `2.5px solid ${COLORS.seal}`,
              boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
              alignSelf: "flex-start"
            }}
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
      {/* PATCH: Show all formulas that contain this herb below the herb card */}
      <div
        style={{
          marginTop: "48px",
          width: "100%",
          maxWidth: "980px",
          background: COLORS.vanilla,
          borderRadius: "2.2em",
          boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
          border: `2.5px solid ${COLORS.violet}`,
          padding: "24px 18px",
        }}
        className="animate-fadeInScaleUp"
      >
        <WhatFormulaMakesUpThoseHerbs
          herbs={[herb]}
        />
      </div>
      <BackToTopButton />
    </div>
  );
}