import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

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

const SIDEBAR_WIDTH = 300;
const FILTER_BAR_HEIGHT = 56;
const CARD_MAX_WIDTH = 980;

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const formulaApiEndpoints = [
  `${API_URL}/api/data/caleandnccaomformulas`,
  `${API_URL}/api/data/nccaomformulas`,
  `${API_URL}/api/data/extraformulas`,
];
const formulaCategoryListEndpoint = `${API_URL}/api/data/formulacategorylist`;

// --- Animations ---
const GlobalAnimations = () => (
  <style>
    {`
      @keyframes pulseGlow {
        0% { box-shadow: 0 0 0 0 ${COLORS.violet}33; }
        50% { box-shadow: 0 0 16px 8px ${COLORS.violet}88; }
        100% { box-shadow: 0 0 0 0 ${COLORS.violet}33; }
      }
      .animate-pulseGlow { animation: pulseGlow 2s infinite; }
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
        margin: "0.8em 0 0.3em 0",
        padding: "0.14em 0",
        textShadow: `0 3px 16px ${COLORS.shadowStrong}`,
        borderRadius: "1em"
      }}
    >
      TCM Party Palace (BETA) 🎉
    </div>
  );
}

// --- PATCH: Back to Top Button styled like herbCard.js ---
function BackToTopButton({ scrollContainerRef }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const handleScroll = () => setShow(container.scrollTop > 180);
    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => container.removeEventListener("scroll", handleScroll);
  }, [scrollContainerRef]);

  function handleClick() {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({ top: 0, behavior: "smooth" });
    }
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
        border: `2.5px solid ${COLORS.seal}`,
        boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
        fontWeight: 900,
        fontSize: "2rem",
        display: show ? "flex" : "none",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.2s, scale 0.15s",
        cursor: "pointer",
        outline: "none",
        animation: "pulseGlow 2s infinite",
      }}
      aria-label="Back to top"
      title="Back to top"
      className="animate-fadeInScaleUp"
    >
      ↑
    </button>
  );
}

function getFormulaBadge(formula) {
  if (formula.caleAndNccaom === "yes" || formula.origin === "CALE") {
    return { label: "NCCAOM/CALE", color: "bg-green-200 text-green-700" };
  }
  if (formula.nccaom === "yes" && formula.caleAndNccaom !== "yes") {
    return { label: "NCCAOM", color: "bg-blue-200 text-blue-700" };
  }
  if (formula.extraFormula === "yes") {
    return { label: "Extra", color: "bg-gray-200 text-gray-700" };
  }
  return null;
}

function Badge({ badge }) {
  if (!badge) return null;
  let className = "inline-block ml-2 px-2 py-1 rounded text-xs font-semibold align-middle transition-all duration-200";
  if (badge.color) className += ` ${badge.color}`;
  return (
    <span
      className={className}
      style={badge.color ? {} : { background: "#e0e0e0", color: "#333" }}
    >
      {badge.label}
    </span>
  );
}

function normalize(str) {
  return (str || "")
    .replace(/\s|-/g, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// --- SORTING PATCH: Sort formulas by badge order before rendering each category ---
function sortFormulasByBadge(formulas, getAnyFormulaMatchByName) {
  const badgeOrder = {
    "NCCAOM/CALE": 0,
    "NCCAOM": 1,
    "Extra": 2,
  };
  return [...formulas].sort((a, b) => {
    const aObj = getAnyFormulaMatchByName(a.name);
    const bObj = getAnyFormulaMatchByName(b.name);
    const aBadge = aObj?.badge?.label || "";
    const bBadge = bObj?.badge?.label || "";
    return (badgeOrder[aBadge] ?? 99) - (badgeOrder[bBadge] ?? 99);
  });
}

export default function FormulaCategoryListPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showExtra, setShowExtra] = useState(true);
  const [showCaleNccaom, setShowCaleNccaom] = useState(true);
  const [showNccaom, setShowNccaom] = useState(true);

  const navigate = useNavigate();

  const categoryRefs = useRef({});
  const subcategoryRefs = useRef({});
  const sidebarRef = useRef();
  const scrollContainerRef = useRef();

  const [formulasByType, setFormulasByType] = useState({
    caleNccaom: [],
    nccaom: [],
    extra: []
  });
  const [allFormulas, setAllFormulas] = useState([]);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(formulaCategoryListEndpoint).then((r) => r.json()),
      ...formulaApiEndpoints.map((url) => fetch(url).then((r) => r.json())),
    ])
      .then(([catData, caleNccaomList, nccaomList, extraList]) => {
        setCategories(catData);

        const mapFormulaList = (list, type) =>
          (list || [])
            .flat()
            .map((f) =>
              f && typeof f === "object"
                ? {
                    ...f,
                    _normPinyin: Array.isArray(f.pinyinName)
                      ? normalize(f.pinyinName[0])
                      : normalize(f.pinyinName || f.name || ""),
                    badge: getFormulaBadge(f),
                    _type: type
                  }
                : null
            )
            .filter(Boolean);

        const caleNccaom = mapFormulaList(caleNccaomList, "caleNccaom");
        const nccaom = mapFormulaList(nccaomList, "nccaom");
        const extra = mapFormulaList(extraList, "extra");

        setFormulasByType({ caleNccaom, nccaom, extra });
        setAllFormulas([...caleNccaom, ...nccaom, ...extra]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // --- Sidebar/category sync logic ---
  useEffect(() => {
    if (!categories.length) return;

    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      let bestSubcat = null;
      let minTop = Infinity;

      categories.forEach((category) => {
        (category.subcategories || []).forEach((subcat) => {
          const ref = subcategoryRefs.current[subcat.title];
          if (ref) {
            const rect = ref.getBoundingClientRect();
            const top = Math.abs(rect.top - containerRect.top - 32); // fudge for header
            if ((rect.top - containerRect.top) <= 64 && top < minTop) {
              minTop = top;
              bestSubcat = subcat.title;
            }
          }
        });
      });

      // fallback
      if (!bestSubcat && categories[0]?.subcategories?.[0]) {
        bestSubcat = categories[0].subcategories[0].title;
      }
      setActiveSubcategory(bestSubcat);

      // Scroll sidebar to active button
      setTimeout(() => {
        const sidebar = sidebarRef.current;
        if (sidebar && bestSubcat) {
          const activeBtn = sidebar.querySelector(`[data-subcategory="${bestSubcat}"]`);
          if (activeBtn) {
            activeBtn.scrollIntoView({ block: "center", behavior: "smooth" });
          }
        }
      }, 80);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      setTimeout(handleScroll, 0);
    }
    return () => {
      if (container) container.removeEventListener("scroll", handleScroll);
    };
  }, [categories, showCaleNccaom, showNccaom, showExtra]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.style.overflowY = isSidebarHovered ? "hidden" : "scroll";
    }
  }, [isSidebarHovered]);

  function handleSubcategoryScroll(title) {
    const ref = subcategoryRefs.current[title];
    if (ref && ref.scrollIntoView) {
      ref.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setActiveSubcategory(title);
    setTimeout(() => {
      const sidebar = sidebarRef.current;
      if (sidebar) {
        const activeBtn = sidebar.querySelector(`[data-subcategory="${title}"]`);
        if (activeBtn) {
          activeBtn.scrollIntoView({ block: "center", behavior: "smooth" });
        }
      }
    }, 120);
  }

  function handleFormulaClick(formulaObj) {
    if (formulaObj && formulaObj.pinyinName) {
      navigate(
        `/formulabuilder?formula=${encodeURIComponent(formulaObj.pinyinName)}`
      );
    }
  }

  function getAnyFormulaMatchByName(name) {
    const norm = normalize(name);
    return allFormulas.find((f) => f._normPinyin === norm);
  }
  function getFormulaMatchByName(name) {
    const norm = normalize(name);
    let formulaList = [];
    if (showCaleNccaom) formulaList = formulaList.concat(formulasByType.caleNccaom);
    if (showNccaom) formulaList = formulaList.concat(formulasByType.nccaom);
    if (showExtra) formulaList = formulaList.concat(formulasByType.extra);
    return formulaList.find((f) => f._normPinyin === norm);
  }

  function getDisplayFormulaName(formula, formulaObj) {
    if (
      formula.name &&
      formula.english &&
      formula.name.trim().toLowerCase() === formula.english.trim().toLowerCase()
    ) {
      if (formulaObj && formulaObj.pinyinName) return formulaObj.pinyinName;
      if (formula.pinyinName) return formula.pinyinName;
    }
    return formula.name;
  }

  function renderFormulaExtras(formulaObj) {
    if (!formulaObj) return null;
    const { yoSanCarries, formats } = formulaObj;
    if (!yoSanCarries && (!formats || formats.length === 0)) return null;
    return (
      <div
        className="flex flex-col gap-1 items-start"
        style={{
          minWidth: 170,
          maxWidth: 290,
          justifyContent: "center",
          marginTop: "6px",
          marginLeft: "1.2em"
        }}
      >
        {yoSanCarries !== undefined && (
          <div>
            <strong style={{ color: COLORS.violet }}>Yo San Carries:</strong>{" "}
            <span style={{ color: yoSanCarries ? COLORS.carolina : COLORS.claret, fontWeight: 600 }}>
              {yoSanCarries === true ? "Yes" : yoSanCarries === false ? "No" : ""}
            </span>
          </div>
        )}
        {formats && Array.isArray(formats) && formats.length > 0 && (
          <div>
            <strong style={{ color: COLORS.violet }}>Format:</strong>{" "}
            <span style={{ color: COLORS.seal }}>
              {formats.join(", ")}
            </span>
          </div>
        )}
      </div>
    );
  }

  const filterBar = (
    <div
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-center py-3 px-2"
      style={{
        background: `linear-gradient(90deg, ${COLORS.vanilla} 65%, ${COLORS.carolina} 100%)`,
        borderBottom: `2.5px solid ${COLORS.violet}`,
        boxShadow: `0 4px 16px -6px ${COLORS.violet}22`,
        minHeight: FILTER_BAR_HEIGHT,
        fontWeight: 600,
        fontSize: "1.05rem"
      }}
    >
      <span className="mr-6 font-extrabold text-violet text-lg tracking-tight" style={{textShadow:`0 1px 0 ${COLORS.vanilla}`}}>
        Show formulas:
      </span>
      <label className="mx-4 flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          checked={showCaleNccaom}
          onChange={() => setShowCaleNccaom((v) => !v)}
          className="accent-green-700 w-4 h-4"
        />
        <span className="text-green-700 font-semibold">NCCAOM/CALE</span>
      </label>
      <label className="mx-4 flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          checked={showNccaom}
          onChange={() => setShowNccaom((v) => !v)}
          className="accent-blue-700 w-4 h-4"
        />
        <span className="text-blue-700 font-semibold">NCCAOM</span>
      </label>
      <label className="mx-4 flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          checked={showExtra}
          onChange={() => setShowExtra((v) => !v)}
          className="accent-gray-700 w-4 h-4"
        />
        <span className="text-gray-700 font-semibold">Extra</span>
      </label>
    </div>
  );

  const backToHomeButton = (
    <div
      className="fixed"
      style={{
        top: FILTER_BAR_HEIGHT + 16,
        right: 32,
        zIndex: 51,
      }}
    >
      <Link
        to="/"
        className="px-5 py-2 rounded-full font-bold shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-carolina"
        style={{
          background: COLORS.violet,
          color: COLORS.vanilla,
          border: `2px solid ${COLORS.seal}`,
          textShadow: `0 1px 0 ${COLORS.carolina}`,
        }}
        tabIndex={0}
      >
        Back to Home
      </Link>
    </div>
  );

  if (loading) return <div>Loading...</div>;
  if (!Array.isArray(categories) || categories.length === 0) {
    return <div>No categories found. Check your data file structure.</div>;
  }

  return (
    <>
      <GlobalAnimations />
      {filterBar}
      {backToHomeButton}
      <BackToTopButton scrollContainerRef={scrollContainerRef} />
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          width: "100vw",
          height: "100vh",
          background: `linear-gradient(135deg, ${COLORS.vanilla} 0%, ${COLORS.carolina} 35%, ${COLORS.violet} 100%)`,
        }}
        aria-hidden="true"
      />
      <div
        className="relative w-full"
        style={{
          minHeight: "100vh",
          height: "100vh",
          position: "relative",
          zIndex: 1,
          width: "100vw",
          overflow: "hidden"
        }}
      >
        {/* Sidebar */}
        <aside
          ref={sidebarRef}
          className="hidden md:flex flex-col"
          style={{
            position: "fixed",
            top: `${FILTER_BAR_HEIGHT}px`,
            left: 0,
            width: SIDEBAR_WIDTH,
            height: `calc(100vh - ${FILTER_BAR_HEIGHT}px)`,
            overflowY: "auto",
            background: `linear-gradient(160deg, ${COLORS.vanilla} 80%, ${COLORS.carolina} 100%)`,
            borderRadius: "2em",
            border: `2.5px solid ${COLORS.violet}`,
            boxShadow: `0 0 24px -8px ${COLORS.violet}44`,
            zIndex: 20,
            marginTop: "0.5em",
            marginBottom: "0.5em",
            paddingTop: "0.75em",
            scrollbarWidth: "thin",
            scrollbarColor: `${COLORS.violet} ${COLORS.vanilla}`,
            transition: "box-shadow 0.2s"
          }}
          onMouseEnter={() => setIsSidebarHovered(true)}
          onMouseLeave={() => setIsSidebarHovered(false)}
        >
          <nav className="py-8 px-2">
            <h2
              className="text-lg font-bold mb-4 pl-2"
              style={{
                color: COLORS.violet,
                letterSpacing: "-.01em",
                textShadow: `0 1px 0 ${COLORS.carolina}`,
                borderLeft: `6px solid ${COLORS.carolina}`,
                paddingLeft: "0.5em",
              }}
            >
              Categories
            </h2>
            <ul className="space-y-2">
              {categories.map((category, catIdx) => (
                <React.Fragment key={category.category + catIdx}>
                  <li>
                    <div
                      style={{
                        color: COLORS.claret,
                        fontWeight: 800,
                        fontSize: "1.05em",
                        padding: "0.25em 0.7em 0.15em 0.7em",
                        margin: "0.3em 0",
                        borderLeft: `5px solid ${COLORS.claret}`,
                        background: COLORS.vanilla,
                        borderRadius: "0 1.2em 1.2em 0",
                        letterSpacing: "-.01em",
                        boxShadow: `1px 2px 10px -9px ${COLORS.claret}`,
                      }}
                    >
                      {category.category}
                    </div>
                  </li>
                  {(category.subcategories || []).map((subcat, subIdx) => (
                    <li key={subcat.title + subIdx}>
                      <button
                        data-subcategory={subcat.title}
                        onClick={() => handleSubcategoryScroll(subcat.title)}
                        className={[
                          "w-full text-left px-3 py-2 rounded transition-colors font-semibold hover:bg-violet/20",
                          activeSubcategory === subcat.title
                            ? "bg-violet/30 text-carolina font-extrabold shadow"
                            : "",
                          "focus-visible:ring-2 focus-visible:ring-carolina"
                        ].join(" ")}
                        style={{
                          color: COLORS.violet,
                          cursor: "pointer",
                          fontWeight: 700,
                          transition: "background 0.2s, transform 0.1s",
                          outline: activeSubcategory === subcat.title ? `2px solid ${COLORS.carolina}` : "none",
                          boxShadow: activeSubcategory === subcat.title ? `0 0 4px 0 ${COLORS.violet}` : "none"
                        }}
                        tabIndex={0}
                      >
                        {subcat.title}
                      </button>
                    </li>
                  ))}
                </React.Fragment>
              ))}
            </ul>
          </nav>
        </aside>
        {/* Main scroll area */}
        <div
          ref={scrollContainerRef}
          className="custom-scrollbar-main"
          style={{
            position: "fixed",
            top: FILTER_BAR_HEIGHT,
            left: 0,
            width: "100vw",
            height: `calc(100vh - ${FILTER_BAR_HEIGHT}px)`,
            overflowY: "scroll",
            overflowX: "hidden",
            WebkitOverflowScrolling: "touch",
            zIndex: 10,
            paddingLeft: SIDEBAR_WIDTH,
            background: "none"
          }}
        >
          {/* PATCH: TCM Party Palace logo centered above formula cards */}
          <div
            style={{
              width: "100%",
              maxWidth: CARD_MAX_WIDTH,
              margin: "0 auto",
              textAlign: "center",
              paddingTop: "2.2em",
              marginBottom: "0.5em",
            }}
          >
            <TcmPartyZoneHeader />
          </div>
          <div
            className="flex flex-col items-center"
            style={{
              width: "100%",
              maxWidth: CARD_MAX_WIDTH + 120,
              margin: "0 auto",
              paddingRight: 60,
            }}
          >
            <div className="space-y-14 w-full flex flex-col items-center" style={{ maxWidth: CARD_MAX_WIDTH }}>
              {categories.map((category, catIdx) =>
                (category.subcategories || []).map((subcat, subIdx) => (
                  <section
                    key={subcat.title + subIdx}
                    ref={(ref) => (subcategoryRefs.current[subcat.title] = ref)}
                    className="shadow-2xl rounded-2xl border border-violet px-7 py-8"
                    style={{
                      background: "#fff",
                      boxShadow: `0 8px 40px -14px ${COLORS.violet}55, 0 1.5px 0 ${COLORS.vanilla}`,
                      borderColor: COLORS.violet,
                      position: "relative",
                      overflow: "hidden",
                      width: "100%",
                      maxWidth: CARD_MAX_WIDTH,
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: "180px",
                        height: "100%",
                        zIndex: 1,
                        background: `linear-gradient(105deg, transparent 60%, ${COLORS.carolina}55 100%)`,
                        pointerEvents: "none",
                        borderRadius: "1.5em",
                      }}
                    />
                    <h3
                      className="mb-7 tracking-tight"
                      style={{
                        fontSize: "2.1rem",
                        fontWeight: 900,
                        color: COLORS.violet,
                        borderLeft: `8px solid ${COLORS.claret}`,
                        background: COLORS.vanilla,
                        padding: "0.22em 1.2em",
                        marginLeft: "-1.2em",
                        borderRadius: "0 1.7em 1.7em 0",
                        boxShadow: `1px 2px 12px -7px ${COLORS.claret}`,
                        textShadow: `0 1px 0 ${COLORS.carolina}`,
                        letterSpacing: "-.02em",
                        fontFamily: "inherit",
                        zIndex: 2,
                        position: "relative",
                      }}
                    >
                      {subcat.title}
                    </h3>
                    <ul className="flex flex-col gap-7">
                      {sortFormulasByBadge(subcat.formulas || [], getAnyFormulaMatchByName).map((formula, i) => {
                        const formulaObjAny = getAnyFormulaMatchByName(formula.name);
                        if (!formulaObjAny) {
                          return (
                            <li
                              key={formula.name + i}
                              className="group transition-all duration-200 shadow-lg rounded-xl border border-gray-200 opacity-40 grayscale cursor-not-allowed"
                              style={{
                                cursor: "not-allowed",
                                background: "#fff",
                                zIndex: 3,
                                filter: "grayscale(0.85) brightness(0.98)",
                                opacity: 0.4,
                                pointerEvents: "none",
                                transition: "box-shadow .2s, transform .15s"
                              }}
                              tabIndex={-1}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-7 p-5">
                                <div className="flex items-center min-w-0 flex-shrink-0 mr-3">
                                  <span
                                    className="font-extrabold truncate"
                                    style={{
                                      fontSize: "1.25rem",
                                      color: COLORS.violet,
                                      letterSpacing: "-.01em",
                                      textShadow: `0 1px 0 ${COLORS.highlight}`,
                                      fontFamily: "inherit",
                                      opacity: 0.7,
                                      whiteSpace: "nowrap",
                                      maxWidth: 600,
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      transition: "color 0.2s"
                                    }}
                                  >
                                    {getDisplayFormulaName(formula, formulaObjAny)}
                                  </span>
                                </div>
                                <span
                                  className="italic font-semibold"
                                  style={{
                                    fontSize: "0.93rem",
                                    color: COLORS.seal,
                                    marginLeft: "0.85em",
                                    minWidth: 70,
                                    maxWidth: "none",
                                    fontFamily: "serif",
                                    letterSpacing: "-.01em",
                                    opacity: 0.6,
                                    flex: "0 1 auto",
                                    whiteSpace: "normal",
                                    lineHeight: 1.35,
                                    transition: "color 0.2s"
                                  }}
                                >
                                  {formula.english}
                                </span>
                                {formula.explanation && (
                                  <span
                                    className="mt-2 sm:mt-0 text-sm"
                                    style={{
                                      color: COLORS.claret,
                                      background: COLORS.highlight,
                                      borderRadius: "0.7em",
                                      fontWeight: 500,
                                      padding: "0.22em 1.1em",
                                      marginLeft: "0.95em",
                                      boxShadow: `0px 1px 5px -3px ${COLORS.seal}60`,
                                      fontFamily: "inherit",
                                      fontSize: "1.01em",
                                      opacity: 0.5,
                                      transition: "background 0.2s, color 0.2s"
                                    }}
                                  >
                                    {formula.explanation}
                                  </span>
                                )}
                              </div>
                            </li>
                          );
                        }
                        const formulaObj = getFormulaMatchByName(formula.name);
                        if (!formulaObj) return null;
                        return (
                          <li
                            key={formula.name + i}
                            className="group transition-all duration-200 shadow-lg rounded-xl border border-carolina bg-white/95 cursor-pointer hover:border-violet hover:scale-[1.025] active:scale-95 focus:ring-2 focus:ring-carolina"
                            style={{
                              background: "#fff",
                              zIndex: 3,
                              transition: "box-shadow .2s, transform .15s"
                            }}
                            onClick={() => handleFormulaClick(formulaObj)}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                handleFormulaClick(formulaObj);
                              }
                            }}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-7 p-5">
                              <div className="flex items-center min-w-0 flex-shrink-0 mr-3">
                                <span
                                  className="font-extrabold"
                                  style={{
                                    fontSize: "1.25rem",
                                    color: COLORS.violet,
                                    letterSpacing: "-.01em",
                                    textShadow: `0 1px 0 ${COLORS.highlight}`,
                                    fontFamily: "inherit",
                                    whiteSpace: "nowrap",
                                    maxWidth: 600,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    transition: "color 0.2s"
                                  }}
                                >
                                  {getDisplayFormulaName(formula, formulaObj)}
                                </span>
                                <span className="ml-2 flex-shrink-0">
                                  <Badge badge={formulaObj.badge} />
                                </span>
                              </div>
                              <span
                                className="italic font-semibold"
                                style={{
                                  fontSize: "0.93rem",
                                  color: COLORS.seal,
                                  marginLeft: "0.85em",
                                  minWidth: 70,
                                  maxWidth: "none",
                                  fontFamily: "serif",
                                  letterSpacing: "-.01em",
                                  flex: "0 1 auto",
                                  whiteSpace: "normal",
                                  lineHeight: 1.35,
                                  transition: "color 0.2s"
                                }}
                              >
                                {formula.english}
                              </span>
                              {formula.explanation && (
                                <span
                                  className="mt-2 sm:mt-0 text-sm"
                                  style={{
                                    color: COLORS.claret,
                                    background: COLORS.highlight,
                                    borderRadius: "0.7em",
                                    fontWeight: 500,
                                    padding: "0.22em 1.1em",
                                    marginLeft: "0.95em",
                                    boxShadow: `0px 1px 5px -3px ${COLORS.seal}60`,
                                    fontFamily: "inherit",
                                    fontSize: "1.01em",
                                    transition: "background 0.2s, color 0.2s"
                                  }}
                                >
                                  {formula.explanation}
                                </span>
                              )}
                              {renderFormulaExtras(formulaObj)}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}