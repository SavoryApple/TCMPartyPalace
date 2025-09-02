import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import WhatFormulaMakesUpThoseHerbs from "../components/whatFormulaMakesUpThoseHerbs";
import { useHerbCart } from "../context/HerbCartContext";
import HerbCart from "../components/HerbCart";
import HerbCategoryInfo from "../components/HerbCategoryInfo";
import FooterCard from "../components/FooterCard";
import Logo from "../components/Logo";
import NavBar from "../components/NavBar";
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
  vanilla: "#FFF7E3",
  violet: "#7C5CD3",
  carolina: "#68C5E6",
  claret: "#A52439",
  seal: "#3B4461",
  highlight: "#ffe066",
  shadow: "#B38E3F88",
  shadowStrong: "#B38E3FCC",
  accent: "#fff0f0",
  propertyBubble: "#438C3B",
  propertyBubbleText: "#FCF5E5",
  channelBubble: "#E6F4FF",
  channelBubbleText: "#2176AE",
  yoSanBubble: "#2E3551",
  yoSanBubbleText: "#F9E8C2",
  formatsBubble: "#B38E3F",
  formatsBubbleText: "#FCF5E5",
};

const NAVBAR_HEIGHT = 84;
const CARD_MAX_WIDTH = 650;

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
      .back-to-home-btn {
        position: fixed;
        top: ${NAVBAR_HEIGHT + 12}px;
        right: 32px;
        z-index: 101;
        display: flex;
        justify-content: flex-end;
      }
      @media (max-width: 500px) {
        .back-to-home-btn {
          right: 2px !important;
        }
      }
    `}
  </style>
);

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);
  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth < 700);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
}

function PropertyBubble({ value, uniqueKey, isMobile }) {
  if (!value) return null;
  return (
    <span
      key={uniqueKey}
      className="inline-block rounded-full text-xs font-bold mr-1 mb-1 max-w-[80px] text-center whitespace-nowrap align-middle"
      style={{
        background: COLORS.propertyBubble,
        color: COLORS.propertyBubbleText,
        lineHeight: "1.4",
        verticalAlign: "middle",
        fontWeight: 700,
        letterSpacing: "0.01em",
        fontSize: isMobile ? "0.74em" : "0.8em",
        padding: isMobile ? "2px 8px" : "2.5px 10px",
        minWidth: isMobile ? 38 : 50,
        boxShadow: `0 1px 6px -3px ${COLORS.accentGold}44`,
        border: `1.1px solid ${COLORS.accentGold}`,
      }}
    >
      {value}
    </span>
  );
}

function ChannelBubble({ value, uniqueKey, isMobile }) {
  if (!value) return null;
  return (
    <span
      key={uniqueKey}
      className="inline-block rounded-full text-xs font-bold mr-1 mb-1 max-w-[120px] text-center whitespace-nowrap align-middle"
      style={{
        background: COLORS.channelBubble,
        color: COLORS.channelBubbleText,
        fontWeight: 700,
        fontSize: isMobile ? "0.74em" : "0.8em",
        padding: isMobile ? "2px 8px" : "2.5px 10px",
        minWidth: isMobile ? 38 : 50,
        boxShadow: `0 1px 6px -3px ${COLORS.accentBlue}33`,
        border: `1.1px solid ${COLORS.accentBlue}`,
        letterSpacing: "0.01em",
      }}
    >
      {value}
    </span>
  );
}

function YoSanCarriesAndFormatsBubble({ herb, isMobile }) {
  let yoSanCarries;
  if (herb.yoSanCarries === true) {
    yoSanCarries = "Yes";
  } else if (herb.yoSanCarries === false || herb.yoSanCarries === undefined || herb.yoSanCarries === null) {
    yoSanCarries = "No";
  } else {
    yoSanCarries = String(herb.yoSanCarries);
  }
  const formats =
    Array.isArray(herb.formats) && herb.formats.length > 0
      ? herb.formats.join(", ")
      : typeof herb.formats === "string" && herb.formats
      ? herb.formats
      : null;

  const bubbleSize = isMobile
    ? { fontSize: "0.63em", padding: "1px 6px", minWidth: 25, marginRight: 2 }
    : { fontSize: "0.7em", padding: "1.5px 8px", minWidth: 32, marginRight: 5 };

  return (
    <span
      style={{
        display: "inline-flex",
        flexDirection: "row",
        gap: isMobile ? "0.2em" : "0.4em",
        alignItems: "center",
        marginTop: 0,
        marginBottom: 0,
        fontWeight: 600,
      }}
    >
      <span
        style={{
          ...bubbleSize,
          background: COLORS.yoSanBubble,
          color: COLORS.yoSanBubbleText,
          borderRadius: "999px",
          textAlign: "center",
          boxShadow: `0 1px 5px -2px ${COLORS.yoSanBubble}55`,
          border: `1px solid ${COLORS.accentGold}`,
          letterSpacing: "0.01em",
        }}
      >
        Yo San: {yoSanCarries}
      </span>
      {formats && (
        <span
          style={{
            ...bubbleSize,
            background: COLORS.formatsBubble,
            color: COLORS.formatsBubbleText,
            borderRadius: "999px",
            textAlign: "center",
            boxShadow: `0 1px 5px -2px ${COLORS.formatsBubble}55`,
            border: `1px solid ${COLORS.accentGold}`,
            letterSpacing: "0.01em",
          }}
        >
          Formats: {formats}
        </span>
      )}
    </span>
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

function HerbImage({ url, alt, isMobile }) {
  const [expanded, setExpanded] = useState(false);
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
  if (!url) {
    return (
      <div
        style={{
          position: isMobile ? "static" : "absolute",
          top: isMobile ? undefined : 18,
          right: isMobile ? undefined : 18,
          zIndex: 99,
          width: isMobile ? "130px" : 120,
          height: isMobile ? "130px" : 120,
          border: `2.5px dashed ${COLORS.violet}`,
          borderRadius: "1em",
          background: COLORS.backgroundGold,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: COLORS.accentCrimson,
          fontWeight: 700,
          fontSize: "1.1em",
          textAlign: "center",
          boxShadow: "0 4px 18px -3px " + COLORS.shadowStrong,
          margin: isMobile ? "0 auto 18px auto" : undefined,
        }}
        aria-label="Image coming soon"
      >
        Image<br />coming soon!
      </div>
    );
  }
  return (
    <>
      <div
        style={{
          position: isMobile ? "static" : "absolute",
          top: isMobile ? undefined : 18,
          right: isMobile ? undefined : 18,
          zIndex: 99,
          cursor: "pointer",
          borderRadius: "1em",
          overflow: "hidden",
          boxShadow: `0 4px 18px -3px ${COLORS.shadowStrong}`,
          border: `2.5px solid ${COLORS.violet}`,
          background: COLORS.backgroundGold,
          width: isMobile ? "130px" : 120,
          height: isMobile ? "130px" : 120,
          transition: "box-shadow 0.2s",
          margin: isMobile ? "0 auto 18px auto" : undefined,
          display: isMobile ? "block" : "block"
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
              background: COLORS.backgroundGold,
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

function getPropertiesArr(herb) {
  if (!herb) return [];
  let val = herb.properties;
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === "string") {
    return val
      .split(/[,;/]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function getChannelsArr(herb) {
  if (!herb) return [];
  let val = herb.channelsEntered;
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === "string") {
    return val
      .split(/[,;/]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export default function HerbCard() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("q") || "";
  const { id } = useParams();
  const navigate = useNavigate();

  const { cart, addHerb, removeHerb, clearCart } = useHerbCart();
  const [showCart, setShowCart] = useState(false);

  const [herb, setHerb] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || "https://thetcmatlas.fly.dev";
  const isMobile = useIsMobile();

  const bgStyle = {
    minHeight: "100vh",
    width: "100vw",
    background: COLORS.backgroundGold,
    position: "relative",
    fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
    overflowX: "hidden",
  };

  const backToHomeButton = (
    <div className="back-to-home-btn">
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
    setShowCart(true);
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

  // This function is used for "Add To Formula Builder" button in formulas list
  function handleAddFormulaBuilder(formula) {
    const formulaName = Array.isArray(formula.pinyinName)
      ? formula.pinyinName[0]
      : formula.pinyinName;
    navigate(`/formulabuilder?formula=${encodeURIComponent(formulaName)}`);
  }

  const propertiesArr = herb ? getPropertiesArr(herb) : [];
  const channelsArr = herb ? getChannelsArr(herb) : [];

  if (loading) {
    return (
      <div style={bgStyle}>
        <GlobalAnimations />
        <NavBar
          showReportError={true}
          showAbout={true}
          showAdminButtons={true}
          showLogo={true}
          fixed={true}
        />
        <div style={{ height: NAVBAR_HEIGHT }} />
        {backToHomeButton}
        <div style={{ margin: "2.5em auto 1.5em auto", textAlign: "center" }}>
          <Logo size={60} showBeta={true} />
        </div>
        <div
          className="rounded-xl p-8 mb-6 flex flex-col items-start animate-fadeInScaleUp card-shadow"
          style={{
            background: COLORS.backgroundGold,
            border: `2.5px solid ${COLORS.accentGold}`,
            color: COLORS.accentBlack,
            maxWidth: "500px",
            textAlign: "left",
            boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
            fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
            margin: "0 auto"
          }}
        >
          <h2 className="text-3xl font-bold mb-4" style={{ color: COLORS.claret }}>Loading...</h2>
          <p className="mb-3">Loading herb data...</p>
        </div>
        <FooterCard />
      </div>
    );
  }

  if (!herb) {
    return (
      <div style={bgStyle}>
        <GlobalAnimations />
        <NavBar
          showReportError={true}
          showAbout={true}
          showAdminButtons={true}
          showLogo={true}
          fixed={true}
        />
        <div style={{ height: NAVBAR_HEIGHT }} />
        {backToHomeButton}
        <div style={{ margin: "2.5em auto 1.5em auto", textAlign: "center" }}>
          <Logo size={60} showBeta={true} />
        </div>
        <div
          className="rounded-xl p-8 mb-6 flex flex-col items-start animate-fadeInScaleUp card-shadow"
          style={{
            background: COLORS.backgroundGold,
            border: `2.5px solid ${COLORS.accentGold}`,
            color: COLORS.accentBlack,
            maxWidth: "500px",
            textAlign: "left",
            boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
            fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
            margin: "0 auto"
          }}
        >
          <h2 className="text-3xl font-bold mb-4" style={{ color: COLORS.claret }}>Not Found</h2>
          <p className="mb-3">Sorry, we couldn't find a herb matching your search.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 mt-2 rounded-full font-bold shadow-xl transition hover:scale-105 animate-bounceIn"
            style={{
              background: COLORS.violet,
              color: COLORS.backgroundGold,
              border: `2.5px solid ${COLORS.seal}`,
              boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
            }}
          >
            Back to Home
          </button>
        </div>
        <FooterCard />
      </div>
    );
  }

  return (
    <div style={bgStyle}>
      <GlobalAnimations />
      <NavBar
        showReportError={true}
        showAbout={true}
        showAdminButtons={true}
        showLogo={true}
        fixed={true}
      />
      <div style={{ height: NAVBAR_HEIGHT }} />
      {backToHomeButton}
      <HerbCart
        show={showCart}
        onClose={() => setShowCart(false)}
        onOpen={() => setShowCart(true)}
        onCreateFormula={handleCreateFormula}
        sidebarTop={NAVBAR_HEIGHT}
      />
      <BackToTopButton right={75} />
      <div
        className="flex flex-col items-center justify-center w-full"
        style={{
          minHeight: "60vh",
          width: "100%",
          marginTop: isMobile ? "12px" : "32px",
        }}
      >
        <div
          className="rounded-2xl p-8 flex flex-col items-start shadow-2xl animate-fadeInScaleUp card-shadow"
          style={{
            background: `linear-gradient(120deg, ${COLORS.backgroundGold} 80%, ${COLORS.accentGold} 100%)`,
            border: `2.5px solid ${COLORS.accentGold}`,
            maxWidth: isMobile ? "98vw" : CARD_MAX_WIDTH,
            width: isMobile ? "99vw" : "100%",
            textAlign: "left",
            boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
            margin: isMobile ? "0 auto 22px auto" : "0 auto 42px auto",
            position: "relative",
            minHeight: "300px",
            fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
            padding: isMobile ? "18px 7px 22px 7px" : "32px 32px 32px 32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          {/* Herb Image */}
          <HerbImage url={process.env.PUBLIC_URL + "/" + herb.herbImageURL} alt={getHerbDisplayName(herb)} isMobile={isMobile} />
          <div className="flex items-center mb-4 animate-bounceIn" style={{ flexWrap: isMobile ? "wrap" : "nowrap" }}>
            <span className="text-4xl mr-3">🌿</span>
            <h2 className="font-bold text-3xl" style={{ color: COLORS.claret, textAlign: "left", wordBreak: "break-word" }}>
              {highlightText(Array.isArray(herb.pinyinName) ? herb.pinyinName[0] : herb.pinyinName, query)}
              <span className="ml-2 text-xl" style={{ color: COLORS.violet }}>{herb.chineseCharacters}</span>
            </h2>
          </div>
          <p className="mb-2" style={{ color: COLORS.violet, fontSize: isMobile ? "1em" : "1.07em" }}>
            <strong>Category:</strong> {highlightText(herb.category, query)}
          </p>
          <p className="mb-2" style={{ color: COLORS.seal, fontSize: isMobile ? "1em" : "1.07em" }}>
            <strong>Pharmaceutical Name:</strong> {highlightText(herb.pharmaceuticalName, query)}
          </p>
          <p className="mb-2" style={{ color: COLORS.seal, fontSize: isMobile ? "1em" : "1.07em" }}>
            <strong>English Name(s):</strong>{" "}
            {safeArr(herb.englishNames).map((n, i) => (
              <span key={i}>{highlightText(n, query)}{i < safeArr(herb.englishNames).length - 1 ? ", " : ""}</span>
            ))}
          </p>
          {/* YoSan + Formats bubbles */}
          <div
            style={{
              margin: "0.5em 0 0.5em 0",
              fontSize: isMobile ? "0.74em" : "0.8em",
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: isMobile ? "8px" : "18px",
            }}
          >
            <YoSanCarriesAndFormatsBubble herb={herb} isMobile={isMobile} />
          </div>
          {/* Properties bubbles */}
          <p className="mb-2" style={{
            color: COLORS.seal,
            fontSize: isMobile ? "1em" : "1.07em",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center"
          }}>
            <strong>Properties:</strong>{" "}
            {propertiesArr.length > 0
              ? propertiesArr.map((val, i) =>
                  <PropertyBubble
                    value={val}
                    uniqueKey={`property-card-${herb.pinyinName || herb.name || i}-${val}-${i}`}
                    key={`property-card-${herb.pinyinName || herb.name || i}-${val}-${i}`}
                    isMobile={isMobile}
                  />
                )
              : highlightText(herb.properties, query)}
          </p>
          {/* Channels Entered bubbles */}
          <p className="mb-2" style={{
            color: COLORS.seal,
            fontSize: isMobile ? "1em" : "1.07em",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center"
          }}>
            <strong>Channels Entered:</strong>{" "}
            {channelsArr.length > 0
              ? channelsArr.map((val, i) =>
                  <ChannelBubble
                    value={val}
                    uniqueKey={`channel-card-${herb.pinyinName || herb.name || i}-${val}-${i}`}
                    key={`channel-card-${herb.pinyinName || herb.name || i}-${val}-${i}`}
                    isMobile={isMobile}
                  />
                )
              : safeArr(herb.channelsEntered).join(", ")}
          </p>
          <p className="mb-2" style={{ color: COLORS.seal, fontSize: isMobile ? "1em" : "1.07em" }}>
            <strong>Keywords:</strong>{" "}
            {safeArr(herb.keywords).map((k, i) => (
              <span key={i}>{highlightText(k, query)}{i < safeArr(herb.keywords).length - 1 ? ", " : ""}</span>
            ))}
          </p>
          <p className="mb-2" style={{ color: COLORS.seal, fontSize: isMobile ? "1em" : "1.07em" }}>
            <strong>Dosage:</strong> {highlightText(herb.dosage, query)}
          </p>
          <p className="mb-2" style={{ color: COLORS.seal, fontSize: isMobile ? "1em" : "1.07em" }}>
            <strong>Cautions/Contraindications:</strong>{" "}
            {safeArr(herb.cautionsAndContraindications).map((c, i) => (
              <span key={i}>{highlightText(c, query)}{i < safeArr(herb.cautionsAndContraindications).length - 1 ? "; " : ""}</span>
            ))}
          </p>
          <p className="mb-2" style={{ color: COLORS.seal, fontSize: isMobile ? "1em" : "1.07em" }}>
            <strong>Notes:</strong>{" "}
            {safeArr(herb.notes).map((n, i) => (
              <span key={i}>{highlightText(n, query)}{i < safeArr(herb.notes).length - 1 ? "; " : ""}</span>
            ))}
          </p>
          <div
            className="flex gap-4 mt-6"
            style={{
              flexWrap: isMobile ? "wrap" : "nowrap",
              justifyContent: isMobile ? "center" : "flex-start",
              width: isMobile ? "100%" : undefined,
            }}
          >
            {!isInCart ? (
              <button
                className="px-6 py-3 font-bold rounded-full shadow-xl transition hover:scale-105 animate-pulseGlow"
                style={{
                  background: COLORS.accentGold,
                  color: COLORS.accentBlack,
                  border: `2.5px solid ${COLORS.violet}`,
                  boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
                  alignSelf: isMobile ? "center" : "flex-start",
                  width: isMobile ? "90%" : undefined,
                  fontSize: isMobile ? "1em" : "1.08em",
                  margin: isMobile ? "0 auto" : undefined,
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
                  color: COLORS.backgroundGold,
                  border: `2.5px solid ${COLORS.violet}`,
                  boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
                  alignSelf: isMobile ? "center" : "flex-start",
                  width: isMobile ? "90%" : undefined,
                  fontSize: isMobile ? "1em" : "1.08em",
                  margin: isMobile ? "0 auto" : undefined,
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
                color: COLORS.backgroundGold,
                border: `2.5px solid ${COLORS.seal}`,
                boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
                alignSelf: isMobile ? "center" : "flex-start",
                width: isMobile ? "90%" : undefined,
                fontSize: isMobile ? "1em" : "1.08em",
                margin: isMobile ? "0 auto" : undefined,
              }}
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
      <WhatFormulaMakesUpThoseHerbs
        herbs={[herb]}
        mainHerbObj={herb}
        cart={cart}
        addHerb={addHerb}
        removeHerb={removeHerb}
        showCartOptions={true}
        onAddFormulaBuilder={handleAddFormulaBuilder}
        formulaCardStyle={true}
        highlightMainHerb={true}
        showAddToFormulaBuilderButton={true} // <-- Pass this!
      />
      <HerbCategoryInfo />
      <FooterCard />
    </div>
  );
}